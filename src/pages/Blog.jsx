import React, { useState, useEffect } from 'react';
import initialPosts from '../data/posts.json';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Blog = () => {
    // ... state logic ...
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState(() => {
        const storedPosts = JSON.parse(localStorage.getItem('physicsPosts')) || [];
        return [...storedPosts, ...initialPosts];
    });

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* ... header ... */}
            <h2>Physics Blog</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Exploring the universe, one equation at a time.
            </p>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for lessons (e.g., Newton, Quantum)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <motion.div
                className="card-grid"
                layout
            >
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
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                />
                            )}
                            <span className="card-date">{post.date}</span>
                            <h3 className="card-title">{post.title}</h3>
                        </Link>

                        <div className="card-content">
                            {/* Render markdown but be careful with links inside links if we wrapped it. 
                                Now we separated them. */}
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                                    // Make links inside markdown preview non-clickable or acceptable
                                    a: ({ node, ...props }) => <span style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }} {...props} />
                                }}
                            >
                                {post.content && post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')}
                            </ReactMarkdown>

                            <Link to={`/blog/${post.id}`} style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--accent-blue)', fontSize: '0.9rem' }}>Read more</Link>
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {post.tags && post.tags.map(tag => (
                                <span key={tag} className="skill-tag" style={{ border: 'none', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem' }}>#{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ... footer ... */}
            {filteredPosts.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    No posts found matching "{searchTerm}".
                </p>
            )}
        </div>
    );
};

export default Blog;
