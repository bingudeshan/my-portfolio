
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserExperience, getProfileByUsername } from '../services/dbService';

const Experience = ({ publicUser }) => {
    const { username } = useParams();
    const { user } = useAuth();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            setLoading(true);
            try {
                let targetUid = null;

                if (publicUser) {
                    targetUid = publicUser.id;
                } else if (username) {
                    const profile = await getProfileByUsername(username);
                    if (profile) targetUid = profile.id;
                } else if (user) {
                    targetUid = user.uid;
                }

                if (!targetUid) {
                    const mainProfile = await getProfileByUsername('bingudeshan');
                    if (mainProfile) targetUid = mainProfile.id;
                }

                if (targetUid) {
                    const data = await getUserExperience(targetUid);
                    setExperiences(data);
                }
            } catch (err) {
                console.error("Failed to fetch experience", err);
            }
            setLoading(false);
        };
        fetchExperience();
    }, [user, publicUser, username]);

    if (loading) return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading Experience...</div>;

    const workExp = experiences.filter(exp => exp.type === 'work');
    const eduExp = experiences.filter(exp => exp.type === 'education');

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="experience-page"
        >
            <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Experience & Education</h2>

            <div className="glass-panel" style={{ padding: '2rem 3rem', marginBottom: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--accent-blue)' }}>Professional Experience</h3>

                {workExp.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No professional experience listed yet.</p>
                ) : (
                    workExp.map((exp, index) => (
                        <div key={exp.id || index} className="timeline-item">
                            <span className="timeline-date">{exp.date}</span>
                            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{exp.title}</h4>
                            <span className="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{exp.company}</span>
                            <p style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem 3rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--accent-purple)' }}>Education</h3>

                {eduExp.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No education history listed yet.</p>
                ) : (
                    eduExp.map((exp, index) => (
                        <div key={exp.id || index} className="timeline-item">
                            <span className="timeline-date">{exp.date}</span>
                            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{exp.title}</h4>
                            <span className="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{exp.institution}</span>
                            <p style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default Experience;
