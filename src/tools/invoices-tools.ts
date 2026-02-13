import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const invoicesTools = [
  {
    name: 'freshbooks_list_invoices',
    description: 'List all invoices with optional search and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter invoices',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
      },
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getInvoices(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_get_invoice',
    description: 'Get detailed information about a specific invoice',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getInvoice(args.invoice_id);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_create_invoice',
    description: 'Create a new invoice in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        customerid: {
          type: 'number',
          description: 'Client ID for this invoice',
        },
        create_date: {
          type: 'string',
          description: 'Invoice creation date (YYYY-MM-DD)',
        },
        due_offset_days: {
          type: 'number',
          description: 'Number of days until invoice is due',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD, CAD)',
        },
        language: {
          type: 'string',
          description: 'Language code (e.g., en)',
        },
        notes: {
          type: 'string',
          description: 'Invoice notes',
        },
        terms: {
          type: 'string',
          description: 'Invoice terms',
        },
        po_number: {
          type: 'string',
          description: 'Purchase order number',
        },
        discount_value: {
          type: 'string',
          description: 'Discount value as percentage or amount',
        },
        discount_description: {
          type: 'string',
          description: 'Description of discount',
        },
        lines: {
          type: 'array',
          description: 'Invoice line items',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Line item name',
              },
              description: {
                type: 'string',
                description: 'Line item description',
              },
              qty: {
                type: 'string',
                description: 'Quantity',
              },
              unit_cost: {
                type: 'object',
                properties: {
                  amount: {
                    type: 'string',
                    description: 'Unit cost amount',
                  },
                  code: {
                    type: 'string',
                    description: 'Currency code',
                  },
                },
              },
              taxName1: {
                type: 'string',
                description: 'First tax name',
              },
              taxAmount1: {
                type: 'string',
                description: 'First tax amount',
              },
            },
          },
        },
      },
      required: ['customerid'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createInvoice(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_update_invoice',
    description: 'Update an existing invoice',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID to update',
        },
        customerid: {
          type: 'number',
          description: 'Client ID',
        },
        notes: {
          type: 'string',
          description: 'Invoice notes',
        },
        terms: {
          type: 'string',
          description: 'Invoice terms',
        },
        po_number: {
          type: 'string',
          description: 'Purchase order number',
        },
        discount_value: {
          type: 'string',
          description: 'Discount value',
        },
        lines: {
          type: 'array',
          description: 'Invoice line items',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { invoice_id, ...updates } = args;
      const result = await client.updateInvoice(invoice_id, updates);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_delete_invoice',
    description: 'Delete an invoice from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID to delete',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteInvoice(args.invoice_id);
      return {
        content: [
          {
            type: 'text',
            text: `Invoice ${args.invoice_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_send_invoice',
    description: 'Send an invoice to the client via email',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID to send',
        },
        email: {
          type: 'string',
          description: 'Email address to send to (optional, uses client email if not provided)',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.sendInvoice(args.invoice_id, args.email);
      return {
        content: [
          {
            type: 'text',
            text: `Invoice ${args.invoice_id} sent successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_mark_invoice_paid',
    description: 'Mark an invoice as paid',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID to mark as paid',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.markInvoicePaid(args.invoice_id);
      return {
        content: [
          {
            type: 'text',
            text: `Invoice ${args.invoice_id} marked as paid`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_get_invoice_share_link',
    description: 'Get the shareable link for an invoice',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID',
        },
      },
      required: ['invoice_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const link = await client.getInvoiceShareLink(args.invoice_id);
      return {
        content: [
          {
            type: 'text',
            text: link,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_add_invoice_line',
    description: 'Add a line item to an existing invoice',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_id: {
          type: 'number',
          description: 'Invoice ID',
        },
        name: {
          type: 'string',
          description: 'Line item name',
        },
        description: {
          type: 'string',
          description: 'Line item description',
        },
        qty: {
          type: 'string',
          description: 'Quantity',
        },
        unit_cost: {
          type: 'string',
          description: 'Unit cost amount',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
      },
      required: ['invoice_id', 'name', 'qty', 'unit_cost'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const invoice = await client.getInvoice(args.invoice_id);
      const newLine = {
        name: args.name,
        description: args.description || '',
        qty: args.qty,
        unit_cost: {
          amount: args.unit_cost,
          code: args.currency_code || invoice.currency_code,
        },
      };
      const lines = [...invoice.lines, newLine];
      const result = await client.updateInvoice(args.invoice_id, { lines });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_search_invoices',
    description: 'Search for invoices by various criteria',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getInvoices({ search: args.query });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
];
