import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';
import jsQR from 'jsqr';
import questsData from '../data/quests.json';
import type { Quest } from '../types';

const quests = questsData as unknown as Quest[];
const validQuestIds = quests.map(q => q.id);

export const Scan: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string>('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [manualEntry, setManualEntry] = useState(false);
    const [manualQuestId, setManualQuestId] = useState('');

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera on mobile
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
                setStatus('scanning');
                setError('');
            }
        } catch (err) {
            console.error('Camera access failed:', err);
            setError('Camera access denied or not available. Try manual entry below.');
            setStatus('error');
            setManualEntry(true);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const scanQR = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || status !== 'scanning') return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const data = code.data.trim();
            if (validQuestIds.includes(data)) {
                setStatus('success');
                stopCamera();
                setTimeout(() => navigate(`/ar/${data}`), 1000); // Brief success message
            } else {
                setError('Invalid QR code. Please scan a valid Consent Quest poster.');
                setStatus('error');
                setTimeout(() => setStatus('scanning'), 2000); // Resume scanning
            }
        } else {
            requestAnimationFrame(scanQR);
        }
    }, [status, navigate, stopCamera]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    useEffect(() => {
        if (status === 'scanning') {
            requestAnimationFrame(scanQR);
        }
    }, [status, scanQR]);

    const handleManualSubmit = () => {
        if (validQuestIds.includes(manualQuestId)) {
            navigate(`/ar/${manualQuestId}`);
        } else {
            setError('Invalid quest ID. Please enter a valid one (e.g., q1, q2).');
        }
    };

    const retryCamera = () => {
        setManualEntry(false);
        setError('');
        startCamera();
    };

    return (
        <div className="container fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Scan QR Code</h2>

            <div style={{
                flex: 1,
                background: '#000',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '20px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '300px'
            }}>
                {status === 'scanning' && (
                    <>
                        <video
                            ref={videoRef}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            playsInline
                            muted
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <Camera size={48} style={{ opacity: 0.8, marginBottom: '10px' }} />
                            <p>Scanning...</p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <CheckCircle size={48} color="green" style={{ marginBottom: '10px' }} />
                        <p>QR Code Detected!</p>
                        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>Starting quest...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <AlertCircle size={48} color="red" style={{ marginBottom: '10px' }} />
                        <p>{error}</p>
                    </div>
                )}

                {status === 'idle' && !manualEntry && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
                        <p>Initializing camera...</p>
                    </div>
                )}

                {manualEntry && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(255,255,255,0.9)',
                        color: 'black',
                        padding: '20px',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                    }}>
                        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Manual Entry</p>
                        <input
                            type="text"
                            placeholder="Enter quest ID (e.g., q1)"
                            value={manualQuestId}
                            onChange={(e) => setManualQuestId(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                        <button className="btn btn-primary" onClick={handleManualSubmit} style={{ width: '100%' }}>
                            Start Quest
                        </button>
                        <button className="btn btn-outline" onClick={retryCamera} style={{ width: '100%', marginTop: '10px' }}>
                            Retry Camera
                        </button>
                    </div>
                )}
            </div>

            <button className="btn btn-outline btn-block" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};
