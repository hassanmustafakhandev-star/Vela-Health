const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = [
  'e:/myproject/HmK EcoSystem My Company/Vela/frontend/app',
  'e:/myproject/HmK EcoSystem My Company/Vela/frontend/components',
  'e:/myproject/HmK EcoSystem My Company/Vela/frontend/app/globals.css'
];

function getTargetColor(filePath) {
  if (filePath.includes('doctors')) return 'rose';
  if (filePath.includes('ai') || filePath.includes('records') || filePath.includes('prescription')) return 'cyan';
  if (filePath.includes('family')) return 'amber';
  return 'emerald';
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  const target = getTargetColor(filePath.replace(/\\/g, '/'));

  // Replace v-teal with target
  content = content.replace(/v-teal/g, `v-${target}`);
  // Replace target-light -> target (tailwind tokens for light aren't always mapped, let's just do v-teal -> v-emerald)
  content = content.replace(/bg-v-emerald-light/g, `bg-v-emerald/10`);
  content = content.replace(/text-v-emerald-light/g, `text-white/70`);
  
  // Replace v-glow with v-glow-target if not already suffixed
  content = content.replace(/v-glow(?!-)/g, `v-glow-${target}`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath} -> mapped to ${target}`);
  }
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const stat = fs.statSync(dir);
  if (stat.isFile()) return [dir];
  if (dir.includes('.next') || dir.includes('node_modules')) return [];
  
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

dirs.forEach(d => {
  const allFiles = getFiles(d);
  allFiles.forEach(f => processFile(f));
});
console.log("Migration script complete.");
