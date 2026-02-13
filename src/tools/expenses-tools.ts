import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const expensesTools = [
  {
    name: 'freshbooks_list_expenses',
    description: 'List all expenses with optional search and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter expenses',
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
      const result = await client.getExpenses(args);
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
    name: 'freshbooks_get_expense',
    description: 'Get detailed information about a specific expense',
    inputSchema: {
      type: 'object',
      properties: {
        expense_id: {
          type: 'number',
          description: 'Expense ID',
        },
      },
      required: ['expense_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getExpense(args.expense_id);
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
    name: 'freshbooks_create_expense',
    description: 'Create a new expense in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        amount: {
          type: 'string',
          description: 'Expense amount',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        vendor: {
          type: 'string',
          description: 'Vendor name',
        },
        date: {
          type: 'string',
          description: 'Expense date (YYYY-MM-DD)',
        },
        categoryid: {
          type: 'number',
          description: 'Expense category ID',
        },
        clientid: {
          type: 'number',
          description: 'Client ID (optional)',
        },
        projectid: {
          type: 'number',
          description: 'Project ID (optional)',
        },
        notes: {
          type: 'string',
          description: 'Expense notes',
        },
        markup_percent: {
          type: 'string',
          description: 'Markup percentage for billable expenses',
        },
      },
      required: ['amount', 'vendor', 'date', 'categoryid'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const expense = {
        amount: {
          amount: args.amount,
          code: args.currency_code || 'USD',
        },
        vendor: args.vendor,
        date: args.date,
        categoryid: args.categoryid,
        clientid: args.clientid,
        projectid: args.projectid,
        notes: args.notes,
        markup_percent: args.markup_percent,
      };
      const result = await client.createExpense(expense);
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
    name: 'freshbooks_update_expense',
    description: 'Update an existing expense',
    inputSchema: {
      type: 'object',
      properties: {
        expense_id: {
          type: 'number',
          description: 'Expense ID to update',
        },
        amount: {
          type: 'string',
          description: 'Expense amount',
        },
        vendor: {
          type: 'string',
          description: 'Vendor name',
        },
        date: {
          type: 'string',
          description: 'Expense date',
        },
        notes: {
          type: 'string',
          description: 'Expense notes',
        },
      },
      required: ['expense_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { expense_id, amount, ...updates } = args;
      if (amount) {
        const expense = await client.getExpense(expense_id);
        updates.amount = {
          amount,
          code: expense.amount.code,
        };
      }
      const result = await client.updateExpense(expense_id, updates);
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
    name: 'freshbooks_delete_expense',
    description: 'Delete an expense from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        expense_id: {
          type: 'number',
          description: 'Expense ID to delete',
        },
      },
      required: ['expense_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteExpense(args.expense_id);
      return {
        content: [
          {
            type: 'text',
            text: `Expense ${args.expense_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_list_expense_categories',
    description: 'List all expense categories',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getExpenseCategories();
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
    name: 'freshbooks_search_expenses',
    description: 'Search for expenses by vendor, category, or notes',
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
      const result = await client.getExpenses({ search: args.query });
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
