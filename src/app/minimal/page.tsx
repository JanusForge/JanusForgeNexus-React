export default function MinimalPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Janus Forge Nexus
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Minimal test page - No components loaded
      </p>
      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '2rem', 
        borderRadius: '0.75rem',
        border: '1px solid #334155',
        maxWidth: '400px',
        width: '100%'
      }}>
        <p style={{ marginBottom: '1rem' }}>Testing if Next.js works...</p>
        <p style={{ color: '#22c55e' }}>✅ If you can see this, Next.js is working!</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <a 
            href="/working-test" 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              textAlign: 'center',
              flex: 1
            }}
          >
            Go to Working Test
          </a>
          <button
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/health');
                const data = await response.json();
                alert(`Backend: ✅ Connected\n\n${JSON.stringify(data, null, 2)}`);
              } catch (error: any) {
                alert(`Backend: ❌ Error\n\n${error.message}`);
              }
            }}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Test Backend
          </button>
        </div>
      </div>
    </div>
  );
}
