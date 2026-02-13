import { useState, useEffect } from 'react';
import './styles.css';

interface Invoice {
  id: number;
  number: string;
  client: string;
  amount: number;
  status: 'paid' | 'partial' | 'overdue' | 'draft' | 'sent';
  date: string;
  dueDate: string;
}

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, overdue: 0, draft: 0, outstanding: 0 });
  const [filter, setFilter] = useState({ status: 'all', client: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      // Call MCP tool to fetch invoices
      const response = await (window as any).mcp?.callTool('freshbooks_list_invoices', {
        page: 1,
        per_page: 50
      });
      
      if (response?.invoices) {
        setInvoices(response.invoices);
        calculateStats(response.invoices);
      } else {
        // Fallback to sample data
        loadSampleData();
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleInvoices: Invoice[] = [
      { id: 1, number: 'INV-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2024-01-15', dueDate: '2024-02-15' },
      { id: 2, number: 'INV-002', client: 'Tech Solutions', amount: 4200, status: 'overdue', date: '2024-01-10', dueDate: '2024-02-10' },
      { id: 3, number: 'INV-003', client: 'Design Co', amount: 1800, status: 'partial', date: '2024-01-20', dueDate: '2024-02-20' },
      { id: 4, number: 'INV-004', client: 'Marketing Inc', amount: 3600, status: 'draft', date: '2024-01-25', dueDate: '2024-02-25' },
      { id: 5, number: 'INV-005', client: 'Startup Labs', amount: 5200, status: 'sent', date: '2024-02-01', dueDate: '2024-03-01' },
      { id: 6, number: 'INV-006', client: 'Enterprise Co', amount: 8900, status: 'paid', date: '2024-02-05', dueDate: '2024-03-05' },
    ];
    setInvoices(sampleInvoices);
    calculateStats(sampleInvoices);
  };

  const calculateStats = (invoices: Invoice[]) => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
    const draftCount = invoices.filter(i => i.status === 'draft').length;
    const outstandingAmount = invoices.filter(i => i.status === 'sent' || i.status === 'partial').reduce((sum, inv) => sum + inv.amount, 0);
    
    setStats({
      total: totalRevenue,
      paid: paidAmount,
      overdue: overdueAmount,
      draft: draftCount,
      outstanding: outstandingAmount
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter.status !== 'all' && inv.status !== filter.status) return false;
    if (filter.client && !inv.client.toLowerCase().includes(filter.client.toLowerCase())) return false;
    return true;
  });

  const handleViewInvoice = async (invoiceId: number) => {
    try {
      await (window as any).mcp?.callTool('freshbooks_get_invoice', { invoice_id: invoiceId });
    } catch (error) {
      console.error('Error viewing invoice:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Invoice Dashboard</h1>
        <p className="subtitle">Manage and track all your invoices</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="value">${stats.total.toLocaleString()}</div>
          <div className="label">All invoices</div>
        </div>
        <div className="stat-card green">
          <h3>Paid</h3>
          <div className="value">${stats.paid.toLocaleString()}</div>
          <div className="label">Received</div>
        </div>
        <div className="stat-card blue">
          <h3>Outstanding</h3>
          <div className="value">${stats.outstanding.toLocaleString()}</div>
          <div className="label">Awaiting payment</div>
        </div>
        <div className="stat-card red">
          <h3>Overdue</h3>
          <div className="value">${stats.overdue.toLocaleString()}</div>
          <div className="label">Past due</div>
        </div>
        <div className="stat-card yellow">
          <h3>Drafts</h3>
          <div className="value">{stats.draft}</div>
          <div className="label">Pending</div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Status</label>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="sent">Sent</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Client</label>
          <input type="text" placeholder="Search client..." value={filter.client} onChange={(e) => setFilter({ ...filter, client: e.target.value })} />
        </div>
        <div className="filter-group">
          <button className="btn" onClick={loadInvoices}>Refresh</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="font-medium">{invoice.number}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.dueDate}</td>
                  <td className="amount">${invoice.amount.toLocaleString()}</td>
                  <td><span className={`status status-${invoice.status}`}>{invoice.status}</span></td>
                  <td>
                    <button className="btn-small" onClick={() => handleViewInvoice(invoice.id)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
