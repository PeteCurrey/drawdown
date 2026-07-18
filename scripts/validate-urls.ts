import fs from 'fs';
import path from 'path';

const FORBIDDEN_STRINGS = [
  "£50k",
  "bought the watch",
  "EST. 2024",
  "LDN",
  "Sub-millisecond routing protocols directly to institutional liquidity hubs.",
  "Monte Carlo simulation engines run against historical tick data dating back to 2014.",
  "Aggregated live client positioning feed sourced from five global broker systems."
];

function checkDirectoryForStrings(dir: string) {
  let hasError = false;
  
  if (!fs.existsSync(dir)) return hasError;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      hasError = checkDirectoryForStrings(fullPath) || hasError;
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const str of FORBIDDEN_STRINGS) {
          if (content.includes(str)) {
            console.error(`❌ FORBIDDEN STRING FOUND in ${fullPath}: "${str}"`);
            hasError = true;
          }
        }
      }
    }
  }
  return hasError;
}

console.log('Running CI integrity checks...');
const hasError = checkDirectoryForStrings(path.join(process.cwd(), 'src/app'));

if (hasError) {
  console.error('\nIntegrity check failed. Found fabricated claims.');
  process.exit(1);
} else {
  console.log('✅ Integrity check passed.');
}
