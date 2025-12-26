export default function UltraPage() {
  return (
    <html>
      <head>
        <title>Ultra Minimal Test</title>
      </head>
      <body style={{ 
        margin: 0, 
        padding: '40px', 
        background: '#000', 
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1>🚀 Janus Forge Nexus - Ultra Minimal Test</h1>
        <p>If you can see this, Next.js is working at the most basic level.</p>
        <button 
          onClick={() => alert('JavaScript works!')} 
          style={{ 
            padding: '10px 20px', 
            margin: '10px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test JavaScript
        </button>
        <a 
          href="/working-test" 
          style={{ 
            color: '#0af', 
            display: 'block', 
            margin: '10px',
            padding: '10px',
            background: '#1a1a1a',
            borderRadius: '5px',
            textDecoration: 'none'
          }}
        >
          Go to Working Test
        </a>
      </body>
    </html>
  );
}
