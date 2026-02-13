import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

const appsDir = resolve(process.cwd(), 'src/apps');
const apps = readdirSync(appsDir).filter(file => {
  const fullPath = resolve(appsDir, file);
  return statSync(fullPath).isDirectory();
});

console.log(`Building ${apps.length} apps...`);

for (const app of apps) {
  console.log(`Building ${app}...`);
  
  await build({
    plugins: [react()],
    build: {
      outDir: resolve(process.cwd(), 'dist'),
      rollupOptions: {
        input: resolve(appsDir, app, 'index.html'),
        output: {
          entryFileNames: `${app}.js`,
          assetFileNames: `${app}.[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
  });
}

console.log('Build complete!');
