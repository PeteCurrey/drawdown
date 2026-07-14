const fs = require('fs');
const glob = require('glob'); // Not available by default, let's use standard fs
const path = require('path');

const dirs = [
  'src/components/home',
  'src/components/layout'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A regex to match text-[8px], text-[9px], text-[10px], text-xs
  // but ONLY if they are NOT immediately preceded by md:, lg:, sm:, xl: 
  // and they are a standalone word
  const regex = /(?<!(sm|md|lg|xl|2xl):)\b(text-\[8px\]|text-\[9px\]|text-\[10px\]|text-xs)\b/g;
  
  let newContent = content.replace(regex, (match) => {
    return `text-sm md:${match}`;
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

dirs.forEach(dir => {
  const fullDirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullDirPath)) {
    fs.readdirSync(fullDirPath).forEach(file => {
      if (file.endsWith('.tsx')) {
        processFile(path.join(fullDirPath, file));
      }
    });
  }
});
console.log("Done text size bumping.");
