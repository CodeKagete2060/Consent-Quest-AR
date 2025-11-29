import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Home } from 'lucide-react';
import { getLastRoute } from '../utils/storage';

export const Resume: React.FC = () => {
    const navigate = useNavigate();
    const lastRoute = getLastRoute();

    const handleResume = () => {
        navigate(lastRoute);
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className="container fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
                <RotateCcw size={64} color="var(--color-primary)" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Resume Session?</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Would you like to return to where you were before?
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
                <button className="btn btn-primary btn-block" onClick={handleResume}>
                    <RotateCcw size={20} style={{ marginRight: '8px' }} />
                    Yes, Resume
                </button>

                <button className="btn btn-outline btn-block" onClick={handleHome}>
                    <Home size={20} style={{ marginRight: '8px' }} />
                    No, Go Home
                </button>
            </div>
        </div>
    );
};