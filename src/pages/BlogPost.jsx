import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getPostById, deletePost } from '../services/dbService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const cleanId = id?.trim();
            if (!cleanId) return;
            setLoading(true);
            try {
                console.log("--- BLOG GOD-MODE DEBUG START ---");
                console.log("URL Pathname:", window.location.pathname);
                console.log("Params ID:", id);
                console.log("Cleaned ID:", cleanId);

                // 1. Try direct fetch (Standard)
                let data = await getPostById(cleanId);

                if (!data) {
                    console.warn("Step 1 (Standard) Failed. Trying Step 2 (Collection Scan)...");

                    // 2. Full Collection Scan (doc.id match)
                    const postsRef = collection(db, 'posts');
                    const snap = await getDocs(postsRef);
                    console.log(`Step 2: Scanned ${snap.size} documents in 'posts' collection.`);

                    // Log all IDs to see if there's a mismatch
                    snap.docs.forEach(doc => console.log(` - ID in DB: "${doc.id}" vs Target: "${cleanId}"`));

                    const docMatch = snap.docs.find(doc => doc.id === cleanId);
                    if (docMatch) {
                        console.log("SUCCESS at Step 2! Found by direct doc.id match.");
                        data = { ...docMatch.data(), id: docMatch.id };
                    } else {
                        console.warn("Step 2 Failed. Trying Step 3 (Field id Scan)...");

                        // 3. Field Search (check data().id) - some older posts might have 'id' as a field
                        const fieldMatch = snap.docs.find(doc => doc.data().id === cleanId);
                        if (fieldMatch) {
                            console.log("SUCCESS at Step 3! Found by data().id field match.");
                            data = { ...fieldMatch.data(), id: fieldMatch.id };
                        } else {
                            console.error("ALL STEPS FAILED. Post not found in 'posts' collection.");
                        }
                    }
                }

                if (data) {
                    console.log("FINAL RESULT: Post retrieved successfully.", data);
                    setPost(data);
                } else {
                    console.error("FINAL RESULT: Post could not be found.");
                }
                console.log("--- BLOG GOD-MODE DEBUG END ---");
            } catch (err) {
                console.error("CRITICAL ERROR during fetchPost:", err);
            }
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                alert('Post deleted.');
                navigate('/blog');
            } catch (err) {
                console.error(err);
                alert('Failed to delete post.');
            }
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>Loading post...</div>;
    }

    if (!post) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Post not found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The post might have been deleted or the link is incorrect.</p>
                <Link to="/blog" className="back-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    <FaArrowLeft /> Back to Blog
                </Link>
            </div>
        );
    }

    // Strictly verify ownership based on UID
    const isOwner = user && post.uid && user.uid === post.uid;

    const formatDate = (dateValue) => {
        if (!dateValue) return "No date";
        try {
            const d = new Date(dateValue);
            return isNaN(d.getTime()) ? dateValue : d.toLocaleDateString();
        } catch {
            return dateValue;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="single-post-container"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} className="back-btn" style={{ background: 'none', color: 'var(--text-secondary)', border: 'none', fontSize: '1rem', padding: 0, cursor: 'pointer' }}>
                    <FaArrowLeft /> Back to Blog
                </button>

                {isOwner && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="submit-btn"
                            style={{ background: '#f59e0b', fontSize: '0.9rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                            onClick={() => navigate(`/dashboard?tab=createPost&edit=${id}`)}
                        >
                            <FaEdit /> Edit Post
                        </button>
                        <button
                            className="submit-btn"
                            style={{ background: '#ef4444', fontSize: '0.9rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                            onClick={handleDelete}
                        >
                            <FaTrash /> Delete
                        </button>
                    </div>
                )}
            </div>

            <article className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
                {(post.image || post.imageUrl) && (
                    <img
                        src={post.image || post.imageUrl}
                        alt={post.title}
                        className="post-hero-image"
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem', maxHeight: '500px', objectFit: 'cover' }}
                    />
                )}

                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{post.title || 'Untitled Post'}</h1>

                    {post.authorName && (
                        <div
                            style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent-blue)', cursor: 'pointer', display: 'inline-block' }}
                            onClick={() => post.authorUsername && navigate(`/${post.authorUsername}`)}
                        >
                            By <span style={{ textDecoration: 'underline' }}>{post.authorName}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaCalendarAlt /> {formatDate(post.createdAt || post.date)}
                        </span>
                        {post.tags && post.tags.length > 0 && (
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
                        {post.content || ''}
                    </ReactMarkdown>
                </div>
            </article>
        </motion.div>
    );
};

export default BlogPost;
