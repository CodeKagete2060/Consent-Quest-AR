import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Video } from 'lucide-react';
import type { SafetyVideo } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface SafetyVideoProps {
  scenario?: string;
  video?: SafetyVideo;
  onVideoGenerated?: (video: SafetyVideo) => void;
}

export const SafetyVideoComponent: React.FC<SafetyVideoProps> = ({
  scenario = "Responding to suspicious online messages",
  video,
  onVideoGenerated
}) => {
  const [currentVideo, setCurrentVideo] = useState<SafetyVideo | null>(video || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!currentVideo && scenario) {
      generateVideo();
    }
  }, [scenario]);

  const generateVideo = async () => {
    setIsGenerating(true);
    try {
      const videoScript = await geminiService.generateVideoScript(scenario);
      const storedVideo = storageService.addVideo(videoScript);
      setCurrentVideo(storedVideo);
      onVideoGenerated?.(storedVideo);
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual video playback
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= (currentVideo?.duration || 45)) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  if (isGenerating) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <Video size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
        <h3>Generating Safety Video</h3>
        <p>Creating an educational video for: {scenario}</p>
        <div style={{
          width: '100%',
          height: '4px',
          background: 'var(--color-border)',
          borderRadius: '2px',
          marginTop: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '30%',
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: '2px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <Video size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
        <h3>No Video Available</h3>
        <p>Unable to generate video at this time.</p>
        <button className="btn btn-primary" onClick={generateVideo}>
          Try Again
        </button>
      </div>
    );
  }

  const progress = (currentTime / currentVideo.duration) * 100;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Video size={24} color="var(--color-primary)" />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{currentVideo.title}</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Duration: {currentVideo.duration}s
          </p>
        </div>
      </div>

      {/* Video Player Placeholder */}
      <div style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <Video size={48} style={{ marginBottom: '8px', opacity: 0.8 }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>AI-Generated Safety Video</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
            {Math.floor(currentTime)}s / {currentVideo.duration}s
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255,255,255,0.3)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'white',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button
          className="btn btn-primary"
          onClick={handlePlayPause}
          style={{ padding: '8px 16px' }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          className="btn btn-outline"
          onClick={handleRestart}
          style={{ padding: '8px 16px' }}
        >
          <RotateCcw size={18} />
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {isPlaying ? 'Playing...' : 'Paused'}
        </span>
      </div>

      {/* Script */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Video Script</h4>
        <div style={{
          fontSize: '0.9rem',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {currentVideo.script}
        </div>
      </div>
    </div>
  );
};