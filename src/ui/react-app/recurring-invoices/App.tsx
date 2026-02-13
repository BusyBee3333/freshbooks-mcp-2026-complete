import { useState, useEffect } from 'react';
import './styles.css';

export default function RecurringInvoices() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Call MCP tool
      const response = await (window as any).mcp?.callTool('freshbooks_list_invoices', {});
      
      if (response) {
        setData(response);
      } else {
        setData(getSampleData());
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => {
    return { message: 'Sample data - MCP tools not available', items: [] };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading recurring templates...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Recurring Templates</h1>
        <p className="subtitle">Manage recurring invoice templates</p>
      </div>
      
      <div className="content">
        {error && <div className="error">{error}</div>}
        
        <div className="card">
          <h2>Data</h2>
          <pre className="data-preview">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
