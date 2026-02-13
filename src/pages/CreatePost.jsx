
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaEye } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [alert, setAlert] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const newPost = {
                id: Date.now(),
                title,
                date,
                content,
                image: imageUrl,
                tags: [] // Can be extended later
            };

            const existingPosts = JSON.parse(localStorage.getItem('physicsPosts')) || [];
            localStorage.setItem('physicsPosts', JSON.stringify([newPost, ...existingPosts]));

            setTitle('');
            setContent('');
            setImageUrl('');
            setAlert({ type: 'success', message: 'Post published successfully!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to publish post (Local Storage may be full).' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="create-post-container"
        >
            <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard: New Physics Post</h2>

            {alert && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    background: alert.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: alert.type === 'success' ? '#166534' : '#991b1b'
                }}>
                    {alert.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="create-post-form glass-panel" style={{ padding: '2rem' }}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-input"
                        placeholder="E.g., Intro to Quantum Mechanics"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Cover Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-input"
                    />
                    {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" />}
                </div>

                <div className="form-group">
                    <label className="form-label">Content (Markdown + LaTeX Supported)</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-textarea"
                        placeholder="Write your post here... Use $$ for equations."
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    <FaSave style={{ marginRight: '0.5rem' }} /> Publish Post
                </button>
            </form>

            <div className="preview-container">
                <h3 style={{ marginBottom: '1rem' }}><FaEye /> Live Preview</h3>
                <div className="card glass-panel" style={{ padding: '2rem' }}>
                    <h2>{title || 'Post Title'}</h2>
                    <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>{date}</span>
                    <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
                    <div className="markdown-preview">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {content || 'Your content will appear here...'}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreatePost;
