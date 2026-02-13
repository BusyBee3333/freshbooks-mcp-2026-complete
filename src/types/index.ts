// FreshBooks API Types

export interface FreshBooksConfig {
  accountId: string;
  accessToken: string;
  apiBaseUrl?: string;
}

export interface FreshBooksClient {
  id: number;
  organization: string;
  fname: string;
  lname: string;
  email: string;
  username: string;
  home_phone: string | null;
  business_phone: string | null;
  mobile_phone: string | null;
  fax: string | null;
  company_industry: string | null;
  company_size: string | null;
  vat_name: string | null;
  vat_number: string | null;
  s_province: string;
  s_city: string;
  s_street: string;
  s_street2: string;
  s_code: string;
  s_country: string;
  p_province: string;
  p_city: string;
  p_street: string;
  p_street2: string;
  p_code: string;
  p_country: string;
  currency_code: string;
  language: string;
  note: string | null;
  pref_email: boolean;
  pref_gmail: boolean;
  allow_late_fees: boolean;
  allow_late_notifications: boolean;
  role: string;
  vis_state: number;
  updated: string;
}

export interface FreshBooksInvoice {
  id: number;
  accountid: string;
  invoiceid: number;
  invoice_number: string;
  customerid: number;
  create_date: string;
  generation_date: string | null;
  discount_value: string;
  discount_description: string | null;
  po_number: string | null;
  template: string;
  currency_code: string;
  language: string;
  terms: string | null;
  notes: string | null;
  address: string;
  return_uri: string | null;
  deposit_amount: string | null;
  deposit_percentage: string | null;
  deposit_status: string;
  payment_status: string;
  auto_bill: boolean;
  v3_status: string;
  date_paid: string | null;
  estimateid: number;
  basecampid: number;
  sentid: number;
  status: number;
  parent: number;
  fname: string;
  lname: string;
  organization: string;
  amount: {
    amount: string;
    code: string;
  };
  outstanding: {
    amount: string;
    code: string;
  };
  paid: {
    amount: string;
    code: string;
  };
  due_offset_days: number;
  lines: InvoiceLine[];
  presentation: InvoicePresentation;
}

export interface InvoiceLine {
  lineid?: number;
  amount?: {
    amount: string;
    code: string;
  };
  name: string;
  description?: string;
  qty: string;
  unit_cost: {
    amount: string;
    code: string;
  };
  taxName1?: string;
  taxAmount1?: string;
  taxName2?: string;
  taxAmount2?: string;
  type?: number;
  expenseid?: number;
}

export interface InvoicePresentation {
  theme_primary_color: string;
  theme_layout: string;
  theme_font_name: string;
  image_logo_src: string | null;
  image_banner_src: string | null;
}

export interface FreshBooksEstimate {
  id: number;
  accountid: string;
  estimateid: number;
  estimate_number: string;
  customerid: number;
  accepted: boolean;
  create_date: string;
  discount_value: string;
  discount_description: string | null;
  po_number: string | null;
  template: string;
  currency_code: string;
  language: string;
  terms: string | null;
  notes: string | null;
  address: string;
  status: number;
  fname: string;
  lname: string;
  organization: string;
  amount: {
    amount: string;
    code: string;
  };
  lines: EstimateLine[];
  ui_status: string;
}

export interface EstimateLine {
  lineid?: number;
  amount?: {
    amount: string;
    code: string;
  };
  name: string;
  description?: string;
  qty: string;
  unit_cost: {
    amount: string;
    code: string;
  };
  taxName1?: string;
  taxAmount1?: string;
  taxName2?: string;
  taxAmount2?: string;
  type?: number;
}

export interface FreshBooksExpense {
  id: number;
  accountid: string;
  amount: {
    amount: string;
    code: string;
  };
  vendor: string;
  date: string;
  categoryid: number;
  clientid: number;
  projectid: number;
  staffid: number;
  notes: string | null;
  taxName1: string;
  taxAmount1: number;
  taxName2: string;
  taxAmount2: number;
  status: number;
  is_cogs: boolean;
  from_bulk_import: boolean;
  attachment: ExpenseAttachment | null;
  markup_percent: string;
  updated: string;
}

export interface ExpenseAttachment {
  id: number;
  jwt: string;
  media_type: string;
}

export interface ExpenseCategory {
  id: number;
  category: string;
  categoryid: number;
  created_at: string;
  is_cogs: boolean;
  is_editable: boolean;
  parentid: number | null;
  updated_at: string;
  vis_state: number;
}

export interface FreshBooksPayment {
  id: number;
  accountid: string;
  amount: {
    amount: string;
    code: string;
  };
  bulk_paymentid: number;
  clientid: number;
  creditid: number | null;
  date: string;
  from_credit: boolean;
  gateway: string | null;
  invoiceid: number;
  logid: number;
  note: string | null;
  orderid: string | null;
  overpaymentid: number;
  transactionid: string | null;
  type: string;
  updated: string;
  vis_state: number;
}

export interface FreshBooksProject {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  client_id: number;
  internal: boolean;
  budget: number | null;
  fixed_price: number | null;
  rate: number | null;
  billing_method: string;
  project_type: string;
  active: boolean;
  complete: boolean;
  sample: boolean;
  created_at: string;
  updated_at: string;
  logged_duration: number;
  services: ProjectService[];
  billed_amount: string;
  billed_status: string;
  retainer_id: number | null;
}

export interface ProjectService {
  business_id: number;
  id: number;
  name: string;
  billable: boolean;
  vis_state: number;
}

export interface FreshBooksTimeEntry {
  id: number;
  identity_id: number;
  is_logged: boolean;
  started_at: string;
  created_at: string;
  client_id: number;
  project_id: number;
  pending_client: string | null;
  pending_project: string | null;
  pending_task: string | null;
  task_id: number | null;
  service_id: number | null;
  note: string | null;
  active: boolean;
  billable: boolean;
  billed: boolean;
  internal: boolean;
  retainer_id: number | null;
  duration: number;
  timer: Timer | null;
}

export interface Timer {
  id: number;
  is_running: boolean;
  started_at: string;
  duration: number;
}

export interface FreshBooksTax {
  id: number;
  accounting_systemid: string;
  name: string;
  number: string | null;
  amount: string;
  compound: boolean;
  updated: string;
}

export interface FreshBooksItem {
  id: number;
  accountid: string;
  itemid: number;
  name: string;
  description: string;
  quantity: string;
  inventory: string;
  unit_cost: {
    amount: string;
    code: string;
  };
  tax1: number;
  tax2: number;
  updated: string;
  vis_state: number;
  sku: string;
}

export interface FreshBooksStaff {
  id: number;
  identity_id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  business_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  rate: {
    amount: string;
    code: string;
  } | null;
}

export interface FreshBooksBill {
  id: number;
  amount: {
    amount: string;
    code: string;
  };
  attachment: ExpenseAttachment | null;
  bill_number: string | null;
  bill_payments: BillPayment[];
  created_at: string;
  currency_code: string;
  due_date: string;
  due_offset_days: number;
  issue_date: string;
  language: string;
  lines: BillLine[];
  outstanding: {
    amount: string;
    code: string;
  };
  overall_category: string;
  overall_description: string;
  paid: {
    amount: string;
    code: string;
  };
  status: string;
  tax_amount: {
    amount: string;
    code: string;
  };
  total_amount: {
    amount: string;
    code: string;
  };
  updated_at: string;
  vendor_id: number;
  vis_state: number;
}

export interface BillLine {
  id: number;
  amount: {
    amount: string;
    code: string;
  };
  category_id: number;
  description: string;
  list_index: number;
  quantity: string;
  tax_amount1: string | null;
  tax_amount2: string | null;
  tax_authorityid1: number | null;
  tax_authorityid2: number | null;
  tax_name1: string | null;
  tax_name2: string | null;
  tax_percent1: string | null;
  tax_percent2: string | null;
  total_amount: {
    amount: string;
    code: string;
  };
  unit_cost: {
    amount: string;
    code: string;
  };
}

export interface BillPayment {
  id: number;
  amount: {
    amount: string;
    code: string;
  };
  bill_id: number;
  matched_with_expense: boolean;
  note: string | null;
  paid_date: string;
  payment_type: string;
  vis_state: number;
}

export interface BillVendor {
  id: number;
  account_number: string | null;
  city: string;
  country: string;
  currency_code: string;
  is_1099: boolean;
  language: string;
  outstanding_balance: {
    amount: string;
    code: string;
  }[];
  overdue_balance: {
    amount: string;
    code: string;
  }[];
  phone: string | null;
  postal_code: string;
  primary_contact_email: string;
  primary_contact_first_name: string;
  primary_contact_last_name: string;
  province: string;
  street: string;
  street2: string | null;
  tax_defaults: TaxDefault[];
  vendor_name: string;
  vis_state: number;
  website: string | null;
}

export interface TaxDefault {
  systemid: number;
  taxid: number;
}

export interface AccountingAccount {
  id: number;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: {
    amount: string;
    code: string;
  };
  currency_code: string;
  custom: boolean;
  parentid: number | null;
  sub_accounts: AccountingAccount[];
}

export interface JournalEntry {
  id: number;
  created_at: string;
  currency_code: string;
  description: string;
  details: JournalEntryDetail[];
  name: string;
  user_entered_date: string;
}

export interface JournalEntryDetail {
  id: number;
  credit_amount: {
    amount: string;
    code: string;
  } | null;
  currency_code: string;
  debit_amount: {
    amount: string;
    code: string;
  } | null;
  description: string | null;
  name: string;
  sub_accountid: number;
  user_entered_date: string;
}

export interface Retainer {
  id: number;
  active: boolean;
  business_id: number;
  client_id: number;
  created_at: string;
  end_date: string | null;
  fee: string;
  period: string;
  start_date: string;
  updated_at: string;
}

export interface CreditNote {
  id: number;
  accounting_systemid: string;
  clientid: number;
  creditid: number;
  credit_number: string;
  credit_type: string;
  currency_code: string;
  amount: {
    amount: string;
    code: string;
  };
  balance: {
    amount: string;
    code: string;
  };
  create_date: string;
  language: string;
  notes: string | null;
  terms: string | null;
  status: string;
  lines: CreditNoteLine[];
}

export interface CreditNoteLine {
  lineid: number;
  amount: {
    amount: string;
    code: string;
  };
  name: string;
  description: string;
  qty: string;
  unit_cost: {
    amount: string;
    code: string;
  };
  taxName1: string;
  taxAmount1: string;
  taxName2: string;
  taxAmount2: string;
}

export interface ProfitLossReport {
  start_date: string;
  end_date: string;
  currency_code: string;
  income: ReportCategory[];
  expenses: ReportCategory[];
  net_profit: {
    amount: string;
    code: string;
  };
}

export interface ReportCategory {
  category_name: string;
  total: {
    amount: string;
    code: string;
  };
  children: ReportCategory[];
}

export interface TaxSummaryReport {
  start_date: string;
  end_date: string;
  currency_code: string;
  taxes: TaxSummaryItem[];
  total_tax: {
    amount: string;
    code: string;
  };
}

export interface TaxSummaryItem {
  tax_name: string;
  taxable_amount: {
    amount: string;
    code: string;
  };
  tax_collected: {
    amount: string;
    code: string;
  };
  tax_paid: {
    amount: string;
    code: string;
  };
  net_tax: {
    amount: string;
    code: string;
  };
}

export interface AgingReport {
  currency_code: string;
  current: {
    amount: string;
    code: string;
  };
  days_1_30: {
    amount: string;
    code: string;
  };
  days_31_60: {
    amount: string;
    code: string;
  };
  days_61_90: {
    amount: string;
    code: string;
  };
  days_over_90: {
    amount: string;
    code: string;
  };
  total: {
    amount: string;
    code: string;
  };
  clients: AgingReportClient[];
}

export interface AgingReportClient {
  client_id: number;
  client_name: string;
  organization: string;
  current: {
    amount: string;
    code: string;
  };
  days_1_30: {
    amount: string;
    code: string;
  };
  days_31_60: {
    amount: string;
    code: string;
  };
  days_61_90: {
    amount: string;
    code: string;
  };
  days_over_90: {
    amount: string;
    code: string;
  };
  total: {
    amount: string;
    code: string;
  };
}

export interface ExpenseReport {
  start_date: string;
  end_date: string;
  currency_code: string;
  categories: ExpenseReportCategory[];
  total: {
    amount: string;
    code: string;
  };
}

export interface ExpenseReportCategory {
  category_name: string;
  total: {
    amount: string;
    code: string;
  };
  expenses: FreshBooksExpense[];
}

export interface PaginatedResponse<T> {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  results: T[];
}

export interface FreshBooksError {
  message: string;
  error_type?: string;
  field?: string;
}

export interface RecurringProfile {
  id: number;
  recurring_id: number;
  clientid: number;
  frequency: string;
  numberRecurring: number;
  create_date: string;
  currency_code: string;
  lines: InvoiceLine[];
  notes?: string;
  terms?: string;
  vis_state?: number;
}
