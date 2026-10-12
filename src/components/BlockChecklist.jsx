import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Tag, 
  Maximize2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BlockChecklist({ 
  blocks = [], 
  onToggleBlock, 
  onToggleSubStage, 
  onBulkUpdate, 
  onAddBlock, 
  onDeleteBlock,
  onEditBlock,
  weightUnit = 'kg',
  currentFilter = 'all',
  onFilterChange,
  currentUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('id-asc'); // 'id-asc' | 'weight-desc' | 'status'
  const [expandedBlockId, setExpandedBlockId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  // New Block Form state
  const [newBlock, setNewBlock] = useState({
    tag: '',
    name: '',
    dimensions: '1200 x 600 x 400 mm',
    weight: 950,
    quality: 'AZS-41 Refractory',
    notes: '',
  });

  // Filter and search logic
  const filteredBlocks = blocks.filter(block => {
    // Status filter
    if (currentFilter === 'completed' && !block.isCompleted) return false;
    if (currentFilter === 'pending' && (block.isCompleted || block.qcStatus === 'In Review')) return false;
    if (currentFilter === 'in-progress' && (block.isCompleted || (block.qcStatus !== 'In Review' && !block.stages?.moldingCasting))) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTag = block.tag?.toLowerCase().includes(q);
      const matchName = block.name?.toLowerCase().includes(q);
      const matchId = block.id?.toLowerCase().includes(q);
      const matchDim = block.dimensions?.toLowerCase().includes(q);
      const matchQuality = block.quality?.toLowerCase().includes(q);
      return matchTag || matchName || matchId || matchDim || matchQuality;
    }
    return true;
  });

  // Sort logic
  const sortedBlocks = [...filteredBlocks].sort((a, b) => {
    if (sortBy === 'weight-desc') return (b.weight || 0) - (a.weight || 0);
    if (sortBy === 'status') return (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0);
    return (a.id || '').localeCompare(b.id || '', undefined, { numeric: true });
  });

  // Handle master checkbox toggle
  const handleCheckboxClick = (blockId, currentCompleted) => {
    const nextCompleted = !currentCompleted;
    onToggleBlock(blockId, nextCompleted);

    // If all blocks become completed, trigger fireworks celebration
    const willAllBeComplete = blocks.every(b => b.id === blockId ? nextCompleted : b.isCompleted);
    if (willAllBeComplete && nextCompleted) {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#10b981', '#38bdf8', '#f59e0b', '#ec4899']
    });
  };

  const handleCreateBlock = (e) => {
    e.preventDefault();
    const id = `BLK-${String(blocks.length + 1).padStart(3, '0')}`;
    const blockToAdd = {
      id,
      tag: newBlock.tag || `BW-TAG-${String(blocks.length + 1).padStart(2, '0')}`,
      name: newBlock.name || `Refractory Block ${blocks.length + 1}`,
      dimensions: newBlock.dimensions || '1200 x 600 x 400 mm',
      weight: parseFloat(newBlock.weight) || 900,
      quality: newBlock.quality || 'AZS-41',
      isCompleted: false,
      completedAt: null,
      qcStatus: 'Pending',
      stages: {
        lomVerified: true,
        bomAllocated: true,
        mcApproved: true,
        moldingCasting: false,
        machiningCutting: false,
        qualityInspection: false,
        readyForDispatch: false,
      },
      notes: newBlock.notes || ''
    };

    onAddBlock(blockToAdd);
    setIsAddModalOpen(false);
    setNewBlock({ tag: '', name: '', dimensions: '1200 x 600 x 400 mm', weight: 950, quality: 'AZS-41 Refractory', notes: '' });
  };

  const completedCount = blocks.filter(b => b.isCompleted).length;
  const totalCount = blocks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--gradient-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Manufacturing Block Process Checklist
              </h2>
              <span className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)' }}>
                {completedCount} / {totalCount} Done ({progressPercent}%)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Tick the checkbox for each block as it completes manufacturing clearance & quality inspection
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onBulkUpdate(true)}
            className="btn btn-sm btn-secondary"
            title="Mark all blocks as completed"
          >
            <CheckCircle2 size={14} color="var(--accent-emerald)" /> Mark All Complete
          </button>
          <button
            onClick={() => onBulkUpdate(false)}
            className="btn btn-sm btn-secondary"
            title="Reset all checkboxes"
          >
            <Clock size={14} /> Reset All
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-sm btn-primary"
          >
            <Plus size={14} /> Add Block
          </button>
        </div>
      </div>

      {/* Progress Track Strip */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100 ? 'var(--gradient-emerald)' : 'var(--gradient-primary)',
            borderRadius: '4px',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: progressPercent > 0 ? '0 0 10px rgba(0, 242, 254, 0.5)' : 'none'
          }} />
        </div>
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          minWidth: '260px',
          flex: '1 1 260px',
        }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search block tag, dimension, grade, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${blocks.length})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'in-progress', label: `In Progress (${blocks.filter(b => !b.isCompleted && (b.qcStatus === 'In Review' || b.stages?.moldingCasting)).length})` },
            { id: 'pending', label: `Pending (${blocks.filter(b => !b.isCompleted && b.qcStatus !== 'In Review' && !b.stages?.moldingCasting).length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid',
                background: currentFilter === tab.id ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: currentFilter === tab.id ? '#04101e' : 'var(--text-secondary)',
                borderColor: currentFilter === tab.id ? 'transparent' : 'var(--border-color)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.5rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <option value="id-asc">Sort by ID (Ascending)</option>
          <option value="weight-desc">Sort by Weight (Highest)</option>
          <option value="status">Sort by Status (Completed First)</option>
        </select>
      </div>

      {/* Block Checklist Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.85rem 1rem', width: '60px', textAlign: 'center' }}>Check</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Block ID / Tag</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Block Description</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Dimensions (L x W x H)</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Weight</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Grade / Quality</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>QC Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Process Flow</th>
            </tr>
          </thead>
          <tbody>
            {sortedBlocks.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No blocks match the current search / filter criteria.
                </td>
              </tr>
            ) : (
              sortedBlocks.map((block) => {
                const isExpanded = expandedBlockId === block.id;
                const stages = block.stages || {};
                const stageCount = [
                  stages.lomVerified,
                  stages.bomAllocated,
                  stages.mcApproved,
                  stages.moldingCasting,
                  stages.machiningCutting,
                  stages.qualityInspection,
                  stages.readyForDispatch,
                ].filter(Boolean).length;
                const stagePercent = Math.round((stageCount / 7) * 100);

                return (
                  <React.Fragment key={block.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        background: block.isCompleted 
                          ? 'rgba(16, 185, 129, 0.04)' 
                          : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Checkbox Cell */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleCheckboxClick(block.id, block.isCompleted)}
                          style={{
                            background: block.isCompleted ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                            border: `2px solid ${block.isCompleted ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.25)'}`,
                            borderRadius: '6px',
                            width: '24px',
                            height: '24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#000',
                            transition: 'all 0.2s ease',
                            boxShadow: block.isCompleted ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                          }}
                          title={block.isCompleted ? "Mark as Incomplete" : "Tick to mark Block as Completed"}
                        >
                          {block.isCompleted && <Check size={16} strokeWidth={3} color="#ffffff" />}
                        </button>
                      </td>

                      {/* Block ID & Tag */}
                      <td style={{ padding: '0.75rem 0.75rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {block.id}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                          <Tag size={12} color="var(--accent-cyan)" />
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                            {block.tag || 'TAG-N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Block Name */}
                      <td style={{ padding: '0.75rem 0.75rem', fontWeight: '600', color: block.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        <div>{block.name}</div>
                        {block.completedAt && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                            Completed: {block.completedAt}
                          </div>
                        )}
                      </td>

                      {/* Dimensions */}
                      <td style={{ padding: '0.75rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {block.dimensions}
                      </td>

                      {/* Weight */}
                      <td style={{ padding: '0.75rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {(block.weight || 0).toLocaleString()} {weightUnit}
                      </td>

                      {/* Quality Grade */}
                      <td style={{ padding: '0.75rem 0.75rem' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {block.quality}
                        </span>
                      </td>

                      {/* QC Status */}
                      <td style={{ padding: '0.75rem 0.75rem' }}>
                        <span className={`badge ${
                          block.isCompleted || block.qcStatus === 'Passed' 
                            ? 'badge-emerald' 
                            : block.qcStatus === 'In Review' 
                            ? 'badge-cyan' 
                            : 'badge-amber'
                        }`}>
                          {block.isCompleted ? 'Passed & Ready' : (block.qcStatus || 'Pending')}
                        </span>
                      </td>

                      {/* Actions & Process Flow Dropdown */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: block.isCompleted ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
                            {block.isCompleted ? '100%' : `${stagePercent}%`}
                          </span>

                          <button
                            onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              padding: '0.25rem 0.45rem',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.72rem'
                            }}
                            title="Toggle Sub-Stage Process Checklist"
                          >
                            Stages {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>

                          <button
                            onClick={() => onDeleteBlock(block.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                            title="Delete Block"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-Stage Flow Details (Accordion View) */}
                    {isExpanded && (
                      <tr style={{ background: 'rgba(0, 0, 0, 0.25)', borderBottom: '1px solid var(--border-color)' }}>
                        <td colSpan={8} style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Process Stage Checklist for {block.tag} ({block.name})
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Stage Progress: {stageCount}/7 Cleared
                              </span>
                            </div>

                            {/* 7 Stage Flow Chips */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                              gap: '0.5rem',
                            }}>
                              {[
                                { key: 'lomVerified', label: '1. LOM Verified', dept: 'assembly' },
                                { key: 'bomAllocated', label: '2. BOM Allocated', dept: 'assembly' },
                                { key: 'mcApproved', label: '3. MC Approved', dept: 'assembly' },
                                { key: 'moldingCasting', label: '4. Mold / Fusion', dept: 'assembly' },
                                { key: 'machiningCutting', label: '5. Machining / Cutting', dept: 'finishing' },
                                { key: 'qualityInspection', label: '6. QC Inspection', dept: 'finishing' },
                                { key: 'readyForDispatch', label: '7. Ready for Dispatch', dept: 'finishing' },
                              ].map(stage => {
                                const isStageDone = stages[stage.key];
                                const isMyDept = currentUser?.role === 'admin' || currentUser?.role === stage.dept;

                                return (
                                  <div
                                    key={stage.key}
                                    onClick={() => onToggleSubStage(block.id, stage.key, !isStageDone)}
                                    style={{
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: 'var(--radius-sm)',
                                      background: isStageDone 
                                        ? 'rgba(16, 185, 129, 0.12)' 
                                        : isMyDept 
                                        ? (stage.dept === 'assembly' ? 'rgba(0, 242, 254, 0.05)' : 'rgba(16, 185, 129, 0.05)')
                                        : 'rgba(255, 255, 255, 0.02)',
                                      border: `1px solid ${
                                        isStageDone 
                                          ? 'rgba(16, 185, 129, 0.35)' 
                                          : isMyDept 
                                          ? (stage.dept === 'assembly' ? 'rgba(0, 242, 254, 0.3)' : 'rgba(16, 185, 129, 0.3)')
                                          : 'rgba(255, 255, 255, 0.06)'
                                      }`,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '0.4rem',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      color: isStageDone ? '#34d399' : 'var(--text-secondary)',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                      <input
                                        type="checkbox"
                                        checked={!!isStageDone}
                                        onChange={() => {}}
                                        style={{ accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                                      />
                                      <span>{stage.label}</span>
                                    </div>

                                    <span style={{
                                      fontSize: '0.62rem',
                                      textTransform: 'uppercase',
                                      fontWeight: '700',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      background: stage.dept === 'assembly' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                      color: stage.dept === 'assembly' ? '#38bdf8' : '#34d399',
                                    }}>
                                      {stage.dept === 'assembly' ? 'Assembly' : 'Finishing'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {block.notes && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                                <strong>Notes:</strong> {block.notes}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Block Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Add Manufacturing Block Item
            </h3>

            <form onSubmit={handleCreateBlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Block Tag / Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. BW-Z1-05"
                  value={newBlock.tag}
                  onChange={(e) => setNewBlock({ ...newBlock, tag: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Block Description / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Basin Sidewall Corner Block"
                  value={newBlock.name}
                  onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                    Dimensions (L x W x H)
                  </label>
                  <input
                    type="text"
                    value={newBlock.dimensions}
                    onChange={(e) => setNewBlock({ ...newBlock, dimensions: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                    Weight ({weightUnit})
                  </label>
                  <input
                    type="number"
                    value={newBlock.weight}
                    onChange={(e) => setNewBlock({ ...newBlock, weight: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Quality / Grade
                </label>
                <input
                  type="text"
                  value={newBlock.quality}
                  onChange={(e) => setNewBlock({ ...newBlock, quality: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                  Inspection Notes
                </label>
                <textarea
                  value={newBlock.notes}
                  onChange={(e) => setNewBlock({ ...newBlock, notes: e.target.value })}
                  rows={2}
                  placeholder="Special tolerances or testing remarks..."
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-sm btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
