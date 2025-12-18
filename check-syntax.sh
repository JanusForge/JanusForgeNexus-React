#!/bin/bash

echo "Checking TypeScript/JSX syntax..."

# Use TypeScript compiler to check syntax
npx tsc --noEmit --jsx preserve 2>&1 | grep -A5 -B5 "error TS" || echo "✅ No TypeScript syntax errors found"

echo ""
echo "Checking for common JSX issues..."

# Check for unclosed tags or fragments
for page in $(find src/app -name "page.tsx"); do
  if grep -q "^[[:space:]]*<>$" "$page" && ! grep -q "^[[:space:]]*</>$" "$page"; then
    echo "❌ $page has unclosed fragment <>"
  fi
  
  if grep -q "^[[:space:]]*<Header\|^[[:space:]]*<Footer" "$page"; then
    echo "❌ $page still has Header/Footer JSX"
  fi
done

echo "Done."
