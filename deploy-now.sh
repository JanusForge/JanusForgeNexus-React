#!/bin/bash
echo "=== Deploying Changes ==="
echo ""

# Check git status
echo "1. Git status:"
git status --short

# Add changes
echo ""
echo "2. Adding changes..."
git add src/app/page.tsx

# Commit
echo ""
echo "3. Committing..."
git commit -m "Update video container: Increase size to w-80 h-80, adjust spacing for better balance with Daily Forge section"

# Push
echo ""
echo "4. Pushing to GitHub..."
git push

echo ""
echo "✅ Deployment initiated!"
echo "📱 Check: https://vercel.com/your-username/janusforge-ai"
echo "🌐 Live in 1-2 minutes: https://janusforge.ai"
echo ""
echo "After deployment, refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac)"
