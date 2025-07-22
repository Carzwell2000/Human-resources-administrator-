// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import auth from '../Components/firebaseConfig'; // adjust as needed
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            // 1️⃣ Persist token (or a flag) in localStorage
            localStorage.setItem('accessToken', user.accessToken);

            console.log('User logged in:', user.email);
            // 2️⃣ Now navigate
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Login error:', err.code, err.message);
            if (['auth/user-not-found', 'auth/wrong-password'].includes(err.code)) {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many attempts. Try again later.');
            } else {
                setError(err.message || 'Unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Login</h2>

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline focus:border-blue-500 text-gray-700"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline focus:border-blue-500 text-gray-700"
                    />
                </div>


                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Logging In...' : 'Login'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">

                    <Link to="/resert-password" className="text-blue-500 hover:text-blue-700">
                        Forgot password
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default AdminLogin;
