import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Library, Shield } from 'lucide-react';

export const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
                <Shield size={64} color="var(--color-primary)" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Consent Quest AR</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Navigate the digital world safely. <br />
                    Learn to prevent and fix digital abuse.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
                <button className="btn btn-primary btn-block" onClick={() => navigate('/scan')}>
                    <QrCode size={20} style={{ marginRight: '8px' }} />
                    Scan QR to Start
                </button>

                <button className="btn btn-outline btn-block" onClick={() => navigate('/library')}>
                    <Library size={20} style={{ marginRight: '8px' }} />
                    Quest Library
                </button>

                <button className="btn btn-outline btn-block" onClick={() => navigate('/badges')}>
                    <Shield size={20} style={{ marginRight: '8px' }} />
                    My Badges
                </button>
            </div>
        </div>
    );
};
