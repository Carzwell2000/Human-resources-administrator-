import React, { useState, useEffect } from 'react';
import { supabase } from '../Components/supabaseConfig';
import { getAuth } from "firebase/auth";

const LeaveManagement = () => {
    const [allLeaves, setAllLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [declineModal, setDeclineModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [declineReason, setDeclineReason] = useState("");

    const auth = getAuth();

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('Leaves').select('*');
        if (error) {
            console.error("Error fetching leaves:", error);
        } else {
            setAllLeaves(data);
        }
        setLoading(false);
    };

    const approveLeave = async (leave) => {
        const currentUser = auth.currentUser;
        const actionBy = currentUser?.displayName || currentUser?.email || "Unknown";

        const { error: insertError } = await supabase
            .from('Approved')
            .insert([{
                user_id: leave.user_id,
                name: leave.name,
                status: 'approved',
                action_by: actionBy,
            }]);

        if (insertError) {
            console.error("Insert error:", insertError);
            return alert("Failed to approve leave: " + insertError.message);
        }

        const { error: deleteError } = await supabase
            .from('Leaves')
            .delete()
            .eq('id', leave.id);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return alert("Failed to remove from Leaves: " + deleteError.message);
        }

        alert("Leave Approved!");
        fetchAllLeaves();
    };

    const openDeclineModal = (leave) => {
        setSelectedLeave(leave);
        setDeclineReason("");
        setDeclineModal(true);
    };

    const declineLeave = async () => {
        if (!declineReason) return alert("Please enter a decline reason.");

        const leave = selectedLeave;
        const currentUser = auth.currentUser;
        const actionBy = currentUser?.displayName || currentUser?.email || "Unknown";

        const { error: insertError } = await supabase
            .from('Declined')
            .insert([{
                user_id: leave.user_id,
                name: leave.name,
                status: 'declined',
                reason: declineReason,
                action_by: actionBy,
            }]);

        if (insertError) {
            console.error("Insert error:", insertError);
            return alert("Failed to decline leave: " + insertError.message);
        }

        const { error: deleteError } = await supabase
            .from('Leaves')
            .delete()
            .eq('id', leave.id);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return alert("Failed to remove from Leaves: " + deleteError.message);
        }

        alert("Leave Declined");
        setDeclineModal(false);
        fetchAllLeaves();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Leave Management</h2>

                {loading ? (
                    <p className="text-center">Loading leaves...</p>
                ) : (
                    <table className="min-w-full table-auto border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Gender</th> {/* Added gender header */}
                                <th className="p-2 border">Leave Type</th>
                                <th className="p-2 border">Dates</th>
                                <th className="p-2 border">Reason</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLeaves.map((leave) => (
                                <tr key={leave.id} className="text-center hover:bg-gray-50">
                                    <td className="p-2 border">{leave.name}</td>
                                    <td className="p-2 border capitalize">{leave.gender || '-'}</td> {/* Display gender */}
                                    <td className="p-2 border">{leave.leavetype}</td>
                                    <td className="p-2 border">{leave.startdate} - {leave.enddate}</td>
                                    <td className="p-2 border">{leave.reason}</td>
                                    <td className="p-2 border text-blue-600 capitalize">{leave.status}</td>
                                    <td className="p-2 border">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                                onClick={() => approveLeave(leave)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                                onClick={() => openDeclineModal(leave)}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Decline Modal */}
            {declineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Decline Reason</h3>
                        <textarea
                            rows="4"
                            className="w-full border p-2 rounded"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="Enter reason for declining"
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="border px-4 py-2 rounded"
                                onClick={() => setDeclineModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded"
                                onClick={declineLeave}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
