const fs = require('fs');
const path = './app/admin/members/[id]/contract/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  'text-gray-800': 'text-[#1f2937]',
  'text-gray-700': 'text-[#374151]',
  'text-gray-600': 'text-[#4b5563]',
  'text-gray-500': 'text-[#6b7280]',
  'bg-gray-100': 'bg-[#f3f4f6]',
  'border-gray-800': 'border-[#1f2937]',
  'border-gray-300': 'border-[#d1d5db]',
  'border-gray-200': 'border-[#e5e7eb]',
  'border-black': 'border-[#000000]',
  'text-black': 'text-[#000000]',
  'bg-white': 'bg-[#ffffff]',
};

for (const [oldClass, newClass] of Object.entries(replacements)) {
  const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
  content = content.replace(regex, newClass);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Colors replaced successfully!');
