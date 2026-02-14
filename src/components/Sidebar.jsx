
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBlog, FaCode, FaBriefcase, FaUser, FaLinkedin, FaGithub, FaFacebook, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import defaultProfilePic from '../assets/profile.jpg';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/dbService';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        name: 'Portfolio Platform',
        bio: 'Build your identity',
        photoURL: defaultProfilePic
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const data = await getUserProfile(user.uid);
                if (data) {
                    setProfileData({
                        name: data.name || user.displayName || 'New User',
                        bio: data.tagline || data.bio || 'Setup your profile',
                        photoURL: data.photoURL || user.photoURL || defaultProfilePic,
                        linkedin: data.linkedin,
                        github: data.github,
                        facebook: data.facebook
                    });
                } else {
                    setProfileData({
                        name: user.displayName || 'New User',
                        bio: 'Click Dashboard to setup',
                        photoURL: user.photoURL || defaultProfilePic
                    });
                }
            } else {
                setProfileData({
                    name: 'Portfolio Platform',
                    bio: 'Share your work',
                    photoURL: defaultProfilePic
                });
            }
        };
        fetchProfile();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const links = [
        { path: '/', name: 'Home', icon: <FaHome /> },
        { path: '/blog', name: 'Blog', icon: <FaBlog /> },
        { path: '/projects', name: 'Projects', icon: <FaCode /> },
        { path: '/experience', name: 'Experience', icon: <FaBriefcase /> },
    ];

    if (user) {
        links.push({ path: '/dashboard', name: 'My Dashboard', icon: <FaUser /> });
    }

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="sidebar"
        >
            <div className="profile-section">
                <div className="profile-img-container">
                    <img
                        src={profileData.photoURL}
                        alt={profileData.name}
                        className="profile-img"
                    />
                </div>
                <h3>{profileData.name}</h3>
                <p className="subtitle">{profileData.bio}</p>
            </div>

            <nav>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        <span className="icon">{link.icon}</span>
                        {link.name}
                    </NavLink>
                ))}

                {user && (
                    <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}>
                        <span className="icon"><FaSignOutAlt /></span>
                        Logout
                    </button>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {profileData.linkedin && (
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FaLinkedin /></a>
                    )}
                    {profileData.github && (
                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FaGithub /></a>
                    )}
                    {profileData.facebook && (
                        <a href={profileData.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FaFacebook /></a>
                    )}
                </div>

                <a href="mailto:support@portfolio.io" className="nav-link" style={{ justifyContent: 'center', background: 'var(--accent-blue)', color: 'white', marginBottom: '1rem' }}>
                    <FaEnvelope /> Support
                </a>

                {!user && (
                    <NavLink to="/login" className="nav-link" style={{ justifyContent: 'center', fontSize: '0.8rem', opacity: 0.5 }}>
                        Join the Platform
                    </NavLink>
                )}

                <p>© 2026 Portfolio App</p>
            </div>
        </motion.div>
    );
};

export default Sidebar;
