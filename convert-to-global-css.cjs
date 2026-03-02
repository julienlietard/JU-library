// convert-to-global-css.js
const fs = require('fs');
const path = require('path');

const componentsDir = './src/components';

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.module.css')) {
      // Renommer .module.css → .css
      const newPath = fullPath.replace('.module.css', '.css');
      fs.renameSync(fullPath, newPath);
      console.log(`✓ Renamed: ${item} → ${item.replace('.module.css', '.css')}`);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      // Modifier les imports et usages
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Remplacer: import styles from './xxx.module.css' → import './xxx.css'
      content = content.replace(
        /import\s+(\w+)\s+from\s+['"](.+)\.module\.css['"]/g,
        (match, varName, cssPath) => {
          console.log(`  Converting ${item}: removing styles import`);
          return `import '${cssPath}.css'`;
        }
      );
      
      // Remplacer: styles['class-name'] → 'class-name'
      content = content.replace(
        /(\w+)\['([\w-]+)'\]/g,
        (match, varName, className) => {
          if (['styles', 'le', 'ue', 'R', 'Y', 'ce', 'ie', 'Ie', 'Ce', '$', 'de', 'Fe', 'ne', 'Pe', 'he', 'V', 'I', '_e', 'q', 'fe', 'E', 'X', 'G', 'F', 'ee', 'H', 'C', '$e', 'oe', 'ae', 'Se'].includes(varName)) {
            return `'${className}'`;
          }
          return match;
        }
      );
      
      // Remplacer: styles[`class-${var}`] → `class-${var}`
      content = content.replace(
        /(\w+)\[`([\w-]+\$\{[^}]+\}[\w-]*)`\]/g,
        (match, varName, template) => {
          if (['styles', 'le', 'ue', 'R', 'Y', 'ce', 'ie', 'Ie', 'Ce', '$', 'de', 'Fe', 'ne', 'Pe', 'he', 'V', 'I', '_e', 'q', 'fe', 'E', 'X', 'G', 'F', 'ee', 'H', 'C', '$e', 'oe', 'ae', 'Se'].includes(varName)) {
            return `\`${template}\``;
          }
          return match;
        }
      );
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Updated: ${item}`);
      }
    }
  }
}

console.log('🔄 Converting CSS Modules to global CSS...\n');
processDirectory(componentsDir);
console.log('\n✅ Done! Run: pnpm build && npm version patch --no-git-tag-version && npm publish');