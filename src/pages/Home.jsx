
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/dbService';

const Home = ({ publicUser }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (publicUser) {
                setProfile(publicUser);
            } else if (user) {
                const data = await getUserProfile(user.uid);
                setProfile(data);
            }
        };
        fetchProfile();
    }, [user, publicUser]);

    // Defaults logic
    const isOwnerSession = user && !publicUser;

    // Dedicated Landing Page for unauthenticated visitors on root "/"
    if (!user && !publicUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="landing-container"
                style={{ textAlign: 'center', padding: '4rem 2rem' }}
            >
                <div className="landing-badge" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(0, 149, 255, 0.1)', color: 'var(--accent-blue)', borderRadius: '2rem', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Welcome to MP - My Portfolio
                </div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>
                    Build Your <span style={{ color: 'var(--accent-blue)' }}>Identity.</span><br />
                    Share Your <span style={{ color: 'var(--accent-purple)' }}>Work.</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                    The world's most beautiful portfolio platform for developers and creatives. Join now to create your own high-end, physics-powered portfolio in minutes.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <a href="/login" className="cta-button primary" style={{ padding: '1.2rem 2.5rem' }}>Get Started Free</a>
                    <a href="/projects" className="cta-button secondary" style={{ padding: '1.2rem 2.5rem' }}>Explore Projects</a>
                </div>
            </motion.div>
        );
    }

    // Default Portfolio Hero Section (for logged-in users or external visitors via /:username)
    const name = profile?.name || (isOwnerSession ? (user?.displayName || "New Developer") : "Professional Developer");
    const tagline = profile?.tagline || (isOwnerSession ? "Building my professional portfolio" : "Crafting high-quality digital experiences.");
    const bio = profile?.bio || (isOwnerSession
        ? "Welcome to your new portfolio! Go to the Dashboard to customize this bio and add your projects."
        : "Showcase your expertise, projects, and blog posts with a premium, physics-powered interface.");
    const githubLink = profile?.github || (isOwnerSession ? "#" : "https://github.com");

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-section"
        >
            {profile?.photoURL && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 2.5rem',
                        border: '4px solid var(--accent-blue)',
                        boxShadow: '0 0 30px rgba(0, 149, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}
                >
                    <img src={profile.photoURL} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
            )}
            <h1 className="hero-title">Hello, I'm {name}</h1>
            <p className="tagline">{tagline}</p>

            <div className="intro-text">
                <p>{bio}</p>
                <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <a href="/projects" className="cta-button primary">View Projects</a>
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" className="cta-button secondary">GitHub Profile</a>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
