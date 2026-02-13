
import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-section"
        >
            <h1 className="hero-title">Hello, I'm Deshan Hettiarachchi</h1>
            <p className="tagline">Physics, Computer Science & Mathematics Undergraduate</p>

            <div className="intro-text">
                <p>
                    I am a highly analytical and solution-driven individual specializing in data analysis and programming.
                    Currently studying at the University of Ruhuna, I combine the rigorous logic of Physics with the creativity of Computer Science to solve complex problems.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <a href="/projects" style={{
                        padding: '10px 20px',
                        background: 'var(--accent-blue)',
                        color: 'var(--bg-primary)',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        marginRight: '1rem'
                    }}>View Projects</a>
                    <a href="/blog" style={{
                        padding: '10px 20px',
                        border: '1px solid var(--accent-blue)',
                        color: 'var(--accent-blue)',
                        borderRadius: '25px',
                        backdropFilter: 'blur(5px)'
                    }}>Read Blog</a>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
