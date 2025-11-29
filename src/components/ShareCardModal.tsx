import React, { useRef, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { getLevel } from '../utils/storage';

interface ShareCardModalProps {
    badge: string;
    xp: number;
    onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ badge, xp, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const level = getLevel(xp);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 250;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 400, 250);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(1, '#50e3c2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 250);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 380, 230);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Digital Safety Certificate', 200, 50);

        // Badge name
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillText(badge, 200, 100);

        // Level
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText(`Digital Safety Level ${level}`, 200, 130);

        // XP
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(`${xp} XP Earned`, 200, 160);

        // Footer
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Consent Quest AR', 200, 200);
    }, [badge, xp, level]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${badge.replace(/\s+/g, '_')}_certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const handleShare = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png');
            });

            if (navigator.share) {
                await navigator.share({
                    title: `${badge} Certificate`,
                    text: `I earned the ${badge} badge in Consent Quest AR!`,
                    files: [new File([blob], `${badge}_certificate.png`, { type: 'image/png' })]
                });
            } else {
                // Fallback to download
                handleDownload();
            }
        } catch (error) {
            console.error('Share failed:', error);
            handleDownload();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Congratulations!</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px' }}>
                        <X />
                    </button>
                </div>

                <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto', border: '2px solid var(--color-primary)', borderRadius: '8px' }} />

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={handleDownload}>
                        <Download size={16} style={{ marginRight: '8px' }} />
                        Download
                    </button>
                    <button className="btn btn-outline" onClick={handleShare}>
                        <Share size={16} style={{ marginRight: '8px' }} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};