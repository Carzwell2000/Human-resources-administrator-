import React, { useEffect, useState } from 'react';
import {
    FaUsers,
    FaBuilding,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaFileSignature
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { supabase } from '../Components/supabaseConfig';

const DashboardOverview = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [requests, setRequests] = useState([]);
    const [appliedLeaves, setAppliedLeaves] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [declinedLeaves, setDeclinedLeaves] = useState([]);
    const [appliedResignations, setAppliedResignations] = useState([]);
    const [approvedResignations, setApprovedResignations] = useState([]);
    const [declinedResignations, setDeclinedResignations] = useState([]);

    useEffect(() => {
        fetchAllCounts();
    }, []);

    const fetchAllCounts = async () => {
        const { data: emps } = await supabase.from('employees').select('*');
        const { data: depts } = await supabase.from('departments').select('*');
        const { data: reqs } = await supabase.from('requests').select('*');
        const { data: leaves } = await supabase.from('Leaves').select('*');
        const { data: approved } = await supabase.from('Approved').select('*');
        const { data: declined } = await supabase.from('Declined').select('*');
        const { data: resigns } = await supabase.from('Resignation').select('*');
        const { data: resApproved } = await supabase.from('ResignationApproved').select('*');
        const { data: resDeclined } = await supabase.from('ResignationDeclined').select('*');

        setEmployees(emps || []);
        setDepartments(depts || []);
        setRequests(reqs || []);
        setAppliedLeaves(leaves || []);
        setApprovedLeaves(approved || []);
        setDeclinedLeaves(declined || []);
        setAppliedResignations(resigns || []);
        setApprovedResignations(resApproved || []);
        setDeclinedResignations(resDeclined || []);
    };

    return (
        <div className="min-h-screen bg-blue-50 p-4 space-y-6">
            {/* Dashboard Overview */}
            <div>
                <h2 className="text-xl font-bold mb-2">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to='/dashboard/view-lecturer'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaUsers className="text-teal-600 text-xl" />
                            <div>
                                <p className="text-sm">Total Employees</p>
                                <p className="font-bold text-lg">{employees.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/view-department'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaBuilding className="text-yellow-500 text-xl" />
                            <div>
                                <p className="text-sm">Total Departments</p>
                                <p className="font-bold text-lg">{departments.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/applied-request'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaBuilding className="text-purple-500 text-xl" />
                            <div>
                                <p className="text-sm">Total Requests</p>
                                <p className="font-bold text-lg">{requests.length}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Leave Details */}
            <div>
                <h2 className="text-xl font-bold mb-2 text-center mt-10">Leave Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to='/dashboard/leave-applied'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3 ">
                            <FaFileAlt className="text-teal-600 text-xl" />
                            <div>
                                <p className="text-sm">Leave Applied</p>
                                <p className="font-bold text-lg">{appliedLeaves.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/leave-approved'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaCheckCircle className="text-green-600 text-xl" />
                            <div>
                                <p className="text-sm">Leave Approved</p>
                                <p className="font-bold text-lg">{approvedLeaves.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/leave-declined'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaTimesCircle className="text-red-600 text-xl" />
                            <div>
                                <p className="text-sm">Leave Declined</p>
                                <p className="font-bold text-lg">{declinedLeaves.length}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Resignation Details */}
            <div>
                <h2 className="text-xl font-bold mb-2 text-center mt-8">Resignation Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to='/dashboard/applied-res'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaFileSignature className="text-red-500 text-xl" />
                            <div>
                                <p className="text-sm">Resignations</p>
                                <p className="font-bold text-lg">{appliedResignations.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/approved-res'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaCheckCircle className="text-green-600 text-xl" />
                            <div>
                                <p className="text-sm">Resignation Approved</p>
                                <p className="font-bold text-lg">{approvedResignations.length}</p>
                            </div>
                        </div>
                    </Link>
                    <Link to='/dashboard/declined-res'>
                        <div className="bg-white rounded shadow p-4 flex items-center space-x-3">
                            <FaTimesCircle className="text-red-600 text-xl" />
                            <div>
                                <p className="text-sm">Resignation Declined</p>
                                <p className="font-bold text-lg">{declinedResignations.length}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
