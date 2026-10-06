import React from 'react';
import { 
  Factory, 
  Sun, 
  Moon, 
  ArrowLeft, 
  Building2, 
  DownloadCloud, 
  Plus, 
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  currentCustomer, 
  onBackToDirectory,
  customers = [],
  onSelectCustomer,
  onOpenReport,
  onOpenQuickScan,
  onResetAll
}) {
  return (
    <header className="glass-panel" style={{
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      {/* Brand / Navigation Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {currentCustomer ? (
          <button
            onClick={onBackToDirectory}
            className="btn btn-sm btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              fontWeight: '700'
            }}
            title="Return to Customer Directory list"
          >
            <ArrowLeft size={16} /> All Customers
          </button>
        ) : (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            color: '#04101e',
            flexShrink: 0
          }}>
            <Factory size={24} />
          </div>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {currentCustomer ? currentCustomer.customerName : 'Finishing and Assembly'}
            </h1>
            {currentCustomer && (
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                {currentCustomer.mNo || 'M-SG-2026'}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {currentCustomer 
              ? `${currentCustomer.quality || 'Refractory Blocks'} · OA: ${currentCustomer.oaNo || 'N/A'}`
              : 'Select a customer to view block details, check completion status & view real-time pie charts'
            }
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Customer Switcher if inside customer workspace */}
        {currentCustomer && (
          <select
            value={currentCustomer.id}
            onChange={(e) => {
              const selected = customers.find(c => c.id === e.target.value);
              if (selected) onSelectCustomer(selected);
            }}
            style={{
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              maxWidth: '220px',
            }}
            title="Switch customer workspace"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.customerName.length > 28 ? c.customerName.slice(0, 26) + '...' : c.customerName}
              </option>
            ))}
          </select>
        )}

        {/* Update Customer Button */}
        {!currentCustomer && (
          <button onClick={onOpenQuickScan} className="btn btn-sm btn-primary">
            <Plus size={15} /> Update / Add Customer
          </button>
        )}

        {/* Export Traveler if on customer page */}
        {currentCustomer && (
          <button
            onClick={onOpenReport}
            className="btn btn-sm btn-primary"
            title="Open Process Report & PDF Traveler"
          >
            <DownloadCloud size={15} /> Export Traveler
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn btn-sm btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ padding: '0.5rem 0.65rem' }}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>

        {/* Reset All */}
        <button
          onClick={onResetAll}
          className="btn btn-sm btn-secondary"
          title="Reset database to default scanned batch"
          style={{ padding: '0.5rem 0.65rem' }}
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
