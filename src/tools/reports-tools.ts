import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const reportsTools = [
  {
    name: 'freshbooks_profit_loss_report',
    description: 'Generate a profit and loss report for a date range',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        end_date: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
      required: ['start_date', 'end_date'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getProfitLossReport(args.start_date, args.end_date);
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
    name: 'freshbooks_tax_summary_report',
    description: 'Generate a tax summary report for a date range',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        end_date: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
      required: ['start_date', 'end_date'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getTaxSummaryReport(args.start_date, args.end_date);
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
    name: 'freshbooks_aging_report',
    description: 'Generate an accounts aging report showing outstanding balances',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getAgingReport();
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
    name: 'freshbooks_expense_report',
    description: 'Generate an expense report for a date range',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        end_date: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
      required: ['start_date', 'end_date'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getExpenseReport(args.start_date, args.end_date);
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
