import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apps = [
  {
    name: 'invoice-dashboard',
    title: 'Invoice Dashboard',
    desc: 'Manage and track all your invoices',
    tool: 'freshbooks_list_invoices',
    color: '#10b981'
  },
  {
    name: 'invoice-detail',
    title: 'Invoice Detail',
    desc: 'View detailed invoice information',
    tool: 'freshbooks_get_invoice',
    color: '#3b82f6'
  },
  {
    name: 'client-dashboard',
    title: 'Client Directory',
    desc: 'Manage all your clients',
    tool: 'freshbooks_list_clients',
    color: '#8b5cf6'
  },
  {
    name: 'client-detail',
    title: 'Client Detail',
    desc: 'View detailed client information',
    tool: 'freshbooks_get_client',
    color: '#8b5cf6'
  },
  {
    name: 'expense-tracker',
    title: 'Expense Tracker',
    desc: 'Track and categorize all expenses',
    tool: 'freshbooks_list_expenses',
    color: '#ef4444'
  },
  {
    name: 'expense-categories',
    title: 'Expense Categories',
    desc: 'Manage expense categories',
    tool: 'freshbooks_list_expense_categories',
    color: '#f59e0b'
  },
  {
    name: 'time-entries',
    title: 'Time Entry Log',
    desc: 'Log and track time entries',
    tool: 'freshbooks_list_time_entries',
    color: '#06b6d4'
  },
  {
    name: 'time-tracker',
    title: 'Project Timer',
    desc: 'Start and stop project timers',
    tool: 'freshbooks_list_time_entries',
    color: '#06b6d4'
  },
  {
    name: 'project-dashboard',
    title: 'Project Overview',
    desc: 'View all active projects',
    tool: 'freshbooks_list_projects',
    color: '#10b981'
  },
  {
    name: 'project-detail',
    title: 'Project Detail',
    desc: 'Detailed project information',
    tool: 'freshbooks_get_project',
    color: '#10b981'
  },
  {
    name: 'payment-history',
    title: 'Payment History',
    desc: 'Track all payments',
    tool: 'freshbooks_list_payments',
    color: '#10b981'
  },
  {
    name: 'estimate-builder',
    title: 'Estimate Builder',
    desc: 'Create and send estimates',
    tool: 'freshbooks_list_estimates',
    color: '#6366f1'
  },
  {
    name: 'tax-summary',
    title: 'Tax Summary',
    desc: 'View tax reporting and summaries',
    tool: 'freshbooks_tax_summary_report',
    color: '#f59e0b'
  },
  {
    name: 'recurring-invoices',
    title: 'Recurring Templates',
    desc: 'Manage recurring invoice templates',
    tool: 'freshbooks_list_invoices',
    color: '#8b5cf6'
  },
  {
    name: 'profit-loss',
    title: 'Profit & Loss',
    desc: 'Financial P&L statements',
    tool: 'freshbooks_profit_loss_report',
    color: '#10b981'
  },
  {
    name: 'revenue-chart',
    title: 'Revenue Chart',
    desc: 'Visual revenue analytics',
    tool: 'freshbooks_list_invoices',
    color: '#10b981'
  },
  {
    name: 'aging-report',
    title: 'Outstanding Balance',
    desc: 'Accounts receivable aging',
    tool: 'freshbooks_aging_report',
    color: '#ef4444'
  },
  {
    name: 'bill-manager',
    title: 'Bill Manager',
    desc: 'Manage vendor bills',
    tool: 'freshbooks_list_bills',
    color: '#f59e0b'
  },
  {
    name: 'credit-note-viewer',
    title: 'Credit Note Viewer',
    desc: 'View and manage credit notes',
    tool: 'freshbooks_list_credit_notes',
    color: '#06b6d4'
  },
  {
    name: 'reports-dashboard',
    title: 'Report Builder',
    desc: 'Build custom financial reports',
    tool: 'freshbooks_profit_loss_report',
    color: '#8b5cf6'
  },
  {
    name: 'invoice-builder',
    title: 'Invoice Builder',
    desc: 'Create new invoices',
    tool: 'freshbooks_create_invoice',
    color: '#10b981'
  },
];

const createApp = (app) => {
  const appDir = path.join(__dirname, app.name);
  
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  // App.tsx
  const appTsx = `import { useState, useEffect } from 'react';
import './styles.css';

export default function ${app.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Call MCP tool
      const response = await (window as any).mcp?.callTool('${app.tool}', {});
      
      if (response) {
        setData(response);
      } else {
        setData(getSampleData());
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => {
    return { message: 'Sample data - MCP tools not available', items: [] };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading ${app.title.toLowerCase()}...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>${app.title}</h1>
        <p className="subtitle">${app.desc}</p>
      </div>
      
      <div className="content">
        {error && <div className="error">{error}</div>}
        
        <div className="card">
          <h2>Data</h2>
          <pre className="data-preview">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
`;

  // styles.css
  const stylesCss = `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #111827;
  color: #e2e8f0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${app.color};
}

.subtitle {
  color: #94a3b8;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #94a3b8;
}

.error {
  background: #7f1d1d;
  color: #fca5a5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #1f2937;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid ${app.color};
}

.card h2 {
  color: #e2e8f0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.data-preview {
  background: #111827;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: #94a3b8;
  max-height: 600px;
  overflow-y: auto;
}

.btn {
  background: ${app.color};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn:hover {
  opacity: 0.9;
}
`;

  // main.tsx
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  // index.html
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

  // vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
`;

  // Write files
  fs.writeFileSync(path.join(appDir, 'App.tsx'), appTsx);
  fs.writeFileSync(path.join(appDir, 'styles.css'), stylesCss);
  fs.writeFileSync(path.join(appDir, 'main.tsx'), mainTsx);
  fs.writeFileSync(path.join(appDir, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(appDir, 'vite.config.ts'), viteConfig);
  
  console.log(`✅ Created ${app.name}`);
};

console.log('🚀 Generating FreshBooks MCP Apps...\n');
apps.forEach(createApp);
console.log(`\n✨ Generated ${apps.length} apps successfully!`);
