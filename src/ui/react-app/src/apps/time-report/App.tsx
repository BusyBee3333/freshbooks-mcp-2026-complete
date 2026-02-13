import React from 'react';
import { useFreshBooks } from '../../hooks/useFreshBooks';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Loading } from '../../components/Loading';

export function App() {
  const { data, loading, error } = useFreshBooks('freshbooks_list_time_entries');

  if (loading) return <Loading />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Time Report</h1>
      </div>
      <Card>
        <CardContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
