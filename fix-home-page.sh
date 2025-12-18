#!/bin/bash

# Read the home page
content=$(cat src/app/page.tsx)

# Replace the feature description if it still has Veteran reference
content=${content//"'Veteran-owned with human oversight'"/"'Human oversight and ethical principles'"}

# Replace the stats section
content=${content//"{ value: '100%', label: 'Veteran Owned', color: 'text-orange-400' },"/"{ value: '24/7', label: 'Live Support', color: 'text-orange-400' },"}

# Write back
echo "$content" > src/app/page.tsx

echo "Home page fixed."
