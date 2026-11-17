import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './styles.css';
// reducedMotion="user" makes every Framer Motion animation respect the OS accessibility setting
createRoot(document.getElementById('root')).render(<MotionConfig reducedMotion="user"><App /></MotionConfig>);
