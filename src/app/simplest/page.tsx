export default function SimplestPage() {
  return (
    <html>
      <head>
        <title>Simplest Test</title>
      </head>
      <body style={{ margin: 0, padding: 40, background: 'black', color: 'white' }}>
        <h1>✅ Simplest Test Page</h1>
        <p>If you can see this, Next.js is working at the most basic level.</p>
        <button 
          onclick="fetch('http://localhost:5000/api/health').then(r => r.json()).then(d => alert(JSON.stringify(d, null, 2)))"
          style={{ padding: '10px 20px', margin: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Test Backend
        </button>
        <div style={{ marginTop: 20, color: '#888' }}>
          <p>Backend: localhost:5000</p>
          <p>Frontend: localhost:3000</p>
        </div>
      </body>
    </html>
  );
}
