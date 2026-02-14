
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, getProfileByUsername } from '../services/dbService';

const Blog = ({ publicUser }) => {
    const { username } = useParams();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
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

                if (targetUid) {
                    const data = await getUserPosts(targetUid);
                    setPosts(data);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error("Failed to fetch posts", err);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [user, publicUser, username]);

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading Blog...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Blog</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Insights, tutorials, and my latest thoughts.
                </p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {posts.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        This user hasn't published any posts yet.
                    </p>
                </div>
            ) : (
                <motion.div className="card-grid" layout>
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                        >
                            <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }}
                                    />
                                )}
                                <span className="card-date">{new Date(post.createdAt || post.date).toLocaleDateString()}</span>
                                <h3 className="card-title" style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>{post.title}</h3>
                            </Link>

                            <div className="card-content" style={{ marginTop: '1rem' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        p: ({ ...props }) => <p style={{ margin: 0, color: 'var(--text-secondary)' }} {...props} />,
                                        a: ({ ...props }) => <span style={{ color: 'var(--accent-blue)' }} {...props} />
                                    }}
                                >
                                    {post.content && post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '')}
                                </ReactMarkdown>
                                <Link to={`/blog/${post.id}`} style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--accent-blue)', fontWeight: '600' }}>Read Full Post →</Link>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {post.tags && post.tags.map(tag => (
                                    <span key={tag} className="skill-tag" style={{ border: 'none', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', padding: '4px 10px' }}>#{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {filteredPosts.length === 0 && posts.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    No matching results for "{searchTerm}".
                </p>
            )}
        </motion.div>
    );
};

export default Blog;
