
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTimes, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getUserExperience, addExperience, updateExperience, deleteExperience, getUserProfile } from '../services/dbService';

const ExperienceForm = () => {
    const { user } = useAuth();
    const [experiences, setExperiences] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        institution: '',
        date: '',
        description: '',
        type: 'work' // 'work' or 'education'
    });

    useEffect(() => {
        const fetchExperienceAndProfile = async () => {
            if (user) {
                try {
                    const [expData, profileData] = await Promise.all([
                        getUserExperience(user.uid),
                        getUserProfile(user.uid)
                    ]);
                    setExperiences(expData);
                    setUserProfile(profileData);
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                }
                setLoading(false);
            }
        };
        fetchExperienceAndProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const dataToSave = {
                ...formData,
                uid: user.uid,
                authorName: userProfile?.name || user.displayName || 'Anonymous',
                authorUsername: userProfile?.username || ''
            };
            if (editingId) {
                await updateExperience(editingId, dataToSave);
                setExperiences(experiences.map(exp => exp.id === editingId ? { ...dataToSave, id: editingId } : exp));
                alert('Experience updated!');
            } else {
                const id = await addExperience(dataToSave);
                setExperiences([...experiences, { ...dataToSave, id }]);
                alert('Experience added!');
            }
            resetForm();
        } catch (error) {
            console.error(error);
            alert('Failed to save experience.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            company: '',
            institution: '',
            date: '',
            description: '',
            type: 'work'
        });
        setEditingId(null);
    };

    const handleEdit = (exp) => {
        setFormData({
            title: exp.title,
            company: exp.company || '',
            institution: exp.institution || '',
            date: exp.date,
            description: exp.description,
            type: exp.type
        });
        setEditingId(exp.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this entry?')) {
            await deleteExperience(id);
            setExperiences(experiences.filter(exp => exp.id !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="experience-form-container">
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Your Timeline</h3>
                {experiences.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No entries yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {experiences.map((exp) => (
                            <div key={exp.id} className="project-list-item">
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {exp.type === 'work' ? <FaBriefcase color="var(--accent-blue)" /> : <FaGraduationCap color="var(--accent-purple)" />}
                                        <h4 style={{ margin: 0 }}>{exp.title}</h4>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                                        {exp.type === 'work' ? exp.company : exp.institution} | {exp.date}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(exp)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(exp.id)} className="delete-btn"><FaTimes /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Entry' : 'Add New Entry'}</h3>
                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                            <option value="work">Work Experience</option>
                            <option value="education">Education</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title / Role</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Software Engineer" required />
                    </div>

                    {formData.type === 'work' ? (
                        <div className="form-group">
                            <label className="form-label">Company</label>
                            <input name="company" value={formData.company} onChange={handleChange} className="form-input" placeholder="e.g. Google" />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">Institution</label>
                            <input name="institution" value={formData.institution} onChange={handleChange} className="form-input" placeholder="e.g. Harvard University" />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input name="date" value={formData.date} onChange={handleChange} className="form-input" placeholder="e.g. 2021 - Present" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" placeholder="Describe your achievements..." />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="submit-btn" style={{ background: formData.type === 'work' ? 'var(--accent-blue)' : 'var(--accent-purple)' }}>
                            {editingId ? <FaSave /> : <FaPlus />} {editingId ? 'Update' : 'Add to Timeline'}
                        </button>
                        {editingId && <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExperienceForm;
