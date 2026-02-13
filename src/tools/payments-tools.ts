import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const paymentsTools = [
  {
    name: 'freshbooks_list_payments',
    description: 'List all payments with pagination',
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
      const result = await client.getPayments(args);
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
    name: 'freshbooks_get_payment',
    description: 'Get detailed information about a specific payment',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'number',
          description: 'Payment ID',
        },
      },
      required: ['payment_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getPayment(args.payment_id);
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
    name: 'freshbooks_create_payment',
    description: 'Record a new payment in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceid: {
          type: 'number',
          description: 'Invoice ID this payment is for',
        },
        amount: {
          type: 'string',
          description: 'Payment amount',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        date: {
          type: 'string',
          description: 'Payment date (YYYY-MM-DD)',
        },
        type: {
          type: 'string',
          description: 'Payment type (e.g., Cash, Check, Credit Card)',
        },
        note: {
          type: 'string',
          description: 'Payment note',
        },
        gateway: {
          type: 'string',
          description: 'Payment gateway name',
        },
      },
      required: ['invoiceid', 'amount', 'date', 'type'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const payment = {
        invoiceid: args.invoiceid,
        amount: {
          amount: args.amount,
          code: args.currency_code || 'USD',
        },
        date: args.date,
        type: args.type,
        note: args.note,
        gateway: args.gateway,
      };
      const result = await client.createPayment(payment);
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
    name: 'freshbooks_update_payment',
    description: 'Update an existing payment',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'number',
          description: 'Payment ID to update',
        },
        amount: {
          type: 'string',
          description: 'Payment amount',
        },
        date: {
          type: 'string',
          description: 'Payment date',
        },
        note: {
          type: 'string',
          description: 'Payment note',
        },
      },
      required: ['payment_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { payment_id, amount, ...updates } = args;
      if (amount) {
        const payment = await client.getPayment(payment_id);
        updates.amount = {
          amount,
          code: payment.amount.code,
        };
      }
      const result = await client.updatePayment(payment_id, updates);
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
    name: 'freshbooks_delete_payment',
    description: 'Delete a payment from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'number',
          description: 'Payment ID to delete',
        },
      },
      required: ['payment_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deletePayment(args.payment_id);
      return {
        content: [
          {
            type: 'text',
            text: `Payment ${args.payment_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
