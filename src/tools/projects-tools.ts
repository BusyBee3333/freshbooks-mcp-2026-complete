import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const projectsTools = [
  {
    name: 'freshbooks_list_projects',
    description: 'List all projects with pagination',
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
      const result = await client.getProjects(args);
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
    name: 'freshbooks_get_project',
    description: 'Get detailed information about a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID',
        },
      },
      required: ['project_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getProject(args.project_id);
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
    name: 'freshbooks_create_project',
    description: 'Create a new project in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Project title',
        },
        description: {
          type: 'string',
          description: 'Project description',
        },
        client_id: {
          type: 'number',
          description: 'Client ID',
        },
        due_date: {
          type: 'string',
          description: 'Project due date (YYYY-MM-DD)',
        },
        billing_method: {
          type: 'string',
          description: 'Billing method (project_rate, service_rate, task_rate, fixed_price)',
        },
        project_type: {
          type: 'string',
          description: 'Project type (fixed_price, hourly_rate)',
        },
        budget: {
          type: 'number',
          description: 'Project budget',
        },
        fixed_price: {
          type: 'number',
          description: 'Fixed price for the project',
        },
        rate: {
          type: 'number',
          description: 'Hourly rate',
        },
        internal: {
          type: 'boolean',
          description: 'Is this an internal project?',
        },
      },
      required: ['title', 'client_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createProject(args);
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
    name: 'freshbooks_update_project',
    description: 'Update an existing project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID to update',
        },
        title: {
          type: 'string',
          description: 'Project title',
        },
        description: {
          type: 'string',
          description: 'Project description',
        },
        due_date: {
          type: 'string',
          description: 'Project due date',
        },
        active: {
          type: 'boolean',
          description: 'Is the project active?',
        },
        complete: {
          type: 'boolean',
          description: 'Is the project complete?',
        },
      },
      required: ['project_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { project_id, ...updates } = args;
      const result = await client.updateProject(project_id, updates);
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
    name: 'freshbooks_delete_project',
    description: 'Delete a project from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID to delete',
        },
      },
      required: ['project_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteProject(args.project_id);
      return {
        content: [
          {
            type: 'text',
            text: `Project ${args.project_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_mark_project_complete',
    description: 'Mark a project as complete',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'number',
          description: 'Project ID',
        },
      },
      required: ['project_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.updateProject(args.project_id, { complete: true });
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
