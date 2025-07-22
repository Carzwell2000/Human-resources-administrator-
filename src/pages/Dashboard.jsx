// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed z-50 md:static top-0 left-0 h-full bg-white shadow-md transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
            >
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <div className="sticky top-0 z-30 shadow-md bg-white">
                    <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Dashboard;