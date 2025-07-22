import React, { useState, useEffect } from 'react';
import { supabase } from '../Components/supabaseConfig';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchEmployees() {
            const { data, error } = await supabase
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching employees:', error.message);
            } else {
                setEmployees(data || []);
                setFilteredEmployees(data || []);
            }
            setLoading(false);
        }

        fetchEmployees();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filtered = employees.filter((emp) =>
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    if (loading)
        return <div className="text-center py-10 text-gray-700">Loading...</div>;

    return (
        <div className="p-4 max-w-full mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                University Workers
            </h1>

            <div className="mb-4 text-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by full name..."
                    className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/2"
                />
            </div>

            <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Full Name</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Email</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Phone</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Gender</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Department</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Position</th>
                            <th className="text-left px-4 py-2 border-b whitespace-nowrap">Employment Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-600">
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr
                                    key={emp.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-4 py-2 border-b whitespace-nowrap">
                                        {emp.first_name} {emp.last_name}
                                    </td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap">{emp.email}</td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap">{emp.phone}</td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap capitalize">{emp.gender}</td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap">{emp.department}</td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap">{emp.position}</td>
                                    <td className="px-4 py-2 border-b whitespace-nowrap capitalize">
                                        {emp.employment_type?.replace('-', ' ')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
