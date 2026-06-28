const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/app/(public)');
const pages = [
  { dir: 'about', title: 'About Us' },
  { dir: 'membership', title: 'Membership & Pricing' },
  { dir: 'classes', title: 'Programs & Classes' },
  { dir: 'personal-training', title: 'Personal Training' },
  { dir: 'bmi-calculator', title: 'BMI Calculator' },
  { dir: 'calories-calculator', title: 'Calories Calculator' },
  { dir: 'diet-plans', title: 'Diet Plans' },
  { dir: 'gallery', title: 'Gallery' },
  { dir: 'blog', title: 'Blog' },
  { dir: 'contact', title: 'Contact Us' },
  { dir: 'privacy-policy', title: 'Privacy Policy' },
  { dir: 'terms', title: 'Terms & Conditions' },
  { dir: 'testimonials', title: 'Testimonials' },
  { dir: 'transformations', title: 'Client Transformations' },
  { dir: 'cookie-policy', title: 'Cookie Policy' },
  { dir: 'refund-policy', title: 'Refund Policy' },
];

const template = (title) => `"use client"

import { motion } from 'framer-motion'

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div className="min-h-screen pt-[120px] pb-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            ${title}
          </h1>
          <p className="text-lg text-white/60 mb-12">
            This page is currently under development. Stay tuned for updates!
          </p>
          
          <div className="glass p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-20 h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-6"></div>
             <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
             <p className="text-white/50 text-center max-w-md">
               We are working hard to bring you the best experience. The ${title} page will be available shortly.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
`;

pages.forEach(page => {
  const dirPath = path.join(pagesDir, page.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, template(page.title));
  console.log(`Created page: ${filePath}`);
});
