import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseConfig';

const WorkerRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching requests:', error.message);
            } else {
                setRequests(data);
            }
            setLoading(false);
        };

        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-700">
                Loading requests...
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-600">
                No worker requests found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 w-full"> {/* Adjusted lg:px for slightly less extreme padding */}
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
                New Worker Requests
            </h1>

            {/* Added max-w-6xl and mx-auto to center the grid and prevent it from becoming too wide */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-8 max-w-6xl mx-auto">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 
                                   transition-transform duration-200 hover:scale-[1.02] 
                                   flex flex-col" // Added flex flex-col to enable mt-auto below
                    >
                        <p className="text-gray-800 font-semibold mb-2 break-words whitespace-normal">
                            <span className="text-gray-600">Position(s):</span> {req.position}
                        </p>
                        <p className="text-gray-800 font-semibold mb-2 break-words whitespace-normal">
                            <span className="text-gray-600">Number of Worker(s):</span> {req.numberOfWorkers}
                        </p>
                        <p className="text-gray-700 mb-2 break-words whitespace-normal">
                            <span className="text-gray-600 font-medium">Requested By:</span> {req.requestedBy}
                        </p>
                        <p className="text-gray-700 mb-2 break-words whitespace-normal">
                            <span className="text-gray-600 font-medium">Department:</span> {req.department}
                        </p>
                        {/* 'Reason' is most likely to be long, ensuring it wraps properly */}
                        <p className="text-gray-700 mt-auto break-words whitespace-normal"> {/* mt-auto helps push it to the bottom if preceding content is short */}
                            <span className="text-gray-600 font-medium">Reason:</span> {req.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerRequestsPage;
