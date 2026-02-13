import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProjects from '../data/projects.json';

const ProjectsContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within ProjectsProvider');
    }
    return context;
};

export const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            try {
                return JSON.parse(storedProjects);
            } catch (error) {
                console.error('Failed to parse projects from localStorage', error);
                return initialProjects;
            }
        }
        return initialProjects;
    });

    // Save projects to localStorage whenever they change
    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    }, [projects]);

    const addProject = (project) => {
        const newProject = {
            ...project,
            id: Date.now().toString(), // Generate unique ID
        };
        setProjects([...projects, newProject]);
    };

    const updateProject = (id, updatedProject) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
    };

    const deleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <ProjectsContext.Provider value={{
            projects,
            addProject,
            updateProject,
            deleteProject
        }}>
            {children}
        </ProjectsContext.Provider>
    );
};
