import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const retainersTools = [
  {
    name: 'freshbooks_list_retainers',
    description: 'List all retainers with pagination',
    inputSchema: {
      type: 'object',
      properties: {
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
      const result = await client.getRetainers(args);
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
    name: 'freshbooks_get_retainer',
    description: 'Get detailed information about a specific retainer',
    inputSchema: {
      type: 'object',
      properties: {
        retainer_id: {
          type: 'number',
          description: 'Retainer ID',
        },
      },
      required: ['retainer_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getRetainer(args.retainer_id);
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
    name: 'freshbooks_create_retainer',
    description: 'Create a new retainer in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: {
          type: 'number',
          description: 'Client ID',
        },
        fee: {
          type: 'string',
          description: 'Retainer fee amount',
        },
        period: {
          type: 'string',
          description: 'Retainer period (monthly, quarterly, yearly)',
        },
        start_date: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        end_date: {
          type: 'string',
          description: 'End date (YYYY-MM-DD, optional)',
        },
      },
      required: ['client_id', 'fee', 'period', 'start_date'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createRetainer(args);
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
    name: 'freshbooks_update_retainer',
    description: 'Update an existing retainer',
    inputSchema: {
      type: 'object',
      properties: {
        retainer_id: {
          type: 'number',
          description: 'Retainer ID to update',
        },
        fee: {
          type: 'string',
          description: 'Retainer fee amount',
        },
        end_date: {
          type: 'string',
          description: 'End date',
        },
        active: {
          type: 'boolean',
          description: 'Is the retainer active?',
        },
      },
      required: ['retainer_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { retainer_id, ...updates } = args;
      const result = await client.updateRetainer(retainer_id, updates);
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
    name: 'freshbooks_delete_retainer',
    description: 'Delete a retainer from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        retainer_id: {
          type: 'number',
          description: 'Retainer ID to delete',
        },
      },
      required: ['retainer_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteRetainer(args.retainer_id);
      return {
        content: [
          {
            type: 'text',
            text: `Retainer ${args.retainer_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
