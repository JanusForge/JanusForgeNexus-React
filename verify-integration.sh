#!/bin/bash

echo "🔍 Verifying Janus Forge Integration"
echo "===================================="
echo ""

echo "1. Checking backend (localhost:5000)..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "   ✅ Backend responding (HTTP 200)"
    BACKEND_DATA=$(curl -s http://localhost:5000/api/health)
    echo "   📊 Database: $(echo $BACKEND_DATA | grep -o '"database":"[^"]*"' | head -1 | cut -d'"' -f4)"
    echo "   🏷️  Tier: $(echo $BACKEND_DATA | grep -o '"tier":"[^"]*"' | head -1 | cut -d'"' -f4)"
else
    echo "   ❌ Backend not responding (HTTP $BACKEND_RESPONSE)"
fi

echo ""
echo "2. Checking frontend (localhost:3000)..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "   ✅ Frontend responding (HTTP 200)"
else
    echo "   ⚠️  Frontend status: HTTP $FRONTEND_RESPONSE"
    echo "   (May still be compiling...)"
fi

echo ""
echo "3. Testing API endpoints..."
echo "   Health: http://localhost:5000/api/health"
echo "   Test: http://localhost:5000/api/test"

echo ""
echo "4. Checking API client..."
if [ -f "src/lib/api/client.ts" ]; then
    echo "   ✅ API client exists"
else
    echo "   ❌ API client missing"
fi

echo ""
echo "5. Checking hooks..."
if [ -f "src/hooks/useConversations.ts" ]; then
    echo "   ✅ useConversations hook exists"
else
    echo "   ❌ useConversations hook missing"
fi

echo ""
echo "🎯 Integration Status Summary:"
echo "   Backend: $([ "$BACKEND_RESPONSE" = "200" ] && echo "✅ Connected" || echo "❌ Disconnected")"
echo "   Frontend: $([ "$FRONTEND_RESPONSE" = "200" ] && echo "✅ Running" || echo "🔄 Starting")"
echo "   Bridge: 🚧 Under construction (API calls will fail until backend implements endpoints)"

echo ""
echo "🌐 Test URLs:"
echo "   • Main App: http://localhost:3000"
echo "   • Integration Test: http://localhost:3000/test-integration"
echo "   • Connection Test: http://localhost:3000/final-test"
echo "   • Backend API: http://localhost:5000/api/health"

echo ""
echo "📝 Note: The conversations API endpoints may not exist yet in the backend."
echo "   The frontend will use mock data until the backend implements them."
