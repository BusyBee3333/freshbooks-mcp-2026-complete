#!/bin/bash

APPS_DIR="src/ui/react-app/src/apps"

# Function to create an app
create_app() {
  local app_name=$1
  local title=$2
  local tool=$3
  
  mkdir -p "$APPS_DIR/$app_name"
  
  # Create index.html
  cat > "$APPS_DIR/$app_name/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$title - FreshBooks</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
EOF

  # Create main.tsx
  cat > "$APPS_DIR/$app_name/main.tsx" <<EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '../../styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

  # Create App.tsx
  cat > "$APPS_DIR/$app_name/App.tsx" <<EOF
import React from 'react';
import { useFreshBooks } from '../../hooks/useFreshBooks';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Loading } from '../../components/Loading';

export function App() {
  const { data, loading, error } = useFreshBooks('$tool');

  if (loading) return <Loading />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>$title</h1>
      </div>
      <Card>
        <CardContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
EOF
}

# Create all apps
create_app "invoice-dashboard" "Invoice Dashboard" "freshbooks_list_invoices"
create_app "invoice-detail" "Invoice Detail" "freshbooks_get_invoice"
create_app "invoice-creator" "Invoice Creator" "freshbooks_create_invoice"
create_app "client-dashboard" "Client Dashboard" "freshbooks_list_clients"
create_app "client-detail" "Client Detail" "freshbooks_get_client"
create_app "expense-tracker" "Expense Tracker" "freshbooks_list_expenses"
create_app "expense-report" "Expense Report" "freshbooks_expense_report"
create_app "project-dashboard" "Project Dashboard" "freshbooks_list_projects"
create_app "project-detail" "Project Detail" "freshbooks_get_project"
create_app "time-tracker" "Time Tracker" "freshbooks_list_time_entries"
create_app "time-report" "Time Report" "freshbooks_list_time_entries"
create_app "payment-dashboard" "Payment Dashboard" "freshbooks_list_payments"
create_app "estimate-builder" "Estimate Builder" "freshbooks_list_estimates"
create_app "profit-loss-report" "Profit & Loss Report" "freshbooks_profit_loss_report"
create_app "tax-summary" "Tax Summary" "freshbooks_tax_summary_report"
create_app "aging-report" "Aging Report" "freshbooks_aging_report"
create_app "item-catalog" "Item Catalog" "freshbooks_list_items"
create_app "bill-manager" "Bill Manager" "freshbooks_list_bills"
create_app "staff-directory" "Staff Directory" "freshbooks_list_staff"

echo "All apps created successfully!"
