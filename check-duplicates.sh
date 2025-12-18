#!/bin/bash

echo "Checking for duplicate Header/Footer imports..."

pages_with_duplicates=0

for page in $(find src/app -name "page.tsx" -o -name "page.jsx"); do
  if grep -q "import.*Header" "$page" || grep -q "import.*Footer" "$page"; then
    echo "❌ $page has Header/Footer imports (should be in layout only)"
    ((pages_with_duplicates++))
  fi
done

if [ $pages_with_duplicates -eq 0 ]; then
  echo "✅ No duplicate Header/Footer imports found!"
else
  echo "Found $pages_with_duplicates pages with duplicate imports"
fi

echo ""
echo "Checking for duplicate JSX elements..."
for page in $(find src/app -name "page.tsx" -o -name "page.jsx"); do
  if grep -q "<Header" "$page" || grep -q "<Footer" "$page"; then
    echo "❌ $page has Header/Footer JSX elements"
    ((pages_with_duplicates++))
  fi
done

echo "Done."
