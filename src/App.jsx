import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerDirectory from './components/CustomerDirectory';
import FileUploadSection from './components/FileUploadSection';
import ExtractedMetadataCard from './components/ExtractedMetadataCard';
import PieChartStatus from './components/PieChartStatus';
import BlockChecklist from './components/BlockChecklist';
import ReportModal from './components/ReportModal';
import QuickScanModal from './components/QuickScanModal';
import { INITIAL_CUSTOMERS } from './utils/parser';

const STORAGE_KEY = 'saint_gobain_multi_customer_data_v2';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mfg_theme') || 'dark';
  });

  // Master Multi-Customer List
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading saved customers:', e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Active View State: null = 1st Page (Customer Directory List), or customer object = 2nd Page (Customer Details & Blocks)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Modals & Filters
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);
  const [currentBlockFilter, setCurrentBlockFilter] = useState('all');

  // Active Customer Object
  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mfg_theme', theme);
  }, [theme]);

  // Persist customers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Select a customer to open detail workspace
  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to 1st Page (Customer List)
  const handleBackToDirectory = () => {
    setSelectedCustomerId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new customer from Quick Scan
  const handleCustomerCreated = (newCust) => {
    setCustomers(prev => [newCust, ...prev]);
    setSelectedCustomerId(newCust.id); // Automatically open newly scanned customer workspace!
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to remove this customer record?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
      }
    }
  };

  // Update active customer metadata (Customer Name, M.No, OA.No, Quality, etc.)
  const handleUpdateCustomerData = (updatedFields) => {
    if (!selectedCustomerId) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        return { ...c, ...updatedFields };
      }
      return c;
    }));
  };

  // Upload/Extract files for active customer
  const handleDataExtracted = (extracted, fileMeta) => {
    if (!selectedCustomerId) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        let updatedBlocks = [...(c.blocks || [])];

        if (extracted.blocks && extracted.blocks.length > 0) {
          if (updatedBlocks.length === 0 || fileMeta?.type === 'LOM') {
            updatedBlocks = extracted.blocks;
          } else {
            extracted.blocks.forEach(newB => {
              const existingIdx = updatedBlocks.findIndex(b => b.tag === newB.tag || b.id === newB.id);
              if (existingIdx !== -1) {
                updatedBlocks[existingIdx] = { ...updatedBlocks[existingIdx], ...newB };
              } else {
                updatedBlocks.push(newB);
              }
            });
          }
        }

        const currentFiles = c.uploadedFiles || [];
        const newFiles = fileMeta ? [fileMeta, ...currentFiles.filter(f => f.name !== fileMeta.name)] : currentFiles;

        return {
          ...c,
          customerName: extracted.customerName || c.customerName,
          mNo: extracted.mNo || c.mNo,
          oaNo: extracted.oaNo || c.oaNo,
          quality: extracted.quality || c.quality,
          totalQuantity: updatedBlocks.length || extracted.totalQuantity || c.totalQuantity,
          totalWeight: extracted.totalWeight || updatedBlocks.reduce((sum, b) => sum + (b.weight || 0), 0) || c.totalWeight,
          weightUnit: extracted.weightUnit || c.weightUnit || 'kg',
          blockDetails: extracted.blockDetails || c.blockDetails,
          clearanceNo: extracted.clearanceNo || c.clearanceNo,
          clearanceStatus: extracted.clearanceStatus || c.clearanceStatus,
          inspectorName: extracted.inspectorName || c.inspectorName,
          uploadedFiles: newFiles,
          blocks: updatedBlocks
        };
      }
      return c;
    }));
  };

  // Checkbox toggle per block for active customer
  const handleToggleBlock = (blockId, isCompleted) => {
    if (!selectedCustomerId) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const updatedBlocks = (c.blocks || []).map(b => {
          if (b.id === blockId) {
            const currentStages = b.stages || {};
            return {
              ...b,
              isCompleted,
              completedAt: isCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
              qcStatus: isCompleted ? 'Passed' : 'Pending',
              stages: {
                ...currentStages,
                lomVerified: true,
                bomAllocated: true,
                mcApproved: true,
                moldingCasting: isCompleted,
                machiningCutting: isCompleted,
                qualityInspection: isCompleted,
                readyForDispatch: isCompleted,
              }
            };
          }
          return b;
        });

        return { ...c, blocks: updatedBlocks };
      }
      return c;
    }));
  };

  // Toggle individual stage for a block
  const handleToggleSubStage = (blockId, stageKey, value) => {
    if (!selectedCustomerId) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const updatedBlocks = (c.blocks || []).map(b => {
          if (b.id === blockId) {
            const newStages = { ...b.stages, [stageKey]: value };
            const allStagesDone = Object.values(newStages).every(Boolean);
            return {
              ...b,
              stages: newStages,
              isCompleted: allStagesDone,
              completedAt: allStagesDone ? (b.completedAt || new Date().toLocaleTimeString()) : null,
              qcStatus: newStages.qualityInspection ? 'Passed' : b.qcStatus,
            };
          }
          return b;
        });
        return { ...c, blocks: updatedBlocks };
      }
      return c;
    }));
  };

  // Bulk update blocks for active customer
  const handleBulkUpdateBlocks = (completeAll) => {
    if (!selectedCustomerId) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const updatedBlocks = (c.blocks || []).map(b => ({
          ...b,
          isCompleted: completeAll,
          completedAt: completeAll ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          qcStatus: completeAll ? 'Passed' : 'Pending',
          stages: {
            lomVerified: true,
            bomAllocated: true,
            mcApproved: true,
            moldingCasting: completeAll,
            machiningCutting: completeAll,
            qualityInspection: completeAll,
            readyForDispatch: completeAll,
          }
        }));
        return { ...c, blocks: updatedBlocks };
      }
      return c;
    }));
  };

  // Add block to active customer
  const handleAddBlock = (newBlock) => {
    if (!selectedCustomerId) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const blocks = [...(c.blocks || []), newBlock];
        return {
          ...c,
          blocks,
          totalQuantity: blocks.length,
          totalWeight: blocks.reduce((sum, b) => sum + (b.weight || 0), 0)
        };
      }
      return c;
    }));
  };

  // Delete block from active customer
  const handleDeleteBlock = (blockId) => {
    if (!selectedCustomerId) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const blocks = (c.blocks || []).filter(b => b.id !== blockId);
        return {
          ...c,
          blocks,
          totalQuantity: blocks.length,
          totalWeight: blocks.reduce((sum, b) => sum + (b.weight || 0), 0)
        };
      }
      return c;
    }));
  };

  // Reset database to default scanned batch
  const handleResetAll = () => {
    if (window.confirm('Reset database to default scanned customer batch?')) {
      setCustomers(INITIAL_CUSTOMERS);
      setSelectedCustomerId(null);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentCustomer={currentCustomer}
        onBackToDirectory={handleBackToDirectory}
        customers={customers}
        onSelectCustomer={handleSelectCustomer}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenQuickScan={() => setIsQuickScanOpen(true)}
        onResetAll={handleResetAll}
      />

      {/* PAGE VIEW 1: Customer Directory Master List (If no customer is selected) */}
      {!currentCustomer ? (
        <CustomerDirectory
          customers={customers}
          onSelectCustomer={handleSelectCustomer}
          onAddNewCustomer={() => setIsQuickScanOpen(true)}
          onDeleteCustomer={handleDeleteCustomer}
          onOpenQuickScan={() => setIsQuickScanOpen(true)}
        />
      ) : (
        /* PAGE VIEW 2: Particular Selected Customer Workspace */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Document Upload Section for this specific customer */}
          <FileUploadSection
            onDataExtracted={handleDataExtracted}
            uploadedFiles={currentCustomer.uploadedFiles || []}
            onFileDelete={(fileIdx) => {
              const updatedFiles = (currentCustomer.uploadedFiles || []).filter((_, i) => i !== fileIdx);
              handleUpdateCustomerData({ uploadedFiles: updatedFiles });
            }}
            onLoadSample={(sampleKey) => {
              const match = INITIAL_CUSTOMERS.find(c => c.id.includes(sampleKey) || c.customerName.toLowerCase().includes(sampleKey));
              if (match) handleSelectCustomer(match);
            }}
            currentData={currentCustomer}
          />

          {/* Extracted Metadata Overview + Pie Chart Completion Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 480px) 1fr',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}>
            {/* Pie Chart Component for Completion Status */}
            <PieChartStatus
              blocks={currentCustomer.blocks || []}
              totalWeight={currentCustomer.totalWeight || 0}
              weightUnit={currentCustomer.weightUnit || 'kg'}
              currentFilter={currentBlockFilter}
              onFilterStatus={setCurrentBlockFilter}
            />

            {/* Extracted Specifications Card */}
            <ExtractedMetadataCard
              data={currentCustomer}
              onUpdateData={handleUpdateCustomerData}
            />
          </div>

          {/* Interactive Block Process Flow Checklist for this customer */}
          <BlockChecklist
            blocks={currentCustomer.blocks || []}
            onToggleBlock={handleToggleBlock}
            onToggleSubStage={handleToggleSubStage}
            onBulkUpdate={handleBulkUpdateBlocks}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            weightUnit={currentCustomer.weightUnit || 'kg'}
            currentFilter={currentBlockFilter}
            onFilterChange={setCurrentBlockFilter}
          />
        </div>
      )}

      {/* Report & Traveler Export Modal */}
      {currentCustomer && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          data={currentCustomer}
        />
      )}

      {/* Quick Scan & Add Customer Modal */}
      <QuickScanModal
        isOpen={isQuickScanOpen}
        onClose={() => setIsQuickScanOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
}
