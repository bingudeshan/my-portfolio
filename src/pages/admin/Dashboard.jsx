
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../CreatePost';
import ProjectForm from '../../components/ProjectForm';
import { FaUserEdit, FaPlusCircle, FaSave, FaExclamationTriangle, FaProjectDiagram } from 'react-icons/fa';
import { motion } from 'framer-motion';


const Dashboard = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('createPost');
    const [profile, setProfile] = useState(() => {
        try {
            const savedProfile = localStorage.getItem('profileData');
            return savedProfile ? JSON.parse(savedProfile) : {
                name: 'Deshan Hettiarachchi',
                bio: 'Physics & CS Undergraduate',
                linkedin: '',
                github: '',
                facebook: ''
            };
        } catch (error) {
            console.error("Failed to parse profile data", error);
            return {
                name: 'Deshan Hettiarachchi',
                bio: 'Physics & CS Undergraduate',
                linkedin: '',
                github: '',
                facebook: ''
            };
        }
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const saveProfile = () => {
        localStorage.setItem('profileData', JSON.stringify(profile));
        alert('Profile updated! Refresh the page to see changes in the sidebar.');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dashboard-container"
            style={{ padding: '2rem' }}
        >
            <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('createPost')}
                    className={`nav-link ${activeTab === 'createPost' ? 'active' : ''}`}
                    style={{ background: activeTab === 'createPost' ? 'var(--accent-blue)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaPlusCircle /> Create/Edit Post
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                    style={{ background: activeTab === 'projects' ? 'var(--accent-blue)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaProjectDiagram /> Manage Projects
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    style={{ background: activeTab === 'profile' ? 'var(--accent-purple)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaUserEdit /> Edit Profile
                </button>
            </div>

            {activeTab === 'createPost' && <CreatePost isAdmin={true} />}

            {activeTab === 'projects' && <ProjectForm />}

            {activeTab === 'profile' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <form className="create-post-form">
                        <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bio / Tagline</label>
                            <input
                                name="bio"
                                value={profile.bio}
                                onChange={handleProfileChange}
                                className="form-input"
                            />
                        </div>
                        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
                        <h4 style={{ marginBottom: '1rem' }}>Social Media Links</h4>
                        <div className="form-group">
                            <label className="form-label">LinkedIn URL</label>
                            <input
                                name="linkedin"
                                value={profile.linkedin}
                                onChange={handleProfileChange}
                                className="form-input"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">GitHub URL</label>
                            <input
                                name="github"
                                value={profile.github}
                                onChange={handleProfileChange}
                                className="form-input"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Facebook URL</label>
                            <input
                                name="facebook"
                                value={profile.facebook}
                                onChange={handleProfileChange}
                                className="form-input"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <button type="button" onClick={saveProfile} className="submit-btn" style={{ background: 'var(--accent-purple)' }}>
                            <FaSave style={{ marginRight: '0.5rem' }} /> Save Profile
                        </button>
                    </form>
                </div>
            )}
        </motion.div>
    );
};

export default Dashboard;
