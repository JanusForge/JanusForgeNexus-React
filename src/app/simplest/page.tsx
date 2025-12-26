"use client";

export default function SimplestPage() {
  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Simplest Possible Page</h1>
      <p>If you can see this, Next.js is working at the most basic level.</p>
      <button 
        onClick={testBackend}
        style={{ padding: '10px 20px', margin: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Test Backend
      </button>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        This page exists solely to verify the most basic functionality.
      </p>
    </div>
  );
}
