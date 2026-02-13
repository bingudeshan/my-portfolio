import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaTimes, FaJava } from 'react-icons/fa';
import { SiPython, SiJavascript, SiReact, SiNodedotjs, SiHtml5, SiCss3, SiMongodb, SiMysql, SiPostgresql, SiAndroid } from 'react-icons/si';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Tech icon mapping
const techIcons = {
    'Java': FaJava,
    'Python': SiPython,
    'JavaScript': SiJavascript,
    'React': SiReact,
    'Node.js': SiNodedotjs,
    'HTML': SiHtml5,
    'CSS': SiCss3,
    'MongoDB': SiMongodb,
    'MySQL': SiMysql,
    'PostgreSQL': SiPostgresql,
    'Android Studio': SiAndroid,
    'SQLite': SiAndroid,
};

const ProjectCard = ({ project }) => {
    const [showCodeSnippet, setShowCodeSnippet] = useState(false);

    return (
        <>
            <motion.div
                className="project-card"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Project Image Preview */}
                {project.image && (
                    <div className="project-image-preview" style={{
                        width: '100%',
                        height: '160px',
                        overflow: 'hidden',
                        borderRadius: '12px 12px 0 0',
                        marginBottom: '1rem',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <img
                            src={project.image}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Project Header */}
                <div className="project-header" style={{ padding: project.image ? '0 1rem' : '0' }}>
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-links">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link-icon"
                                title="View on GitHub"
                            >
                                <FaGithub />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link-icon"
                                title="Live Demo"
                            >
                                <FaExternalLinkAlt />
                            </a>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="project-description">{project.description}</p>

                {/* Tech Stack */}
                <div className="tech-stack">
                    <h4 className="tech-stack-title">Tech Stack</h4>
                    <div className="tech-icons">
                        {project.technologies.map((tech, index) => {
                            const Icon = techIcons[tech];
                            return (
                                <div key={index} className="tech-icon-wrapper" title={tech}>
                                    {Icon ? <Icon className="tech-icon" /> : <span className="tech-text">{tech}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key Features */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div className="key-features">
                        <h4 className="features-title">Key Features</h4>
                        <ul className="features-list">
                            {project.keyFeatures.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="project-actions">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-btn primary"
                        >
                            <FaGithub /> View Code on GitHub
                        </a>
                    )}
                    {((project.codeSnippet && project.codeSnippet.code) || (project.codeSnippets && project.codeSnippets.length > 0)) && (
                        <button
                            onClick={() => setShowCodeSnippet(true)}
                            className="project-btn secondary"
                        >
                            <FaCode /> View Code Snippets
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Code Snippet Modal */}
            <AnimatePresence>
                {showCodeSnippet && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCodeSnippet(false)}
                    >
                        <motion.div
                            className="modal-content code-snippet-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '900px', width: '90%' }}
                        >
                            <div className="modal-header">
                                <h3>Code Snippets: {project.title}</h3>
                                <button
                                    onClick={() => setShowCodeSnippet(false)}
                                    className="close-btn"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {/* Project Screenshot in Modal */}
                                {project.image && (
                                    <div className="modal-screenshot" style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>App Preview Screenshot</h4>
                                        <img
                                            src={project.image}
                                            alt="Project screenshot"
                                            style={{
                                                width: '100%',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Support both old single snippet and new multiple snippets format */}
                                {project.codeSnippet && project.codeSnippet.code && (
                                    <div className="snippet-container" style={{ marginBottom: '2rem' }}>
                                        {project.codeSnippet.description && (
                                            <h4 className="snippet-title" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                                                {project.codeSnippet.description}
                                            </h4>
                                        )}
                                        <SyntaxHighlighter
                                            language={project.codeSnippet.language || 'javascript'}
                                            style={vscDarkPlus}
                                            showLineNumbers
                                            customStyle={{
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {project.codeSnippet.code}
                                        </SyntaxHighlighter>
                                    </div>
                                )}

                                {project.codeSnippets && project.codeSnippets.map((snippet, index) => (
                                    <div key={index} className="snippet-container" style={{ marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <h4 className="snippet-title" style={{ color: 'var(--accent-color)', margin: 0 }}>
                                                {snippet.fileName ? `📄 ${snippet.fileName}` : (snippet.description || `Snippet ${index + 1}`)}
                                            </h4>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                                {snippet.language}
                                            </span>
                                        </div>
                                        {snippet.fileName && snippet.description && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                {snippet.description}
                                            </p>
                                        )}

                                        <div className="snippet-content-wrapper" style={{
                                            display: 'grid',
                                            gridTemplateColumns: snippet.image ? '1fr 200px' : '1fr',
                                            gap: '1rem',
                                            alignItems: 'start'
                                        }}>
                                            <SyntaxHighlighter
                                                language={snippet.language || 'javascript'}
                                                style={vscDarkPlus}
                                                showLineNumbers
                                                customStyle={{
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    margin: 0
                                                }}
                                            >
                                                {snippet.code}
                                            </SyntaxHighlighter>

                                            {snippet.image && (
                                                <div className="snippet-preview-image" style={{ width: '100%' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Result Preview:</p>
                                                    <img
                                                        src={snippet.image}
                                                        alt="Snippet Result"
                                                        style={{
                                                            width: '100%',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--border-color)',
                                                            cursor: 'zoom-in'
                                                        }}
                                                        onClick={() => window.open(snippet.image, '_blank')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectCard;
