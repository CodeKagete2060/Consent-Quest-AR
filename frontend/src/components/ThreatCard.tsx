import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react';
import type { Threat } from '../types';
import { storageService } from '../services/storageService';

interface ThreatCardProps {
  threat: Threat;
  onMarkAsRead?: (id: string) => void;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, onMarkAsRead }) => {
  const handleMarkAsRead = () => {
    storageService.markThreatAsRead(threat.id);
    onMarkAsRead?.(threat.id);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-muted)';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className={`card ${!threat.isRead ? 'border-l-4' : ''}`} style={{
      borderLeftColor: !threat.isRead ? getRiskColor(threat.risk) : undefined,
      opacity: threat.isRead ? 0.7 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} color={getRiskColor(threat.risk)} />
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{threat.title}</h4>
        </div>
        {!threat.isRead && (
          <button
            onClick={handleMarkAsRead}
            className="btn btn-outline"
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
          >
            <CheckCircle size={14} style={{ marginRight: '4px' }} />
            Mark Read
          </button>
        )}
      </div>

      <p style={{ marginBottom: '12px', color: 'var(--color-text-muted)' }}>
        {threat.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} />
          {formatTimeAgo(threat.timestamp)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} />
          {threat.location}
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: '12px',
          background: getRiskColor(threat.risk),
          color: 'white',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {threat.risk.toUpperCase()}
        </div>
      </div>

      {threat.aiAnalysis && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'var(--color-bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)'
        }}>
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            AI Analysis:
          </strong>
          <p style={{ marginTop: '4px', fontSize: '0.9rem', marginBottom: 0 }}>
            {threat.aiAnalysis}
          </p>
        </div>
      )}
    </div>
  );
};