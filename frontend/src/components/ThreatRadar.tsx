import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Radar as RadarIcon, TrendingUp } from 'lucide-react';
import { storageService } from '../services/storageService';

interface ThreatData {
  threat: string;
  count: number;
  risk: 'low' | 'medium' | 'high';
}

export const ThreatRadar: React.FC = () => {
  const threatData = useMemo(() => {
    const threats = storageService.getThreats();

    // Group threats by type and calculate metrics
    const threatGroups = threats.reduce((acc, threat) => {
      if (!acc[threat.type]) {
        acc[threat.type] = { count: 0, risks: [] };
      }
      acc[threat.type].count++;
      acc[threat.type].risks.push(threat.risk);
      return acc;
    }, {} as Record<string, { count: number; risks: string[] }>);

    // Convert to chart data
    const chartData: ThreatData[] = Object.entries(threatGroups).map(([type, data]) => {
      // Determine dominant risk level
      const riskCounts = data.risks.reduce((counts, risk) => {
        counts[risk] = (counts[risk] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const dominantRisk = Object.entries(riskCounts).sort(([,a], [,b]) => b - a)[0][0] as 'low' | 'medium' | 'high';

      return {
        threat: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: data.count,
        risk: dominantRisk
      };
    });

    // Ensure we have data points for the radar chart
    if (chartData.length === 0) {
      return [
        { threat: 'Romance Fraud', count: 2, risk: 'high' as const },
        { threat: 'Job Scams', count: 1, risk: 'high' as const },
        { threat: 'MoMo Reversals', count: 3, risk: 'medium' as const },
        { threat: 'Harassment', count: 1, risk: 'medium' as const },
        { threat: 'Identity Theft', count: 1, risk: 'low' as const }
      ];
    }

    return chartData;
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const totalThreats = threatData.reduce((sum, item) => sum + item.count, 0);
  const highRiskCount = threatData.filter(item => item.risk === 'high').length;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <RadarIcon size={24} color="var(--color-primary)" />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Threat Radar</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Real-time threat analysis and trends
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          flex: 1,
          padding: '12px',
          background: 'var(--color-bg-secondary)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {totalThreats}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Total Threats
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '12px',
          background: 'var(--color-bg-secondary)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>
            {highRiskCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            High Risk
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '12px',
          background: 'var(--color-bg-secondary)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Monitoring
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={threatData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="threat"
              tick={{ fontSize: 12, fill: 'var(--color-text)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'dataMax']}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            />
            <Radar
              name="Threat Count"
              dataKey="count"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ThreatData;
                  return (
                    <div style={{
                      background: 'white',
                      padding: '12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        Count: {data.count}
                      </div>
                      <div style={{
                        color: getRiskColor(data.risk),
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        Risk: {data.risk.toUpperCase()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>High Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Medium Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Low Risk</span>
        </div>
      </div>
    </div>
  );
};