const fs = require('fs')

const files = [
  'app/admin/hero/page.tsx',
  'app/admin/testimonials/page.tsx',
  'components/public/home/TestimonialsSection.tsx',
  'components/public/home/TrainersSection.tsx'
]

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8')
  content = content.replace(/\\`/g, '`')
  content = content.replace(/\\\${/g, '${')
  fs.writeFileSync(file, content, 'utf8')
})
