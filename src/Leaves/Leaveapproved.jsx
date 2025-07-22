import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseConfig';

const LeaveApproved = () => {
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovedLeaves();
    }, []);

    const fetchApprovedLeaves = async () => {
        const { data, error } = await supabase
            .from('Approved')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching approved leaves:', error.message);
        } else {
            setApprovedLeaves(data);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
            <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-green-700">
                    Approved Leaves
                </h2>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : approvedLeaves.length === 0 ? (
                    <p className="text-center text-gray-500">No approved leaves found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-200 text-xs sm:text-sm md:text-base">
                            <thead className="bg-green-100 text-green-800">
                                <tr>
                                    <th className="border-b px-3 sm:px-4 py-2 text-left whitespace-nowrap">Name</th>
                                    <th className="border-b px-3 sm:px-4 py-2 text-left whitespace-nowrap">Status</th>
                                    <th className="border-b px-3 sm:px-4 py-2 text-left whitespace-nowrap">Approved By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {approvedLeaves.map((leave) => (
                                    <tr
                                        key={leave.id}
                                        className="hover:bg-green-50 transition duration-150 ease-in-out"
                                    >
                                        <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{leave.name}</td>
                                        <td className="px-3 sm:px-4 py-2 capitalize font-semibold text-green-600">
                                            {leave.status}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 text-gray-700 whitespace-nowrap">
                                            {leave.action_by}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveApproved;
