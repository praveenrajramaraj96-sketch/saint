import React from 'react';
import { FileText, Download, Printer, X, CheckCircle, ShieldCheck, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const totalBlocks = data.blocks?.length || 0;
  const completedBlocks = data.blocks?.filter(b => b.isCompleted).length || 0;
  const progressPercent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  const completedWeight = data.blocks?.filter(b => b.isCompleted).reduce((acc, b) => acc + (b.weight || 0), 0) || 0;

  // Generate and download PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(9, 13, 22);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(0, 242, 254);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MANUFACTURING PROCESS & CLEARANCE TRAVELER', 14, 18);

    doc.setTextColor(200, 210, 230);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()} | Saint-Gobain Industrial Process Flow`, 14, 26);

    // Summary Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 44, 182, 38, 3, 3, 'FD');

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Customer: ${data.customerName || 'N/A'}`, 18, 52);
    doc.text(`M.No: ${data.mNo || 'N/A'}`, 18, 60);
    doc.text(`OA.No: ${data.oaNo || 'N/A'}`, 100, 60);
    doc.text(`Quality / Grade: ${data.quality || 'N/A'}`, 18, 68);
    doc.text(`Clearance No: ${data.clearanceNo || 'MC-SG-2026-ACTIVE'}`, 100, 68);
    doc.text(`Total Weight: ${(data.totalWeight || 0).toLocaleString()} ${data.weightUnit || 'kg'}`, 18, 76);
    doc.text(`Completion Status: ${completedBlocks}/${totalBlocks} Blocks (${progressPercent}%)`, 100, 76);

    // Blocks Table
    const tableRows = (data.blocks || []).map((b, i) => [
      b.id,
      b.tag,
      b.name,
      b.dimensions,
      `${(b.weight || 0).toLocaleString()} ${data.weightUnit || 'kg'}`,
      b.quality,
      b.isCompleted ? 'COMPLETED (100%)' : (b.qcStatus || 'In Process'),
      b.completedAt || '-'
    ]);

    autoTable(doc, {
      startY: 88,
      head: [['ID', 'Tag', 'Description', 'Dimensions', 'Weight', 'Grade', 'Status', 'Date Completed']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [245, 248, 250] }
    });

    // Signature Footer
    const finalY = doc.lastAutoTable.finalY + 20;
    if (finalY < 260) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Prepared by: Process Engineering', 18, finalY);
      doc.text('Quality Assurance Sign-Off: ____________________', 100, finalY);
    }

    doc.save(`Process_Clearance_Traveler_${data.mNo || 'SG'}_${Date.now()}.pdf`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const summaryData = [
      ['MANUFACTURING PROCESS & CLEARANCE TRAVELER REPORT'],
      ['Customer Name', data.customerName || ''],
      ['M.No', data.mNo || ''],
      ['OA.No', data.oaNo || ''],
      ['Quality Grade', data.quality || ''],
      ['Clearance No', data.clearanceNo || ''],
      ['Clearance Status', data.clearanceStatus || ''],
      ['Total Quantity', totalBlocks],
      ['Completed Blocks', completedBlocks],
      ['Completion Flow %', `${progressPercent}%`],
      ['Total Weight', `${(data.totalWeight || 0)} ${data.weightUnit || 'kg'}`],
      ['Completed Weight', `${completedWeight} ${data.weightUnit || 'kg'}`],
      [],
      ['Block ID', 'Block Tag', 'Block Description', 'Dimensions', 'Weight', 'Grade', 'M.No', 'OA.No', 'Completed', 'QC Status', 'Completed At', 'Notes']
    ];

    (data.blocks || []).forEach(b => {
      summaryData.push([
        b.id,
        b.tag,
        b.name,
        b.dimensions,
        b.weight,
        b.quality,
        b.mNo || data.mNo,
        b.oaNo || data.oaNo,
        b.isCompleted ? 'YES' : 'NO',
        b.qcStatus,
        b.completedAt || '',
        b.notes || ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, 'Process Clearance');
    XLSX.writeFile(wb, `Manufacturing_Process_Report_${data.mNo || 'SG'}.xlsx`);
  };

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
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        background: 'var(--bg-app)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={24} color="var(--accent-cyan)" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Manufacturing Clearance & Process Traveler
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official summary traveler card for shop-floor tracking and QA sign-off
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Executive summary grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{data.customerName || 'N/A'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Manufacturing No (M.No)</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{data.mNo || 'N/A'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Acceptance (OA.No)</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{data.oaNo || 'N/A'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quality Grade</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{data.quality || 'N/A'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Progress Status</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              {progressPercent}% ({completedBlocks}/{totalBlocks} Blocks)
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Weight</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {completedWeight.toLocaleString()} / {(data.totalWeight || 0).toLocaleString()} {data.weightUnit || 'kg'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} /> Print Shop Traveler
          </button>
          <button onClick={handleExportExcel} className="btn btn-secondary">
            <Download size={16} /> Export Excel (.xlsx)
          </button>
          <button onClick={handleExportPDF} className="btn btn-primary">
            <Download size={16} /> Download PDF Traveler
          </button>
        </div>
      </div>
    </div>
  );
}
