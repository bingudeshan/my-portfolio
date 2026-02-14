
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../CreatePost';
import ProjectForm from '../../components/ProjectForm';
import ExperienceForm from '../../components/ExperienceForm';
import { FaUserEdit, FaPlusCircle, FaSave, FaExclamationTriangle, FaProjectDiagram, FaLink, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getUserProfile, saveUserProfile } from '../../services/dbService';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    // ... rest of component ...
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        tagline: '',
        username: '',
        skills: '',
        photoURL: '',
        linkedin: '',
        github: '',
        facebook: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const data = await getUserProfile(user.uid);
                if (data) {
                    setProfile({
                        name: data.name || user.displayName || '',
                        bio: data.bio || '',
                        tagline: data.tagline || '',
                        username: data.username || '',
                        skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
                        photoURL: data.photoURL || user.photoURL || '',
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        facebook: data.facebook || ''
                    });
                } else {
                    // Initialize with basic user info
                    setProfile(prev => ({
                        ...prev,
                        name: user.displayName || '',
                        username: user.email?.split('@')[0] || '',
                        photoURL: user.photoURL || ''
                    }));
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1 * 1024 * 1024) { // 1MB limit for Firestore
                alert('Image too large. Please use an image under 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, photoURL: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfileData = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Convert skills string back to array for storage
            const dataToSave = {
                ...profile,
                skills: profile.skills.split(',').map(s => s.trim()).filter(s => s !== '')
            };
            await saveUserProfile(user.uid, dataToSave);
            alert('Profile updated and synced with cloud!');
        } catch (error) {
            console.error(error);
            alert('Failed to save profile. Check Firestore rules.');
        }
        setSaving(false);
    };

    if (authLoading) return <div style={{ padding: '2rem' }}>Loading Auth...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dashboard-container"
            style={{ padding: '2rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>User Dashboard</h2>
                {profile.username && (
                    <a
                        href={`/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <FaLink /> View Public Portfolio: /{profile.username}
                    </a>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    style={{ background: activeTab === 'profile' ? 'var(--accent-purple)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaUserEdit /> Profile & Identity
                </button>
                <button
                    onClick={() => setActiveTab('experience')}
                    className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
                    style={{ background: activeTab === 'experience' ? 'var(--accent-blue)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaGraduationCap /> Experience & Education
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                    style={{ background: activeTab === 'projects' ? 'var(--accent-blue)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaProjectDiagram /> Manage Projects
                </button>
                <button
                    onClick={() => setActiveTab('createPost')}
                    className={`nav-link ${activeTab === 'createPost' ? 'active' : ''}`}
                    style={{ background: activeTab === 'createPost' ? 'var(--accent-blue)' : 'var(--bg-secondary)', border: 'none' }}
                >
                    <FaPlusCircle /> Blog Posts
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <form className="create-post-form" onSubmit={(e) => { e.preventDefault(); saveProfileData(); }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Basic Information</h3>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        name="name"
                                        value={profile.name}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Portfolio Username (URL Name)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>site.com/</span>
                                        <input
                                            name="username"
                                            value={profile.username}
                                            onChange={handleProfileChange}
                                            className="form-input"
                                            placeholder="myname"
                                            required
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem' }}>
                                        This will be your public URL: <strong>deshan.me/{profile.username || '...'}</strong>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Short Tagline</label>
                                    <input
                                        name="tagline"
                                        value={profile.tagline}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        placeholder="Full Stack Developer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">About Me (Bio)</label>
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        style={{ height: '100px', resize: 'vertical' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Technical Skills (comma separated)</label>
                                    <input
                                        name="skills"
                                        value={profile.skills}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                        placeholder="React, Python, AWS, etc."
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Profile Image</h3>
                                <div className="form-group">
                                    <label className="form-label">Profile Photo</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '2px solid var(--accent-purple)',
                                            background: 'rgba(255,255,255,0.05)'
                                        }}>
                                            {profile.photoURL ? (
                                                <img src={profile.photoURL} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                        Upload a custom photo (Max 1MB). This will override your social login photo.
                                    </p>
                                </div>

                                <h3 style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Social Links</h3>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn URL</label>
                                    <input
                                        name="linkedin"
                                        value={profile.linkedin}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub URL</label>
                                    <input
                                        name="github"
                                        value={profile.github}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Facebook URL</label>
                                    <input
                                        name="facebook"
                                        value={profile.facebook}
                                        onChange={handleProfileChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="submit-btn"
                            style={{ background: 'var(--accent-purple)', marginTop: '2rem' }}
                        >
                            <FaSave style={{ marginRight: '0.5rem' }} /> {saving ? 'Saving...' : 'Save & Sync Cloud'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'experience' && <ExperienceForm />}

            {activeTab === 'projects' && <ProjectForm />}

            {activeTab === 'createPost' && <CreatePost isAdmin={true} />}
        </motion.div>
    );
};

export default Dashboard;
