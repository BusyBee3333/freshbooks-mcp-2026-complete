import type {
  FreshBooksConfig,
  FreshBooksClient,
  FreshBooksInvoice,
  FreshBooksEstimate,
  FreshBooksExpense,
  ExpenseCategory,
  FreshBooksPayment,
  FreshBooksProject,
  FreshBooksTimeEntry,
  FreshBooksTax,
  FreshBooksItem,
  FreshBooksStaff,
  FreshBooksBill,
  BillVendor,
  BillPayment,
  AccountingAccount,
  JournalEntry,
  Retainer,
  CreditNote,
  ProfitLossReport,
  TaxSummaryReport,
  AgingReport,
  ExpenseReport,
  PaginatedResponse,
  FreshBooksError,
} from '../types/index.js';

export class FreshBooksAPIClient {
  private accountId: string;
  private accessToken: string;
  private apiBaseUrl: string;
  private rateLimitDelay = 100; // ms between requests
  private lastRequestTime = 0;

  constructor(config: FreshBooksConfig) {
    this.accountId = config.accountId;
    this.accessToken = config.accessToken;
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.freshbooks.com';
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  // Helper methods for recurring-tools compatibility
  async get<T>(endpoint: string, queryParams?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', `/accounting/account/${this.accountId}${endpoint}`, undefined, queryParams);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', `/accounting/account/${this.accountId}${endpoint}`, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', `/accounting/account/${this.accountId}${endpoint}`, data);
  }

  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    per_page: number = 30,
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>('GET', `/accounting/account/${this.accountId}${endpoint}`, undefined, {
      ...params,
      page,
      per_page,
    });
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    queryParams?: Record<string, any>
  ): Promise<T> {
    await this.rateLimit();

    const url = new URL(`${this.apiBaseUrl}${endpoint}`);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Api-Version': 'alpha',
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.mapError(response.status, errorData);
      }

      const responseData = await response.json() as any;
      return responseData.response || responseData;
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  private mapError(status: number, errorData: any): Error {
    const message = errorData?.message || errorData?.error || 'Unknown error';
    
    switch (status) {
      case 401:
        return new Error(`Authentication failed: ${message}`);
      case 403:
        return new Error(`Permission denied: ${message}`);
      case 404:
        return new Error(`Resource not found: ${message}`);
      case 429:
        return new Error(`Rate limit exceeded: ${message}`);
      case 422:
        return new Error(`Validation error: ${message}`);
      case 500:
      case 502:
      case 503:
        return new Error(`FreshBooks server error: ${message}`);
      default:
        return new Error(`FreshBooks API error (${status}): ${message}`);
    }
  }

  // Pagination helper
  private async paginate<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request<PaginatedResponse<T>>('GET', endpoint, undefined, {
        ...params,
        page,
      });

      results.push(...response.results);
      
      if (page >= response.pages) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return results;
  }

  // ========== CLIENTS ==========
  async getClients(params?: { search?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksClient>> {
    return this.request('GET', `/accounting/account/${this.accountId}/users/clients`, undefined, params);
  }

  async getClient(clientId: number): Promise<FreshBooksClient> {
    const response = await this.request<{ result: FreshBooksClient }>('GET', `/accounting/account/${this.accountId}/users/clients/${clientId}`);
    return response.result;
  }

  async createClient(client: Partial<FreshBooksClient>): Promise<FreshBooksClient> {
    const response = await this.request<{ result: FreshBooksClient }>('POST', `/accounting/account/${this.accountId}/users/clients`, { client });
    return response.result;
  }

  async updateClient(clientId: number, updates: Partial<FreshBooksClient>): Promise<FreshBooksClient> {
    const response = await this.request<{ result: FreshBooksClient }>('PUT', `/accounting/account/${this.accountId}/users/clients/${clientId}`, { client: updates });
    return response.result;
  }

  async deleteClient(clientId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/users/clients/${clientId}`);
  }

  // ========== INVOICES ==========
  async getInvoices(params?: { search?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksInvoice>> {
    return this.request('GET', `/accounting/account/${this.accountId}/invoices/invoices`, undefined, params);
  }

  async getInvoice(invoiceId: number): Promise<FreshBooksInvoice> {
    const response = await this.request<{ result: { invoice: FreshBooksInvoice } }>('GET', `/accounting/account/${this.accountId}/invoices/invoices/${invoiceId}`);
    return response.result.invoice;
  }

  async createInvoice(invoice: Partial<FreshBooksInvoice>): Promise<FreshBooksInvoice> {
    const response = await this.request<{ result: { invoice: FreshBooksInvoice } }>('POST', `/accounting/account/${this.accountId}/invoices/invoices`, { invoice });
    return response.result.invoice;
  }

  async updateInvoice(invoiceId: number, updates: Partial<FreshBooksInvoice>): Promise<FreshBooksInvoice> {
    const response = await this.request<{ result: { invoice: FreshBooksInvoice } }>('PUT', `/accounting/account/${this.accountId}/invoices/invoices/${invoiceId}`, { invoice: updates });
    return response.result.invoice;
  }

  async deleteInvoice(invoiceId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/invoices/invoices/${invoiceId}`);
  }

  async sendInvoice(invoiceId: number, email?: string): Promise<void> {
    await this.request('POST', `/accounting/account/${this.accountId}/invoices/invoices/${invoiceId}/send`, { email });
  }

  async markInvoicePaid(invoiceId: number): Promise<void> {
    await this.updateInvoice(invoiceId, { v3_status: 'paid' });
  }

  async getInvoiceShareLink(invoiceId: number): Promise<string> {
    const invoice = await this.getInvoice(invoiceId);
    return `https://my.freshbooks.com/#/invoice/${this.accountId}-${invoice.invoiceid}`;
  }

  // ========== ESTIMATES ==========
  async getEstimates(params?: { search?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksEstimate>> {
    return this.request('GET', `/accounting/account/${this.accountId}/estimates/estimates`, undefined, params);
  }

  async getEstimate(estimateId: number): Promise<FreshBooksEstimate> {
    const response = await this.request<{ result: { estimate: FreshBooksEstimate } }>('GET', `/accounting/account/${this.accountId}/estimates/estimates/${estimateId}`);
    return response.result.estimate;
  }

  async createEstimate(estimate: Partial<FreshBooksEstimate>): Promise<FreshBooksEstimate> {
    const response = await this.request<{ result: { estimate: FreshBooksEstimate } }>('POST', `/accounting/account/${this.accountId}/estimates/estimates`, { estimate });
    return response.result.estimate;
  }

  async updateEstimate(estimateId: number, updates: Partial<FreshBooksEstimate>): Promise<FreshBooksEstimate> {
    const response = await this.request<{ result: { estimate: FreshBooksEstimate } }>('PUT', `/accounting/account/${this.accountId}/estimates/estimates/${estimateId}`, { estimate: updates });
    return response.result.estimate;
  }

  async deleteEstimate(estimateId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/estimates/estimates/${estimateId}`);
  }

  async sendEstimate(estimateId: number, email?: string): Promise<void> {
    await this.request('POST', `/accounting/account/${this.accountId}/estimates/estimates/${estimateId}/send`, { email });
  }

  async acceptEstimate(estimateId: number): Promise<void> {
    await this.updateEstimate(estimateId, { accepted: true });
  }

  // ========== EXPENSES ==========
  async getExpenses(params?: { search?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksExpense>> {
    return this.request('GET', `/accounting/account/${this.accountId}/expenses/expenses`, undefined, params);
  }

  async getExpense(expenseId: number): Promise<FreshBooksExpense> {
    const response = await this.request<{ result: { expense: FreshBooksExpense } }>('GET', `/accounting/account/${this.accountId}/expenses/expenses/${expenseId}`);
    return response.result.expense;
  }

  async createExpense(expense: Partial<FreshBooksExpense>): Promise<FreshBooksExpense> {
    const response = await this.request<{ result: { expense: FreshBooksExpense } }>('POST', `/accounting/account/${this.accountId}/expenses/expenses`, { expense });
    return response.result.expense;
  }

  async updateExpense(expenseId: number, updates: Partial<FreshBooksExpense>): Promise<FreshBooksExpense> {
    const response = await this.request<{ result: { expense: FreshBooksExpense } }>('PUT', `/accounting/account/${this.accountId}/expenses/expenses/${expenseId}`, { expense: updates });
    return response.result.expense;
  }

  async deleteExpense(expenseId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/expenses/expenses/${expenseId}`);
  }

  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    const response = await this.request<{ result: { categories: ExpenseCategory[] } }>('GET', `/accounting/account/${this.accountId}/expenses/categories`);
    return response.result.categories;
  }

  // ========== PAYMENTS ==========
  async getPayments(params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksPayment>> {
    return this.request('GET', `/accounting/account/${this.accountId}/payments/payments`, undefined, params);
  }

  async getPayment(paymentId: number): Promise<FreshBooksPayment> {
    const response = await this.request<{ result: { payment: FreshBooksPayment } }>('GET', `/accounting/account/${this.accountId}/payments/payments/${paymentId}`);
    return response.result.payment;
  }

  async createPayment(payment: Partial<FreshBooksPayment>): Promise<FreshBooksPayment> {
    const response = await this.request<{ result: { payment: FreshBooksPayment } }>('POST', `/accounting/account/${this.accountId}/payments/payments`, { payment });
    return response.result.payment;
  }

  async updatePayment(paymentId: number, updates: Partial<FreshBooksPayment>): Promise<FreshBooksPayment> {
    const response = await this.request<{ result: { payment: FreshBooksPayment } }>('PUT', `/accounting/account/${this.accountId}/payments/payments/${paymentId}`, { payment: updates });
    return response.result.payment;
  }

  async deletePayment(paymentId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/payments/payments/${paymentId}`);
  }

  // ========== PROJECTS ==========
  async getProjects(params?: { page?: number; per_page?: number }): Promise<FreshBooksProject[]> {
    const response = await this.request<{ projects: FreshBooksProject[] }>('GET', `/projects/business/${this.accountId}/projects`, undefined, params);
    return response.projects;
  }

  async getProject(projectId: number): Promise<FreshBooksProject> {
    const response = await this.request<{ project: FreshBooksProject }>('GET', `/projects/business/${this.accountId}/project/${projectId}`);
    return response.project;
  }

  async createProject(project: Partial<FreshBooksProject>): Promise<FreshBooksProject> {
    const response = await this.request<{ project: FreshBooksProject }>('POST', `/projects/business/${this.accountId}/project`, project);
    return response.project;
  }

  async updateProject(projectId: number, updates: Partial<FreshBooksProject>): Promise<FreshBooksProject> {
    const response = await this.request<{ project: FreshBooksProject }>('PUT', `/projects/business/${this.accountId}/project/${projectId}`, updates);
    return response.project;
  }

  async deleteProject(projectId: number): Promise<void> {
    await this.request('DELETE', `/projects/business/${this.accountId}/project/${projectId}`);
  }

  // ========== TIME ENTRIES ==========
  async getTimeEntries(params?: { page?: number; per_page?: number }): Promise<FreshBooksTimeEntry[]> {
    const response = await this.request<{ time_entries: FreshBooksTimeEntry[] }>('GET', `/timetracking/business/${this.accountId}/time_entries`, undefined, params);
    return response.time_entries;
  }

  async getTimeEntry(timeEntryId: number): Promise<FreshBooksTimeEntry> {
    const response = await this.request<{ time_entry: FreshBooksTimeEntry }>('GET', `/timetracking/business/${this.accountId}/time_entries/${timeEntryId}`);
    return response.time_entry;
  }

  async createTimeEntry(timeEntry: Partial<FreshBooksTimeEntry>): Promise<FreshBooksTimeEntry> {
    const response = await this.request<{ time_entry: FreshBooksTimeEntry }>('POST', `/timetracking/business/${this.accountId}/time_entries`, { time_entry: timeEntry });
    return response.time_entry;
  }

  async updateTimeEntry(timeEntryId: number, updates: Partial<FreshBooksTimeEntry>): Promise<FreshBooksTimeEntry> {
    const response = await this.request<{ time_entry: FreshBooksTimeEntry }>('PUT', `/timetracking/business/${this.accountId}/time_entries/${timeEntryId}`, { time_entry: updates });
    return response.time_entry;
  }

  async deleteTimeEntry(timeEntryId: number): Promise<void> {
    await this.request('DELETE', `/timetracking/business/${this.accountId}/time_entries/${timeEntryId}`);
  }

  async startTimer(projectId: number, note?: string): Promise<FreshBooksTimeEntry> {
    return this.createTimeEntry({
      project_id: projectId,
      is_logged: false,
      started_at: new Date().toISOString(),
      note,
    });
  }

  async stopTimer(timeEntryId: number): Promise<FreshBooksTimeEntry> {
    return this.updateTimeEntry(timeEntryId, {
      is_logged: true,
    });
  }

  // ========== TAXES ==========
  async getTaxes(): Promise<FreshBooksTax[]> {
    const response = await this.request<{ result: { taxes: FreshBooksTax[] } }>('GET', `/accounting/account/${this.accountId}/taxes/taxes`);
    return response.result.taxes;
  }

  async getTax(taxId: number): Promise<FreshBooksTax> {
    const response = await this.request<{ result: { tax: FreshBooksTax } }>('GET', `/accounting/account/${this.accountId}/taxes/taxes/${taxId}`);
    return response.result.tax;
  }

  async createTax(tax: Partial<FreshBooksTax>): Promise<FreshBooksTax> {
    const response = await this.request<{ result: { tax: FreshBooksTax } }>('POST', `/accounting/account/${this.accountId}/taxes/taxes`, { tax });
    return response.result.tax;
  }

  async updateTax(taxId: number, updates: Partial<FreshBooksTax>): Promise<FreshBooksTax> {
    const response = await this.request<{ result: { tax: FreshBooksTax } }>('PUT', `/accounting/account/${this.accountId}/taxes/taxes/${taxId}`, { tax: updates });
    return response.result.tax;
  }

  async deleteTax(taxId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/taxes/taxes/${taxId}`);
  }

  // ========== ITEMS/SERVICES ==========
  async getItems(params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<FreshBooksItem>> {
    return this.request('GET', `/accounting/account/${this.accountId}/items/items`, undefined, params);
  }

  async getItem(itemId: number): Promise<FreshBooksItem> {
    const response = await this.request<{ result: { item: FreshBooksItem } }>('GET', `/accounting/account/${this.accountId}/items/items/${itemId}`);
    return response.result.item;
  }

  async createItem(item: Partial<FreshBooksItem>): Promise<FreshBooksItem> {
    const response = await this.request<{ result: { item: FreshBooksItem } }>('POST', `/accounting/account/${this.accountId}/items/items`, { item });
    return response.result.item;
  }

  async updateItem(itemId: number, updates: Partial<FreshBooksItem>): Promise<FreshBooksItem> {
    const response = await this.request<{ result: { item: FreshBooksItem } }>('PUT', `/accounting/account/${this.accountId}/items/items/${itemId}`, { item: updates });
    return response.result.item;
  }

  async deleteItem(itemId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/items/items/${itemId}`);
  }

  // ========== STAFF ==========
  async getStaff(params?: { page?: number; per_page?: number }): Promise<FreshBooksStaff[]> {
    const response = await this.request<{ staff_members: FreshBooksStaff[] }>('GET', `/projects/business/${this.accountId}/staff`, undefined, params);
    return response.staff_members;
  }

  async getStaffMember(staffId: number): Promise<FreshBooksStaff> {
    const response = await this.request<{ staff_member: FreshBooksStaff }>('GET', `/projects/business/${this.accountId}/staff/${staffId}`);
    return response.staff_member;
  }

  // ========== BILLS ==========
  async getBills(params?: { page?: number; per_page?: number }): Promise<FreshBooksBill[]> {
    const response = await this.request<{ bills: FreshBooksBill[] }>('GET', `/accounting/account/${this.accountId}/bills/bills`, undefined, params);
    return response.bills;
  }

  async getBill(billId: number): Promise<FreshBooksBill> {
    const response = await this.request<{ bill: FreshBooksBill }>('GET', `/accounting/account/${this.accountId}/bills/bills/${billId}`);
    return response.bill;
  }

  async createBill(bill: Partial<FreshBooksBill>): Promise<FreshBooksBill> {
    const response = await this.request<{ bill: FreshBooksBill }>('POST', `/accounting/account/${this.accountId}/bills/bills`, { bill });
    return response.bill;
  }

  async updateBill(billId: number, updates: Partial<FreshBooksBill>): Promise<FreshBooksBill> {
    const response = await this.request<{ bill: FreshBooksBill }>('PUT', `/accounting/account/${this.accountId}/bills/bills/${billId}`, { bill: updates });
    return response.bill;
  }

  async deleteBill(billId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/bills/bills/${billId}`);
  }

  // ========== BILL VENDORS ==========
  async getVendors(params?: { page?: number; per_page?: number }): Promise<BillVendor[]> {
    const response = await this.request<{ bill_vendors: BillVendor[] }>('GET', `/accounting/account/${this.accountId}/bill_vendors/bill_vendors`, undefined, params);
    return response.bill_vendors;
  }

  async getVendor(vendorId: number): Promise<BillVendor> {
    const response = await this.request<{ bill_vendor: BillVendor }>('GET', `/accounting/account/${this.accountId}/bill_vendors/bill_vendors/${vendorId}`);
    return response.bill_vendor;
  }

  async createVendor(vendor: Partial<BillVendor>): Promise<BillVendor> {
    const response = await this.request<{ bill_vendor: BillVendor }>('POST', `/accounting/account/${this.accountId}/bill_vendors/bill_vendors`, { bill_vendor: vendor });
    return response.bill_vendor;
  }

  async updateVendor(vendorId: number, updates: Partial<BillVendor>): Promise<BillVendor> {
    const response = await this.request<{ bill_vendor: BillVendor }>('PUT', `/accounting/account/${this.accountId}/bill_vendors/bill_vendors/${vendorId}`, { bill_vendor: updates });
    return response.bill_vendor;
  }

  async deleteVendor(vendorId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/bill_vendors/bill_vendors/${vendorId}`);
  }

  // ========== BILL PAYMENTS ==========
  async getBillPayments(billId: number): Promise<BillPayment[]> {
    const bill = await this.getBill(billId);
    return bill.bill_payments || [];
  }

  async createBillPayment(billId: number, payment: Partial<BillPayment>): Promise<BillPayment> {
    const response = await this.request<{ bill_payment: BillPayment }>('POST', `/accounting/account/${this.accountId}/bills/bills/${billId}/bill_payments`, { bill_payment: payment });
    return response.bill_payment;
  }

  // ========== ACCOUNTING ACCOUNTS ==========
  async getAccounts(): Promise<AccountingAccount[]> {
    const response = await this.request<{ accounts: AccountingAccount[] }>('GET', `/accounting/account/${this.accountId}/accounts/accounts`);
    return response.accounts;
  }

  async getAccount(accountId: number): Promise<AccountingAccount> {
    const response = await this.request<{ account: AccountingAccount }>('GET', `/accounting/account/${this.accountId}/accounts/accounts/${accountId}`);
    return response.account;
  }

  // ========== JOURNAL ENTRIES ==========
  async getJournalEntries(params?: { page?: number; per_page?: number }): Promise<JournalEntry[]> {
    const response = await this.request<{ journal_entries: JournalEntry[] }>('GET', `/accounting/account/${this.accountId}/journal_entries/journal_entries`, undefined, params);
    return response.journal_entries;
  }

  async getJournalEntry(journalEntryId: number): Promise<JournalEntry> {
    const response = await this.request<{ journal_entry: JournalEntry }>('GET', `/accounting/account/${this.accountId}/journal_entries/journal_entries/${journalEntryId}`);
    return response.journal_entry;
  }

  async createJournalEntry(journalEntry: Partial<JournalEntry>): Promise<JournalEntry> {
    const response = await this.request<{ journal_entry: JournalEntry }>('POST', `/accounting/account/${this.accountId}/journal_entries/journal_entries`, { journal_entry: journalEntry });
    return response.journal_entry;
  }

  // ========== RETAINERS ==========
  async getRetainers(params?: { page?: number; per_page?: number }): Promise<Retainer[]> {
    const response = await this.request<{ retainers: Retainer[] }>('GET', `/projects/business/${this.accountId}/retainers`, undefined, params);
    return response.retainers;
  }

  async getRetainer(retainerId: number): Promise<Retainer> {
    const response = await this.request<{ retainer: Retainer }>('GET', `/projects/business/${this.accountId}/retainers/${retainerId}`);
    return response.retainer;
  }

  async createRetainer(retainer: Partial<Retainer>): Promise<Retainer> {
    const response = await this.request<{ retainer: Retainer }>('POST', `/projects/business/${this.accountId}/retainers`, { retainer });
    return response.retainer;
  }

  async updateRetainer(retainerId: number, updates: Partial<Retainer>): Promise<Retainer> {
    const response = await this.request<{ retainer: Retainer }>('PUT', `/projects/business/${this.accountId}/retainers/${retainerId}`, { retainer: updates });
    return response.retainer;
  }

  async deleteRetainer(retainerId: number): Promise<void> {
    await this.request('DELETE', `/projects/business/${this.accountId}/retainers/${retainerId}`);
  }

  // ========== CREDIT NOTES ==========
  async getCreditNotes(params?: { page?: number; per_page?: number }): Promise<CreditNote[]> {
    const response = await this.request<{ credit_notes: CreditNote[] }>('GET', `/accounting/account/${this.accountId}/credit_notes/credit_notes`, undefined, params);
    return response.credit_notes;
  }

  async getCreditNote(creditNoteId: number): Promise<CreditNote> {
    const response = await this.request<{ credit_note: CreditNote }>('GET', `/accounting/account/${this.accountId}/credit_notes/credit_notes/${creditNoteId}`);
    return response.credit_note;
  }

  async createCreditNote(creditNote: Partial<CreditNote>): Promise<CreditNote> {
    const response = await this.request<{ credit_note: CreditNote }>('POST', `/accounting/account/${this.accountId}/credit_notes/credit_notes`, { credit_note: creditNote });
    return response.credit_note;
  }

  async updateCreditNote(creditNoteId: number, updates: Partial<CreditNote>): Promise<CreditNote> {
    const response = await this.request<{ credit_note: CreditNote }>('PUT', `/accounting/account/${this.accountId}/credit_notes/credit_notes/${creditNoteId}`, { credit_note: updates });
    return response.credit_note;
  }

  async deleteCreditNote(creditNoteId: number): Promise<void> {
    await this.request('DELETE', `/accounting/account/${this.accountId}/credit_notes/credit_notes/${creditNoteId}`);
  }

  // ========== REPORTS ==========
  async getProfitLossReport(startDate: string, endDate: string): Promise<ProfitLossReport> {
    const response = await this.request<{ report: ProfitLossReport }>('GET', `/accounting/account/${this.accountId}/reports/accounting/profitloss`, undefined, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.report;
  }

  async getTaxSummaryReport(startDate: string, endDate: string): Promise<TaxSummaryReport> {
    const response = await this.request<{ report: TaxSummaryReport }>('GET', `/accounting/account/${this.accountId}/reports/accounting/taxsummary`, undefined, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.report;
  }

  async getAgingReport(): Promise<AgingReport> {
    const response = await this.request<{ report: AgingReport }>('GET', `/accounting/account/${this.accountId}/reports/accounting/aging`);
    return response.report;
  }

  async getExpenseReport(startDate: string, endDate: string): Promise<ExpenseReport> {
    const response = await this.request<{ report: ExpenseReport }>('GET', `/accounting/account/${this.accountId}/reports/accounting/expenses`, undefined, {
      start_date: startDate,
      end_date: endDate,
    });
    return response.report;
  }
}
