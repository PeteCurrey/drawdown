
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
    
    // Replace quiz capture links
    if (content.includes('api/market/prop-firms/redirect?id=ftmo')) {
      content = content.replace(/https:\/\/drawdown\.trading\/api\/market\/prop-firms\/redirect\?id=ftmo&source=[^\"\']*/g, '/go/ftmo');
      changed = true;
    }
    
    // Replace X,XXX+ traders patterns
    const traderRegex = /Join [0-9,]+(\+)? traders/g;
    if (traderRegex.test(content)) {
       content = content.replace(traderRegex, 'Join Drawdown Free');
       changed = true;
    }

    // Replace 10,000+ patterns
    if (content.includes('10,000+')) {
       content = content.replace(/10,000\+/g, 'Start learning with Drawdown');
       changed = true;
    }

    // Replace 5,000+ and 2,000+ patterns
    if (content.includes('5,000+')) {
       content = content.replace(/5,000\+/g, 'Join Drawdown Free');
       changed = true;
    }
    if (content.includes('2,000+')) {
       content = content.replace(/2,000\+/g, 'Join Drawdown Free');
       changed = true;
    }

    if (changed) {
      fs.writeFileSync(f, content);
      console.log('Updated: ' + f);
    }
  }
});
