import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingApps = [
  { name: 'client-grid', title: 'Client Grid View', desc: 'Grid view of all clients', tool: 'freshbooks_list_clients', color: '#8b5cf6' },
  { name: 'estimate-grid', title: 'Estimate Grid', desc: 'Grid view of estimates', tool: 'freshbooks_list_estimates', color: '#6366f1' },
  { name: 'invoice-grid', title: 'Invoice Grid', desc: 'Grid view of invoices', tool: 'freshbooks_list_invoices', color: '#10b981' },
  { name: 'expense-dashboard', title: 'Expense Dashboard', desc: 'Comprehensive expense overview', tool: 'freshbooks_list_expenses', color: '#ef4444' }
];

const createFiles = (app) => {
  const appDir = path.join(__dirname, app.name);
  
  const appTsx = `import { useState, useEffect } from 'react';
import './styles.css';

export default function ${app.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await (window as any).mcp?.callTool('${app.tool}', {});
      setData(response || { items: [] });
    } catch (err) {
      console.error('Error:', err);
      setData({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="header">
        <h1>${app.title}</h1>
        <p className="subtitle">${app.desc}</p>
      </div>
      <div className="card">
        <pre className="data-preview">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
`;

  const styles = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, sans-serif; background: #111827; color: #e2e8f0; }
.container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
.header h1 { font-size: 2rem; margin-bottom: 0.5rem; color: ${app.color}; }
.subtitle { color: #94a3b8; }
.loading { text-align: center; padding: 4rem; color: #94a3b8; }
.card { background: #1f2937; padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${app.color}; }
.data-preview { background: #111827; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.875rem; color: #94a3b8; }
`;

  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${app.title} - FreshBooks MCP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
`;

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
});
`;

  fs.writeFileSync(path.join(appDir, 'App.tsx'), appTsx);
  fs.writeFileSync(path.join(appDir, 'styles.css'), styles);
  fs.writeFileSync(path.join(appDir, 'main.tsx'), mainTsx);
  fs.writeFileSync(path.join(appDir, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(appDir, 'vite.config.ts'), viteConfig);
  
  console.log(`✅ Updated ${app.name}`);
};

missingApps.forEach(createFiles);
console.log('✨ Done!');
