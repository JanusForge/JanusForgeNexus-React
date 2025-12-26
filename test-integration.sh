#!/bin/bash

echo "🔍 Testing Janus Forge Nexus Integration"
echo "========================================"

# Test backend
echo "1. Testing backend on localhost:5000..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend is running (HTTP $BACKEND_STATUS)"
    BACKEND_DATA=$(curl -s http://localhost:5000/api/health)
    echo "   📊 Response: $BACKEND_DATA"
else
    echo "   ❌ Backend not responding (HTTP $BACKEND_STATUS)"
fi

# Test frontend
echo ""
echo "2. Testing frontend on localhost:3000..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is running (HTTP $FRONTEND_STATUS)"
else
    echo "   ❌ Frontend not responding (HTTP $FRONTEND_STATUS)"
fi

# Test the bridge
echo ""
echo "3. Testing API bridge..."
cat > /tmp/test_bridge.js << 'JS'
const fetch = require('node-fetch');

async function testBridge() {
    try {
        // Test direct backend
        const backendRes = await fetch('http://localhost:5000/api/health');
        const backendData = await backendRes.json();
        
        console.log('Backend: ✅', backendData.database || 'Connected');
        
        // Test frontend API endpoint (if exists)
        const frontendRes = await fetch('http://localhost:3000/api/test');
        if (frontendRes.ok) {
            console.log('Frontend API: ✅');
        } else {
            console.log('Frontend API: ⚠️ (may not exist)');
        }
        
        console.log('\n🎯 Integration Status:');
        if (backendRes.ok) {
            console.log('   Bridge: 🚧 Under construction');
            console.log('   Next: Connect frontend components to backend API');
        } else {
            console.log('   Bridge: ❌ Backend not reachable');
        }
        
    } catch (error) {
        console.log('Bridge test error:', error.message);
    }
}

testBridge();
JS

node /tmp/test_bridge.js

echo ""
echo "🎯 NEXT STEPS:"
echo "   1. Open http://localhost:3000/final-test"
echo "   2. Click 'Test Backend Connection'"
echo "   3. Verify the bridge is working"
echo ""
echo "🌌 The AI-AI-human conversation platform is ready for integration!"
