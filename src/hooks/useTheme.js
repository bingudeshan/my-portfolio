import { useState, useEffect } from 'react';

// Define 6 unique scientific themes
export const themes = {
    deepSpace: {
        name: 'Deep Space Blue',
        bgPrimary: '#0a0e27',
        bgSecondary: '#141b3d',
        textPrimary: '#e8f4f8',
        textSecondary: '#8b9dc3',
        accentBlue: '#4a9eff',
        accentPurple: '#7c3aed',
        glassBg: 'rgba(20, 27, 61, 0.7)',
        borderColor: 'rgba(139, 157, 195, 0.15)',
    },
    physicsLab: {
        name: 'Physics Lab Grey',
        bgPrimary: '#1a1d23',
        bgSecondary: '#2d3139',
        textPrimary: '#f0f0f0',
        textSecondary: '#a8adb7',
        accentBlue: '#00d4ff',
        accentPurple: '#b794f6',
        glassBg: 'rgba(45, 49, 57, 0.7)',
        borderColor: 'rgba(168, 173, 183, 0.15)',
    },
    quantumPurple: {
        name: 'Quantum Purple',
        bgPrimary: '#1a0b2e',
        bgSecondary: '#2d1b4e',
        textPrimary: '#f5e6ff',
        textSecondary: '#b794f6',
        accentBlue: '#9d4edd',
        accentPurple: '#c77dff',
        glassBg: 'rgba(45, 27, 78, 0.7)',
        borderColor: 'rgba(183, 148, 246, 0.15)',
    },
    emeraldGreen: {
        name: 'Emerald Green',
        bgPrimary: '#0a1f1a',
        bgSecondary: '#1a3329',
        textPrimary: '#e8fff5',
        textSecondary: '#7dd3ae',
        accentBlue: '#10b981',
        accentPurple: '#34d399',
        glassBg: 'rgba(26, 51, 41, 0.7)',
        borderColor: 'rgba(125, 211, 174, 0.15)',
    },
    neonDark: {
        name: 'Neon Dark',
        bgPrimary: '#0d0d0d',
        bgSecondary: '#1a1a1a',
        textPrimary: '#ffffff',
        textSecondary: '#a3a3a3',
        accentBlue: '#00ff88',
        accentPurple: '#ff00ff',
        glassBg: 'rgba(26, 26, 26, 0.7)',
        borderColor: 'rgba(163, 163, 163, 0.15)',
    },
    sunsetOrange: {
        name: 'Sunset Orange',
        bgPrimary: '#1a0f0a',
        bgSecondary: '#2d1f1a',
        textPrimary: '#fff5e6',
        textSecondary: '#d4a574',
        accentBlue: '#ff6b35',
        accentPurple: '#f77f00',
        glassBg: 'rgba(45, 31, 26, 0.7)',
        borderColor: 'rgba(212, 165, 116, 0.15)',
    },
};

// Get theme keys in order
export const themeKeys = Object.keys(themes);

export const useTheme = () => {
    // Initialize theme from localStorage or default to first theme
    const [currentThemeIndex, setCurrentThemeIndex] = useState(() => {
        const savedIndex = localStorage.getItem('themeIndex');
        const parsed = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
        // Ensure index is within bounds
        return (parsed >= 0 && parsed < themeKeys.length) ? parsed : 0;
    });

    // Apply theme to CSS variables
    const applyTheme = (themeIndex) => {
        const themeKey = themeKeys[themeIndex];
        const theme = themes[themeKey];

        if (!theme) return;

        const root = document.documentElement;
        root.style.setProperty('--bg-primary', theme.bgPrimary);
        root.style.setProperty('--bg-secondary', theme.bgSecondary);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--accent-blue', theme.accentBlue);
        root.style.setProperty('--accent-purple', theme.accentPurple);
        root.style.setProperty('--glass-bg', theme.glassBg);
        root.style.setProperty('--border-color', theme.borderColor);
    };

    // Auto-cycle theme every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentThemeIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % themeKeys.length;
                return nextIndex;
            });
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Apply theme whenever it changes
    useEffect(() => {
        applyTheme(currentThemeIndex);
        localStorage.setItem('themeIndex', currentThemeIndex.toString());
    }, [currentThemeIndex]);

    return {
        currentTheme: themes[themeKeys[currentThemeIndex]] || themes[themeKeys[0]],
        currentThemeIndex,
        setCurrentThemeIndex,
        themeKeys,
    };
};
