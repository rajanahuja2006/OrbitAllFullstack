import fs from 'fs';
import path from 'path';

const dir = '/Users/aadya/Documents/OrbitAllFullstack/orbit-frontend-premium/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/import SoftBackground from "\.\.\/components\/SoftBackground";\n?/g, '');
  content = content.replace(/[ \t]*<SoftBackground \/>\n?/g, '');
  fs.writeFileSync(p, content);
});
console.log('Cleaned SoftBackground from all pages.');
