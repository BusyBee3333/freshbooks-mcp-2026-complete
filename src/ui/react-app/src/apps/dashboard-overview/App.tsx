import React from 'react';
import { useFreshBooks } from '../../hooks/useFreshBooks';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Loading } from '../../components/Loading';

export function App() {
  const { data: invoices, loading: invoicesLoading } = useFreshBooks('freshbooks_list_invoices', { per_page: 5 });
  const { data: clients, loading: clientsLoading } = useFreshBooks('freshbooks_list_clients', { per_page: 5 });
  const { data: expenses, loading: expensesLoading } = useFreshBooks('freshbooks_list_expenses', { per_page: 5 });

  if (invoicesLoading || clientsLoading || expensesLoading) {
    return <Loading />;
  }

  const totalInvoices = invoices?.total || 0;
  const totalClients = clients?.total || 0;
  const recentInvoices = invoices?.results || [];
  const recentClients = clients?.results || [];

  return (
    <div className="container">
      <div className="header">
        <h1>FreshBooks Dashboard</h1>
        <p>Overview of your business</p>
      </div>

      <div className="grid grid-3">
        <Card>
          <div className="stat-box">
            <div className="stat-value">{totalInvoices}</div>
            <div className="stat-label">Total Invoices</div>
          </div>
        </Card>
        <Card>
          <div className="stat-box">
            <div className="stat-value">{totalClients}</div>
            <div className="stat-label">Total Clients</div>
          </div>
        </Card>
        <Card>
          <div className="stat-box">
            <div className="stat-value">{expenses?.total || 0}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-2">
        <Card>
          <CardHeader>
            <h3>Recent Invoices</h3>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <p>No invoices found</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td>{inv.invoice_number}</td>
                      <td>{inv.organization || `${inv.fname} ${inv.lname}`}</td>
                      <td>${inv.amount.amount} {inv.amount.code}</td>
                      <td>
                        <span className={`badge badge-${inv.v3_status === 'paid' ? 'success' : 'warning'}`}>
                          {inv.v3_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3>Recent Clients</h3>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p>No clients found</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map((client: any) => (
                    <tr key={client.id}>
                      <td>{client.fname} {client.lname}</td>
                      <td>{client.organization}</td>
                      <td>{client.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
