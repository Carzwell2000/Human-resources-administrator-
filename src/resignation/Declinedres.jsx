import React, { useState, useEffect } from 'react';
import { supabase } from '../Components/supabaseConfig'

const DeclinedResignationsTable = () => {
    const [resignations, setResignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeclinedResignations = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('ResignationDeclined')
                    .select('*')
                    .order('created_at', { ascending: false }); // Order by creation date, newest first

                if (error) {
                    throw error;
                }
                setResignations(data);
            } catch (err) {
                console.error('Error fetching declined resignations:', err.message);
                setError(err.message || 'Failed to load declined resignations.');
            } finally {
                setLoading(false);
            }
        };

        fetchDeclinedResignations();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600 text-lg">Loading declined resignations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500 text-lg font-medium">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8 mb-8 overflow-x-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Declined Resignations</h1>

            {resignations.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No declined resignations found.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action By
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Declined On
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {resignations.map((resignation) => (
                            <tr key={resignation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {resignation.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resignation.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800' // Ensure this matches your status values
                                        }`}>
                                        {resignation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"> {/* Added max-w-xs and truncate */}
                                    {resignation.reason || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {resignation.action_by}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {resignation.created_at ? new Date(resignation.created_at).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DeclinedResignationsTable;