// src/pages/AddUniversityWorkerForm.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../Components/supabaseConfig';

// Global styles (fonts + scrollbar)
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@300;400;500&display=swap');
  body { font-family: 'Roboto', sans-serif; }
  h1, h2 { font-family: 'Merriweather', serif; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #555; }
`;
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
}

function AddUniversityWorkerForm() {
    const initialForm = {
        firstName: '', lastName: '', email: '', phone: '',
        dateOfBirth: '', gender: '', employeeId: '', department: '',
        position: '', startDate: '', endDate: '', employmentType: '',
    };
    const [formData, setFormData] = useState(initialForm);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        async function fetchDepartments() {
            const { data, error } = await supabase
                .from('departments')
                .select('id, department_name')
                .order('department_name');
            if (error) console.error('Error loading departments:', error.message);
            else setDepartments(data || []);
        }
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            employee_id: formData.employeeId,
            department: formData.department,
            position: formData.position,
            start_date: formData.startDate,
            employment_type: formData.employmentType,
        };

        if (formData.employmentType !== 'full-time') {
            submissionData.end_date = formData.endDate || null;
        }

        const { error } = await supabase
            .from('employees')
            .insert([submissionData]);

        if (error) {
            console.error('Insert failed:', error.message);
            alert('Error submitting form. Check console.');
        } else {
            alert('Employee added successfully!');
            setFormData(initialForm);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl border border-gray-200">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">Add Employee</h1>
                <form onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <fieldset className="border border-gray-300 p-4 md:p-6 rounded-md mb-8">
                        <legend className="text-lg md:text-xl font-semibold text-gray-700">Personal Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Employment Info */}
                    <fieldset className="border border-gray-300 p-4 md:p-6 rounded-md mb-8">
                        <legend className="text-lg md:text-xl font-semibold text-gray-700">Employment Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                <input name="employeeId" value={formData.employeeId} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select name="department" value={formData.department} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.department_name}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input name="position" value={formData.position} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={formData.employmentType === 'full-time'}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${formData.employmentType === 'full-time' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                <div className="flex flex-wrap gap-4">
                                    {['full-time', 'part-time', 'contract', 'temporary'].map(type => (
                                        <label key={type} className="inline-flex items-center">
                                            <input type="radio" name="employmentType" value={type} checked={formData.employmentType === type} onChange={handleChange}
                                                className="form-radio h-4 w-4 text-blue-600 border-gray-300" />
                                            <span className="ml-2 text-sm capitalize">{type.replace('-', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button type="reset" onClick={() => setFormData(initialForm)}
                            className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">Reset</button>
                        <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800">Add Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUniversityWorkerForm;
