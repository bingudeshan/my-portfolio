import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaAtom, FaCode, FaBriefcase, FaCamera, FaUser, FaLinkedin, FaGithub, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import defaultProfilePic from '../assets/profile.jpg';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { isAdmin } = useAuth();

    // Initialize profile image directly from localStorage
    const [profileImage, setProfileImage] = useState(() => {
        try {
            return localStorage.getItem('profileImage') || defaultProfilePic;
        } catch (e) {
            return defaultProfilePic;
        }
    });

    // Initialize profile data directly from localStorage
    const [profileData, setProfileData] = useState(() => {
        try {
            const savedProfile = localStorage.getItem('profileData');
            return savedProfile ? JSON.parse(savedProfile) : {
                name: 'Deshan Hettiarachchi',
                bio: 'Physics & CS Undergraduate',
                linkedin: '',
                github: '',
                facebook: ''
            };
        } catch (e) {
            return {
                name: 'Deshan Hettiarachchi',
                bio: 'Physics & CS Undergraduate',
                linkedin: '',
                github: '',
                facebook: ''
            };
        }
    });

    // useEffect is no longer needed for loading initial data as we do it in useState initialization

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set max dimensions for profile picture
                    const maxWidth = 300;
                    const maxHeight = 300;
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with quality reduction
                    const base64String = canvas.toDataURL('image/jpeg', 0.7);

                    try {
                        localStorage.setItem('profileImage', base64String);
                        setProfileImage(base64String);
                    } catch (error) {
                        console.error("Error saving image to localStorage:", error);
                        alert("Image is too large to save. Please choose a smaller image.");
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const links = [
        { path: '/', name: 'Home', icon: <FaHome /> },
        { path: '/blog', name: 'Physics Blog', icon: <FaAtom /> },
        { path: '/projects', name: 'Projects', icon: <FaCode /> },
        { path: '/experience', name: 'Experience', icon: <FaBriefcase /> },
    ];

    if (isAdmin) {
        links.push({ path: '/dashboard', name: 'Admin Dashboard', icon: <FaUser /> });
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
                        src={profileImage}
                        alt={profileData.name}
                        className="profile-img"
                    />
                </div>
                <h3>{profileData.name}</h3>
                <p className="subtitle">{profileData.bio}</p>

                {isAdmin && (
                    <>
                        <input
                            type="file"
                            id="profile-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="profile-upload" className="change-photo-btn">
                            <FaCamera style={{ marginRight: '5px' }} /> Change Photo
                        </label>
                    </>
                )}
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

                <a href="mailto:bingudeshan009@gmail.com" className="nav-link" style={{ justifyContent: 'center', background: 'var(--accent-blue)', color: 'white', marginBottom: '1rem' }}>
                    <FaEnvelope /> Contact Me
                </a>

                {!isAdmin && (
                    <NavLink to="/login" className="nav-link" style={{ justifyContent: 'center', fontSize: '0.8rem', opacity: 0.5 }}>
                        Admin Login
                    </NavLink>
                )}

                <p>© 2026 Deshan H.</p>
            </div>
        </motion.div>
    );
};

export default Sidebar;
