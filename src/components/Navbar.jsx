import React, { useState } from 'react';
import { 
  Factory, 
  Sun, 
  Moon, 
  ArrowLeft, 
  DownloadCloud, 
  Plus, 
  RefreshCw,
  LogOut,
  ShieldCheck,
  Wrench,
  Sparkles,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { USER_ROLES } from '../utils/auth';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  currentCustomer, 
  onBackToDirectory,
  customers = [],
  onSelectCustomer,
  onOpenReport,
  onOpenQuickScan,
  onResetAll,
  currentUser,
  onLogout,
  onSwitchRole
}) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'admin':
        return <ShieldCheck size={14} color="#c084fc" />;
      case 'assembly':
        return <Wrench size={14} color="#38bdf8" />;
      case 'finishing':
        return <Sparkles size={14} color="#34d399" />;
      default:
        return <UserCheck size={14} />;
    }
  };

  return (
    <header className="glass-panel" style={{
      padding: '0.85rem 1.5rem',
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
              {currentCustomer ? currentCustomer.customerName : 'Saint-Gobain Refractories MES'}
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
              : 'Finishing and Assembly Quality & Process Flow Management Portal'
            }
          </p>
        </div>
      </div>

      {/* Right Controls & User Role Bar */}
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
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              maxWidth: '200px',
            }}
            title="Switch customer workspace"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.customerName.length > 25 ? c.customerName.slice(0, 23) + '...' : c.customerName}
              </option>
            ))}
          </select>
        )}

        {/* Update Customer Button (Available for Admin & Assembly) */}
        {!currentCustomer && currentUser?.permissions?.canAddCustomer && (
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

        {/* User Role Switcher Dropdown */}
        {currentUser && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="btn btn-sm btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.75rem',
                border: `1px solid ${
                  currentUser.role === 'admin' 
                    ? 'rgba(168, 85, 247, 0.4)' 
                    : currentUser.role === 'assembly' 
                    ? 'rgba(0, 242, 254, 0.4)' 
                    : 'rgba(16, 185, 129, 0.4)'
                }`,
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              title="Click to switch between Admin, Assembly, or Finishing"
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: currentUser.avatarBg || 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.65rem'
              }}>
                {getRoleIcon(currentUser.role)}
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span className={`badge ${currentUser.badgeClass}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu for quick role switching */}
            {isRoleMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: '0',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.6rem',
                zIndex: 100,
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.2rem 0.5rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  Switch Operator Role
                </div>

                {Object.values(USER_ROLES).map(roleItem => {
                  const isActive = currentUser.role === roleItem.role;
                  return (
                    <button
                      key={roleItem.id}
                      onClick={() => {
                        onSwitchRole(roleItem.id);
                        setIsRoleMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: roleItem.avatarBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.7rem'
                      }}>
                        {getRoleIcon(roleItem.role)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'capitalize' }}>
                          {roleItem.role}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {roleItem.title}
                        </div>
                      </div>
                      {isActive && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem' }}>✓</span>}
                    </button>
                  );
                })}

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.3rem 0' }} />

                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    color: '#fda4af',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <LogOut size={13} /> Sign Out to Login Screen
                </button>
              </div>
            )}
          </div>
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

        {/* Reset Database (Admin Only) */}
        {currentUser?.permissions?.canResetDatabase ? (
          <button
            onClick={onResetAll}
            className="btn btn-sm btn-secondary"
            title="Reset database to default scanned batch (Admin)"
            style={{ padding: '0.5rem 0.65rem' }}
          >
            <RefreshCw size={15} />
          </button>
        ) : (
          <button
            onClick={() => alert('Only Admin users can reset the customer database.')}
            className="btn btn-sm btn-secondary"
            title="Reset Database (Admin Privilege Required)"
            style={{ padding: '0.5rem 0.65rem', opacity: 0.5, cursor: 'not-allowed' }}
          >
            <RefreshCw size={15} />
          </button>
        )}

        {/* Logout Quick Icon */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="btn btn-sm btn-secondary"
            title="Log Out"
            style={{ padding: '0.5rem 0.65rem', color: '#fda4af' }}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  );
}
