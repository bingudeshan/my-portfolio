
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getProfileByUsername, getUserProjects, getUserPosts } from '../services/dbService';
import Home from './Home';
import Projects from './Projects';
import Blog from './Blog';
import { ProjectsProvider } from '../context/ProjectsContext';

const PublicPortfolio = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfileByUsername(username);
            setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, [username]);

    if (loading) return <div className="loading">Loading Portfolio...</div>;
    if (!profile) return <div className="error">User not found</div>;

    // This component will basically serve as a customized view of the Home/Projects/Blog 
    // but filtered by the public user's UID instead of current logged in user.
    // For now, we can redirect or show a simplified verson.

    return (
        <div className="public-portfolio">
            <Home publicUser={profile} />
            <Projects publicUid={profile.id} />
        </div>
    );
};

export default PublicPortfolio;
