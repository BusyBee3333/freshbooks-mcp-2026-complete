import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const taxesTools = [
  {
    name: 'freshbooks_list_taxes',
    description: 'List all taxes in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getTaxes();
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
    name: 'freshbooks_get_tax',
    description: 'Get detailed information about a specific tax',
    inputSchema: {
      type: 'object',
      properties: {
        tax_id: {
          type: 'number',
          description: 'Tax ID',
        },
      },
      required: ['tax_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getTax(args.tax_id);
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
    name: 'freshbooks_create_tax',
    description: 'Create a new tax in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Tax name (e.g., GST, VAT, Sales Tax)',
        },
        amount: {
          type: 'string',
          description: 'Tax rate as a percentage (e.g., 5, 13.5)',
        },
        number: {
          type: 'string',
          description: 'Tax number/ID (optional)',
        },
        compound: {
          type: 'boolean',
          description: 'Is this a compound tax?',
        },
      },
      required: ['name', 'amount'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createTax(args);
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
    name: 'freshbooks_update_tax',
    description: 'Update an existing tax',
    inputSchema: {
      type: 'object',
      properties: {
        tax_id: {
          type: 'number',
          description: 'Tax ID to update',
        },
        name: {
          type: 'string',
          description: 'Tax name',
        },
        amount: {
          type: 'string',
          description: 'Tax rate as a percentage',
        },
        number: {
          type: 'string',
          description: 'Tax number/ID',
        },
      },
      required: ['tax_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { tax_id, ...updates } = args;
      const result = await client.updateTax(tax_id, updates);
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
    name: 'freshbooks_delete_tax',
    description: 'Delete a tax from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        tax_id: {
          type: 'number',
          description: 'Tax ID to delete',
        },
      },
      required: ['tax_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteTax(args.tax_id);
      return {
        content: [
          {
            type: 'text',
            text: `Tax ${args.tax_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
