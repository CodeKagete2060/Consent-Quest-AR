import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';
import type { Quest } from '../types';

export const Library: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'survivor' | 'ally'>('survivor');
    const [quests, setQuests] = useState<Quest[]>([]);

    useEffect(() => {
        import('../data/quests.json').then(module => {
            setQuests(module.default as unknown as Quest[]);
        });
    }, []);

    const filteredQuests = quests.filter(q => q.track === activeTab);

    return (
        <div className="container fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Quest Library</h2>

            <div style={{ display: 'flex', marginBottom: '20px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '4px' }}>
                <button
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-lg)',
                        background: activeTab === 'survivor' ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === 'survivor' ? 'white' : 'var(--color-text)',
                        fontWeight: 'bold'
                    }}
                    onClick={() => setActiveTab('survivor')}
                >
                    Survivor Track
                </button>
                <button
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-lg)',
                        background: activeTab === 'ally' ? 'var(--color-secondary)' : 'transparent',
                        color: activeTab === 'ally' ? 'white' : 'var(--color-text)',
                        fontWeight: 'bold'
                    }}
                    onClick={() => setActiveTab('ally')}
                >
                    Ally Track
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredQuests.map(quest => (
                    <div key={quest.id} className="card" onClick={() => navigate(`/ar/${quest.id}`)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h3 style={{ margin: 0 }}>{quest.title}</h3>
                            {quest.track === 'survivor' ? <Shield size={20} color="var(--color-primary)" /> : <Heart size={20} color="var(--color-secondary)" />}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                            {quest.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                                {quest.country}
                            </span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                                {quest.xp} XP
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn btn-outline btn-block" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};
