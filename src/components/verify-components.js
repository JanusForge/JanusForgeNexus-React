const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying all components are in place...\n');

const components = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/components/LogoVideo.tsx',
  'src/components/TheDailyForge.tsx',
  'src/components/LiveConversation.tsx',
  'src/components/auth/AuthProvider.tsx',
  'src/app/layout.tsx',
  'src/app/page.tsx'
];

let allExist = true;

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - MISSING`);
    allExist = false;
  }
});

console.log('\n📦 Checking imports in layout.tsx...');
const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
const requiredImports = ['Header', 'Footer', 'AuthProvider'];
requiredImports.forEach(importName => {
  if (layoutContent.includes(importName)) {
    console.log(`✅ ${importName} imported in layout.tsx`);
  } else {
    console.log(`❌ ${importName} not imported in layout.tsx`);
    allExist = false;
  }
});

console.log('\n' + (allExist ? '✅ All components are properly set up!' : '⚠️ Some components are missing'));
console.log('\n🌐 Open http://localhost:3000 to test');
