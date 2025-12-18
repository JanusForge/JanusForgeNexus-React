#!/usr/bin/env python3
import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Remove the entire Veteran Badge section (lines 89-93)
content = re.sub(
    r'\s*{/\* Veteran Badge \*/}.*?\n\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

# 2. Update "Ethical AI" feature description
content = content.replace(
    "'Veteran-owned with human oversight'",
    "'Human oversight and ethical principles'"
)

# 3. Replace "100% Veteran Owned" stat
content = content.replace(
    "{ value: '100%', label: 'Veteran Owned', color: 'text-orange-400' },",
    "{ value: '24/7', label: 'Live Support', color: 'text-orange-400' },"
)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

print("Home page cleaned successfully!")
