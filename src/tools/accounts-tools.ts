import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const accountsTools = [
  {
    name: 'freshbooks_list_accounts',
    description: 'List all accounting accounts (chart of accounts)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getAccounts();
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
    name: 'freshbooks_get_account',
    description: 'Get detailed information about a specific accounting account',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'number',
          description: 'Account ID',
        },
      },
      required: ['account_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getAccount(args.account_id);
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
