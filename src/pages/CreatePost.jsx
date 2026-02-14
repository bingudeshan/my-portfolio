import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAuth } from '../context/AuthContext';
import { addPost, getUserPosts, updatePost, deletePost, getPostById } from '../services/dbService';
import { useLocation, useNavigate } from 'react-router-dom';

const CreatePost = ({ isAdmin }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [alert, setAlert] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch posts for the user
    const fetchPosts = useCallback(async () => {
        if (!user && !isAdmin) return;
        setLoading(true);
        try {
            // If admin, fetch all posts. Otherwise, fetch only user posts.
            const data = await getUserPosts(isAdmin ? null : user?.uid);
            setPosts(data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [user, isAdmin]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleEdit = useCallback(async (id) => {
        // Try to find in current posts first, then fetch if not found
        let postToEdit = posts.find(p => p.id === id);
        if (!postToEdit) {
            postToEdit = await getPostById(id);
        }

        if (postToEdit) {
            setEditingId(postToEdit.id);
            setTitle(postToEdit.title);
            setDate(postToEdit.date || postToEdit.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]);
            setContent(postToEdit.content);
            setImageUrl(postToEdit.image || '');
            setTags(postToEdit.tags ? postToEdit.tags.join(', ') : '');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    }, [posts]);

    // Check for edit query param
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const editId = queryParams.get('edit');
        if (editId) {
            handleEdit(editId);
        }
    }, [location.search, handleEdit]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                setPosts(posts.filter(p => p.id !== id));
                if (editingId === id) resetForm();
                setAlert({ type: 'success', message: 'Post deleted successfully.' });
            } catch (error) {
                console.error(error);
                setAlert({ type: 'error', message: 'Failed to delete post.' });
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setContent('');
        setImageUrl('');
        setTags('');
        // Clean up URL if we were editing
        if (location.search.includes('edit=')) {
            navigate('/admin/dashboard?tab=createPost');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) {
                alert('Image is too large. Please use an image smaller than 500KB to ensure it correctly saves to the database.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setAlert(null);

        try {
            const postData = {
                uid: user.uid,
                title,
                date,
                content,
                image: imageUrl,
                tags: tags.split(',').map(t => t.trim()).filter(t => t !== '')
            };

            if (editingId) {
                await updatePost(editingId, postData);
                setAlert({ type: 'success', message: 'Post updated successfully!' });
            } else {
                await addPost(postData);
                setAlert({ type: 'success', message: 'Post published successfully!' });
            }

            resetForm();
            fetchPosts();
        } catch (error) {
            console.error("Save error details:", error);
            setAlert({
                type: 'error',
                message: `Failed to save post: ${error.message || 'Unknown error'}. If it's a large post, try reducing the image size.`
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="create-post-container"
        >
            <h2 style={{ marginBottom: '2rem' }}>Manage Blog Posts</h2>

            {/* Existing Posts List */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaEdit /> Your Published Posts
                </h3>
                {loading && posts.length === 0 ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No posts yet. Start writing below!</p>
                ) : (
                    <div className="projects-list">
                        {posts.map((post) => (
                            <div key={post.id} className="project-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{post.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                                        {new Date(post.createdAt || post.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => navigate(`/blog/${post.id}`)} className="edit-btn" style={{ background: 'var(--accent-purple)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                        View
                                    </button>
                                    <button onClick={() => handleEdit(post.id)} className="edit-btn" style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="delete-btn" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor Form */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingId ? <><FaEdit /> Edit Post</> : <><FaPlus /> Create New Post</>}
                </h3>

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

                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-input"
                            placeholder="Post Title"
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
                        {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" style={{ marginTop: '1rem', maxWidth: '200px', borderRadius: '8px' }} />}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="form-input"
                            placeholder="physics, quantum, tutorial"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content (Markdown + LaTeX Supported)</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="form-textarea"
                            placeholder="Write your content here..."
                            required
                            style={{ height: '300px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="submit-btn" disabled={isSaving}>
                            <FaSave style={{ marginRight: '0.5rem' }} />
                            {isSaving ? 'Saving...' : (editingId ? 'Update Post' : 'Publish Post')}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="cancel-btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="preview-container" style={{ marginTop: '2rem' }}>
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
