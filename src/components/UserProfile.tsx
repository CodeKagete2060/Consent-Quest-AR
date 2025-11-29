import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, Save } from 'lucide-react';
import { AGE_RANGES, COUNTRIES, INTERESTS } from '../constants';
import { storageService } from '../services/storageService';
import type { UserProfile } from '../types';

export const UserProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    ageRange: '',
    interests: [],
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existingProfile = storageService.getUserProfile();
    if (existingProfile) {
      setProfile(existingProfile);
    }
  }, []);

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const handleSave = async () => {
    if (!profile.ageRange || !profile.country || !profile.interests?.length) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      storageService.saveUserProfile({
        ageRange: profile.ageRange,
        interests: profile.interests,
        country: profile.country,
        safetyScore: storageService.getSafetyScore()
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile save failed:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const safetyScore = storageService.getSafetyScore();
  const scoreColor = safetyScore >= 80 ? 'var(--color-success)' :
                    safetyScore >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={32} color="var(--color-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>My Profile</h1>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => setIsEditing(!isEditing)}
          style={{ padding: '8px 16px' }}
        >
          <Settings size={18} style={{ marginRight: '8px' }} />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Safety Score Card */}
      <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Shield size={48} color={scoreColor} style={{ marginBottom: '16px' }} />
        <h2 style={{ color: scoreColor, marginBottom: '8px' }}>
          Safety Score: {safetyScore}/100
        </h2>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          {safetyScore >= 80 ? 'Excellent! You\'re well-protected.' :
           safetyScore >= 60 ? 'Good progress. Keep learning!' :
           'Room for improvement. Complete more safety quests!'}
        </p>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--color-border)',
          borderRadius: '4px',
          marginTop: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${safetyScore}%`,
            height: '100%',
            background: scoreColor,
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Profile Form */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Age Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Age Range *
            </label>
            {isEditing ? (
              <select
                value={profile.ageRange || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, ageRange: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select age range</option>
                {AGE_RANGES.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            ) : (
              <p style={{ margin: 0, padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                {profile.ageRange || 'Not set'}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Country *
            </label>
            {isEditing ? (
              <select
                value={profile.country || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            ) : (
              <p style={{ margin: 0, padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                {profile.country || 'Not set'}
              </p>
            )}
          </div>

          {/* Interests */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Interests * (Select all that apply)
            </label>
            {isEditing ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: `2px solid ${profile.interests?.includes(interest) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: profile.interests?.includes(interest) ? 'var(--color-primary)' : 'transparent',
                      color: profile.interests?.includes(interest) ? 'white' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.interests?.map(interest => (
                  <span
                    key={interest}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {interest}
                  </span>
                )) || <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>No interests selected</p>}
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              className="btn btn-primary btn-block"
              onClick={handleSave}
              disabled={isSaving}
              style={{ marginTop: '20px' }}
            >
              {isSaving ? 'Saving...' : (
                <>
                  <Save size={18} style={{ marginRight: '8px' }} />
                  Save Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <button className="btn btn-outline btn-block" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};