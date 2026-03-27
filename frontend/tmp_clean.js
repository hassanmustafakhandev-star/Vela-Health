const fs = require('fs');
const path = require('path');

const dirsToEmpty = [
  path.join(__dirname, 'app', '(app)'),
  path.join(__dirname, 'app', '(auth)'),
  path.join(__dirname, 'components')
];

function rmDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        rmDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

dirsToEmpty.forEach(d => {
  try { rmDir(d); } catch(e) { console.error(e); }
  fs.mkdirSync(d, { recursive: true });
});

// Create base component folders
const compDirs = ['ui', 'layout', 'brand', 'auth', 'dashboard', 'ai', 'doctors', 'records'];
compDirs.forEach(d => {
  fs.mkdirSync(path.join(__dirname, 'components', d), { recursive: true });
});

console.log('Cleaned directories and prepared structure.');
