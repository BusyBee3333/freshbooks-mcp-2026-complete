import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FreshBooksAPIClient } from './clients/freshbooks.js';
import { clientsTools } from './tools/clients-tools.js';
import { invoicesTools } from './tools/invoices-tools.js';
import { estimatesTools } from './tools/estimates-tools.js';
import { expensesTools } from './tools/expenses-tools.js';
import { paymentsTools } from './tools/payments-tools.js';
import { projectsTools } from './tools/projects-tools.js';
import { timeEntriesTools } from './tools/time-entries-tools.js';
import { taxesTools } from './tools/taxes-tools.js';
import { itemsTools } from './tools/items-tools.js';
import { staffTools } from './tools/staff-tools.js';
import { billsTools } from './tools/bills-tools.js';
import { vendorsTools } from './tools/vendors-tools.js';
import { accountsTools } from './tools/accounts-tools.js';
import { journalEntriesTools } from './tools/journal-entries-tools.js';
import { retainersTools } from './tools/retainers-tools.js';
import { creditNotesTools } from './tools/credit-notes-tools.js';
import { reportsTools } from './tools/reports-tools.js';

// Combine all tools
const allTools = [
  ...clientsTools,
  ...invoicesTools,
  ...estimatesTools,
  ...expensesTools,
  ...paymentsTools,
  ...projectsTools,
  ...timeEntriesTools,
  ...taxesTools,
  ...itemsTools,
  ...staffTools,
  ...billsTools,
  ...vendorsTools,
  ...accountsTools,
  ...journalEntriesTools,
  ...retainersTools,
  ...creditNotesTools,
  ...reportsTools,
];

// MCP App resources (HTML files)
const appResources = [
  { uri: 'freshbooks://apps/invoice-dashboard', name: 'Invoice Dashboard' },
  { uri: 'freshbooks://apps/invoice-detail', name: 'Invoice Detail' },
  { uri: 'freshbooks://apps/invoice-creator', name: 'Invoice Creator' },
  { uri: 'freshbooks://apps/client-dashboard', name: 'Client Dashboard' },
  { uri: 'freshbooks://apps/client-detail', name: 'Client Detail' },
  { uri: 'freshbooks://apps/expense-tracker', name: 'Expense Tracker' },
  { uri: 'freshbooks://apps/expense-report', name: 'Expense Report' },
  { uri: 'freshbooks://apps/project-dashboard', name: 'Project Dashboard' },
  { uri: 'freshbooks://apps/project-detail', name: 'Project Detail' },
  { uri: 'freshbooks://apps/time-tracker', name: 'Time Tracker' },
  { uri: 'freshbooks://apps/time-report', name: 'Time Report' },
  { uri: 'freshbooks://apps/payment-dashboard', name: 'Payment Dashboard' },
  { uri: 'freshbooks://apps/estimate-builder', name: 'Estimate Builder' },
  { uri: 'freshbooks://apps/profit-loss-report', name: 'Profit & Loss Report' },
  { uri: 'freshbooks://apps/tax-summary', name: 'Tax Summary' },
  { uri: 'freshbooks://apps/aging-report', name: 'Aging Report' },
  { uri: 'freshbooks://apps/item-catalog', name: 'Item Catalog' },
  { uri: 'freshbooks://apps/bill-manager', name: 'Bill Manager' },
  { uri: 'freshbooks://apps/staff-directory', name: 'Staff Directory' },
  { uri: 'freshbooks://apps/dashboard-overview', name: 'Dashboard Overview' },
];

export async function createServer() {
  const server = new Server(
    {
      name: 'freshbooks-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Get config from environment
  const accountId = process.env.FRESHBOOKS_ACCOUNT_ID;
  const accessToken = process.env.FRESHBOOKS_ACCESS_TOKEN;

  if (!accountId || !accessToken) {
    throw new Error(
      'Missing required environment variables: FRESHBOOKS_ACCOUNT_ID and FRESHBOOKS_ACCESS_TOKEN'
    );
  }

  const client = new FreshBooksAPIClient({
    accountId,
    accessToken,
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = allTools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    try {
      return await tool.handler(client, request.params.arguments || {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  // List resources handler (MCP Apps)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: appResources.map((app) => ({
        uri: app.uri,
        mimeType: 'text/html',
        name: app.name,
      })),
    };
  });

  // Read resource handler (serve MCP App HTML)
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const appName = uri.replace('freshbooks://apps/', '');
    
    try {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const { fileURLToPath } = await import('url');
      const __dirname = fileURLToPath(new URL('.', import.meta.url));
      
      const htmlPath = join(__dirname, 'ui', 'react-app', 'dist', `${appName}.html`);
      const html = readFileSync(htmlPath, 'utf-8');
      
      return {
        contents: [
          {
            uri,
            mimeType: 'text/html',
            text: html,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to load app ${appName}: ${error}`);
    }
  });

  return server;
}

export async function runServer() {
  const server = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('FreshBooks MCP server running on stdio');
}
