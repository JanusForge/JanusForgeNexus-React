#!/usr/bin/env python3
import re

with open('src/app/pricing/page.tsx', 'r') as f:
    content = f.read()

# 1. Remove "veteran-owned" from description (line 109)
content = content.replace(
    'All plans include veteran-owned operation and ethical AI principles.',
    'All plans include ethical AI principles and human oversight.'
)

# 2. Update the FAQ about veteran ownership
content = content.replace(
    '''                  q: 'Is this veteran-owned?',
                  a: 'Yes, Janus Forge Nexus is proudly veteran owned and operated by US Navy & Marine Veteran Cassandra Williamson.',''',
    '''                  q: 'Who operates Janus Forge?',
                  a: 'Janus Forge Nexus is operated by a team of AI experts and ethicists committed to responsible AI development.','''
)

with open('src/app/pricing/page.tsx', 'w') as f:
    f.write(content)

print("Pricing page cleaned successfully!")
