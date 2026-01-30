import React, { useState } from 'react';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminDashboard';
import DocumentsView from './components/FAQManager';

function App() {
  const [view, setView] = useState('customer'); // 'customer', 'admin', 'documents'

  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
        <button onClick={() => setView('customer')}>Customer</button>
        <button onClick={() => setView('admin')}>Admin</button>
        <button onClick={() => setView('documents')}>Documents</button>
      </nav>

      <div>
        {view === 'customer' && <CustomerView />}
        {view === 'admin' && <AdminView />}
        {view === 'documents' && <DocumentsView />}
      </div>
    </div>
  );
}

export default App;
