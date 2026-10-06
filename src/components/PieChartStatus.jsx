import React, { useState } from 'react';
import { PieChart as PieIcon, CheckCircle2, Clock, AlertCircle, Sparkles, TrendingUp, Layers } from 'lucide-react';

export default function PieChartStatus({ blocks = [], totalWeight = 0, weightUnit = 'kg', onFilterStatus, currentFilter }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter(b => b.isCompleted).length;
  
  // Categorize in-progress: not fully completed, but has at least 1 sub-stage or in review
  const inProgressBlocks = blocks.filter(b => !b.isCompleted && (
    b.qcStatus === 'In Review' || 
    (b.stages && (b.stages.moldingCasting || b.stages.machiningCutting))
  )).length;

  const pendingBlocks = Math.max(0, totalBlocks - completedBlocks - inProgressBlocks);

  const completionPercentage = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  
  const completedWeight = blocks.filter(b => b.isCompleted).reduce((sum, b) => sum + (b.weight || 0), 0);
  const weightPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : completionPercentage;

  // Donut chart parameters
  const size = 260;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Slices data
  const slices = [
    {
      id: 'completed',
      label: 'Completed Blocks',
      count: completedBlocks,
      color: '#10b981', // Emerald
      glowColor: 'rgba(16, 185, 129, 0.4)',
      gradientId: 'grad-completed',
      percent: totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0,
      icon: CheckCircle2,
    },
    {
      id: 'in-progress',
      label: 'In Progress / Machining',
      count: inProgressBlocks,
      color: '#00f2fe', // Cyan
      glowColor: 'rgba(0, 242, 254, 0.4)',
      gradientId: 'grad-in-progress',
      percent: totalBlocks > 0 ? (inProgressBlocks / totalBlocks) * 100 : 0,
      icon: Clock,
    },
    {
      id: 'pending',
      label: 'Pending Production',
      count: pendingBlocks,
      color: '#64748b', // Slate
      glowColor: 'rgba(100, 116, 139, 0.3)',
      gradientId: 'grad-pending',
      percent: totalBlocks > 0 ? (pendingBlocks / totalBlocks) * 100 : 0,
      icon: AlertCircle,
    },
  ];

  // Calculate SVG stroke dashes
  let cumulativePercent = 0;
  const renderedSlices = slices.map(slice => {
    const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += slice.percent;

    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: completionPercentage === 100 
          ? 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(0,242,254,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(30px)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(79,172,254,0.1))',
            border: '1px solid rgba(0,242,254,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <PieIcon size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Process Completion Status
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Real-time block checklist & manufacturing flow
            </p>
          </div>
        </div>

        {completionPercentage === 100 ? (
          <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem' }}>
            <Sparkles size={14} /> 100% COMPLETE
          </span>
        ) : (
          <span className="badge badge-cyan" style={{ padding: '0.35rem 0.75rem' }}>
            <TrendingUp size={13} style={{ marginRight: '4px' }} /> {completionPercentage}% FLOW
          </span>
        )}
      </div>

      {/* Chart Layout: Donut Chart + Stats & Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '2rem',
        alignItems: 'center',
      }}>
        {/* SVG Donut / Pie Chart */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
            <defs>
              <linearGradient id="grad-completed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-in-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="grad-pending" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />

            {/* Donut Slices */}
            {totalBlocks === 0 ? (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={strokeWidth}
                strokeDasharray="4 4"
              />
            ) : (
              renderedSlices.map(slice => {
                if (slice.percent === 0) return null;
                const isHovered = hoveredSlice === slice.id;
                return (
                  <circle
                    key={slice.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={`url(#${slice.gradientId})`}
                    strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    filter={isHovered ? 'url(#glow-effect)' : 'none'}
                    style={{
                      transition: 'all 0.35s ease',
                      cursor: 'pointer',
                      transformOrigin: 'center',
                    }}
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => onFilterStatus && onFilterStatus(currentFilter === slice.id ? 'all' : slice.id)}
                  />
                );
              })
            )}
          </svg>

          {/* Center Hub Display */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}>
            <span style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
              background: completionPercentage === 100 ? 'var(--gradient-emerald)' : 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {completionPercentage}%
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>
              {completedBlocks} of {totalBlocks} Blocks
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Completed
            </span>
          </div>
        </div>

        {/* Legend & Breakdown Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {slices.map(slice => {
            const isHovered = hoveredSlice === slice.id;
            const isSelected = currentFilter === slice.id;
            const Icon = slice.icon;

            return (
              <div
                key={slice.id}
                onClick={() => onFilterStatus && onFilterStatus(currentFilter === slice.id ? 'all' : slice.id)}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected 
                    ? 'rgba(255, 255, 255, 0.09)' 
                    : isHovered 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.2)',
                  border: isSelected 
                    ? `1px solid ${slice.color}` 
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isHovered ? `0 4px 12px ${slice.glowColor}` : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    background: slice.color,
                    boxShadow: `0 0 8px ${slice.color}`
                  }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Icon size={14} color={slice.color} />
                      {slice.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {slice.count} blocks ({Math.round(slice.percent)}%)
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: slice.color
                  }}>
                    {slice.count}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '2px' }}>
                    /{totalBlocks}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick Metrics Bar: Weight Completion & QA Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: '0.25rem'
          }}>
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Completed Weight
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {completedWeight.toLocaleString()} {weightUnit}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                {weightPercentage}% of total {totalWeight.toLocaleString()} {weightUnit}
              </div>
            </div>

            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Clearance Gate
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Layers size={14} /> Stage 4 / 6
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                Manufacturing Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
