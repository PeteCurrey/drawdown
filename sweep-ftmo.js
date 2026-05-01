
const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(walk(fullPath));
    else results.push(fullPath);
  });
  return results;
};

const files = walk('src');
files.forEach(f => {
  if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.mdx')) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;
    
    // Pattern 1: Direct URLs
    const ftmoRegex = /https?:\/\/(trader\.)?ftmo\.com(\/\?affiliates=[^\s\"\'\)]*)?/g;
    if (ftmoRegex.test(content)) {
       content = content.replace(ftmoRegex, '/go/ftmo');
       changed = true;
    }
    
    // Pattern 2: Old redirect system
    if (content.includes('/api/market/prop-firms/redirect?id=ftmo')) {
      content = content.replace(/\/api\/market\/prop-firms\/redirect\?id=ftmo(&source=[^\"\']*)?/g, '/go/ftmo');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(f, content);
      console.log('Updated FTMO links in: ' + f);
    }
  }
});
