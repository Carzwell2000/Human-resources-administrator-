import React, { useEffect, useState } from 'react';
import { supabase } from '../Components/supabaseConfig';

const ViewDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching departments:', error.message);
        } else {
            setDepartments(data);
            setFilteredDepartments(data);
        }

        setLoading(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = departments.filter((dept) =>
            dept.department_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDepartments(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Departments</h2>

                <div className="mb-4 text-center">
                    <input
                        type="text"
                        placeholder="Search by department name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/2"
                    />
                </div>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : filteredDepartments.length === 0 ? (
                    <p className="text-center text-gray-500">No departments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-gray-200 text-sm md:text-base">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="border-b px-4 py-3 text-left font-semibold">Department Name</th>
                                    <th className="border-b px-4 py-3 text-left font-semibold">Head</th>
                                    <th className="border-b px-4 py-3 text-left font-semibold">Phone</th>
                                    <th className="border-b px-4 py-3 text-left font-semibold">Email</th>
                                    <th className="border-b px-4 py-3 text-left font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDepartments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                                        <td className="px-4 py-2">{dept.department_name}</td>
                                        <td className="px-4 py-2">{dept.head_of_department}</td>
                                        <td className="px-4 py-2">{dept.phone_number}</td>
                                        <td className="px-4 py-2">{dept.contact_email}</td>
                                        <td className="px-4 py-2">{dept.description}</td>
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

export default ViewDepartments;
