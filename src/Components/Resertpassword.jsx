// src/PasswordReset.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '../Components/firebaseConfig'; // Import your Firebase auth instance

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setMessageType('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Please check your inbox.');
            setMessageType('success');
            setEmail(''); // Clear the email input
        } catch (error) {
            console.error("Error sending password reset email:", error);
            let displayMessage = "Failed to send password reset email. Please try again.";

            if (error.code === 'auth/user-not-found') {
                displayMessage = "No user found with that email address.";
            } else if (error.code === 'auth/invalid-email') {
                displayMessage = "Please enter a valid email address.";
            }
            setMessage(displayMessage);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Reset Your Password
                </h2>
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? 'Sending...' : 'Send Reset Email'}
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

                <div className="mt-6 text-center text-gray-600">
                    Remember your password?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;