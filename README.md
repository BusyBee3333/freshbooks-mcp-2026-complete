> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/freshbooks)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 💰 FreshBooks MCP Server — AI-Native Accounting Automation

## 💡 What This Unlocks

**Turn your AI into a certified accountant.** This MCP server gives Claude direct access to your FreshBooks accounting system—no clicking, no copy-paste, just natural language commands that create invoices, track expenses, and manage clients.

### 🎯 FreshBooks-Native Power Moves

Real accounting workflows you can automate with plain English:

1. **End-of-month invoicing blitz**  
   *"Pull all unbilled time entries from March, group by client, create draft invoices with standard payment terms, and email me the summary."*  
   → AI generates 20 invoices in 30 seconds vs. 2 hours manual work.

2. **Overdue payment chase**  
   *"Show me all invoices 30+ days overdue, send reminder emails with escalating urgency based on amount owed."*  
   → Automated collections without the awkward manual follow-ups.

3. **Expense categorization sprint**  
   *"List all uncategorized expenses from Q1, match to project codes based on description keywords, flag anomalies for review."*  
   → Clean books in minutes instead of hours of manual data entry.

4. **Client onboarding pipeline**  
   *"Create new client records for these 5 companies with addresses, set currency to CAD, generate welcome invoices with 15-day terms, attach our standard contract PDF."*  
   → Bulk onboarding that used to take half a day, done in one prompt.

5. **Financial intelligence extraction**  
   *"Analyze payment patterns for top 10 clients—average days to pay, total revenue YTD, flag any late payers and suggest credit limit adjustments."*  
   → Strategic insights from raw transactional data without spreadsheets.

### 🔗 The Real Power: Combining Tools

Claude chains FreshBooks operations into complete workflows:

- `list_invoices` (overdue) → `send_invoice` (reminders) → `list_payments` (track results)
- `list_expenses` → filter & categorize → `create_invoice` (bill clients for reimbursable costs)
- `create_client` → `create_invoice` → `send_invoice` → monitor payment

## 📦 What's Inside

**8 API tools** covering core FreshBooks accounting workflows:

| Tool | Purpose |
|------|---------|
| `list_invoices` | Query invoices with filters (status, date range, client) |
| `get_invoice` | Full invoice details including line items & payment history |
| `create_invoice` | Generate invoices with line items, terms, notes |
| `send_invoice` | Email invoices to clients with custom messaging |
| `list_clients` | Browse client directory with pagination |
| `create_client` | Add new clients with full contact & billing details |
| `list_expenses` | Review expense records with filtering |
| `list_payments` | Track received payments and outstanding balances |

All with proper error handling, automatic OAuth refresh, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/FreshBooks-MCP-2026-Complete.git
   cd freshbooks-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your FreshBooks API credentials:**
   - Go to [FreshBooks Developer Portal](https://www.freshbooks.com/api/start)
   - Create an OAuth app (or use existing)
   - Generate access token for your account
   - Note your Account ID from Settings → Account Settings

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "freshbooks": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/freshbooks-mcp-2026-complete/dist/index.js"],
         "env": {
           "FRESHBOOKS_ACCESS_TOKEN": "your-oauth-access-token",
           "FRESHBOOKS_ACCOUNT_ID": "your-account-id"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**  
   You'll see the 🔌 icon with FreshBooks tools available.

### Option 2: Docker

```bash
docker build -t freshbooks-mcp .
docker run \
  -e FRESHBOOKS_ACCESS_TOKEN=your-token \
  -e FRESHBOOKS_ACCOUNT_ID=your-account-id \
  freshbooks-mcp
```

## 🔐 Authentication

FreshBooks uses **OAuth 2.0** for API access:

1. **Create an OAuth app** at [FreshBooks Developer Portal](https://www.freshbooks.com/api/authentication)
2. **Authorize the app** to access your account (generates access token & refresh token)
3. **Use access token** in environment variable (this MCP server handles token refresh automatically)

**Required scopes:** `admin:all:legacy` (for full accounting access) or specific scopes like `accounting:invoice`, `accounting:client`, `accounting:expense`.

**Token lifespan:** Access tokens expire after 30 days; refresh tokens are valid for 30 days after last use.

## 🎯 Example Prompts

Once connected to Claude, use natural language for accounting tasks:

### Invoicing
- *"Create an invoice for client ID 12345 dated today, due in 30 days, with 3 line items: Web Design $2000, SEO Consulting $1500, Monthly Hosting $99. Add note about early payment discount."*
- *"Show me all draft invoices, then send them to clients with subject line 'Invoice for March Services'."*
- *"List all overdue invoices with amounts greater than $1000 and send payment reminder emails."*

### Client Management
- *"Create a new client: ABC Corp, email billing@abc.com, address 123 Main St, Toronto ON M5V1A1, currency CAD."*
- *"Show me all clients who have unpaid invoices and export their contact details."*

### Expense & Payment Tracking
- *"List all expenses from last month and categorize them by amount."*
- *"Show payments received in the past 7 days and match them to invoices."*

### Financial Analysis
- *"Calculate total outstanding receivables and break down by aging: 0-30 days, 31-60 days, 60+ days."*
- *"Which clients paid fastest in Q1? Show average days to payment for each."*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- FreshBooks account with API access

### Local Setup

```bash
git clone https://github.com/BusyBee3333/FreshBooks-MCP-2026-Complete.git
cd freshbooks-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your FreshBooks OAuth credentials
npm run build
npm run dev
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Authentication failed" / 401 error
- **Check your access token:** Verify it's copied correctly without extra spaces
- **Token expired:** OAuth tokens expire after 30 days—regenerate from FreshBooks developer portal
- **Account ID mismatch:** Ensure `FRESHBOOKS_ACCOUNT_ID` matches your account (find in Settings)

### "Tools not appearing in Claude"
- **Restart required:** Always restart Claude Desktop after config changes
- **Path issues:** Use absolute paths in `claude_desktop_config.json` (no `~` or relative paths)
- **Build verification:** Check that `dist/index.js` exists after `npm run build`

### "Invalid businessId / Not found"
- FreshBooks API requires your numeric Account ID, not business name
- Find it: Settings → Account Settings → look for `accountid` in URL or API docs

## 📖 Resources

- **[FreshBooks API v3 Docs](https://www.freshbooks.com/api/overview)** — Official REST API reference
- **[OAuth Authentication Guide](https://www.freshbooks.com/api/authentication)** — How to get access tokens
- **[Accounting Endpoints](https://www.freshbooks.com/api/accounting)** — Invoices, clients, expenses, payments
- **[MCP Protocol Specification](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Documentation](https://claude.ai/desktop)** — Desktop app setup

## 🤝 Contributing

Contributions welcome! To add features:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/expense-attachments`)
3. Commit your changes (`git commit -m 'Add expense attachment uploads'`)
4. Push to the branch (`git push origin feature/expense-attachments`)
5. Open a Pull Request

**Ideas for contributions:**
- Support for recurring invoices
- Expense receipt image uploads
- Time tracking integration
- Project & estimate management
- Multi-currency handling improvements

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
