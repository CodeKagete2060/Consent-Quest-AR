import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, CheckCircle, Shield, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import type { ScamAnalysis } from '../types';
import { Analytics } from '../utils/analytics';

export const Scan: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string>('');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
    const [capturedImage, setCapturedImage] = useState<string>('');


    const captureAndAnalyze = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        setStatus('analyzing');

        try {
            const result = await geminiService.analyzeScam(imageData);
            setAnalysis(result);

            // Add to threats if high risk
            if (result.risk === 'high') {
                storageService.addThreat({
                    type: 'scam_scan',
                    title: 'High-Risk Content Detected',
                    description: 'AI analysis detected potential scam or harmful content.',
                    risk: 'high',
                    timestamp: new Date(),
                    location: 'Camera Scan',
                    aiAnalysis: result.explanation
                });
            }

            Analytics.qrSuccess('scam_analysis');
            setStatus('success');

        } catch (err) {
            console.error('Analysis failed:', err);
            setError('Analysis failed. Please try again.');
            setStatus('error');
            Analytics.qrFail('analysis_error');
        }
    }, []);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: 640, height: 480 }
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
                setError('Camera access denied or not available.');
                setStatus('error');
            }
        };

        initCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        };
    }, [stream]);

    const retryScan = () => {
        setError('');
        setAnalysis(null);
        setCapturedImage('');
        setStatus('scanning');
    };

    const getRiskColor = (risk?: string) => {
        switch (risk) {
            case 'high': return 'var(--color-danger)';
            case 'medium': return 'var(--color-warning)';
            case 'low': return 'var(--color-success)';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div className="container fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Shield size={32} color="var(--color-primary)" style={{ marginBottom: '10px' }} />
                <h2>AI Safety Scanner</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Point your camera at suspicious messages, posters, or content to analyze for scams
                </p>
            </div>

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
                            <p>Ready to scan</p>
                            <button
                                className="btn btn-primary"
                                onClick={captureAndAnalyze}
                                style={{ marginTop: '16px' }}
                            >
                                <Zap size={18} style={{ marginRight: '8px' }} />
                                Analyze
                            </button>
                        </div>
                    </>
                )}

                {status === 'analyzing' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '3px solid var(--color-primary)',
                            borderTop: '3px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '10px'
                        }} />
                        <p>AI Analyzing...</p>
                    </div>
                )}

                {status === 'success' && analysis && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <CheckCircle size={48} color={getRiskColor(analysis.risk)} style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: getRiskColor(analysis.risk), marginBottom: '12px' }}>
                            Risk Level: {analysis.risk.toUpperCase()}
                        </h3>
                        <p style={{ textAlign: 'center', marginBottom: '16px', lineHeight: '1.5' }}>
                            {analysis.explanation}
                        </p>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <strong>Advice:</strong> {analysis.advice}
                        </div>
                        <button className="btn btn-primary" onClick={retryScan}>
                            Scan Again
                        </button>
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
                        <button className="btn btn-primary" onClick={retryScan} style={{ marginTop: '16px' }}>
                            Try Again
                        </button>
                    </div>
                )}

                {status === 'idle' && (
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
            </div>

            {/* Captured Image Preview */}
            {capturedImage && status === 'success' && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <h4>Captured Image</h4>
                    <img
                        src={capturedImage}
                        alt="Captured for analysis"
                        style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                </div>
            )}

            <button className="btn btn-outline btn-block" onClick={() => navigate('/')}>
                Back to Dashboard
            </button>
        </div>
    );
};
