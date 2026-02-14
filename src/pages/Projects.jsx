
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProjects, getUserProfile, getProfileByUsername } from '../services/dbService';
import ProjectCard from '../components/ProjectCard';
import '../styles/projects.css';

const Projects = ({ publicUser }) => {
    const { username } = useParams();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                let targetUid = null;
                let targetProfile = null;

                if (publicUser) {
                    targetUid = publicUser.id;
                    targetProfile = publicUser;
                } else if (username) {
                    const data = await getProfileByUsername(username);
                    if (data) {
                        targetUid = data.id;
                        targetProfile = data;
                    }
                } else if (user) {
                    targetUid = user.uid;
                    targetProfile = await getUserProfile(user.uid);
                }

                if (!targetUid) {
                    // If no user is logged in and no username is in the URL,
                    // we show an empty state or a featured global projects list.
                    // For now, an empty list is safer for a generic platform.
                    setProjects([]);
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                if (targetUid) {
                    const projectData = await getUserProjects(targetUid);
                    setProjects(projectData);
                    setProfile(targetProfile);
                }
            } catch (error) {
                console.error("Error fetching projects/profile", error);
            }
            setLoading(false);
        };
        fetchContent();
    }, [user, publicUser, username]);

    if (loading) return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading Projects...</div>;

    const skills = profile?.skills || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="projects-page"
        >
            <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Skills & Projects</h2>

            {/* Skills Section */}
            {skills.length > 0 && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Technical Proficiencies</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                        {skills.map(skill => (
                            <span key={skill} className="skill-tag" style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}>{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects Section */}
            <h3 style={{ marginBottom: '1.5rem' }}>Featured Projects</h3>

            {projects.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        No projects found for this profile.
                    </p>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Projects;
