import { Clock, FileText, Star, TrendingUp, Users } from 'lucide-react';

import React from 'react';

const AdminView = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ background: '#2563eb', padding: 8, borderRadius: 8 }}>
                <FileText style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 18 }}>Admin Dashboard</h1>
                <p style={{ margin: 0, color: '#6b7280' }}>Manage your AI chatbot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Total Conversations</div>
              <Users style={{ width: 18, height: 18, color: '#2563eb' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>847</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Rating</div>
              <Star style={{ width: 18, height: 18, color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>4.8</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Resolution Rate</div>
              <TrendingUp style={{ width: 18, height: 18, color: '#059669' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>92%</div>
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Response Time</div>
              <Clock style={{ width: 18, height: 18, color: '#7c3aed' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>1.8min</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Recent Conversations</h2>
          </div>
          {/* Recent conversations list would go here */}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
