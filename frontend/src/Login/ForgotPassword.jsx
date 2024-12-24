import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import { Lock, Mail, KeyRound, CheckCircle2, X, ArrowLeft, Link } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState('forgotPassword');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    // Handle Forgot Password Form Submission
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await axios.post(`${config.backendUrl}/forget-password`, { email });
            if (response.status === 200) {
                setStep('verifyOtp');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-screen overflow-hidden  bg-black flex items-center justify-center px-4 py-8">
            
            <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-8">
                {step === 'forgotPassword' && (
                    <ForgotPasswordForm
                        email={email}
                        setEmail={setEmail}
                        error={error}
                        onSubmit={handleForgotPasswordSubmit}
                    />
                )}
                {step === 'verifyOtp' && (
                    <VerifyOtpForm
                        email={email}
                        onSuccess={() => setStep('changePassword')}
                        onError={(errorMsg) => setError(errorMsg)}
                    />
                )}
                {step === 'changePassword' && <ChangePasswordForm />}
            </div>
        </div>
    );
};

// Forgot Password Form
const ForgotPasswordForm = ({ email, setEmail, error, onSubmit }) => {
    const navigate=useNavigate();
    const handleBack=(e)=>{
        e.preventDefault();
        navigate('/')
    
    }
    return (
    <div>
        <div className="flex items-center justify-between mb-6 relative">
        {/* Left Arrow */}
        <button onClick={handleBack} className="absolute left-0 bg-gray-800 h-4 w-4 text-white p-2 rounded-md">
            <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Center Lock */}
        <div className="flex justify-center w-full">
            <Lock className="w-12 h-12 text-purple-600" />
        </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-4">Forgot Password</h2>
        <p className="text-white text-center mb-6">Enter your email to reset your password</p>
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-transform transform hover:scale-105 text-white font-medium rounded-md flex items-center justify-center"
            >
                Send Reset Link
            </button>
        </form>
    </div>
    )
};

// OTP Verification Form
const VerifyOtpForm = ({ email, onSuccess, onError }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await axios.post(
                `${config.backendUrl}/verify-otp`,
                { email, otp },
                { withCredentials: true }
            );
            if (response.status === 200) {
                onSuccess();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(errorMsg);
            onError(errorMsg);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center mb-6">
                <KeyRound className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-4">Verify OTP</h2>
            <p className="text-white text-center mb-6">Enter the 6-digit code sent to {email}</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
                        placeholder="Enter OTP"
                        required
                        className="w-full px-3 py-2 text-center text-xl tracking-widest border border-gray-300 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-transform transform hover:scale-105 text-white font-medium rounded-md"
                >
                    Verify
                </button>
            </form>
        </div>
    );
};

// Change Password Form
const ChangePasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post(
                `${config.backendUrl}/reset-password`,
                { password },
                { withCredentials: true }
            );
            if (response.status === 200) {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error changing password. Please try again.');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-4">Reset Password</h2>
            <p className="text-white text-center mb-6">Create a new password</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-transform transform hover:scale-105 text-white font-medium rounded-md"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
