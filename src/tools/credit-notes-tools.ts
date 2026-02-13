import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const creditNotesTools = [
  {
    name: 'freshbooks_list_credit_notes',
    description: 'List all credit notes with pagination',
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
      const result = await client.getCreditNotes(args);
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
    name: 'freshbooks_get_credit_note',
    description: 'Get detailed information about a specific credit note',
    inputSchema: {
      type: 'object',
      properties: {
        credit_note_id: {
          type: 'number',
          description: 'Credit note ID',
        },
      },
      required: ['credit_note_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getCreditNote(args.credit_note_id);
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
    name: 'freshbooks_create_credit_note',
    description: 'Create a new credit note in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        clientid: {
          type: 'number',
          description: 'Client ID',
        },
        create_date: {
          type: 'string',
          description: 'Creation date (YYYY-MM-DD)',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        credit_type: {
          type: 'string',
          description: 'Credit type (goodwill, prepayment, etc.)',
        },
        notes: {
          type: 'string',
          description: 'Credit note notes',
        },
        lines: {
          type: 'array',
          description: 'Credit note line items',
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
                },
              },
            },
          },
        },
      },
      required: ['clientid'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createCreditNote(args);
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
    name: 'freshbooks_update_credit_note',
    description: 'Update an existing credit note',
    inputSchema: {
      type: 'object',
      properties: {
        credit_note_id: {
          type: 'number',
          description: 'Credit note ID to update',
        },
        notes: {
          type: 'string',
          description: 'Credit note notes',
        },
        lines: {
          type: 'array',
          description: 'Credit note line items',
        },
      },
      required: ['credit_note_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { credit_note_id, ...updates } = args;
      const result = await client.updateCreditNote(credit_note_id, updates);
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
    name: 'freshbooks_delete_credit_note',
    description: 'Delete a credit note from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        credit_note_id: {
          type: 'number',
          description: 'Credit note ID to delete',
        },
      },
      required: ['credit_note_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteCreditNote(args.credit_note_id);
      return {
        content: [
          {
            type: 'text',
            text: `Credit note ${args.credit_note_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
