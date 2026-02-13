import { useState, useEffect } from 'react';
import './styles.css';

export default function EstimateGrid() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await (window as any).mcp?.callTool('freshbooks_list_estimates', {});
      setData(response || { items: [] });
    } catch (err) {
      console.error('Error:', err);
      setData({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Estimate Grid</h1>
        <p className="subtitle">Grid view of estimates</p>
      </div>
      <div className="card">
        <pre className="data-preview">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
