import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, TrendingUp, BookOpen, Camera, MessageSquare, User } from 'lucide-react';
import { Analytics } from '../utils/analytics';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { ThreatRadar } from '../components/ThreatRadar';
import { ThreatCard } from '../components/ThreatCard';
import type { Threat, SafetyTip } from '../types';

export const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [safetyTip, setSafetyTip] = useState<SafetyTip | null>(null);
    const [recentThreats, setRecentThreats] = useState<Threat[]>([]);
    const [isLoadingTip, setIsLoadingTip] = useState(false);

    const loadDashboardData = useCallback(() => {
        // Load recent threats
        const threats = storageService.getThreats();
        setRecentThreats(threats.slice(0, 3)); // Show latest 3

        // Load or generate safety tip
        generateSafetyTip();
    }, []);

    useEffect(() => {
        Analytics.landingViewed();
        loadDashboardData();
    }, [loadDashboardData]);

    const generateSafetyTip = async () => {
        setIsLoadingTip(true);
        try {
            const profile = storageService.getUserProfile();
            if (profile) {
                const tip = await geminiService.generateSafetyTip(profile);
                setSafetyTip(tip);
            } else {
                setSafetyTip({
                    tip: "Complete your profile to receive personalized safety tips tailored to your needs and interests.",
                    category: "general"
                });
            }
        } catch (error) {
            console.error('Safety tip generation failed:', error);
            setSafetyTip({
                tip: "Stay vigilant online. Never share personal information with strangers, and verify identities before engaging.",
                category: "general"
            });
        } finally {
            setIsLoadingTip(false);
        }
    };

    const handleThreatRead = (threatId: string) => {
        setRecentThreats(prev => prev.map(t =>
            t.id === threatId ? { ...t, isRead: true } : t
        ));
    };

    const safetyScore = storageService.getSafetyScore();

    return (
        <div className="container fade-in" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Shield size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
                    Safety Dashboard
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                    Your personal safety command center
                </p>
            </div>

            {/* Safety Score */}
            <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                    <TrendingUp size={24} color="var(--color-primary)" />
                    <h2 style={{ margin: 0 }}>Safety Score</h2>
                </div>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: safetyScore >= 80 ? 'var(--color-success)' :
                           safetyScore >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
                    marginBottom: '8px'
                }}>
                    {safetyScore}
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        width: `${safetyScore}%`,
                        height: '100%',
                        background: safetyScore >= 80 ? 'var(--color-success)' :
                                 safetyScore >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                    {safetyScore >= 80 ? 'Excellent protection!' :
                     safetyScore >= 60 ? 'Good progress!' :
                     'Keep learning to improve your safety.'}
                </p>
            </div>

            {/* Daily Safety Tip */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '12px', color: 'var(--color-primary)' }}>
                    💡 Daily Safety Tip
                </h3>
                {isLoadingTip ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading personalized tip...</p>
                ) : safetyTip ? (
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{safetyTip.tip}</p>
                ) : null}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/scan')}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '80px' }}
                    >
                        <Camera size={24} />
                        <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>AI Safety Scanner</span>
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/library')}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '80px' }}
                    >
                        <BookOpen size={24} />
                        <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>Safety Quests</span>
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/report')}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '80px' }}
                    >
                        <AlertTriangle size={24} />
                        <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>Report Threat</span>
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/help')}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '80px' }}
                    >
                        <MessageSquare size={24} />
                        <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>Help & Resources</span>
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/profile')}
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '80px' }}
                    >
                        <User size={24} />
                        <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>My Profile</span>
                    </button>
                </div>
            </div>

            {/* Threat Radar */}
            <ThreatRadar />

            {/* Recent Threats */}
            {recentThreats.length > 0 && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Recent Threat Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentThreats.map(threat => (
                            <ThreatCard
                                key={threat.id}
                                threat={threat}
                                onMarkAsRead={handleThreatRead}
                            />
                        ))}
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        Stay informed with real-time threat monitoring above
                    </p>
                </div>
            )}
        </div>
    );
};
