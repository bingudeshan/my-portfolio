import React from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../context/ProjectsContext';
import ProjectCard from '../components/ProjectCard';
import '../styles/projects.css';

const Projects = () => {
    const { projects } = useProjects();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="projects-page"
        >
            <h2 style={{ marginBottom: '2rem' }}>Skills & Projects</h2>

            {/* Skills Section */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Technical Proficiencies</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Java', 'Python', 'HTML', 'CSS', 'JavaScript', 'React', 'SQL', 'Analytical Thinking', 'Problem Solving'].map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>

            {/* Projects Section */}
            <h3 style={{ marginBottom: '1.5rem' }}>Featured Projects</h3>

            {projects.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        No projects yet. Add your first project from the Admin Dashboard!
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
