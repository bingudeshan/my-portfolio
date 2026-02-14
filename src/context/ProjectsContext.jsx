
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    getUserProjects,
    addProject as dbAddProject,
    updateProject as dbUpdateProject,
    deleteProject as dbDeleteProject
} from '../services/dbService';

const ProjectsContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within ProjectsProvider');
    }
    return context;
};

export const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Fetch projects from Firestore when user changes
    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                setLoading(true);
                try {
                    const data = await getUserProjects(user.uid);
                    setProjects(data);
                } catch (error) {
                    console.error('Failed to fetch projects', error);
                }
                setLoading(false);
            } else {
                setProjects([]);
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);

    const addProject = async (project) => {
        if (!user) return;
        const newProject = { ...project, uid: user.uid };
        const id = await dbAddProject(newProject);
        setProjects([...projects, { ...newProject, id }]);
    };

    const updateProject = async (id, updatedProject) => {
        await dbUpdateProject(id, updatedProject);
        setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
    };

    const deleteProject = async (id) => {
        await dbDeleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <ProjectsContext.Provider value={{
            projects,
            addProject,
            updateProject,
            deleteProject,
            loading
        }}>
            {children}
        </ProjectsContext.Provider>
    );
};
