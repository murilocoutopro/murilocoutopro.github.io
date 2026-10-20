import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import HealingCenters from './pages/HealingCenters';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{location.pathname.replace(/\/$/,'')==='/centros-de-cura'?<HealingCenters/>:<App/>}</React.StrictMode>);
