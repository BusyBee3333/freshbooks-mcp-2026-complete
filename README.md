# FreshBooks MCP Server

Complete Model Context Protocol server for FreshBooks with 80+ tools and 20 React apps.

## Features

### 🛠️ Comprehensive Tool Coverage (80+ tools)

- **Clients**: CRUD, search, contacts management
- **Invoices**: Full lifecycle (create, update, send, mark paid, share links, line items)
- **Estimates**: CRUD, send, accept, line items
- **Expenses**: CRUD, categories, receipts, search
- **Payments**: Record and track invoice payments
- **Projects**: CRUD, services, time tracking integration
- **Time Entries**: CRUD, timers (start/stop), bulk operations
- **Taxes**: CRUD, tax defaults
- **Items/Services**: Product and service catalog management
- **Staff**: List and manage team members
- **Bills**: Vendor bills and bill payments
- **Vendors**: Vendor management
- **Accounting**: Chart of accounts, journal entries
- **Retainers**: Recurring retainer agreements
- **Credit Notes**: Customer credits
- **Reports**: P&L, tax summary, aging, expense reports

### 🎨 MCP Apps (20 React Apps)

1. **Dashboard Overview** - Business metrics at a glance
2. **Invoice Dashboard** - Invoice list and metrics
3. **Invoice Detail** - Detailed invoice view
4. **Invoice Creator** - Create and edit invoices
5. **Client Dashboard** - Client list and overview
6. **Client Detail** - Detailed client information
7. **Expense Tracker** - Track and categorize expenses
8. **Expense Report** - Expense reporting and analysis
9. **Project Dashboard** - Active projects overview
10. **Project Detail** - Project details and time entries
11. **Time Tracker** - Log and manage time entries
12. **Time Report** - Time tracking reports
13. **Payment Dashboard** - Payment tracking
14. **Estimate Builder** - Create and send estimates
15. **Profit & Loss Report** - Financial P&L statements
16. **Tax Summary** - Tax reporting
17. **Aging Report** - Accounts receivable aging
18. **Item Catalog** - Products and services catalog
19. **Bill Manager** - Vendor bill management
20. **Staff Directory** - Team member directory

## Installation

```bash
npm install @mcpengine/freshbooks
```

## Configuration

### Environment Variables

```bash
FRESHBOOKS_ACCOUNT_ID=your_account_id
FRESHBOOKS_ACCESS_TOKEN=your_oauth_access_token
```

### OAuth2 Setup

1. Register your app at https://my.freshbooks.com/#/developer
2. Obtain OAuth2 credentials
3. Complete the OAuth2 authorization flow
4. Use the access token in your MCP server configuration

### MCP Settings (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "freshbooks": {
      "command": "npx",
      "args": ["-y", "@mcpengine/freshbooks"],
      "env": {
        "FRESHBOOKS_ACCOUNT_ID": "your_account_id",
        "FRESHBOOKS_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

## Usage Examples

### List Invoices

```typescript
// Using the MCP tool
{
  "tool": "freshbooks_list_invoices",
  "arguments": {
    "page": 1,
    "per_page": 20,
    "search": "Acme Corp"
  }
}
```

### Create an Invoice

```typescript
{
  "tool": "freshbooks_create_invoice",
  "arguments": {
    "customerid": 12345,
    "create_date": "2024-01-15",
    "due_offset_days": 30,
    "notes": "Thank you for your business!",
    "lines": [
      {
        "name": "Consulting Services",
        "description": "January 2024 consulting",
        "qty": "10",
        "unit_cost": {
          "amount": "150.00",
          "code": "USD"
        }
      }
    ]
  }
}
```

### Send an Invoice

```typescript
{
  "tool": "freshbooks_send_invoice",
  "arguments": {
    "invoice_id": 98765
  }
}
```

### Track Time

```typescript
// Start a timer
{
  "tool": "freshbooks_start_timer",
  "arguments": {
    "project_id": 456,
    "note": "Working on website redesign"
  }
}

// Stop a timer
{
  "tool": "freshbooks_stop_timer",
  "arguments": {
    "time_entry_id": 789
  }
}
```

### Generate Reports

```typescript
// Profit & Loss Report
{
  "tool": "freshbooks_profit_loss_report",
  "arguments": {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }
}

// Aging Report
{
  "tool": "freshbooks_aging_report",
  "arguments": {}
}
```

## Tool Reference

### Client Tools (6 tools)

- `freshbooks_list_clients` - List all clients
- `freshbooks_get_client` - Get client details
- `freshbooks_create_client` - Create new client
- `freshbooks_update_client` - Update client
- `freshbooks_delete_client` - Delete client
- `freshbooks_search_clients` - Search clients

### Invoice Tools (10 tools)

- `freshbooks_list_invoices` - List invoices
- `freshbooks_get_invoice` - Get invoice details
- `freshbooks_create_invoice` - Create invoice
- `freshbooks_update_invoice` - Update invoice
- `freshbooks_delete_invoice` - Delete invoice
- `freshbooks_send_invoice` - Send invoice to client
- `freshbooks_mark_invoice_paid` - Mark as paid
- `freshbooks_get_invoice_share_link` - Get shareable link
- `freshbooks_add_invoice_line` - Add line item
- `freshbooks_search_invoices` - Search invoices

### Estimate Tools (8 tools)

- `freshbooks_list_estimates` - List estimates
- `freshbooks_get_estimate` - Get estimate details
- `freshbooks_create_estimate` - Create estimate
- `freshbooks_update_estimate` - Update estimate
- `freshbooks_delete_estimate` - Delete estimate
- `freshbooks_send_estimate` - Send to client
- `freshbooks_accept_estimate` - Mark as accepted
- `freshbooks_add_estimate_line` - Add line item

### Expense Tools (7 tools)

- `freshbooks_list_expenses` - List expenses
- `freshbooks_get_expense` - Get expense details
- `freshbooks_create_expense` - Create expense
- `freshbooks_update_expense` - Update expense
- `freshbooks_delete_expense` - Delete expense
- `freshbooks_list_expense_categories` - List categories
- `freshbooks_search_expenses` - Search expenses

### Payment Tools (5 tools)

- `freshbooks_list_payments` - List payments
- `freshbooks_get_payment` - Get payment details
- `freshbooks_create_payment` - Record payment
- `freshbooks_update_payment` - Update payment
- `freshbooks_delete_payment` - Delete payment

### Project Tools (6 tools)

- `freshbooks_list_projects` - List projects
- `freshbooks_get_project` - Get project details
- `freshbooks_create_project` - Create project
- `freshbooks_update_project` - Update project
- `freshbooks_delete_project` - Delete project
- `freshbooks_mark_project_complete` - Mark complete

### Time Entry Tools (7 tools)

- `freshbooks_list_time_entries` - List time entries
- `freshbooks_get_time_entry` - Get entry details
- `freshbooks_create_time_entry` - Log time
- `freshbooks_update_time_entry` - Update entry
- `freshbooks_delete_time_entry` - Delete entry
- `freshbooks_start_timer` - Start timer
- `freshbooks_stop_timer` - Stop timer

### Tax Tools (5 tools)

- `freshbooks_list_taxes` - List taxes
- `freshbooks_get_tax` - Get tax details
- `freshbooks_create_tax` - Create tax
- `freshbooks_update_tax` - Update tax
- `freshbooks_delete_tax` - Delete tax

### Item/Service Tools (5 tools)

- `freshbooks_list_items` - List items
- `freshbooks_get_item` - Get item details
- `freshbooks_create_item` - Create item
- `freshbooks_update_item` - Update item
- `freshbooks_delete_item` - Delete item

### Staff Tools (2 tools)

- `freshbooks_list_staff` - List staff members
- `freshbooks_get_staff_member` - Get staff details

### Bill Tools (8 tools)

- `freshbooks_list_bills` - List bills
- `freshbooks_get_bill` - Get bill details
- `freshbooks_create_bill` - Create bill
- `freshbooks_update_bill` - Update bill
- `freshbooks_delete_bill` - Delete bill
- `freshbooks_get_bill_payments` - List payments
- `freshbooks_create_bill_payment` - Record payment

### Vendor Tools (5 tools)

- `freshbooks_list_vendors` - List vendors
- `freshbooks_get_vendor` - Get vendor details
- `freshbooks_create_vendor` - Create vendor
- `freshbooks_update_vendor` - Update vendor
- `freshbooks_delete_vendor` - Delete vendor

### Accounting Tools (2 tools)

- `freshbooks_list_accounts` - List chart of accounts
- `freshbooks_get_account` - Get account details

### Journal Entry Tools (3 tools)

- `freshbooks_list_journal_entries` - List entries
- `freshbooks_get_journal_entry` - Get entry details
- `freshbooks_create_journal_entry` - Create entry

### Retainer Tools (5 tools)

- `freshbooks_list_retainers` - List retainers
- `freshbooks_get_retainer` - Get retainer details
- `freshbooks_create_retainer` - Create retainer
- `freshbooks_update_retainer` - Update retainer
- `freshbooks_delete_retainer` - Delete retainer

### Credit Note Tools (5 tools)

- `freshbooks_list_credit_notes` - List credit notes
- `freshbooks_get_credit_note` - Get credit note
- `freshbooks_create_credit_note` - Create credit note
- `freshbooks_update_credit_note` - Update credit note
- `freshbooks_delete_credit_note` - Delete credit note

### Report Tools (4 tools)

- `freshbooks_profit_loss_report` - P&L report
- `freshbooks_tax_summary_report` - Tax summary
- `freshbooks_aging_report` - Accounts aging
- `freshbooks_expense_report` - Expense report

## Architecture

```
src/
├── server.ts              # MCP server setup
├── main.ts                # Entry point
├── clients/
│   └── freshbooks.ts      # FreshBooks API client (OAuth2, rate limiting)
├── tools/                 # Tool definitions (17 files)
│   ├── clients-tools.ts
│   ├── invoices-tools.ts
│   ├── estimates-tools.ts
│   ├── expenses-tools.ts
│   ├── payments-tools.ts
│   ├── projects-tools.ts
│   ├── time-entries-tools.ts
│   ├── taxes-tools.ts
│   ├── items-tools.ts
│   ├── staff-tools.ts
│   ├── bills-tools.ts
│   ├── vendors-tools.ts
│   ├── accounts-tools.ts
│   ├── journal-entries-tools.ts
│   ├── retainers-tools.ts
│   ├── credit-notes-tools.ts
│   └── reports-tools.ts
├── types/
│   └── index.ts           # TypeScript interfaces
└── ui/
    └── react-app/         # MCP Apps (20 apps)
        ├── src/
        │   ├── apps/      # Individual apps
        │   ├── components/ # Shared components
        │   ├── hooks/     # Shared hooks
        │   └── styles/    # Shared CSS
        └── package.json
```

## API Coverage

- ✅ Clients API (complete)
- ✅ Invoices API (complete)
- ✅ Estimates API (complete)
- ✅ Expenses API (complete)
- ✅ Payments API (complete)
- ✅ Projects API (complete)
- ✅ Time Tracking API (complete)
- ✅ Taxes API (complete)
- ✅ Items/Services API (complete)
- ✅ Staff API (read-only)
- ✅ Bills API (complete)
- ✅ Vendors API (complete)
- ✅ Accounting API (partial - read-only)
- ✅ Journal Entries API (create + read)
- ✅ Retainers API (complete)
- ✅ Credit Notes API (complete)
- ✅ Reports API (complete)

## Development

### Build from source

```bash
git clone https://github.com/BusyBee3333/mcpengine
cd mcpengine/servers/freshbooks
npm install
npm run build
```

### Run tests

```bash
npm test
```

### Type checking

```bash
npm run type-check
```

## License

MIT

## Support

For issues and feature requests, please visit:
https://github.com/BusyBee3333/mcpengine/issues

## Related

- [FreshBooks API Documentation](https://www.freshbooks.com/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCPEngine Repository](https://github.com/BusyBee3333/mcpengine)
