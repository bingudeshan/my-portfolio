
import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="experience-page"
        >
            <h2 style={{ marginBottom: '2rem' }}>Experience & Education</h2>

            <div className="glass-panel" style={{ padding: '2rem 3rem', marginBottom: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>Professional Experience</h3>

                <div className="timeline-item">
                    <span className="timeline-date">2023 - Present</span>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Quality Checker</h4>
                    <span className="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Western Paper Industries</span>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                        <li>Ensured data integrity and adherence to quality control standards.</li>
                        <li>Implemented rigorous testing protocols for manufactured products.</li>
                        <li>Collaborated with production teams to optimize output efficiency.</li>
                    </ul>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem 3rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>Education</h3>

                <div className="timeline-item">
                    <span className="timeline-date">2023 - Present</span>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>BSc in Physics, Computer Science & Mathematics</h4>
                    <span className="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>University of Ruhuna</span>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Focusing on computational physics, data structures, and advanced mathematical modeling.
                    </p>
                </div>

                <div className="timeline-item">
                    <span className="timeline-date">2019 - 2021</span>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>G.C.E. Advanced Level</h4>
                    <span className="subtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Physical Science Stream</span>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Achieved high distictions in Physics, Chemistry, and Combined Mathematics.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Experience;
