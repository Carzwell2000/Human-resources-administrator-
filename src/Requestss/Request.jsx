import React, { useState } from 'react';
import { supabase } from '../Components/supabaseConfig';

const NewWorkerRequestForm = () => {
    const [formData, setFormData] = useState({
        requestedBy: '',
        department: '',
        numberOfWorkers: '',
        reason: '',
        position: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        const { data, error } = await supabase.from('requests').insert([formData]);

        if (error) {
            setErrorMessage('Failed to submit request. Please try again.');
            console.error('Error submitting:', error);
        } else {
            setSuccessMessage('Request submitted successfully!');
            setFormData({
                requestedBy: '',
                department: '',
                numberOfWorkers: '',
                reason: '',
                position: '',
            });
        }

        setSubmitting(false);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                New Worker Request Form
            </h2>

            {successMessage && (
                <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Requested By</label>
                    <input
                        type="text"
                        name="requestedBy"
                        value={formData.requestedBy}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Enter Department"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Number of Workers</label>
                    <input
                        type="number"
                        name="numberOfWorkers"
                        value={formData.numberOfWorkers}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Enter number of workers"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Enter position"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Reason for Request</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Why do you need this position filled?"
                        rows={4}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default NewWorkerRequestForm;
