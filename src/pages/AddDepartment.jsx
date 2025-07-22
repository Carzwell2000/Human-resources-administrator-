import React, { useState } from 'react';
import { supabase } from '../Components/supabaseConfig'; // adjust the path as needed

function AddDepartmentForm() {
    const [formData, setFormData] = useState({
        departmentName: '',
        headOfDepartment: '',
        phoneNumber: '',
        contactEmail: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Insert into Supabase
        const { error } = await supabase
            .from('departments')
            .insert([
                {
                    department_name: formData.departmentName,
                    head_of_department: formData.headOfDepartment,
                    phone_number: formData.phoneNumber,
                    contact_email: formData.contactEmail,
                    description: formData.description,
                },
            ]);

        setLoading(false);

        if (error) {
            console.error('Insert error:', error.message);
            setMessage('❌ Failed to add department.');
        } else {
            console.log('Inserted:', formData);
            setMessage('✅ Department added successfully!');
            setFormData({
                departmentName: '',
                headOfDepartment: '',
                phoneNumber: '',
                contactEmail: '',
                description: ''
            });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Department</h1>
                    {message && <p className="text-sm text-center mt-2">{message}</p>}
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset className="border border-gray-300 p-6 rounded-md mb-8">
                        <legend className="text-xl font-semibold text-gray-700 px-2">Department Details</legend>

                        <div className="mb-6">
                            <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                            <input
                                type="text"
                                id="departmentName"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="headOfDepartment" className="block text-sm font-medium text-gray-700 mb-1">Head of Department</label>
                            <input
                                type="text"
                                id="headOfDepartment"
                                name="headOfDepartment"
                                value={formData.headOfDepartment}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    placeholder="e.g., +1234567890"
                                />
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                placeholder="Brief description of the department's function or academic focus."
                            ></textarea>
                        </div>
                    </fieldset>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="reset"
                            onClick={() => setFormData({
                                departmentName: '',
                                headOfDepartment: '',
                                phoneNumber: '',
                                contactEmail: '',
                                description: ''
                            })}
                            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-md shadow-sm text-sm text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Add Department'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDepartmentForm;
