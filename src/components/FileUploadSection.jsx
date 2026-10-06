import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldCheck, 
  ClipboardList, 
  Layers, 
  AlertCircle,
  FileCode,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { parseUploadedFile, downloadSampleTemplate, extractFromRawContent } from '../utils/parser';

export default function FileUploadSection({ 
  onDataExtracted, 
  uploadedFiles = [], 
  onFileDelete, 
  onLoadSample,
  currentData
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'templates'
  const [dragOverZone, setDragOverZone] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const lomInputRef = useRef(null);
  const bomInputRef = useRef(null);
  const mcInputRef = useRef(null);

  // File Upload Handlers
  const handleFileUpload = async (e, category) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file, category);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    setDragOverZone(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file, category);
  };

  const processFile = async (file, category) => {
    setIsProcessing(true);
    setFeedbackMsg({ type: 'info', text: `Analyzing and extracting data from ${file.name} (${category})...` });

    try {
      const parsedResult = await parseUploadedFile(file, category, currentData);
      onDataExtracted(parsedResult.extracted, {
        name: file.name,
        type: category,
        size: (file.size / 1024).toFixed(1) + ' KB',
        timestamp: new Date().toLocaleTimeString(),
      });
      setFeedbackMsg({ 
        type: 'success', 
        text: `Extracted ${parsedResult.extracted.blocks.length} blocks, Customer, M.No & OA.No successfully!` 
      });
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: `Failed to parse file: ${err.message}` });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handlePasteExtract = () => {
    if (!pasteText.trim()) return;
    setIsProcessing(true);
    try {
      const extracted = extractFromRawContent(pasteText, currentData);
      onDataExtracted(extracted, {
        name: 'Manual Text Extraction',
        type: 'Raw Paste',
        size: `${pasteText.length} chars`,
        timestamp: new Date().toLocaleTimeString(),
      });
      setFeedbackMsg({ 
        type: 'success', 
        text: `Successfully extracted ${extracted.blocks.length} blocks from pasted text!` 
      });
      setPasteText('');
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: `Error extracting text: ${err.message}` });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const uploadSlots = [
    {
      id: 'LOM',
      title: 'List of Material (LOM)',
      sub: 'Block IDs, Dimensions, Tag Nos, Weights',
      icon: Layers,
      color: '#00f2fe',
      accentBg: 'rgba(0, 242, 254, 0.08)',
      inputRef: lomInputRef,
    },
    {
      id: 'BOM',
      title: 'Bill of Material (BOM)',
      sub: 'Customer Name, M.No, OA.No, Quality Grade',
      icon: ClipboardList,
      color: '#3b82f6',
      accentBg: 'rgba(59, 130, 246, 0.08)',
      inputRef: bomInputRef,
    },
    {
      id: 'MC',
      title: 'Manufacturing Clearance (MC)',
      sub: 'Clearance No, QA Inspector, Batch Approval',
      icon: ShieldCheck,
      color: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.08)',
      inputRef: mcInputRef,
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Top Bar with Navigation & 1-Click Demos */}
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
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#04101e',
          }}>
            <UploadCloud size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Document Upload & Extraction Center
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Upload LOM, BOM, & Manufacturing Clearance files (Excel .xlsx, CSV, TXT)
            </p>
          </div>
        </div>

        {/* Action Tabs & Quick Demos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('upload')}
            className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileSpreadsheet size={15} /> Upload Files
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`btn btn-sm ${activeTab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileCode size={15} /> Paste Unstructured Text
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`btn btn-sm ${activeTab === 'templates' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Download size={15} /> Sample Templates
          </button>

          {/* Quick Demo Preload Button */}
          <button
            onClick={() => onLoadSample('refractory')}
            className="btn btn-sm btn-emerald"
            title="Load realistic Saint-Gobain Refractory Blocks order with 1 click"
          >
            <Sparkles size={15} /> Load Demo Batch (Saint-Gobain)
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: feedbackMsg.type === 'error' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
          color: feedbackMsg.type === 'error' ? '#fda4af' : '#6ee7b7',
          border: `1px solid ${feedbackMsg.type === 'error' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
        }}>
          {feedbackMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {feedbackMsg.text}
        </div>
      )}

      {/* TAB 1: 3-Slot File Upload Dropzones */}
      {activeTab === 'upload' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {uploadSlots.map((slot) => {
              const Icon = slot.icon;
              const isDrag = dragOverZone === slot.id;
              const hasUploaded = uploadedFiles.some(f => f.type === slot.id);
              const fileInfo = uploadedFiles.find(f => f.type === slot.id);

              return (
                <div
                  key={slot.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOverZone(slot.id); }}
                  onDragLeave={() => setDragOverZone(null)}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  onClick={() => slot.inputRef.current?.click()}
                  style={{
                    position: 'relative',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: isDrag ? 'rgba(0, 242, 254, 0.12)' : slot.accentBg,
                    border: isDrag 
                      ? `2px dashed ${slot.color}` 
                      : hasUploaded 
                      ? `1px solid ${slot.color}` 
                      : '1px dashed rgba(255, 255, 255, 0.18)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    ref={slot.inputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv, .txt, .json"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, slot.id)}
                  />

                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `rgba(255, 255, 255, 0.05)`,
                    border: `1px solid ${slot.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: slot.color,
                  }}>
                    <Icon size={24} />
                  </div>

                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {slot.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {slot.sub}
                    </div>
                  </div>

                  {hasUploaded ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      <CheckCircle size={14} /> {fileInfo.name} ({fileInfo.size})
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      padding: '0.25rem 0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '4px',
                    }}>
                      Drop Excel / CSV / TXT or Click to Browse
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Uploaded Files Summary List */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Document Sessions ({uploadedFiles.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {uploadedFiles.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span className={`badge ${f.type === 'LOM' ? 'badge-cyan' : f.type === 'BOM' ? 'badge-purple' : 'badge-emerald'}`}>
                      {f.type}
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{f.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({f.size})</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onFileDelete(idx); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Paste Raw Text Tab */}
      {activeTab === 'paste' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Paste any unformatted text from email approvals, ERP printouts, or clearance sheets to auto-extract Customer Name, M.No, OA.No, Quality, Weight, and Blocks.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`Example:
Customer: Saint-Gobain Glass India Ltd
M.No: M-88492-SG-2026   OA.No: OA-SG-2026-4491
Quality: AZS-41 Fusion Cast Refractory
Total Quantity: 10 Blocks
Total Weight: 12500 kg
Block Details: Basin Wall & Forehearth Blocks

BLK-01 | BW-01 | Basin Wall Corner | 1200x600x400 mm | 1250 kg
BLK-02 | BW-02 | Basin Wall Side | 1000x500x400 mm | 980 kg`}
            rows={7}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button onClick={() => setPasteText('')} className="btn btn-sm btn-secondary">
              Clear
            </button>
            <button onClick={handlePasteExtract} disabled={!pasteText.trim()} className="btn btn-sm btn-primary">
              <Sparkles size={14} /> Extract Process Flow
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Download Excel Templates */}
      {activeTab === 'templates' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          padding: '0.5rem 0',
        }}>
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              1. List of Material (LOM) Template
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Contains structured column headers for Block ID, Block Tag, Dimensions, Individual Weight, and Grade.
            </p>
            <button onClick={() => downloadSampleTemplate('LOM')} className="btn btn-sm btn-secondary" style={{ marginTop: 'auto' }}>
              <Download size={14} /> Download LOM Template (.xlsx)
            </button>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-blue)' }}>
              2. Bill of Material (BOM) Template
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Contains Order specifications, Customer info, M.No, OA.No, and raw material batch breakdown.
            </p>
            <button onClick={() => downloadSampleTemplate('BOM')} className="btn btn-sm btn-secondary" style={{ marginTop: 'auto' }}>
              <Download size={14} /> Download BOM Template (.xlsx)
            </button>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              3. Manufacturing Clearance (MC) Template
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Includes QA inspector certificate, sign-off clearance milestone stages, and batch approvals.
            </p>
            <button onClick={() => downloadSampleTemplate('MC')} className="btn btn-sm btn-secondary" style={{ marginTop: 'auto' }}>
              <Download size={14} /> Download MC Template (.xlsx)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
