#!/bin/bash

echo "🧪 Testing Frontend-Backend Connection..."
echo ""

# Check if backend is running
echo "1. Checking backend on port 5000..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
    echo "   Start it with: cd ~/JanusForgeNexus-Backend && node server-fixed.js"
    exit 1
fi

# Check if frontend dependencies are installed
echo ""
echo "2. Checking frontend dependencies..."
cd ~/JanusForgeNexus-React

if [ -f "package.json" ]; then
    echo "✅ package.json exists"
    
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "⚠️ node_modules not found"
        echo "   Run: npm install"
    fi
else
    echo "❌ package.json not found"
    exit 1
fi

# Check if API file was created
echo ""
echo "3. Checking API configuration..."
if [ -f "src/lib/api/index.ts" ]; then
    echo "✅ API configuration exists"
    
    # Check the content
    if grep -q "localhost:5000" src/lib/api/index.ts; then
        echo "✅ API configured for localhost:5000"
    else
        echo "❌ API not configured correctly"
    fi
else
    echo "❌ API configuration not found"
    echo "   Creating it now..."
    mkdir -p src/lib/api
    cat > src/lib/api/index.ts << 'EOF'
export const API_BASE_URL = 'http://localhost:5000/api';
export const WS_URL = 'ws://localhost:5000';
// ... rest of the file
EOF
fi

# Check if test page was created
echo ""
echo "4. Checking test page..."
if [ -f "src/app/test-integration/page.tsx" ]; then
    echo "✅ Test page exists"
else
    echo "❌ Test page not found"
fi

echo ""
echo "🎯 READY TO TEST!"
echo ""
echo "To start the frontend:"
echo "   cd ~/JanusForgeNexus-React"
echo "   npm run dev"
echo ""
echo "Then visit: http://localhost:3000/test-integration"
echo ""
echo "All tests should show ✅ Success if backend is running!"
