import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const clientsTools = [
  {
    name: 'freshbooks_list_clients',
    description: 'List all clients in FreshBooks with optional search and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter clients',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (default: 30)',
        },
      },
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getClients(args);
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
    name: 'freshbooks_get_client',
    description: 'Get detailed information about a specific client',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: {
          type: 'number',
          description: 'Client ID',
        },
      },
      required: ['client_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getClient(args.client_id);
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
    name: 'freshbooks_create_client',
    description: 'Create a new client in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        fname: {
          type: 'string',
          description: 'First name',
        },
        lname: {
          type: 'string',
          description: 'Last name',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        organization: {
          type: 'string',
          description: 'Company/organization name',
        },
        business_phone: {
          type: 'string',
          description: 'Business phone number',
        },
        mobile_phone: {
          type: 'string',
          description: 'Mobile phone number',
        },
        home_phone: {
          type: 'string',
          description: 'Home phone number',
        },
        fax: {
          type: 'string',
          description: 'Fax number',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD, CAD, GBP)',
        },
        language: {
          type: 'string',
          description: 'Language code (e.g., en, fr)',
        },
        note: {
          type: 'string',
          description: 'Internal note about the client',
        },
        vat_name: {
          type: 'string',
          description: 'VAT name',
        },
        vat_number: {
          type: 'string',
          description: 'VAT number',
        },
        s_street: {
          type: 'string',
          description: 'Shipping address street',
        },
        s_street2: {
          type: 'string',
          description: 'Shipping address street line 2',
        },
        s_city: {
          type: 'string',
          description: 'Shipping address city',
        },
        s_province: {
          type: 'string',
          description: 'Shipping address province/state',
        },
        s_code: {
          type: 'string',
          description: 'Shipping address postal code',
        },
        s_country: {
          type: 'string',
          description: 'Shipping address country',
        },
        p_street: {
          type: 'string',
          description: 'Billing address street',
        },
        p_street2: {
          type: 'string',
          description: 'Billing address street line 2',
        },
        p_city: {
          type: 'string',
          description: 'Billing address city',
        },
        p_province: {
          type: 'string',
          description: 'Billing address province/state',
        },
        p_code: {
          type: 'string',
          description: 'Billing address postal code',
        },
        p_country: {
          type: 'string',
          description: 'Billing address country',
        },
      },
      required: ['email'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createClient(args);
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
    name: 'freshbooks_update_client',
    description: 'Update an existing client',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: {
          type: 'number',
          description: 'Client ID to update',
        },
        fname: {
          type: 'string',
          description: 'First name',
        },
        lname: {
          type: 'string',
          description: 'Last name',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        organization: {
          type: 'string',
          description: 'Company/organization name',
        },
        business_phone: {
          type: 'string',
          description: 'Business phone number',
        },
        mobile_phone: {
          type: 'string',
          description: 'Mobile phone number',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code',
        },
        language: {
          type: 'string',
          description: 'Language code',
        },
        note: {
          type: 'string',
          description: 'Internal note',
        },
        s_street: {
          type: 'string',
          description: 'Shipping address street',
        },
        s_city: {
          type: 'string',
          description: 'Shipping address city',
        },
        s_province: {
          type: 'string',
          description: 'Shipping address province/state',
        },
        s_code: {
          type: 'string',
          description: 'Shipping address postal code',
        },
        s_country: {
          type: 'string',
          description: 'Shipping address country',
        },
      },
      required: ['client_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { client_id, ...updates } = args;
      const result = await client.updateClient(client_id, updates);
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
    name: 'freshbooks_delete_client',
    description: 'Delete a client from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: {
          type: 'number',
          description: 'Client ID to delete',
        },
      },
      required: ['client_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteClient(args.client_id);
      return {
        content: [
          {
            type: 'text',
            text: `Client ${args.client_id} deleted successfully`,
          },
        ],
      };
    },
  },
  {
    name: 'freshbooks_search_clients',
    description: 'Search for clients by name, email, or organization',
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
      const result = await client.getClients({ search: args.query });
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
