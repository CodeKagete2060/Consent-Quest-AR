import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import questsData from '../data/quests.json';
import type { Quest } from '../types';

const quests = questsData as unknown as Quest[];

export const ARIntro: React.FC = () => {
    const { questId } = useParams<{ questId: string }>();
    const navigate = useNavigate();
    const [quest, setQuest] = useState<Quest | null>(null);
    const [arStarted, setArStarted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [showProceed, setShowProceed] = useState(false);
    const arContainerRef = useRef<HTMLDivElement>(null);

    const questData = React.useMemo(() => {
        return quests.find(q => q.id === questId) || null;
    }, [questId]);

    useEffect(() => {
        setQuest(questData);
    }, [questData]);

    useEffect(() => {
        let interval: number;
        if (arStarted && timer < 10) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [arStarted, timer]);

    useEffect(() => {
        if (timer >= 10) {
            setShowProceed(true);
        }
    }, [timer]);

    const startAR = async () => {
        if (!arContainerRef.current || !quest) return;

        try {
            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: arContainerRef.current,
                imageTargetSrc: '/targets.mind',
            });

            await mindarThree.start();

            // Create canvas for text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 256;
            if (context) {
                context.fillStyle = 'white';
                context.font = '24px Arial';
                context.fillText(quest.intro_scene, 10, 50);
            }

            const texture = new window.THREE.CanvasTexture(canvas);
            const geometry = new window.THREE.PlaneGeometry(1, 0.5);
            const material = new window.THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const plane = new window.THREE.Mesh(geometry, material);

            const anchor = mindarThree.addAnchor(0);
            anchor.group.add(plane);

            setArStarted(true);

        } catch (error) {
            console.error('AR initialization failed:', error);
            // Fallback or error message
        }
    };

    if (!quest) return <div className="container">Loading...</div>;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px'
        }}>
            {/* AR Container */}
            <div
                ref={arContainerRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: arStarted ? 'block' : 'none'
                }}
            />

            {!arStarted && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        border: '2px dashed rgba(255,255,255,0.5)',
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <p>Point your camera at a QR code or poster marker to start the AR experience.</p>
                        <button
                            className="btn btn-primary"
                            onClick={startAR}
                            style={{ background: 'white', color: 'var(--color-primary)', marginTop: '10px' }}
                        >
                            Start AR Experience
                        </button>
                    </div>
                </div>
            )}

            {showProceed && (
                <div className="fade-in" style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{quest.title}</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: '20px', opacity: 0.9 }}>
                        {quest.intro_scene}
                    </p>

                    <button
                        className="btn btn-primary btn-block"
                        onClick={() => navigate(`/quest/${questId}`)}
                        style={{ background: 'white', color: 'var(--color-primary)' }}
                    >
                        Enter Scenario <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            )}
        </div>
    );
};
