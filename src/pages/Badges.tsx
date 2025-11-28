import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Award } from 'lucide-react';
import { getProgress } from '../utils/storage';

export const Badges: React.FC = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState<{ xp: number; badges: string[] }>({ xp: 0, badges: [] });

    useEffect(() => {
        setProgress(getProgress());
    }, []);

    return (
        <div className="container fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Progress</h2>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white' }}>
                <Star size={48} style={{ marginBottom: '10px' }} />
                <h1 style={{ fontSize: '3rem', margin: 0 }}>{progress.xp}</h1>
                <p>Total XP</p>
            </div>

            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Badges Earned</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {progress.badges.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No badges yet. Complete a quest to earn one!
                    </p>
                ) : (
                    progress.badges.map((badge, index) => (
                        <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Award size={32} color="var(--color-warning)" style={{ marginBottom: '8px' }} />
                            <span style={{ fontWeight: 'bold' }}>{badge}</span>
                        </div>
                    ))
                )}
            </div>

            <button className="btn btn-outline btn-block" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};
