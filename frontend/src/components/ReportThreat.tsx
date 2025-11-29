import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, Shield } from 'lucide-react';
import { REPORT_CATEGORIES } from '../constants';
import { storageService } from '../services/storageService';
import { Analytics } from '../utils/analytics';

export const ReportThreat: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      storageService.addReport({
        category,
        description: description.trim(),
        anonymous
      });

      Analytics.reportSubmitted(category, anonymous);

      alert('Report submitted successfully. Thank you for helping keep our community safe.');
      navigate('/');

    } catch (error) {
      console.error('Report submission failed:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--color-danger)' }}>
        <Shield size={32} />
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Report a Threat</h1>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
        <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>
          Your safety matters. Report suspicious activity, harassment, or abuse anonymously.
          All reports are reviewed by our safety team.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '1rem'
              }}
              required
            >
              <option value="">Select a category</option>
              {REPORT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide as much detail as possible about the incident..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Submit anonymously</span>
            </label>
            <p style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {anonymous
                ? 'Your report will be completely anonymous. No personal information will be collected.'
                : 'Your contact information may be requested for follow-up if needed.'
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={18} style={{ marginRight: '8px' }} />
                  Submit Report
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/')}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '20px', background: 'var(--color-bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <AlertTriangle size={20} color="var(--color-warning)" />
          <h3 style={{ margin: 0 }}>What happens next?</h3>
        </div>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Your report is securely stored and reviewed by our safety team</li>
          <li>Patterns are analyzed to improve community safety</li>
          <li>Serious threats may be escalated to relevant authorities</li>
          <li>You may receive updates on the status of your report</li>
        </ul>
      </div>
    </div>
  );
};