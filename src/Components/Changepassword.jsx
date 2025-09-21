// src/ChangePassword.jsx
import React, { useState } from 'react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import auth from './firebaseConfig'; // Import your Firebase auth instance

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setMessageType('');

        if (newPassword !== confirmNewPassword) {
            setMessage('New password and confirm new password do not match.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) { // Firebase requires a minimum of 6 characters for new passwords
            setMessage('New password must be at least 6 characters long.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        const user = auth.currentUser;

        if (user) {
            // 1. Re-authenticate the user
            // This is crucial for security-sensitive operations like changing passwords.
            // It ensures the user is currently who they say they are.
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            try {
                await reauthenticateWithCredential(user, credential);

                // 2. Update the password
                await updatePassword(user, newPassword);
                setMessage('Your password has been changed successfully!');
                setMessageType('success');
                // Clear fields on success
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } catch (error) {
                console.error("Error changing password:", error);
                let displayMessage = "Failed to change password. Please try again.";

                if (error.code === 'auth/wrong-password') {
                    displayMessage = "Incorrect current password.";
                } else if (error.code === 'auth/user-mismatch' || error.code === 'auth/invalid-credential') {
                    displayMessage = "Authentication failed. Please log out and log in again, then try.";
                } else if (error.code === 'auth/requires-recent-login') {
                    displayMessage = "Please log out and log in again, then try changing your password. (Session expired)";
                } else if (error.code === 'auth/weak-password') {
                    displayMessage = "New password is too weak. Please choose a stronger password.";
                }
                setMessage(displayMessage);
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        } else {
            setMessage('No user is currently logged in.');
            setMessageType('error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Change Your Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Confirm your new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-300
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
                        disabled={loading}
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-6 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'
                            }`}
                        role="alert"
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;