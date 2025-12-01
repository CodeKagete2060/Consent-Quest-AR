import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { saveLastRoute } from '../utils/storage';

export const PanicButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tapCountRef = useRef(0);
    const tapTimeoutRef = useRef<number | null>(null);

    const handlePanic = useCallback(() => {
        saveLastRoute(location.pathname);
        navigate('/decoy');
    }, [location.pathname, navigate]);

    const handleTripleTap = useCallback(() => {
        tapCountRef.current += 1;
        if (tapCountRef.current === 3) {
            handlePanic();
            tapCountRef.current = 0;
            if (tapTimeoutRef.current) {
                clearTimeout(tapTimeoutRef.current);
                tapTimeoutRef.current = null;
            }
        } else {
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = setTimeout(() => {
                tapCountRef.current = 0;
            }, 600);
        }
    }, [handlePanic]);

    useEffect(() => {
        const handleTouchStart = () => handleTripleTap();

        document.addEventListener('touchstart', handleTouchStart);
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
        };
    }, [handleTripleTap]);

    // Don't show on decoy or resume pages - AFTER all hooks
    if (location.pathname === '/decoy' || location.pathname === '/resume') return null;

    return (
        <button
            className="panic-button"
            onClick={handlePanic}
            aria-label="Quick Exit"
        >
            <Shield size={20} />
        </button>
    );
};