import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const HelpButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on help page itself
    if (location.pathname === '/help') return null;

    return (
        <button
            className="floating-help"
            onClick={() => navigate('/help')}
            aria-label="Get Help Now"
        >
            <ShieldAlert size={24} />
            <span>Help Now</span>
        </button>
    );
};
