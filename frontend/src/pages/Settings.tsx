import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [stealthMode, setStealthMode] = useState(false); // Always false for now

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <SettingsIcon size={32} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Settings</h1>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '10px' }}>Privacy & Safety</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong>Stealth App Mode</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: '4px 0' }}>
                            Rename app icon and title for discreet use
                        </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                        <input
                            type="checkbox"
                            checked={stealthMode}
                            onChange={(e) => setStealthMode(e.target.checked)}
                            disabled
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute',
                            cursor: 'not-allowed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#ccc',
                            transition: '.4s',
                            borderRadius: '24px'
                        }}>
                            <span style={{
                                position: 'absolute',
                                height: '18px',
                                width: '18px',
                                left: '3px',
                                bottom: '3px',
                                backgroundColor: 'white',
                                transition: '.4s',
                                borderRadius: '50%',
                                transform: stealthMode ? 'translateX(26px)' : 'translateX(0px)'
                            }}></span>
                        </span>
                    </label>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                    Coming soon after hackathon
                </p>
            </div>

            <button className="btn btn-outline btn-block" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};