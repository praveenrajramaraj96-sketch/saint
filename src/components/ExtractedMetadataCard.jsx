import React, { useState } from 'react';
import { 
  Building2, 
  Hash, 
  FileCheck2, 
  Award, 
  Scale, 
  Boxes, 
  Info, 
  Edit3, 
  Copy, 
  Check, 
  ShieldCheck, 
  Calendar, 
  UserCheck 
} from 'lucide-react';

export default function ExtractedMetadataCard({ data, onUpdateData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...data });
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateData(formData);
    setIsEditing(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(0,242,254,0.1))',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Extracted Project Specifications
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Auto-extracted parameters from LOM, BOM & Manufacturing Clearance
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...data });
            setIsEditing(!isEditing);
          }}
          className={`btn btn-sm ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Parameters'}
        </button>
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName || ''}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                M.No (Manufacturing No)
              </label>
              <input
                type="text"
                value={formData.mNo || ''}
                onChange={(e) => setFormData({ ...formData, mNo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                OA.No (Order Acceptance No)
              </label>
              <input
                type="text"
                value={formData.oaNo || ''}
                onChange={(e) => setFormData({ ...formData, oaNo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                Quality / Material Grade
              </label>
              <input
                type="text"
                value={formData.quality || ''}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                Total Quantity (Blocks)
              </label>
              <input
                type="number"
                value={formData.totalQuantity || 0}
                onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value, 10) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                Total Weight ({formData.weightUnit || 'kg'})
              </label>
              <input
                type="number"
                value={formData.totalWeight || 0}
                onChange={(e) => setFormData({ ...formData, totalWeight: parseFloat(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Block Details Summary & Scope
            </label>
            <textarea
              value={formData.blockDetails || ''}
              onChange={(e) => setFormData({ ...formData, blockDetails: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-sm btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              <Check size={14} /> Save Specifications
            </button>
          </div>
        </form>
      ) : (
        /* Display Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* Card 1: Customer Name */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
                Customer Name
              </span>
              <button
                onClick={() => handleCopy(data.customerName, 'customer')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Copy Customer Name"
              >
                {copiedField === 'customer' ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
              </button>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {data.customerName || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending document upload</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Client Verified</span>
              {data.inspectorName && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  QA: {data.inspectorName}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Manufacturing & Order Acceptance (M.No & OA.No) */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
              Order Identifiers
            </span>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-cyan)' }}>M.No:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {data.mNo || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(data.mNo, 'mNo')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Copy M.No"
              >
                {copiedField === 'mNo' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-purple)' }}>OA.No:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {data.oaNo || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(data.oaNo, 'oaNo')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Copy OA.No"
              >
                {copiedField === 'oaNo' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* Card 3: Quality / Grade & Clearance Status */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
                Quality & Material Grade
              </span>
              <Award size={16} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {data.quality || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Specification not set</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                <ShieldCheck size={12} /> {data.clearanceStatus || 'MC Approved'}
              </span>
              {data.clearanceNo && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  #{data.clearanceNo}
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Quantity & Batch Weight Summary */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
                Quantity & Total Weight
              </span>
              <Scale size={16} color="var(--accent-cyan)" />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {data.totalQuantity || data.blocks?.length || 0}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Blocks</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                  {(data.totalWeight || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                  {data.weightUnit || 'kg'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Avg block weight: {data.blocks?.length > 0 ? Math.round((data.totalWeight || 0) / data.blocks.length) : 0} {data.weightUnit || 'kg'}
            </div>
          </div>
        </div>
      )}

      {/* Block Details Scope Description */}
      {data.blockDetails && !isEditing && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(0, 242, 254, 0.03)',
          border: '1px solid rgba(0, 242, 254, 0.15)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
        }}>
          <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Scope & Block Details:
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {data.blockDetails}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
