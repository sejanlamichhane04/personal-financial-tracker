import React from 'react';

export function SplashScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      flexDirection: 'column',
      background: '#fff',
      zIndex: 9999
    }}>
      <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>Personal Financial Tracker</div>
      <div style={{ fontSize: 18, color: '#888' }}>Loading...</div>
    </div>
  );
} 