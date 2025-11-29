import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Decoy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
                <BookOpen size={64} color="var(--color-primary)" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Digital Skills Quiz</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Test your knowledge of online safety and digital literacy.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
                <button className="btn btn-primary btn-block" onClick={() => navigate('/resume')}>
                    Return to App
                </button>

                <div className="card">
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        This is a safe, neutral screen. Your previous session is preserved.
                    </p>
                </div>
            </div>
        </div>
    );
};