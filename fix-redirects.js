
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

const files = walk('src/app');
files.forEach(f => {
  if (f.endsWith('page.tsx')) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    if (content.includes('/api/market/prop-firms/redirect')) {
      // Template literal replacement
      const templateRegex = /href=\{\`\/api\/market\/prop-firms\/redirect\?id=\$\{firm\.(id|slug)\}&source=[^\"\']*\`\}/g;
      if (templateRegex.test(content)) {
        content = content.replace(templateRegex, (match, p1) => `href={\`/go/\${firm.${p1}}\`}`);
        changed = true;
      }

      // Static string replacement
      const staticRegex = /\/api\/market\/prop-firms\/redirect\?id=([a-z0-9-]+)&source=[^\"\']*/g;
      if (staticRegex.test(content)) {
        content = content.replace(staticRegex, '/go/$1');
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(f, content);
      console.log('Fixed links in: ' + f);
    }
  }
});
