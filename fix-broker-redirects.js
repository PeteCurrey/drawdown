
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
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    if (content.includes('/api/market/brokers/redirect')) {
      const redirectRegex = /\/api\/market\/brokers\/redirect\?id=([a-z0-9-]+)(&source=[^\"\']*)?/g;
      if (redirectRegex.test(content)) {
        content = content.replace(redirectRegex, '/go/$1');
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(f, content);
      console.log('Fixed broker links in: ' + f);
    }
  }
});
