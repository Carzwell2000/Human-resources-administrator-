import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseConfig';

const LeaveDeclined = () => {
    const [declinedLeaves, setDeclinedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeclinedLeaves();
    }, []);

    const fetchDeclinedLeaves = async () => {
        const { data, error } = await supabase
            .from('Declined')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching declined leaves:', error.message);
        } else {
            setDeclinedLeaves(data);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Declined Leaves</h2>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : declinedLeaves.length === 0 ? (
                    <p className="text-center text-gray-500">No declined leaves found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-gray-200 text-sm md:text-base">
                            <thead className="bg-red-100 text-red-800">
                                <tr>
                                    <th className="border-b px-4 py-2 text-left">Name</th>
                                    <th className="border-b px-4 py-2 text-left">Status</th>
                                    <th className="border-b px-4 py-2 text-left">Reason</th>
                                    <th className="border-b px-4 py-2 text-left">Declined By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {declinedLeaves.map((leave) => (
                                    <tr
                                        key={leave.id}
                                        className="hover:bg-red-50 transition duration-150 ease-in-out"
                                    >
                                        <td className="px-4 py-2">{leave.name}</td>
                                        <td className="px-4 py-2 capitalize font-semibold text-red-600">{leave.status}</td>
                                        <td className="px-4 py-2">{leave.reason || '—'}</td>
                                        <td className="px-4 py-2 text-gray-700">{leave.action_by || '—'}</td>
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

export default LeaveDeclined;
