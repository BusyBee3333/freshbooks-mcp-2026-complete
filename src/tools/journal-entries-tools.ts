import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const journalEntriesTools = [
  {
    name: 'freshbooks_list_journal_entries',
    description: 'List all journal entries with pagination',
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
      const result = await client.getJournalEntries(args);
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
    name: 'freshbooks_get_journal_entry',
    description: 'Get detailed information about a specific journal entry',
    inputSchema: {
      type: 'object',
      properties: {
        journal_entry_id: {
          type: 'number',
          description: 'Journal entry ID',
        },
      },
      required: ['journal_entry_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getJournalEntry(args.journal_entry_id);
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
    name: 'freshbooks_create_journal_entry',
    description: 'Create a new journal entry in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Journal entry name',
        },
        description: {
          type: 'string',
          description: 'Journal entry description',
        },
        user_entered_date: {
          type: 'string',
          description: 'Entry date (YYYY-MM-DD)',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        details: {
          type: 'array',
          description: 'Journal entry details (debits and credits)',
          items: {
            type: 'object',
            properties: {
              sub_accountid: {
                type: 'number',
                description: 'Sub-account ID',
              },
              debit_amount: {
                type: 'object',
                properties: {
                  amount: {
                    type: 'string',
                    description: 'Debit amount (or null)',
                  },
                },
              },
              credit_amount: {
                type: 'object',
                properties: {
                  amount: {
                    type: 'string',
                    description: 'Credit amount (or null)',
                  },
                },
              },
              description: {
                type: 'string',
                description: 'Line description',
              },
            },
          },
        },
      },
      required: ['name', 'user_entered_date', 'details'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createJournalEntry(args);
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
