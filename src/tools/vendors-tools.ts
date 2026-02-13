import type { FreshBooksAPIClient } from '../clients/freshbooks.js';

export const vendorsTools = [
  {
    name: 'freshbooks_list_vendors',
    description: 'List all bill vendors with pagination',
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
      const result = await client.getVendors(args);
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
    name: 'freshbooks_get_vendor',
    description: 'Get detailed information about a specific vendor',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: {
          type: 'number',
          description: 'Vendor ID',
        },
      },
      required: ['vendor_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.getVendor(args.vendor_id);
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
    name: 'freshbooks_create_vendor',
    description: 'Create a new vendor in FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_name: {
          type: 'string',
          description: 'Vendor name',
        },
        primary_contact_first_name: {
          type: 'string',
          description: 'Primary contact first name',
        },
        primary_contact_last_name: {
          type: 'string',
          description: 'Primary contact last name',
        },
        primary_contact_email: {
          type: 'string',
          description: 'Primary contact email',
        },
        phone: {
          type: 'string',
          description: 'Phone number',
        },
        website: {
          type: 'string',
          description: 'Website URL',
        },
        street: {
          type: 'string',
          description: 'Street address',
        },
        city: {
          type: 'string',
          description: 'City',
        },
        province: {
          type: 'string',
          description: 'Province/state',
        },
        postal_code: {
          type: 'string',
          description: 'Postal code',
        },
        country: {
          type: 'string',
          description: 'Country',
        },
        currency_code: {
          type: 'string',
          description: 'Currency code (e.g., USD)',
        },
        is_1099: {
          type: 'boolean',
          description: 'Is this vendor subject to 1099 reporting?',
        },
      },
      required: ['vendor_name', 'primary_contact_email'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const result = await client.createVendor(args);
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
    name: 'freshbooks_update_vendor',
    description: 'Update an existing vendor',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: {
          type: 'number',
          description: 'Vendor ID to update',
        },
        vendor_name: {
          type: 'string',
          description: 'Vendor name',
        },
        primary_contact_email: {
          type: 'string',
          description: 'Primary contact email',
        },
        phone: {
          type: 'string',
          description: 'Phone number',
        },
        street: {
          type: 'string',
          description: 'Street address',
        },
        city: {
          type: 'string',
          description: 'City',
        },
      },
      required: ['vendor_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      const { vendor_id, ...updates } = args;
      const result = await client.updateVendor(vendor_id, updates);
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
    name: 'freshbooks_delete_vendor',
    description: 'Delete a vendor from FreshBooks',
    inputSchema: {
      type: 'object',
      properties: {
        vendor_id: {
          type: 'number',
          description: 'Vendor ID to delete',
        },
      },
      required: ['vendor_id'],
    },
    handler: async (client: FreshBooksAPIClient, args: any) => {
      await client.deleteVendor(args.vendor_id);
      return {
        content: [
          {
            type: 'text',
            text: `Vendor ${args.vendor_id} deleted successfully`,
          },
        ],
      };
    },
  },
];
