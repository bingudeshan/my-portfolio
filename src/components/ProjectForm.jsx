import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import { useProjects } from '../context/ProjectsContext';

const ProjectForm = () => {
    const { projects, addProject, updateProject, deleteProject } = useProjects();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        keyFeatures: '',
        image: '',
        codeSnippets: [
            { fileName: '', language: 'javascript', code: '', description: '', image: '' }
        ]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('Image is too large. Please select an image under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSnippetChange = (index, field, value) => {
        const updatedSnippets = [...formData.codeSnippets];
        updatedSnippets[index] = { ...updatedSnippets[index], [field]: value };
        setFormData({ ...formData, codeSnippets: updatedSnippets });
    };

    const handleSnippetImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('Image is too large. Please select an image under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                handleSnippetChange(index, 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addSnippetField = () => {
        setFormData({
            ...formData,
            codeSnippets: [...formData.codeSnippets, { fileName: '', language: 'javascript', code: '', description: '', image: '' }]
        });
    };

    const removeSnippetField = (index) => {
        const updatedSnippets = formData.codeSnippets.filter((_, i) => i !== index);
        setFormData({ ...formData, codeSnippets: updatedSnippets });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Process the data
        const projectData = {
            title: formData.title,
            description: formData.description,
            technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
            githubUrl: formData.githubUrl,
            liveUrl: formData.liveUrl,
            keyFeatures: formData.keyFeatures.split('\n').map(f => f.trim()).filter(f => f),
            image: formData.image,
            codeSnippets: formData.codeSnippets.filter(s => s.code.trim() !== '')
        };

        if (editingId) {
            updateProject(editingId, projectData);
            alert('Project updated successfully!');
        } else {
            addProject(projectData);
            alert('Project added successfully!');
        }

        // Reset form
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            technologies: '',
            githubUrl: '',
            liveUrl: '',
            keyFeatures: '',
            image: '',
            codeSnippets: [
                { fileName: '', language: 'javascript', code: '', description: '', image: '' }
            ]
        });
        setEditingId(null);
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies.join(', '),
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            keyFeatures: project.keyFeatures ? project.keyFeatures.join('\n') : '',
            image: project.image || '',
            codeSnippets: project.codeSnippets && project.codeSnippets.length > 0
                ? project.codeSnippets.map(s => ({ ...s, fileName: s.fileName || '', image: s.image || '' }))
                : (project.codeSnippet ? [{ ...project.codeSnippet, fileName: '', image: '' }] : [{ fileName: '', language: 'javascript', code: '', description: '', image: '' }])
        });
        setEditingId(project.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
            if (editingId === id) {
                resetForm();
            }
        }
    };

    return (
        <div className="project-form-container">
            {/* Existing Projects List */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Existing Projects</h3>
                {projects.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No projects yet. Create your first project below!</p>
                ) : (
                    <div className="projects-list">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                className="project-list-item"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div>
                                    <h4>{project.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {project.technologies.join(', ')}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="delete-btn"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Form */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>
                    {editingId ? 'Edit Project' : 'Add New Project'}
                </h3>

                <form onSubmit={handleSubmit} className="create-post-form">
                    {/* Project Title */}
                    <div className="form-group">
                        <label className="form-label">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., Kitchen Kart App"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            rows="4"
                            placeholder="Brief description of your project..."
                            required
                        />
                    </div>

                    {/* Technologies */}
                    <div className="form-group">
                        <label className="form-label">Technologies (comma-separated) *</label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., Java, Python, React, Node.js"
                            required
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Supported: Java, Python, JavaScript, React, Node.js, HTML, CSS, MongoDB, MySQL, PostgreSQL, Android Studio, SQLite
                        </small>
                    </div>

                    {/* GitHub URL */}
                    <div className="form-group">
                        <label className="form-label">GitHub Repository URL</label>
                        <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Live Demo URL */}
                    <div className="form-group">
                        <label className="form-label">Live Demo URL</label>
                        <input
                            type="url"
                            name="liveUrl"
                            value={formData.liveUrl}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://your-demo-url.com"
                        />
                    </div>

                    {/* Project Screenshot */}
                    <div className="form-group">
                        <label className="form-label">Project Screenshot / Preview</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-input"
                            style={{ padding: '0.5rem' }}
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Upload a screenshot of your app in action (Max 2MB).
                        </small>
                        {formData.image && (
                            <div style={{ marginTop: '1rem', position: 'relative', width: '200px' }}>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: '' })}
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        background: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Key Features */}
                    <div className="form-group">
                        <label className="form-label">Key Features (one per line)</label>
                        <textarea
                            name="keyFeatures"
                            value={formData.keyFeatures}
                            onChange={handleChange}
                            className="form-input"
                            rows="5"
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        />
                    </div>

                    <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

                    <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>Code Snippets (Optional)</h4>
                        <button
                            type="button"
                            onClick={addSnippetField}
                            className="add-snippet-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid var(--accent-color)',
                                background: 'transparent',
                                color: 'var(--accent-color)',
                                cursor: 'pointer'
                            }}
                        >
                            <FaPlus size={12} /> Add Another Snippet
                        </button>
                    </div>

                    {formData.codeSnippets.map((snippet, index) => (
                        <div key={index} className="snippet-input-group" style={{
                            padding: '1.5rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            position: 'relative',
                            background: 'rgba(255, 255, 255, 0.03)'
                        }}>
                            {formData.codeSnippets.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSnippetField(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ff4444',
                                        cursor: 'pointer'
                                    }}
                                    title="Remove snippet"
                                >
                                    <FaTimes />
                                </button>
                            )}

                            {/* File Name */}
                            <div className="form-group">
                                <label className="form-label">File Name / Path</label>
                                <input
                                    type="text"
                                    value={snippet.fileName}
                                    onChange={(e) => handleSnippetChange(index, 'fileName', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., MainActivity.java or res/layout/activity_main.xml"
                                />
                            </div>

                            {/* Code Snippet Language */}
                            <div className="form-group">
                                <label className="form-label">Programming Language</label>
                                <select
                                    value={snippet.language}
                                    onChange={(e) => handleSnippetChange(index, 'language', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="sql">SQL</option>
                                    <option value="jsx">JSX/React</option>
                                    <option value="xml">XML</option>
                                    <option value="kotlin">Kotlin</option>
                                </select>
                            </div>

                            {/* Code Snippet Description */}
                            <div className="form-group">
                                <label className="form-label">Snippet Description</label>
                                <input
                                    type="text"
                                    value={snippet.description}
                                    onChange={(e) => handleSnippetChange(index, 'description', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., Main logic, API helper, etc."
                                />
                            </div>

                            {/* Code Snippet */}
                            <div className="form-group">
                                <label className="form-label">Code</label>
                                <textarea
                                    value={snippet.code}
                                    onChange={(e) => handleSnippetChange(index, 'code', e.target.value)}
                                    className="form-input code-input"
                                    rows="8"
                                    placeholder="Paste your code snippet here..."
                                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                />
                            </div>

                            {/* Snippet Image Preview */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Snippet Result Preview (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleSnippetImageChange(index, e)}
                                    className="form-input"
                                    style={{ padding: '0.4rem' }}
                                />
                                {snippet.image && (
                                    <div style={{ marginTop: '0.5rem', position: 'relative', width: '120px' }}>
                                        <img
                                            src={snippet.image}
                                            alt="Snippet preview"
                                            style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleSnippetChange(index, 'image', '')}
                                            style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                background: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Submit Buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="submit-btn">
                            {editingId ? <><FaSave /> Update Project</> : <><FaPlus /> Add Project</>}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="cancel-btn">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
