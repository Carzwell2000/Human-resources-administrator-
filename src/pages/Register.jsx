
import React, { useState } from 'react';
import auth from '../Components/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || !confirmPw) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password !== confirmPw) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            if (displayName) {
                await updateProfile(userCred.user, { displayName });
            }
            navigate('/Login', { replace: true });
        } catch (err) {
            console.error('Registration error', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Email already in use.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Weak password. Try 6+ characters.');
                    break;
                default:
                    setError(err.message || 'Failed to register.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Create Account</h1>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Confirm Password </label>
                        <input
                            type="password"
                            value={confirmPw}
                            onChange={e => setConfirmPw(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}
