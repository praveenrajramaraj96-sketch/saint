import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  Building2, 
  Layers, 
  Check, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { parseUploadedFile, extractFromRawContent } from '../utils/parser';

export default function QuickScanModal({ isOpen, onClose, onCustomerCreated }) {
  if (!isOpen) return null;

  const [scanMode, setScanMode] = useState('upload'); // 'upload' | 'text' | 'manual'
  const [customerName, setCustomerName] = useState('');
  const [mNo, setMNo] = useState('');
  const [oaNo, setOANo] = useState('');
  const [quality, setQuality] = useState('AZS-41 Fusion Cast Refractory');
  const [blockCount, setBlockCount] = useState(8);
  const [totalWeight, setTotalWeight] = useState(9600);
  const [blockDetails, setBlockDetails] = useState('Float Glass Furnace Basin Sidewall & Channel Blocks');
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileUpload = async (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const parsed = await parseUploadedFile(file, category);
      const ext = parsed.extracted;

      const newCustomer = {
        id: `cust-${Date.now()}`,
        customerName: ext.customerName || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
        mNo: ext.mNo || `M-${Math.floor(10000 + Math.random() * 90000)}-SG-2026`,
        oaNo: ext.oaNo || `OA-SG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        quality: ext.quality || 'AZS-41 Electrically Fused Cast',
        totalQuantity: ext.totalQuantity || ext.blocks?.length || 8,
        totalWeight: ext.totalWeight || 9600,
        weightUnit: ext.weightUnit || 'kg',
        blockDetails: ext.blockDetails || 'Furnace Refractory Blocks Order',
        clearanceNo: ext.clearanceNo || `MC-SG-2026-${Math.floor(100 + Math.random() * 900)}`,
        clearanceDate: new Date().toISOString().split('T')[0],
        clearanceStatus: 'Approved & Cleared',
        inspectorName: 'Dr. V. Rajesh (Head of QA & Metallurgy)',
        createdAt: new Date().toLocaleString(),
        uploadedFiles: [{ name: file.name, type: category, size: `${(file.size/1024).toFixed(1)} KB`, timestamp: 'Just now' }],
        blocks: ext.blocks?.length ? ext.blocks : generateDemoBlocks(8, ext.quality)
      };

      onCustomerCreated(newCustomer);
      onClose();
    } catch (err) {
      setErrorMsg(`Failed to parse: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextScan = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    try {
      const ext = extractFromRawContent(rawText);
      const newCustomer = {
        id: `cust-${Date.now()}`,
        customerName: ext.customerName || 'New Scanned Customer Project',
        mNo: ext.mNo || `M-${Math.floor(10000 + Math.random() * 90000)}-SG`,
        oaNo: ext.oaNo || `OA-SG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        quality: ext.quality || 'AZS-41 Refractory',
        totalQuantity: ext.totalQuantity || ext.blocks?.length || 8,
        totalWeight: ext.totalWeight || 9600,
        weightUnit: ext.weightUnit || 'kg',
        blockDetails: ext.blockDetails || 'Custom Scanned Clearance Project',
        clearanceNo: ext.clearanceNo || `MC-SG-${Math.floor(100 + Math.random() * 900)}`,
        clearanceDate: new Date().toISOString().split('T')[0],
        clearanceStatus: 'Approved & Cleared',
        inspectorName: 'Dr. V. Rajesh (Head of QA)',
        createdAt: new Date().toLocaleString(),
        uploadedFiles: [{ name: 'Pasted_Text_Extraction.txt', type: 'LOM', size: '1.2 KB', timestamp: 'Just now' }],
        blocks: ext.blocks?.length ? ext.blocks : generateDemoBlocks(ext.totalQuantity || 8, ext.quality)
      };

      onCustomerCreated(newCustomer);
      onClose();
    } catch (err) {
      setErrorMsg(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCreate = (e) => {
    e.preventDefault();
    const qty = parseInt(blockCount, 10) || 8;
    const newCustomer = {
      id: `cust-${Date.now()}`,
      customerName: customerName || 'New Client Manufacturing Order',
      mNo: mNo || `M-${Math.floor(10000 + Math.random() * 90000)}-SG`,
      oaNo: oaNo || `OA-SG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      quality: quality || 'AZS-41 Fusion Cast Refractory',
      totalQuantity: qty,
      totalWeight: parseFloat(totalWeight) || 9600,
      weightUnit: 'kg',
      blockDetails: blockDetails || 'Custom Industrial Blocks',
      clearanceNo: `MC-SG-2026-${Math.floor(100 + Math.random() * 900)}`,
      clearanceDate: new Date().toISOString().split('T')[0],
      clearanceStatus: 'Approved & Cleared',
      inspectorName: 'Dr. V. Rajesh (Head of QA)',
      createdAt: new Date().toLocaleString(),
      uploadedFiles: [],
      blocks: generateDemoBlocks(qty, quality)
    };

    onCustomerCreated(newCustomer);
    onClose();
  };

  function generateDemoBlocks(qty, grade) {
    const blocks = [];
    for (let i = 1; i <= qty; i++) {
      blocks.push({
        id: `BLK-${String(i).padStart(3, '0')}`,
        tag: `TAG-Z${Math.ceil(i / 4)}-${String(i).padStart(2, '0')}`,
        name: `Refractory Block Unit ${i}`,
        dimensions: '1200 x 600 x 400 mm',
        weight: 1200,
        quality: grade || 'AZS-41',
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
        notes: ''
      });
    }
    return blocks;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '580px',
        padding: '2rem',
        background: 'var(--bg-app)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={22} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Update & Add Customer Order
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Extract LOM, BOM, or MC documents to update or add to the customer directory
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scan Mode Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'upload', label: 'Upload File (Excel/CSV)' },
            { id: 'text', label: 'Paste Text Document' },
            { id: 'manual', label: 'Create Record' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setScanMode(t.id)}
              className={`btn btn-sm ${scanMode === t.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(244,63,94,0.15)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.3)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        {/* Mode 1: File Upload */}
        {scanMode === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '2px dashed var(--border-color)',
              background: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              textAlign: 'center',
              gap: '0.75rem',
              transition: 'border 0.2s',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFileUpload({ target: { files: [f] } }, 'LOM'); }}
            >
              <input
                type="file"
                accept=".xlsx, .xls, .csv, .txt, .json"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'LOM')}
              />
              <UploadCloud size={36} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isProcessing ? 'Extracting Customer & Block Specs...' : 'Choose or Drop Customer File'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Supports LOM, BOM, or Manufacturing Clearance (.xlsx, .csv, .txt)
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Mode 2: Paste Raw Text */}
        {scanMode === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste customer clearance text, e.g.:
Customer: AGC Flat Glass Europe Line-2
M.No: M-99302-AGC  OA.No: OA-2026-7788
Quality: AZS-41 Refractory
Total Quantity: 10 Blocks
Total Weight: 12000 kg`}
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={onClose} className="btn btn-sm btn-secondary">Cancel</button>
              <button onClick={handleTextScan} disabled={!rawText.trim() || isProcessing} className="btn btn-sm btn-primary">
                <Sparkles size={14} /> Extract & Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Mode 3: Manual Create */}
        {scanMode === 'manual' && (
          <form onSubmit={handleManualCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Asahi Glass Europe Flat Line"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>M.No</label>
                <input
                  type="text"
                  placeholder="e.g. M-88120-SG"
                  value={mNo}
                  onChange={(e) => setMNo(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>OA.No</label>
                <input
                  type="text"
                  placeholder="e.g. OA-2026-4411"
                  value={oaNo}
                  onChange={(e) => setOANo(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Total Blocks</label>
                <input
                  type="number"
                  value={blockCount}
                  onChange={(e) => setBlockCount(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Total Weight (kg)</label>
                <input
                  type="number"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Quality / Grade</label>
              <input
                type="text"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-sm btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-sm btn-primary">
                <Check size={14} /> Create Customer Workspace
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
