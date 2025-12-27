"use client";
export const dynamic = "force-dynamic";

export default function WorkingTestPage() {
  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      alert(`✅ Backend Connected!\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      alert(`❌ Backend Error: ${error.message}`);
    }
  };

  const testFrontend = () => {
    alert('✅ Frontend is working!');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        🎉 Janus Forge Nexus
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '3rem', textAlign: 'center' }}>
        Working Test Page - No broken components
      </p>
      
      <div style={{ 
        backgroundColor: '#18181b', 
        padding: '2rem', 
        borderRadius: '1rem',
        border: '1px solid #27272a',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Connection Test</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={testBackend}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            🔗 Test Backend Connection
          </button>
          
          <button
            onClick={testFrontend}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            🎨 Test Frontend
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: '#27272a', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Quick Links:</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/"
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                textAlign: 'center',
                flex: 1,
                minWidth: '120px'
              }}
            >
              🏠 Home
            </a>
            <a 
              href="/simple-test"
              style={{
                backgroundColor: '#0ea5e9',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                textAlign: 'center',
                flex: 1,
                minWidth: '120px'
              }}
            >
              🔧 Simple Test
            </a>
            <a 
              href="/minimal"
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                textAlign: 'center',
                flex: 1,
                minWidth: '120px'
              }}
            >
              ⚡ Minimal Test
            </a>
          </div>
        </div>
        
        <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
          <p>Backend URL: <code style={{ backgroundColor: '#27272a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>http://localhost:5000</code></p>
          <p style={{ marginTop: '0.5rem' }}>Frontend URL: <code style={{ backgroundColor: '#27272a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>http://localhost:3000</code></p>
        </div>
      </div>
    </div>
  );
}
