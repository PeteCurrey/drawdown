const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/app/(marketing)');

const replacements = [
  // Specific complex replacements first
  { 
    from: /bg-white border border-mkt-bd/g, 
    to: "bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5" 
  },
  { from: /hover:bg-\[#F7F7F7\]/g, to: "hover:bg-background-elevated" },
  { from: /hover:bg-white/g, to: "hover:bg-background-elevated/60" },
  { from: /hover:border-mkt-bds\/30/g, to: "hover:border-border-slate/70" },
  { from: /hover:border-mkt-bds/g, to: "hover:border-border-slate" },
  { from: /hover:text-mkt-ink/g, to: "hover:text-text-primary" },
  { from: /border-mkt-bd\/50/g, to: "border-border-slate/30" },
  { from: /bg-white/g, to: "" },
  { from: /border-mkt-bd/g, to: "border-border-slate/50" },
  { from: /text-mkt-ink/g, to: "text-text-primary" },
  { from: /text-mkt-i2/g, to: "text-text-secondary" },
  { from: /text-mkt-i3/g, to: "text-text-tertiary" },
  { from: /text-mkt-i4/g, to: "text-text-tertiary" },
  { from: /text-mkt-grn/g, to: "text-profit" },
  { from: /bg-\[#F7F7F7\]/g, to: "bg-background-elevated/40" },
  { from: /bg-mkt-bg/g, to: "bg-background-primary" },
  { from: /bg-mkt-sur/g, to: "bg-background-surface/40 backdrop-blur-md" },
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

let filesUpdated = 0;

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const rep of replacements) {
    newContent = newContent.replace(rep.from, rep.to);
  }

  // Cleanup any double spaces created by replacing "bg-white" with ""
  newContent = newContent.replace(/className="([^"]*)"/g, (match, classNames) => {
    // Replace multiple spaces with a single space and trim
    const cleanClasses = classNames.replace(/\s+/g, ' ').trim();
    return `className="${cleanClasses}"`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
    filesUpdated++;
  }
});

console.log(`Finished updating ${filesUpdated} files.`);
