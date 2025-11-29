import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BookOpen } from 'lucide-react';
import type { Quest } from '../types';
import { saveProgress, getProgress, markCardGenerated } from '../utils/storage';
import { HelpButton } from '../components/HelpButton';
import { ShareCardModal } from '../components/ShareCardModal';
import { Analytics } from '../utils/analytics';

export const QuestPlayer: React.FC = () => {
    const { questId } = useParams<{ questId: string }>();
    const navigate = useNavigate();
    const [quest, setQuest] = useState<Quest | null>(null);
    const [currentSceneId, setCurrentSceneId] = useState<string>('start');
    const [quests, setQuests] = useState<Quest[]>([]);
    const [showCardModal, setShowCardModal] = useState(false);

    useEffect(() => {
        import('../data/quests.json').then(module => {
            setQuests(module.default as unknown as Quest[]);
        });
    }, []);

    useEffect(() => {
        if (quests.length > 0) {
            const found = quests.find(q => q.id === questId);
            if (found) {
                setQuest(found);
                Analytics.arStarted(found.id);
                Analytics.questViewed(found.id);
            }
        }
    }, [questId, quests]);

    if (!quest) return <div className="container">Loading...</div>;

    const currentScene = quest.scenes[currentSceneId];
    if (!currentScene) return <div className="container">Error: Scene not found</div>;

    const handleChoice = (nextId: string) => {
        const choice = currentScene.choices?.find(c => c.next === nextId);
        if (choice && quest) {
            Analytics.questChoice(quest.id, currentSceneId, choice.type || 'constructive', choice.text);
        }
        setCurrentSceneId(nextId);
    };

    const handleFinish = () => {
        const prevProgress = getProgress();
        saveProgress(quest.xp, quest.badge, quest.id);
        Analytics.questCompleted(quest.id, quest.xp, quest.badge);

        // Check if badge is new
        if (!prevProgress.badges.includes(quest.badge)) {
            markCardGenerated(quest.badge);
            setShowCardModal(true);
        } else {
            navigate('/badges');
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{quest.title}</span>
                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => navigate('/')}>Exit</button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSceneId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Scene Content */}
                    <div className="card">
                        <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{currentScene.text}</p>

                        {currentScene.feedback && (
                            <div style={{
                                background: '#e6fffa',
                                borderLeft: '4px solid var(--color-secondary)',
                                padding: '12px',
                                marginBottom: '16px',
                                borderRadius: '4px',
                                fontSize: '0.95rem'
                            }}>
                                <strong>Mentor Note:</strong> {currentScene.feedback}
                            </div>
                        )}
                    </div>

                    {/* Lesson Card */}
                    {currentScene.isLesson && currentScene.lessonCard && (
                        <div className="card" style={{ border: '2px solid var(--color-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-primary)' }}>
                                <BookOpen size={24} />
                                <h3 style={{ margin: 0 }}>{currentScene.lessonCard.title}</h3>
                            </div>
                            <p style={{ marginBottom: '12px' }}>{currentScene.lessonCard.what}</p>

                            <div style={{ marginBottom: '12px' }}>
                                <strong>How to Prevent:</strong>
                                <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                                    {currentScene.lessonCard.prevent.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>

                            <div>
                                <strong>How to Fix:</strong>
                                <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                                    {currentScene.lessonCard.fix.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* End Screen */}
                    {currentScene.isEnd && (
                        <div className="card" style={{ textAlign: 'center', background: 'var(--color-bg)' }}>
                            <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: '16px' }} />
                            <h2>Quest Complete!</h2>
                            <p>You earned {quest.xp} XP</p>
                            <div style={{
                                display: 'inline-block',
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                marginTop: '12px'
                            }}>
                                Badge Unlocked: {quest.badge}
                            </div>
                            <button className="btn btn-primary btn-block" style={{ marginTop: '24px' }} onClick={handleFinish}>
                                Collect Rewards
                            </button>
                        </div>
                    )}

                    {/* Choices */}
                    {!currentScene.isEnd && currentScene.choices && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                            {currentScene.choices.map((choice, index) => (
                                <button
                                    key={index}
                                    className="btn btn-primary btn-block"
                                    style={{
                                        background: choice.type === 'risky' ? '#fff' : 'var(--color-primary)',
                                        color: choice.type === 'risky' ? 'var(--color-danger)' : 'white',
                                        border: choice.type === 'risky' ? '2px solid var(--color-danger)' : 'none',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start'
                                    }}
                                    onClick={() => handleChoice(choice.next)}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <HelpButton />

            {showCardModal && quest && (
                <ShareCardModal
                    badge={quest.badge}
                    xp={getProgress().xp}
                    onClose={() => {
                        setShowCardModal(false);
                        navigate('/badges');
                    }}
                />
            )}
        </div>
    );
};
