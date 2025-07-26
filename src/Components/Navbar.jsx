import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { signOut } from 'firebase/auth';
import auth from '../Components/firebaseConfig';

const AdminNavbar = ({ onMenuClick }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('accessToken');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <nav className="bg-blue-600 p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-white text-2xl font-bold px-2 focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>
                    <Link to="/" className="text-xl font-bold text-white">
                        Admin Dashboard
                    </Link>
                </div>



                <div className="flex items-center gap-8">
                    <span className="text-white text-sm md:text-base">
                        Welcome, <span className="font-semibold">{user?.name || 'User'}</span>
                    </span>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            Log out of your account?
                        </h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminNavbar;

