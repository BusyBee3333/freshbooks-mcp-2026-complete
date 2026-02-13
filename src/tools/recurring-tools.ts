import { z } from 'zod';
import type { FreshBooksAPIClient } from '../clients/freshbooks.js';
import type { RecurringProfile } from '../types/index.js';

export const recurringTools = [
  {
    name: 'freshbooks_list_recurring_profiles',
    description: 'List all recurring invoice profiles',
    inputSchema: z.object({
      clientid: z.number().optional().describe('Filter by client ID'),
      page: z.number().default(1),
      per_page: z.number().default(30),
    }),
    handler: async (args: any, client: FreshBooksAPIClient) => {
      const params: Record<string, any> = {};
      if (args.clientid) params.clientid = args.clientid;

      const response = await client.getPaginated<any>(
        '/invoices/recurring',
        args.page,
        args.per_page,
        params
      );
      return {
        recurring: response.result?.recurring || response.recurring || [],
        page: response.page || args.page,
        pages: response.pages || 1,
        total: response.total || 0,
      };
    },
  },

  {
    name: 'freshbooks_get_recurring_profile',
    description: 'Get a single recurring profile by ID',
    inputSchema: z.object({
      recurring_id: z.number().describe('Recurring profile ID'),
    }),
    handler: async (args: any, client: FreshBooksAPIClient) => {
      const response = await client.get<any>(
        `/invoices/recurring/${args.recurring_id}`
      );
      return response.result?.recurring || response.recurring;
    },
  },

  {
    name: 'freshbooks_create_recurring_profile',
    description: 'Create a new recurring invoice profile',
    inputSchema: z.object({
      clientid: z.number().describe('Client ID'),
      frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']).describe('Billing frequency'),
      numberRecurring: z.number().optional().describe('Number of times to recur (0 = indefinite)'),
      lines: z.array(z.object({
        name: z.string().describe('Line item name'),
        description: z.string().optional(),
        qty: z.number().default(1),
        unit_cost: z.string().describe('Unit cost'),
      })).describe('Invoice line items'),
      currency_code: z.string().default('USD'),
      notes: z.string().optional(),
      terms: z.string().optional(),
    }),
    handler: async (args: any, client: FreshBooksAPIClient) => {
      const lines = args.lines.map((line: any) => ({
        ...line,
        unit_cost: { amount: line.unit_cost, code: args.currency_code },
      }));

      const recurringData = {
        recurring: {
          clientid: args.clientid,
          frequency: args.frequency,
          numberRecurring: args.numberRecurring || 0,
          create_date: new Date().toISOString().split('T')[0],
          currency_code: args.currency_code,
          lines,
          notes: args.notes,
          terms: args.terms,
        },
      };

      const response = await client.post<any>(
        '/invoices/recurring',
        recurringData
      );
      return response.result?.recurring || response.recurring;
    },
  },

  {
    name: 'freshbooks_update_recurring_profile',
    description: 'Update an existing recurring profile',
    inputSchema: z.object({
      recurring_id: z.number().describe('Recurring profile ID'),
      frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']).optional(),
      numberRecurring: z.number().optional(),
      lines: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        qty: z.number(),
        unit_cost: z.string(),
      })).optional(),
      notes: z.string().optional(),
      terms: z.string().optional(),
    }),
    handler: async (args: any, client: FreshBooksAPIClient) => {
      const { recurring_id, ...updateFields } = args;
      
      if (updateFields.lines) {
        updateFields.lines = updateFields.lines.map((line: any) => ({
          ...line,
          unit_cost: { amount: line.unit_cost, code: 'USD' },
        }));
      }

      const recurringData = { recurring: updateFields };
      const response = await client.put<any>(
        `/invoices/recurring/${recurring_id}`,
        recurringData
      );
      return response.result?.recurring || response.recurring;
    },
  },

  {
    name: 'freshbooks_delete_recurring_profile',
    description: 'Delete a recurring profile',
    inputSchema: z.object({
      recurring_id: z.number().describe('Recurring profile ID'),
    }),
    handler: async (args: any, client: FreshBooksAPIClient) => {
      await client.put(
        `/invoices/recurring/${args.recurring_id}`,
        { recurring: { vis_state: 1 } }
      );
      return { success: true, message: `Recurring profile ${args.recurring_id} deleted` };
    },
  },
];
