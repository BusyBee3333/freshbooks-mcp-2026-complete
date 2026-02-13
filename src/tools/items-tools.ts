import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const itemsTools = [
  {
    name: 'freshbooks_list_items',
    description: 'List all items/services with pagination',
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
      const result = await client.getItems(args);
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
    name: 'freshbooks_get_item',
    description: 'Get detailed information about a specific item/service',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: {
          type: 'number',
          description: 'Item ID',
        },
      },
      required: ['item_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getItem(args.item_id);
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
    name: 'freshbooks_create_item',
    description: 'Create a new item/service in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Item name',
        },
        description: {
          type: 'string',
          description: 'Item description',
        },
        quantity: {
          type: 'string',
          description: 'Quantity',
        },
        inventory: {
          type: 'string',
          description: 'Inventory count',
        },
        unit_cost: {
          type: 'string',
          description: 'Unit cost amount',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        sku: {
          type: 'string',
          description: 'SKU',
        },
      },
      required: ['name', 'unit_cost'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const item = {
        name: args.name,
        description: args.description || '',
        quantity: args.quantity || '1',
        inventory: args.inventory || '0',
        unit_cost: {
          amount: args.unit_cost,
          code: args.currency_code || 'USD',
        },
        sku: args.sku || '',
      };
      const result = await client.createItem(item);
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
    name: 'freshbooks_update_item',
    description: 'Update an existing item/service',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: {
          type: 'number',
          description: 'Item ID to update',
        },
        name: {
          type: 'string',
          description: 'Item name',
        },
        description: {
          type: 'string',
          description: 'Item description',
        },
        unit_cost: {
          type: 'string',
          description: 'Unit cost amount',
        },
        inventory: {
          type: 'string',
          description: 'Inventory count',
        },
      },
      required: ['item_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { item_id, unit_cost, ...updates } = args;
      if (unit_cost) {
        const item = await client.getItem(item_id);
        updates.unit_cost = {
          amount: unit_cost,
          code: item.unit_cost.code,
        };
      }
      const result = await client.updateItem(item_id, updates);
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
    name: 'freshbooks_delete_item',
    description: 'Delete an item/service from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: {
          type: 'number',
          description: 'Item ID to delete',
        },
      },
      required: ['item_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteItem(args.item_id);
      return {
        content: [
          {
            type: 'text',
            text: `Item ${args.item_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
