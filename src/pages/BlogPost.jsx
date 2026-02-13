
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import initialPosts from '../data/posts.json';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [post, setPost] = useState(() => {
        const storedPosts = JSON.parse(localStorage.getItem('physicsPosts')) || [];
        const allPosts = [...storedPosts, ...initialPosts];
        return allPosts.find(p => p.id.toString() === id) || null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem('physicsPosts')) || [];
        const allPosts = [...storedPosts, ...initialPosts];
        const foundPost = allPosts.find(p => p.id.toString() === id);
        setPost(foundPost || null);
        setLoading(false);
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const storedPosts = JSON.parse(localStorage.getItem('physicsPosts')) || [];
            const updatedPosts = storedPosts.filter(p => p.id.toString() !== id);
            localStorage.setItem('physicsPosts', JSON.stringify(updatedPosts));
            alert('Post deleted.');
            navigate('/blog');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    }

    if (!post) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Post not found</h2>
                <Link to="/blog" className="back-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    <FaArrowLeft /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="single-post-container"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} className="back-btn" style={{ background: 'none', color: 'var(--text-secondary)', border: 'none', fontSize: '1rem', padding: 0 }}>
                    <FaArrowLeft /> Back to Blog
                </button>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Edit functionality could be expanded here */}
                        <button className="submit-btn" style={{ background: '#f59e0b', fontSize: '0.9rem', padding: '0.5rem 1rem' }} onClick={() => alert('Edit feature coming soon! For now, delete and recreate.')}>
                            <FaEdit /> Edit
                        </button>
                        <button className="submit-btn" style={{ background: '#ef4444', fontSize: '0.9rem', padding: '0.5rem 1rem' }} onClick={handleDelete}>
                            <FaTrash /> Delete
                        </button>
                    </div>
                )}
            </div>

            <article className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="post-hero-image"
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }}
                    />
                )}

                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{post.title}</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaCalendarAlt /> {post.date}
                        </span>
                        {post.tags && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {post.tags.map(tag => (
                                    <span key={tag} className="skill-tag" style={{ margin: 0 }}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </motion.div>
    );
};

export default BlogPost;
