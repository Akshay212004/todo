#!/usr/bin/env node
/**
 * Creates the native React Native (CLI) project in ./Frontend and drops this repo's
 * app source (App.tsx + src/) into it, then installs the JS dependencies.
 *
 * Usage (from the repo root):   node scripts/setup-frontend.js
 * Works on macOS, Linux and Windows.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const frontend = path.join(root, 'Frontend');
const staging = path.join(root, 'Frontend-src');

const DEPENDENCIES = [
  'axios',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  'react-native-screens',
  'react-native-safe-area-context',
  '@react-native-async-storage/async-storage',
  '@react-native-community/datetimepicker',
];

const run = (command, cwd) => {
  console.log(`\n> ${command}`);
  const result = spawnSync(command, { cwd, stdio: 'inherit', shell: true });
  return result.status === 0;
};

/** Puts the original source folder back if project creation fails half way. */
const restoreSource = () => {
  if (!fs.existsSync(staging)) return;
  fs.rmSync(frontend, { recursive: true, force: true });
  fs.renameSync(staging, frontend);
  console.error('Restored the original Frontend/ folder.');
};

/**
 * react-native-screens recommends calling super.onCreate(null) in MainActivity so Android
 * does not try to restore fragments after the process is killed. Best effort: if the file
 * looks different from what we expect we leave it alone and print a note.
 */
const patchMainActivity = () => {
  const javaRoot = path.join(frontend, 'android', 'app', 'src', 'main', 'java');
  const find = (dir) => {
    if (!fs.existsSync(dir)) return null;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const hit = find(full);
        if (hit) return hit;
      } else if (entry.name === 'MainActivity.kt') return full;
    }
    return null;
  };

  const file = find(javaRoot);
  if (!file) return console.log('Note: MainActivity.kt not found, skipping optional patch.');

  let source = fs.readFileSync(file, 'utf8');
  if (source.includes('onCreate')) return;

  const lastBrace = source.lastIndexOf('}');
  const packageLine = source.match(/^package .*$/m);
  if (lastBrace === -1 || !packageLine) {
    return console.log('Note: MainActivity.kt has an unexpected layout, skipping optional patch.');
  }

  const method =
    '\n  // Recommended by react-native-screens: avoid restoring fragments after process death.\n' +
    '  override fun onCreate(savedInstanceState: Bundle?) {\n' +
    '    super.onCreate(null)\n' +
    '  }\n';
  source = source.slice(0, lastBrace) + method + source.slice(lastBrace);
  if (!source.includes('import android.os.Bundle')) {
    source = source.replace(packageLine[0], `${packageLine[0]}\n\nimport android.os.Bundle`);
  }
  fs.writeFileSync(file, source);
  console.log('Patched MainActivity.kt (react-native-screens recommendation).');
};

// ---- checks ---------------------------------------------------------------
if (fs.existsSync(path.join(frontend, 'android'))) {
  console.log('Frontend/ already contains a React Native project. Nothing to do.');
  process.exit(0);
}
if (!fs.existsSync(path.join(frontend, 'src')) || !fs.existsSync(path.join(frontend, 'App.tsx'))) {
  console.error('Expected Frontend/App.tsx and Frontend/src/ (the app source) to exist.');
  process.exit(1);
}
if (fs.existsSync(staging)) {
  console.error('Frontend-src/ already exists. Remove or rename it and try again.');
  process.exit(1);
}

// ---- 1. generate the native project --------------------------------------
fs.renameSync(frontend, staging); // the CLI needs an empty target directory

if (!run('npx @react-native-community/cli@latest init TodoApp --directory Frontend --skip-git-init --pm npm', root)) {
  restoreSource();
  process.exit(1);
}

// ---- 2. copy our source over the template ---------------------------------
fs.cpSync(path.join(staging, 'src'), path.join(frontend, 'src'), { recursive: true });
fs.copyFileSync(path.join(staging, 'App.tsx'), path.join(frontend, 'App.tsx'));
fs.rmSync(staging, { recursive: true, force: true });
console.log('\nCopied App.tsx and src/ into the new project.');

// ---- 3. dependencies + Android tweak --------------------------------------
if (!run(`npm install ${DEPENDENCIES.join(' ')}`, frontend)) {
  console.error('\nDependency install failed. Fix the error, then run:');
  console.error(`  cd Frontend && npm install ${DEPENDENCIES.join(' ')}`);
  process.exit(1);
}
patchMainActivity();

console.log('\nFrontend ready. Next: start the backend, then in Frontend/ run  npm start  and  npm run android');
