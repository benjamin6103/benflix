import React from 'react';
import PropTypes from 'prop-types';

export default function PlaceholderPage({ title, icon }) {
  return (
    <div className="placeholder-page" style={{ 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      minHeight: '70vh', textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out',
      padding: '0 4%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 15px rgba(255, 159, 28, 0.4))' }}>{icon}</div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--primary)', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>This section is currently being built for Phase 3. Check back soon!</p>
    </div>
  );
}

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
