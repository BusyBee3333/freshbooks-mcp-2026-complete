import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const timeEntriesTools = [
  {
    name: 'freshbooks_list_time_entries',
    description: 'List all time entries with pagination',
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
      const result = await client.getTimeEntries(args);
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
    name: 'freshbooks_get_time_entry',
    description: 'Get detailed information about a specific time entry',
    inputSchema: {
      type: 'object',
      properties: {
        time_entry_id: {
          type: 'number',
          description: 'Time entry ID',
        },
      },
      required: ['time_entry_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getTimeEntry(args.time_entry_id);
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
    name: 'freshbooks_create_time_entry',
    description: 'Create a new time entry in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID',
        },
        client_id: {
          type: 'number',
          description: 'Client ID',
        },
        duration: {
          type: 'number',
          description: 'Duration in seconds',
        },
        started_at: {
          type: 'string',
          description: 'Start time (ISO 8601)',
        },
        note: {
          type: 'string',
          description: 'Note about the time entry',
        },
        billable: {
          type: 'boolean',
          description: 'Is this time billable?',
        },
        internal: {
          type: 'boolean',
          description: 'Is this an internal time entry?',
        },
      },
      required: ['project_id', 'duration', 'started_at'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createTimeEntry(args);
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
    name: 'freshbooks_update_time_entry',
    description: 'Update an existing time entry',
    inputSchema: {
      type: 'object',
      properties: {
        time_entry_id: {
          type: 'number',
          description: 'Time entry ID to update',
        },
        duration: {
          type: 'number',
          description: 'Duration in seconds',
        },
        note: {
          type: 'string',
          description: 'Note about the time entry',
        },
        billable: {
          type: 'boolean',
          description: 'Is this time billable?',
        },
      },
      required: ['time_entry_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { time_entry_id, ...updates } = args;
      const result = await client.updateTimeEntry(time_entry_id, updates);
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
    name: 'freshbooks_delete_time_entry',
    description: 'Delete a time entry from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        time_entry_id: {
          type: 'number',
          description: 'Time entry ID to delete',
        },
      },
      required: ['time_entry_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteTimeEntry(args.time_entry_id);
      return {
        content: [
          {
            type: 'text',
            text: `Time entry ${args.time_entry_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_start_timer',
    description: 'Start a new timer for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID',
        },
        note: {
          type: 'string',
          description: 'Note about what you are working on',
        },
      },
      required: ['project_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.startTimer(args.project_id, args.note);
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
    name: 'freshbooks_stop_timer',
    description: 'Stop a running timer',
    inputSchema: {
      type: 'object',
      properties: {
        time_entry_id: {
          type: 'number',
          description: 'Time entry ID of the running timer',
        },
      },
      required: ['time_entry_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.stopTimer(args.time_entry_id);
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
