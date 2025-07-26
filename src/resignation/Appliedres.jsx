// src/pages/ResignationListPage.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseConfig';
import { getAuth } from 'firebase/auth';

const ResignationListPage = () => {
    const [resignations, setResignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [declineModal, setDeclineModal] = useState(false);
    const [selectedResignation, setSelectedResignation] = useState(null);
    const [declineReason, setDeclineReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const auth = getAuth();

    useEffect(() => {
        fetchResignations();
    }, []);

    const fetchResignations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Resignation')
            .select('*')
            .order('resignation_date', { ascending: false });

        if (error) {
            console.error('Error fetching resignations:', error);
            setResignations([]);
        } else {
            setResignations(data);
        }
        setLoading(false);
    };

    const approveResignation = async (resignation) => {
        const currentUser = auth.currentUser;
        const actionBy = currentUser?.displayName || currentUser?.email || 'Unknown Admin';

        if (!window.confirm(`Approve resignation for ${resignation.full_name}?`)) return;

        setActionLoading(true);

        const { error: insertError } = await supabase
            .from('ResignationApproved')
            .insert([{
                name: resignation.full_name,
                status: 'approved',
                action_by: actionBy,
                user_id: resignation.user_id,
            }]);

        if (insertError) {
            alert('Failed to approve resignation: ' + insertError.message);
            setActionLoading(false);
            return;
        }

        const { error: deleteError } = await supabase
            .from('Resignation')
            .delete()
            .eq('id', resignation.id);

        if (deleteError) {
            alert('Resignation approved but failed to delete original: ' + deleteError.message);
        } else {
            alert('Resignation approved successfully!');
            fetchResignations();
        }

        setActionLoading(false);
    };

    const openDeclineModal = (resignation) => {
        setSelectedResignation(resignation);
        setDeclineReason('');
        setDeclineModal(true);
    };

    const handleDecline = async () => {
        if (!declineReason.trim()) {
            alert('Please enter a reason for declining.');
            return;
        }

        const currentUser = auth.currentUser;
        const actionBy = currentUser?.displayName || currentUser?.email || 'Unknown Admin';

        setActionLoading(true);

        const { error: insertError } = await supabase
            .from('ResignationDeclined')
            .insert([{
                name: selectedResignation.full_name,
                status: 'declined',
                reason: declineReason,
                action_by: actionBy,
                user_id: selectedResignation.user_id,
            }]);

        if (insertError) {
            alert('Failed to decline resignation: ' + insertError.message);
            setActionLoading(false);
            return;
        }

        const { error: deleteError } = await supabase
            .from('Resignation')
            .delete()
            .eq('id', selectedResignation.id);

        if (deleteError) {
            alert('Declined but failed to remove original: ' + deleteError.message);
        } else {
            alert('Resignation declined successfully!');
            fetchResignations();
            setDeclineModal(false);
        }

        setActionLoading(false);
    };

    if (loading) return <p className="text-center py-6">Loading resignations...</p>;
    if (resignations.length === 0) return <p className="text-center py-6">No resignations found.</p>;

    return (
        <div className="min-h-screen px-4 py-6 bg-gray-100 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-6">Resignation Records</h1>

                <div className="space-y-6">
                    {resignations.map((resignation) => {
                        const isActionable = resignation.status !== 'approved' && resignation.status !== 'declined';

                        return (
                            <div key={resignation.id} className="bg-white p-5 rounded-lg shadow-md space-y-2">
                                <p><strong>Name:</strong> {resignation.full_name}</p>
                                <p><strong>Employee ID:</strong> {resignation.employee_id}</p>
                                {resignation.phone_number && <p><strong>Phone:</strong> {resignation.phone_number}</p>}
                                {resignation.email && <p><strong>Email:</strong> {resignation.email}</p>}
                                <p><strong>Gender:</strong> {resignation.gender}</p>
                                <p><strong>Resignation Date:</strong> {resignation.resignation_date}</p>
                                <p><strong>Last Day:</strong> {resignation.last_day}</p>
                                <p><strong>Reason:</strong> {resignation.reason}</p>
                                <p><strong>Status:</strong> <span className={
                                    resignation.status === 'approved' ? 'text-green-600' :
                                        resignation.status === 'declined' ? 'text-red-600' :
                                            'text-yellow-600'
                                }>
                                    {resignation.status || 'pending'}
                                </span></p>

                                {isActionable && (
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => approveResignation(resignation)}
                                            disabled={actionLoading}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => openDeclineModal(resignation)}
                                            disabled={actionLoading}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Decline Modal */}
            {declineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" role="dialog" aria-modal="true">
                        <h2 className="text-xl font-semibold mb-4">
                            Decline Resignation: {selectedResignation?.full_name}
                        </h2>
                        <textarea
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="Enter reason for declining..."
                            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setDeclineModal(false);
                                    setSelectedResignation(null);
                                }}
                                disabled={actionLoading}
                                className="border px-4 py-2 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={actionLoading}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                {actionLoading ? 'Declining...' : 'Submit Decline'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResignationListPage;
