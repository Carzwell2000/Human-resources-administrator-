import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddDepartment from './pages/AddDepartment';
import ViewDepartment from './pages/ViewDepartment';
import AddLecturer from './pages/AddLecturer';
import ViewLecturer from './pages/ViewLecturer';
import DashboardOverview from './pages/Dashboardoverview';
import Leaveapplied from './Leaves/Leaveapplied';
import Leavedeclined from './Leaves/Leavedeclined';
import Leaveapproved from './Leaves/Leaveapproved';
import Appliedres from './resignation/Appliedres';
import Declinedres from './resignation/Declinedres';
import Approvedres from './resignation/Approvedres';
import Resertpassword from './Components/Resertpassword';
import Request from './Requestss/Request';
import Appliedrequest from './Requestss/Appliedrequest';
import Changepassword from "./Components/Changepassword";

// Dummy auth check
const isAuthenticated = () => !!localStorage.getItem('accessToken');

// Protected route wrapper
const ProtectedRoute = ({ children }) =>
    isAuthenticated() ? children : <Navigate to="/login" replace />;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/resert-password" element={< Resertpassword />} />


                {/* Protected Dashboard */}
                < Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardOverview />} />
                    <Route path="add-department" element={<AddDepartment />} />
                    <Route path="view-department" element={<ViewDepartment />} />
                    <Route path="add-lecturer" element={<AddLecturer />} />
                    <Route path="view-lecturer" element={<ViewLecturer />} />
                    <Route path="leave-applied" element={<Leaveapplied />} />
                    <Route path="leave-declined" element={<Leavedeclined />} />
                    <Route path="leave-approved" element={<Leaveapproved />} />
                    <Route path="applied-res" element={<Appliedres />} />
                    <Route path="declined-res" element={<Declinedres />} />
                    <Route path="approved-res" element={<Approvedres />} />
                    <Route path="register" element={<Register />} />
                    <Route path="request" element={<Request />} />
                    <Route path="applied-request" element={<Appliedrequest />} />
                    <Route path="change-password" element={<Changepassword />} />



                </Route>


                <Route
                    path="*"
                    element={
                        isAuthenticated() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;