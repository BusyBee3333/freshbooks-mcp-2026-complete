import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const estimatesTools = [
  {
    name: 'freshbooks_list_estimates',
    description: 'List all estimates with optional search and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter estimates',
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
      const result = await client.getEstimates(args);
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
    name: 'freshbooks_get_estimate',
    description: 'Get detailed information about a specific estimate',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID',
        },
      },
      required: ['estimate_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getEstimate(args.estimate_id);
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
    name: 'freshbooks_create_estimate',
    description: 'Create a new estimate in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        customerid: {
          type: 'number',
          description: 'Client ID for this estimate',
        },
        create_date: {
          type: 'string',
          description: 'Estimate creation date (YYYY-MM-DD)',
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
          description: 'Estimate notes',
        },
        terms: {
          type: 'string',
          description: 'Estimate terms',
        },
        discount_value: {
          type: 'string',
          description: 'Discount value',
        },
        lines: {
          type: 'array',
          description: 'Estimate line items',
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
            },
          },
        },
      },
      required: ['customerid'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createEstimate(args);
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
    name: 'freshbooks_update_estimate',
    description: 'Update an existing estimate',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID to update',
        },
        notes: {
          type: 'string',
          description: 'Estimate notes',
        },
        terms: {
          type: 'string',
          description: 'Estimate terms',
        },
        lines: {
          type: 'array',
          description: 'Estimate line items',
        },
      },
      required: ['estimate_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { estimate_id, ...updates } = args;
      const result = await client.updateEstimate(estimate_id, updates);
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
    name: 'freshbooks_delete_estimate',
    description: 'Delete an estimate from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID to delete',
        },
      },
      required: ['estimate_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteEstimate(args.estimate_id);
      return {
        content: [
          {
            type: 'text',
            text: `Estimate ${args.estimate_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_send_estimate',
    description: 'Send an estimate to the client via email',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID to send',
        },
        email: {
          type: 'string',
          description: 'Email address to send to (optional)',
        },
      },
      required: ['estimate_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.sendEstimate(args.estimate_id, args.email);
      return {
        content: [
          {
            type: 'text',
            text: `Estimate ${args.estimate_id} sent successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_accept_estimate',
    description: 'Mark an estimate as accepted',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID to accept',
        },
      },
      required: ['estimate_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.acceptEstimate(args.estimate_id);
      return {
        content: [
          {
            type: 'text',
            text: `Estimate ${args.estimate_id} accepted`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_add_estimate_line',
    description: 'Add a line item to an existing estimate',
    inputSchema: {
      type: 'object',
      properties: {
        estimate_id: {
          type: 'number',
          description: 'Estimate ID',
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
      required: ['estimate_id', 'name', 'qty', 'unit_cost'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const estimate = await client.getEstimate(args.estimate_id);
      const newLine = {
        name: args.name,
        description: args.description || '',
        qty: args.qty,
        unit_cost: {
          amount: args.unit_cost,
          code: args.currency_code || estimate.currency_code,
        },
      };
      const lines = [...estimate.lines, newLine];
      const result = await client.updateEstimate(args.estimate_id, { lines });
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
