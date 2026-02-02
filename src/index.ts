#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "freshbooks";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.freshbooks.com";

// ============================================
// API CLIENT
// ============================================
class FreshBooksClient {
  private accessToken: string;
  private accountId: string;
  private baseUrl: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
    this.baseUrl = `${API_BASE_URL}/accounting/account/${accountId}`;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Api-Version": "alpha",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`FreshBooks API error: ${response.status} ${response.statusText} - ${text}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Invoice methods
  async listInvoices(options?: { page?: number; perPage?: number; status?: string }) {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.perPage) params.append("per_page", options.perPage.toString());
    if (options?.status) params.append("search[v3_status]", options.status);
    const query = params.toString();
    return this.get(`/invoices/invoices${query ? `?${query}` : ""}`);
  }

  async getInvoice(invoiceId: string) {
    return this.get(`/invoices/invoices/${invoiceId}`);
  }

  async createInvoice(data: {
    customerid: number;
    create_date: string;
    due_offset_days?: number;
    currency_code?: string;
    language?: string;
    notes?: string;
    terms?: string;
    lines?: Array<{
      name: string;
      description?: string;
      qty: number;
      unit_cost: { amount: string; code?: string };
    }>;
  }) {
    return this.post("/invoices/invoices", { invoice: data });
  }

  async sendInvoice(invoiceId: string, emailData: {
    email_recipients?: string[];
    email_subject?: string;
    email_body?: string;
    action_email?: boolean;
  }) {
    // To send an invoice, update status to "sent"
    return this.put(`/invoices/invoices/${invoiceId}`, {
      invoice: {
        action_email: emailData.action_email ?? true,
        email_recipients: emailData.email_recipients,
        email_subject: emailData.email_subject,
        email_body: emailData.email_body,
        status: 2, // 2 = sent
      },
    });
  }

  // Client methods
  async listClients(options?: { page?: number; perPage?: number }) {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.perPage) params.append("per_page", options.perPage.toString());
    const query = params.toString();
    return this.get(`/users/clients${query ? `?${query}` : ""}`);
  }

  async getClient(clientId: string) {
    return this.get(`/users/clients/${clientId}`);
  }

  async createClient(data: {
    email?: string;
    fname?: string;
    lname?: string;
    organization?: string;
    p_street?: string;
    p_street2?: string;
    p_city?: string;
    p_province?: string;
    p_code?: string;
    p_country?: string;
    currency_code?: string;
    language?: string;
    bus_phone?: string;
    mob_phone?: string;
    note?: string;
  }) {
    return this.post("/users/clients", { client: data });
  }

  // Expense methods
  async listExpenses(options?: { page?: number; perPage?: number }) {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.perPage) params.append("per_page", options.perPage.toString());
    const query = params.toString();
    return this.get(`/expenses/expenses${query ? `?${query}` : ""}`);
  }

  async getExpense(expenseId: string) {
    return this.get(`/expenses/expenses/${expenseId}`);
  }

  // Payment methods
  async listPayments(options?: { page?: number; perPage?: number }) {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.perPage) params.append("per_page", options.perPage.toString());
    const query = params.toString();
    return this.get(`/payments/payments${query ? `?${query}` : ""}`);
  }

  async getPayment(paymentId: string) {
    return this.get(`/payments/payments/${paymentId}`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_invoices",
    description: "List invoices from FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default 1)" },
        per_page: { type: "number", description: "Results per page (default 15)" },
        status: { 
          type: "string", 
          description: "Filter by status",
          enum: ["draft", "sent", "viewed", "paid", "overdue", "disputed"]
        },
      },
    },
  },
  {
    name: "get_invoice",
    description: "Get a specific invoice by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        invoice_id: { type: "string", description: "Invoice ID" },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "create_invoice",
    description: "Create a new invoice in FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        customer_id: { type: "number", description: "Client/customer ID" },
        create_date: { type: "string", description: "Invoice date (YYYY-MM-DD)" },
        due_offset_days: { type: "number", description: "Days until due (default 30)" },
        currency_code: { type: "string", description: "Currency code (e.g., USD, CAD)" },
        notes: { type: "string", description: "Invoice notes" },
        terms: { type: "string", description: "Payment terms" },
        lines: { 
          type: "array", 
          description: "Invoice line items",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Item name" },
              description: { type: "string", description: "Item description" },
              qty: { type: "number", description: "Quantity" },
              unit_cost: { type: "string", description: "Unit cost as string (e.g., '100.00')" },
            },
            required: ["name", "qty", "unit_cost"],
          },
        },
      },
      required: ["customer_id", "create_date"],
    },
  },
  {
    name: "send_invoice",
    description: "Send an invoice to the client via email",
    inputSchema: {
      type: "object" as const,
      properties: {
        invoice_id: { type: "string", description: "Invoice ID to send" },
        email_recipients: { 
          type: "array", 
          items: { type: "string" },
          description: "Email addresses to send to"
        },
        email_subject: { type: "string", description: "Email subject line" },
        email_body: { type: "string", description: "Email body message" },
      },
      required: ["invoice_id"],
    },
  },
  {
    name: "list_clients",
    description: "List all clients from FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default 1)" },
        per_page: { type: "number", description: "Results per page (default 15)" },
      },
    },
  },
  {
    name: "create_client",
    description: "Create a new client in FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Client email" },
        fname: { type: "string", description: "First name" },
        lname: { type: "string", description: "Last name" },
        organization: { type: "string", description: "Company/organization name" },
        p_street: { type: "string", description: "Street address" },
        p_city: { type: "string", description: "City" },
        p_province: { type: "string", description: "State/Province" },
        p_code: { type: "string", description: "Postal/ZIP code" },
        p_country: { type: "string", description: "Country" },
        currency_code: { type: "string", description: "Currency code (e.g., USD)" },
        bus_phone: { type: "string", description: "Business phone" },
        note: { type: "string", description: "Notes about client" },
      },
    },
  },
  {
    name: "list_expenses",
    description: "List expenses from FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default 1)" },
        per_page: { type: "number", description: "Results per page (default 15)" },
      },
    },
  },
  {
    name: "list_payments",
    description: "List payments received in FreshBooks",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default 1)" },
        per_page: { type: "number", description: "Results per page (default 15)" },
      },
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: FreshBooksClient, name: string, args: any) {
  switch (name) {
    case "list_invoices": {
      return await client.listInvoices({
        page: args.page,
        perPage: args.per_page,
        status: args.status,
      });
    }
    case "get_invoice": {
      return await client.getInvoice(args.invoice_id);
    }
    case "create_invoice": {
      const lines = args.lines?.map((line: any) => ({
        name: line.name,
        description: line.description,
        qty: line.qty,
        unit_cost: { amount: line.unit_cost, code: args.currency_code || "USD" },
      }));
      
      return await client.createInvoice({
        customerid: args.customer_id,
        create_date: args.create_date,
        due_offset_days: args.due_offset_days || 30,
        currency_code: args.currency_code,
        notes: args.notes,
        terms: args.terms,
        lines,
      });
    }
    case "send_invoice": {
      return await client.sendInvoice(args.invoice_id, {
        email_recipients: args.email_recipients,
        email_subject: args.email_subject,
        email_body: args.email_body,
        action_email: true,
      });
    }
    case "list_clients": {
      return await client.listClients({
        page: args.page,
        perPage: args.per_page,
      });
    }
    case "create_client": {
      return await client.createClient({
        email: args.email,
        fname: args.fname,
        lname: args.lname,
        organization: args.organization,
        p_street: args.p_street,
        p_city: args.p_city,
        p_province: args.p_province,
        p_code: args.p_code,
        p_country: args.p_country,
        currency_code: args.currency_code,
        bus_phone: args.bus_phone,
        note: args.note,
      });
    }
    case "list_expenses": {
      return await client.listExpenses({
        page: args.page,
        perPage: args.per_page,
      });
    }
    case "list_payments": {
      return await client.listPayments({
        page: args.page,
        perPage: args.per_page,
      });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const accessToken = process.env.FRESHBOOKS_ACCESS_TOKEN;
  const accountId = process.env.FRESHBOOKS_ACCOUNT_ID;
  
  if (!accessToken) {
    console.error("Error: FRESHBOOKS_ACCESS_TOKEN environment variable required");
    process.exit(1);
  }
  if (!accountId) {
    console.error("Error: FRESHBOOKS_ACCOUNT_ID environment variable required");
    process.exit(1);
  }

  const client = new FreshBooksClient(accessToken, accountId);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
