
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './hooks/useTheme';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:username" element={<PublicPortfolio />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { currentTheme } = useTheme();

  return (
    <AuthProvider>
      <ProjectsProvider>
        <Router>
          <motion.div
            className="app-container"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sidebar />
            <main className="main-content">
              <AnimatedRoutes />
            </main>

            {/* Theme Indicator */}
            <motion.div
              className="theme-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={currentTheme.name}
            >
              <div className="theme-dot"></div>
              <span>{currentTheme.name}</span>
            </motion.div>
          </motion.div>
        </Router>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
