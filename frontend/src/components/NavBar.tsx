import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Scan, Library, HelpCircle, User } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={20} /> },
  { path: '/scan', label: 'Scan', icon: <Scan size={20} /> },
  { path: '/library', label: 'Library', icon: <Library size={20} /> },
  { path: '/help', label: 'Help', icon: <HelpCircle size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
];

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid var(--color-border)',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                minWidth: '60px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {item.icon}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: isActive ? '600' : '400'
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  width: '20px',
                  height: '2px',
                  background: 'var(--color-primary)',
                  borderRadius: '1px',
                  marginTop: '2px'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};