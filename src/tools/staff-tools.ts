import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const staffTools = [
  {
    name: 'freshbooks_list_staff',
    description: 'List all staff members with pagination',
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
      const result = await client.getStaff(args);
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
    name: 'freshbooks_get_staff_member',
    description: 'Get detailed information about a specific staff member',
    inputSchema: {
      type: 'object',
      properties: {
        staff_id: {
          type: 'number',
          description: 'Staff member ID',
        },
      },
      required: ['staff_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getStaffMember(args.staff_id);
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
