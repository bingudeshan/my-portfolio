
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaShieldAlt } from 'react-icons/fa';
import '../../styles/login.css';

const Login = () => {
    const [error, setError] = useState('');
    const { loginWithGoogle, loginWithGithub } = useAuth();
    const navigate = useNavigate();

    const handleSocialLogin = async (loginMethod) => {
        try {
            setError('');
            await loginMethod();
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Authentication failed. Please try again or check your account.');
        }
    };

    return (
        <div className="login-page">
            <div className="background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="premium-login-card"
            >
                <div className="login-logo">Deshan.</div>

                <h2>Join the Platform</h2>
                <p>Create, manage, and share your professional portfolio with the community.</p>

                <div className="social-container">
                    <button
                        onClick={() => handleSocialLogin(loginWithGoogle)}
                        className="premium-social-btn btn-google"
                    >
                        <FcGoogle size={24} />
                        Continue with Google
                    </button>

                    <button
                        onClick={() => handleSocialLogin(loginWithGithub)}
                        className="premium-social-btn btn-github"
                    >
                        <FaGithub size={24} />
                        Continue with GitHub
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="error-message"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="login-footer">
                    <span>
                        <FaShieldAlt /> Secure Cloud Authentication
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
