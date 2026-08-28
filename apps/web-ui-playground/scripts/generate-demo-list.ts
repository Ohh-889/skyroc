import fs from 'node:fs';
import path from 'node:path';

interface ComponentDir {
  label: string;
  value: string;
}

const root = process.cwd();

const demoBasePath = path.join(root, 'src/app/[locale]/(demo)');

function getComponentDirs(): Array<ComponentDir> {
  const entries = fs.readdirSync(demoBasePath, { withFileTypes: true });

  return entries
    .filter(entry => entry.isDirectory() && entry.name !== 'modules' && !entry.name.startsWith('_'))
    .map(dir => ({
      name: dir.name,
      label: dir.name[0].toUpperCase() + dir.name.slice(1),
      value: dir.name
    }));
}

function writeJson(data: Array<ComponentDir>) {
  const outPath = path.join(root, 'component-list.json');

  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log(`Generated component-list.json (${data.length} items)`);
}

writeJson(getComponentDirs());
