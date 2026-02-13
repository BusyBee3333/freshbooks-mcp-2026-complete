import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const billsTools = [
  {
    name: 'freshbooks_list_bills',
    description: 'List all bills with pagination',
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
      const result = await client.getBills(args);
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
    name: 'freshbooks_get_bill',
    description: 'Get detailed information about a specific bill',
    inputSchema: {
      type: 'object',
      properties: {
        bill_id: {
          type: 'number',
          description: 'Bill ID',
        },
      },
      required: ['bill_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getBill(args.bill_id);
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
    name: 'freshbooks_create_bill',
    description: 'Create a new bill in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: {
          type: 'number',
          description: 'Vendor ID',
        },
        bill_number: {
          type: 'string',
          description: 'Bill number',
        },
        issue_date: {
          type: 'string',
          description: 'Issue date (YYYY-MM-DD)',
        },
        due_date: {
          type: 'string',
          description: 'Due date (YYYY-MM-DD)',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        lines: {
          type: 'array',
          description: 'Bill line items',
          items: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Line item description',
              },
              quantity: {
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
              category_id: {
                type: 'number',
                description: 'Expense category ID',
              },
            },
          },
        },
      },
      required: ['vendor_id', 'issue_date'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createBill(args);
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
    name: 'freshbooks_update_bill',
    description: 'Update an existing bill',
    inputSchema: {
      type: 'object',
      properties: {
        bill_id: {
          type: 'number',
          description: 'Bill ID to update',
        },
        due_date: {
          type: 'string',
          description: 'Due date',
        },
        lines: {
          type: 'array',
          description: 'Bill line items',
        },
      },
      required: ['bill_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { bill_id, ...updates } = args;
      const result = await client.updateBill(bill_id, updates);
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
    name: 'freshbooks_delete_bill',
    description: 'Delete a bill from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        bill_id: {
          type: 'number',
          description: 'Bill ID to delete',
        },
      },
      required: ['bill_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteBill(args.bill_id);
      return {
        content: [
          {
            type: 'text',
            text: `Bill ${args.bill_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_get_bill_payments',
    description: 'Get all payments for a specific bill',
    inputSchema: {
      type: 'object',
      properties: {
        bill_id: {
          type: 'number',
          description: 'Bill ID',
        },
      },
      required: ['bill_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getBillPayments(args.bill_id);
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
    name: 'freshbooks_create_bill_payment',
    description: 'Create a payment for a bill',
    inputSchema: {
      type: 'object',
      properties: {
        bill_id: {
          type: 'number',
          description: 'Bill ID',
        },
        amount: {
          type: 'string',
          description: 'Payment amount',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        paid_date: {
          type: 'string',
          description: 'Payment date (YYYY-MM-DD)',
        },
        payment_type: {
          type: 'string',
          description: 'Payment type (e.g., Check, Cash, Credit Card)',
        },
        note: {
          type: 'string',
          description: 'Payment note',
        },
      },
      required: ['bill_id', 'amount', 'paid_date', 'payment_type'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { bill_id, amount, currency_code, ...payment } = args;
      const paymentData = {
        ...payment,
        amount: {
          amount,
          code: currency_code || 'USD',
        },
      };
      const result = await client.createBillPayment(bill_id, paymentData);
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
