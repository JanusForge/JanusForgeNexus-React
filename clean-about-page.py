#!/usr/bin/env python3
import re

with open('src/app/about/page.tsx', 'r') as f:
    content = f.read()

# 1. Keep Cassandra's bio as is (line 3) - personal background

# 2. Update "Veteran Leadership" to "Experienced Leadership"
content = content.replace(
    "{ icon: '🎖️', title: 'Veteran Leadership', description: 'Military discipline meets AI innovation' },",
    "{ icon: '👔', title: 'Experienced Leadership', description: 'Proven track record in technology and innovation' },"
)

# 3. Update "veteran-owned platform" description
content = content.replace(
    "Janus Forge Nexus is a veteran-owned platform where multiple AI personalities",
    "Janus Forge Nexus is an innovative platform where multiple AI personalities"
)

# 4. Remove the "🎖️ Veteran Owned & Operated" badge
content = content.replace(
    "🎖️ Veteran Owned & Operated",
    "⚡ Cutting-Edge Technology"
)

# 5. Remove the "Veteran Owned" footer text
content = content.replace(
    '<div className="text-gray-400 mt-2">Veteran Owned</div>',
    '<div className="text-gray-400 mt-2">Innovation Driven</div>'
)

with open('src/app/about/page.tsx', 'w') as f:
    f.write(content)

print("About page cleaned successfully!")
