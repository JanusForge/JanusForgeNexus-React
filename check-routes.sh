#!/bin/bash

echo "Checking if all footer routes exist..."

# Legal pages
echo -e "\nLegal Pages:"
for page in terms privacy cookies gdpr "ai-ethics" "acceptable-use"; do
  dir="src/app/legal/${page}"
  if [ -f "${dir}/page.tsx" ]; then
    echo "✅ ${page}"
  else
    echo "❌ ${page} (missing)"
  fi
done

# Technical pages
echo -e "\nTechnical Pages:"
for page in architecture documentation security status; do
  dir="src/app/${page}"
  if [ -f "${dir}/page.tsx" ]; then
    echo "✅ ${page}"
  else
    echo "❌ ${page} (missing)"
  fi
done

# Contact pages (should exist in app/contact)
echo -e "\nContact Page:"
if [ -f "src/app/contact/page.tsx" ]; then
  echo "✅ contact"
else
  echo "❌ contact (missing)"
fi

echo -e "\nDone!"
