import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Scale, 
  Hash, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Sparkles, 
  FileText, 
  PieChart as PieIcon, 
  TrendingUp,
  Boxes,
  UploadCloud
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function CustomerDirectory({ 
  customers = [], 
  onSelectCustomer, 
  onAddNewCustomer, 
  onDeleteCustomer,
  onOpenQuickScan,
  currentUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'in-progress' | 'pending'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'progress-desc' | 'weight-desc'

  // Aggregate Plant KPIs
  const totalCustomers = customers.length;
  const completedOrders = customers.filter(c => {
    const tot = c.blocks?.length || c.totalQuantity || 0;
    const comp = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
    return tot > 0 && comp === tot;
  }).length;
  const pendingOrders = totalCustomers - completedOrders;
  const totalBlocks = customers.reduce((sum, c) => sum + (c.blocks?.length || c.totalQuantity || 0), 0);
  const totalCompletedBlocks = customers.reduce((sum, c) => {
    return sum + (c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0);
  }, 0);
  const plantProgressPercent = totalBlocks > 0 ? Math.round((totalCompletedBlocks / totalBlocks) * 100) : 0;
  const totalFacilityWeight = customers.reduce((sum, c) => sum + (c.totalWeight || 0), 0);

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const totalB = c.blocks?.length || c.totalQuantity || 0;
    const compB = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
    const isDone = totalB > 0 && compB === totalB;

    if (statusFilter === 'completed' && !isDone) return false;
    if (statusFilter === 'in-progress' && (isDone || compB === 0)) return false;
    if (statusFilter === 'pending' && compB > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customerName?.toLowerCase().includes(q);
      const matchMNo = c.mNo?.toLowerCase().includes(q);
      const matchOANo = c.oaNo?.toLowerCase().includes(q);
      const matchQuality = c.quality?.toLowerCase().includes(q);
      return matchName || matchMNo || matchOANo || matchQuality;
    }
    return true;
  });

  // Sorting
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') return (a.customerName || '').localeCompare(b.customerName || '');
    if (sortBy === 'progress-desc') {
      const pA = a.blocks?.length ? (a.blocks.filter(x => x.isCompleted).length / a.blocks.length) : 0;
      const pB = b.blocks?.length ? (b.blocks.filter(x => x.isCompleted).length / b.blocks.length) : 0;
      return pB - pA;
    }
    if (sortBy === 'weight-desc') return (b.totalWeight || 0) - (a.totalWeight || 0);
    return 0; // Default recent
  });

  // Export Master Plant Directory
  const handleExportPlantDirectory = () => {
    const wb = XLSX.utils.book_new();
    const rows = [
      ['SAINT-GOBAIN MASTER CUSTOMER MANUFACTURING DIRECTORY'],
      ['Generated On', new Date().toLocaleString()],
      ['Total Scanned Customers', totalCustomers],
      ['Total Tracked Blocks', totalBlocks],
      ['Plant Overall Progress', `${plantProgressPercent}%`],
      ['Total Batch Weight', `${totalFacilityWeight.toLocaleString()} kg`],
      [],
      ['#', 'Customer Name', 'M.No', 'OA.No', 'Quality / Grade', 'Total Blocks', 'Completed Blocks', 'Completion Flow %', 'Total Weight (kg)', 'Clearance Status', 'Inspector']
    ];

    customers.forEach((c, i) => {
      const bTotal = c.blocks?.length || c.totalQuantity || 0;
      const bDone = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
      const pct = bTotal > 0 ? Math.round((bDone / bTotal) * 100) : 0;
      rows.push([
        i + 1,
        c.customerName,
        c.mNo,
        c.oaNo,
        c.quality,
        bTotal,
        bDone,
        `${pct}%`,
        c.totalWeight || 0,
        c.clearanceStatus || 'In Process',
        c.inspectorName || 'QA Lead'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Plant Directory');
    XLSX.writeFile(wb, `SaintGobain_Master_Customer_Directory_${Date.now()}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Executive Facility KPI Overview Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Metric 1: Total Scanned Customers */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.1))',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Orders
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {totalCustomers} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Active</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Completed Orders */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Completed Orders
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {completedOrders} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Orders</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Orders */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Orders
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              {pendingOrders} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Orders</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Tonnage / Weight */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)'
          }}>
            <Scale size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Batch Weight
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {(totalFacilityWeight / 1000).toFixed(1)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Metric Tons</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Directory Toolbar & Filter Strip */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 300px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Customer Name, M.No, OA.No, Material Grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All Customers (${customers.length})` },
              { id: 'in-progress', label: `In-Progress (${customers.filter(c => {
                const tot = c.blocks?.length || c.totalQuantity || 0;
                const comp = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
                return comp > 0 && comp < tot;
              }).length})` },
              { id: 'completed', label: `Completed (${customers.filter(c => {
                const tot = c.blocks?.length || c.totalQuantity || 0;
                const comp = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
                return tot > 0 && comp === tot;
              }).length})` },
              { id: 'pending', label: `Pending Start (${customers.filter(c => {
                const comp = c.blocks ? c.blocks.filter(b => b.isCompleted).length : 0;
                return comp === 0;
              }).length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  background: statusFilter === tab.id ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: statusFilter === tab.id ? '#04101e' : 'var(--text-secondary)',
                  borderColor: statusFilter === tab.id ? 'transparent' : 'var(--border-color)',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <option value="recent">Sort by: Recent Updates</option>
              <option value="name">Sort by: Customer Name</option>
              <option value="progress-desc">Sort by: Progress % (Highest)</option>
              <option value="weight-desc">Sort by: Weight (Highest)</option>
            </select>

            <button onClick={handleExportPlantDirectory} className="btn btn-sm btn-secondary" title="Export plant excel report">
              <Download size={14} /> Export Directory
            </button>

            <button onClick={onOpenQuickScan} className="btn btn-sm btn-primary">
              <UploadCloud size={15} /> Update / Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* 3. Customer List Table & Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Customer Order Workspaces ({sortedCustomers.length}) — Click any row to view full details & check blocks
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time synchronization active
          </span>
        </div>

        {sortedCustomers.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Building2 size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>No customers found</div>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try searching with a different keyword or update / add a new customer document.</p>
            <button onClick={onOpenQuickScan} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              <Plus size={14} /> Update / Add Customer Files
            </button>
          </div>
        ) : (
          sortedCustomers.map((cust, index) => {
            const blockCount = cust.blocks?.length || cust.totalQuantity || 0;
            const completedCount = cust.blocks ? cust.blocks.filter(b => b.isCompleted).length : 0;
            const progressPct = blockCount > 0 ? Math.round((completedCount / blockCount) * 100) : 0;
            const is100Done = progressPct === 100;

            return (
              <div
                key={cust.id || index}
                onClick={() => onSelectCustomer(cust)}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(280px, 1.8fr) minmax(180px, 1.2fr) minmax(180px, 1fr) minmax(140px, 0.8fr) auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  border: is100Done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  background: is100Done ? 'linear-gradient(145deg, rgba(16,185,129,0.06), rgba(13,20,36,0.8))' : 'var(--gradient-card)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = is100Done ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Accent indicator strip */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: is100Done ? 'var(--gradient-emerald)' : progressPct > 0 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)'
                }} />

                {/* Column 1: Customer Name, Quality & Scan Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: is100Done 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(0, 242, 254, 0.1)',
                    border: `1px solid ${is100Done ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 242, 254, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: is100Done ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {cust.customerName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {cust.quality || 'AZS Fusion Cast Refractory'}
                    </div>
                    {cust.blockDetails && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '340px' }}>
                        {cust.blockDetails}
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Order Identifiers (M.No & OA.No) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>M.No:</span>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {cust.mNo || 'M-SG-2026'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: '600' }}>OA.No:</span>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {cust.oaNo || 'OA-SG-2026'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                    <ShieldCheck size={13} color="var(--accent-emerald)" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {cust.clearanceNo || 'MC-SG-2026'}
                    </span>
                  </div>
                </div>

                {/* Column 3: Process Flow Progress & Checkbox Completion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
                      Process Flow
                    </span>
                    <span style={{
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '700',
                      color: is100Done ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
                    }}>
                      {progressPct}% ({completedCount}/{blockCount})
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '7px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${progressPct}%`,
                      height: '100%',
                      background: is100Done ? 'var(--gradient-emerald)' : 'var(--gradient-primary)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {is100Done ? 'All Blocks Checked & Cleared' : `${blockCount - completedCount} blocks remaining`}
                  </div>
                </div>

                {/* Column 4: Total Weight & Qty */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Batch Weight
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {(cust.totalWeight || 0).toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cust.weightUnit || 'kg'}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                    {blockCount} Blocks
                  </div>
                </div>

                {/* Column 5: Action Button & Enter Workspace Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {currentUser?.permissions?.canDeleteCustomer ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomer(cust.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        transition: 'color 0.2s',
                      }}
                      title="Delete Customer Record (Admin Only)"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: is100Done ? 'var(--gradient-emerald)' : 'var(--gradient-primary)',
                    color: '#04101e',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}>
                    <span>Open Data</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
