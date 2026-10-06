import * as XLSX from 'xlsx';

/**
 * Multi-Customer Dataset Repository & Intelligent Extraction Engine
 */

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-01',
    customerName: 'Saint-Gobain Glass India Ltd (Sriperumbudur Plant)',
    mNo: 'M-88492-SG-2026',
    oaNo: 'OA-SG-2026-4491',
    quality: 'AZS-41 Electrically Fused Cast (41% ZrO2 High Density)',
    totalQuantity: 12,
    totalWeight: 14850,
    weightUnit: 'kg',
    blockDetails: 'Corrosion-resistant high zirconia refractory blocks for furnace basin sidewall zones 1-3. Class A tolerance +/-0.8mm, bulk density >= 3.95 g/cm3.',
    clearanceNo: 'MC-SG-REF-2026-8849',
    clearanceDate: '2026-03-28',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Dr. V. Rajesh (Head of QA & Metallurgy)',
    createdAt: '2026-03-28 09:30',
    uploadedFiles: [
      { name: 'LOM_Refractory_Basin_2026.xlsx', type: 'LOM', size: '14.2 KB', timestamp: '2026-03-28' },
      { name: 'BOM_Order_SG_4491.xlsx', type: 'BOM', size: '18.5 KB', timestamp: '2026-03-28' },
      { name: 'MC_Clearance_Cert_8849.xlsx', type: 'MC', size: '12.0 KB', timestamp: '2026-03-28' },
    ],
    blocks: [
      {
        id: 'BLK-001',
        tag: 'BW-Z1-01',
        name: 'Basin Wall Corner Block',
        dimensions: '1200 x 600 x 400 mm',
        weight: 1250,
        quality: 'AZS-41 (High ZrO2)',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: true,
        completedAt: '2026-03-29 10:30 AM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Ultrasonic flaw test verified. Free of shrinkage cavities.'
      },
      {
        id: 'BLK-002',
        tag: 'BW-Z1-02',
        name: 'Basin Wall Interlock Block',
        dimensions: '1200 x 600 x 400 mm',
        weight: 1245,
        quality: 'AZS-41 (High ZrO2)',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: true,
        completedAt: '2026-03-29 14:15 PM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Joint gap precision tolerance checked: 0.4mm.'
      },
      {
        id: 'BLK-003',
        tag: 'BW-Z1-03',
        name: 'Basin Wall Sidewall Block A',
        dimensions: '1000 x 500 x 400 mm',
        weight: 980,
        quality: 'AZS-41 (High ZrO2)',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: true,
        completedAt: '2026-03-30 09:00 AM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Diamond blade face ground to Ra 1.6.'
      },
      {
        id: 'BLK-004',
        tag: 'BW-Z1-04',
        name: 'Basin Wall Sidewall Block B',
        dimensions: '1000 x 500 x 400 mm',
        weight: 985,
        quality: 'AZS-41 (High ZrO2)',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'In Review',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: false, readyForDispatch: false },
        notes: 'In final dimensional CMM verification.'
      },
      {
        id: 'BLK-005',
        tag: 'TC-Z2-01',
        name: 'Throat Channel Cover Block',
        dimensions: '1400 x 700 x 450 mm',
        weight: 1650,
        quality: 'AZS-41 Special Cast',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Casting completed; in 5-day controlled annealing.'
      },
      {
        id: 'BLK-006',
        tag: 'TC-Z2-02',
        name: 'Throat Channel Submerged Block',
        dimensions: '1400 x 700 x 450 mm',
        weight: 1660,
        quality: 'AZS-41 Special Cast',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Cooling cycle 72% complete.'
      },
      {
        id: 'BLK-007',
        tag: 'FD-Z3-01',
        name: 'Feeder Forehearth Channel Block',
        dimensions: '900 x 450 x 300 mm',
        weight: 620,
        quality: 'AZS-33 Fused Cast',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Raw batch pre-mix verified; scheduled for arc furnace melt.'
      },
      {
        id: 'BLK-008',
        tag: 'FD-Z3-02',
        name: 'Feeder Forehearth Channel Block',
        dimensions: '900 x 450 x 300 mm',
        weight: 620,
        quality: 'AZS-33 Fused Cast',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Raw batch pre-mix verified.'
      },
      {
        id: 'BLK-009',
        tag: 'EP-Z3-01',
        name: 'Electrode Port Surrounding Block',
        dimensions: '1100 x 550 x 380 mm',
        weight: 1100,
        quality: 'AZS-41 High Density',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Electrode hole drilling CNC profile loaded.'
      },
      {
        id: 'BLK-010',
        tag: 'EP-Z3-02',
        name: 'Electrode Port Surrounding Block',
        dimensions: '1100 x 550 x 380 mm',
        weight: 1110,
        quality: 'AZS-41 High Density',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Awaiting furnace slot allocation.'
      },
      {
        id: 'BLK-011',
        tag: 'BB-Z1-01',
        name: 'Bottom Paving Sub-layer Block',
        dimensions: '1500 x 500 x 150 mm',
        weight: 540,
        quality: 'AZS-33 Standard Refractory',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'LOM raw material staging area checked.'
      },
      {
        id: 'BLK-012',
        tag: 'BB-Z1-02',
        name: 'Bottom Paving Sub-layer Block',
        dimensions: '1500 x 500 x 150 mm',
        weight: 540,
        quality: 'AZS-33 Standard Refractory',
        mNo: 'M-88492-SG-2026',
        oaNo: 'OA-SG-2026-4491',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'LOM raw material staging area checked.'
      }
    ]
  },
  {
    id: 'cust-02',
    customerName: 'Corning Technologies Asia-Pacific Corp',
    mNo: 'M-94210-CT-2026',
    oaNo: 'OA-CT-2026-8812',
    quality: 'High Purity Alumina-Zirconia (Grade HP-99.2)',
    totalQuantity: 8,
    totalWeight: 9200,
    weightUnit: 'kg',
    blockDetails: 'Ultra-low defect blister-free blocks for LCD & OLED glass tank lining. Dimensional tolerance +/-0.3mm.',
    clearanceNo: 'MC-CT-2026-441',
    clearanceDate: '2026-04-01',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Eng. K. Srinivasan (Quality Assurance Specialist)',
    createdAt: '2026-04-01 11:20',
    uploadedFiles: [
      { name: 'Corning_Display_LOM.xlsx', type: 'LOM', size: '16.4 KB', timestamp: '2026-04-01' },
      { name: 'Corning_BOM_Order.xlsx', type: 'BOM', size: '19.1 KB', timestamp: '2026-04-01' },
    ],
    blocks: [
      {
        id: 'BLK-C01',
        tag: 'DSP-L1-01',
        name: 'Tank Bottom Lip Block 01',
        dimensions: '1000 x 500 x 350 mm',
        weight: 1150,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: true,
        completedAt: '2026-04-02 11:00 AM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Surface roughness checked at Ra 0.8.'
      },
      {
        id: 'BLK-C02',
        tag: 'DSP-L1-02',
        name: 'Tank Bottom Lip Block 02',
        dimensions: '1000 x 500 x 350 mm',
        weight: 1150,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: true,
        completedAt: '2026-04-02 16:30 PM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Pre-assembly fit verified with block C01.'
      },
      {
        id: 'BLK-C03',
        tag: 'DSP-L2-01',
        name: 'Sidewall Overflow Block',
        dimensions: '1200 x 600 x 400 mm',
        weight: 1420,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: true,
        completedAt: '2026-04-03 10:15 AM',
        qcStatus: 'Passed',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true },
        notes: 'Passed CMM laser inspection.'
      },
      {
        id: 'BLK-C04',
        tag: 'DSP-L2-02',
        name: 'Sidewall Overflow Block',
        dimensions: '1200 x 600 x 400 mm',
        weight: 1420,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'In Review',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: false, readyForDispatch: false },
        notes: 'Diamond milling scheduled.'
      },
      {
        id: 'BLK-C05',
        tag: 'DSP-CZ-01',
        name: 'Skimmer Dam Block A',
        dimensions: '800 x 400 x 300 mm',
        weight: 760,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Cast mold preparation underway.'
      },
      {
        id: 'BLK-C06',
        tag: 'DSP-CZ-02',
        name: 'Skimmer Dam Block B',
        dimensions: '800 x 400 x 300 mm',
        weight: 760,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'Cast mold preparation underway.'
      },
      {
        id: 'BLK-C07',
        tag: 'DSP-EX-01',
        name: 'Exhaust Port Throat Block',
        dimensions: '1100 x 500 x 400 mm',
        weight: 1270,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'LOM raw material verified.'
      },
      {
        id: 'BLK-C08',
        tag: 'DSP-EX-02',
        name: 'Exhaust Port Throat Block',
        dimensions: '1100 x 500 x 400 mm',
        weight: 1270,
        quality: 'HP-99.2 Alumina',
        mNo: 'M-94210-CT-2026',
        oaNo: 'OA-CT-2026-8812',
        isCompleted: false,
        completedAt: null,
        qcStatus: 'Pending',
        stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
        notes: 'LOM raw material verified.'
      }
    ]
  },
  {
    id: 'cust-03',
    customerName: 'Asahi Glass Co (AGC Flat Glass Europe)',
    mNo: 'M-77312-AGC-2026',
    oaNo: 'OA-AGC-2026-5590',
    quality: 'AZS-33 Standard Fusion Cast Refractory',
    totalQuantity: 10,
    totalWeight: 11400,
    weightUnit: 'kg',
    blockDetails: 'Standard float line canal blocks and tweel surrounds for architectural flat glass furnace.',
    clearanceNo: 'MC-AGC-2026-901',
    clearanceDate: '2026-03-31',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'S. Anand (Senior Metallurgical Officer)',
    createdAt: '2026-03-31 14:45',
    uploadedFiles: [
      { name: 'AGC_LOM_Canal_Blocks.xlsx', type: 'LOM', size: '13.8 KB', timestamp: '2026-03-31' },
      { name: 'AGC_BOM_5590.xlsx', type: 'BOM', size: '15.2 KB', timestamp: '2026-03-31' },
    ],
    blocks: [
      { id: 'BLK-A01', tag: 'AGC-CN-01', name: 'Canal Sidewall Block 01', dimensions: '1200 x 500 x 300 mm', weight: 1140, quality: 'AZS-33', isCompleted: true, completedAt: '2026-04-01 09:00', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-A02', tag: 'AGC-CN-02', name: 'Canal Sidewall Block 02', dimensions: '1200 x 500 x 300 mm', weight: 1140, quality: 'AZS-33', isCompleted: true, completedAt: '2026-04-01 10:30', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-A03', tag: 'AGC-CN-03', name: 'Canal Sidewall Block 03', dimensions: '1200 x 500 x 300 mm', weight: 1140, quality: 'AZS-33', isCompleted: true, completedAt: '2026-04-01 14:00', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-A04', tag: 'AGC-CN-04', name: 'Canal Sidewall Block 04', dimensions: '1200 x 500 x 300 mm', weight: 1140, quality: 'AZS-33', isCompleted: true, completedAt: '2026-04-02 08:45', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-A05', tag: 'AGC-TW-01', name: 'Tweel Gate Surrounding Block', dimensions: '1000 x 600 x 400 mm', weight: 1200, quality: 'AZS-33', isCompleted: true, completedAt: '2026-04-02 15:20', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-A06', tag: 'AGC-TW-02', name: 'Tweel Gate Surrounding Block', dimensions: '1000 x 600 x 400 mm', weight: 1200, quality: 'AZS-33', isCompleted: false, completedAt: null, qcStatus: 'In Review', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: false, readyForDispatch: false } },
      { id: 'BLK-A07', tag: 'AGC-CN-05', name: 'Canal Bottom Tile', dimensions: '1000 x 500 x 200 mm', weight: 860, quality: 'AZS-33', isCompleted: false, completedAt: null, qcStatus: 'Pending', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false } },
      { id: 'BLK-A08', tag: 'AGC-CN-06', name: 'Canal Bottom Tile', dimensions: '1000 x 500 x 200 mm', weight: 860, quality: 'AZS-33', isCompleted: false, completedAt: null, qcStatus: 'Pending', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false } },
      { id: 'BLK-A09', tag: 'AGC-CN-07', name: 'Canal Bottom Tile', dimensions: '1000 x 500 x 200 mm', weight: 860, quality: 'AZS-33', isCompleted: false, completedAt: null, qcStatus: 'Pending', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false } },
      { id: 'BLK-A10', tag: 'AGC-CN-08', name: 'Canal Bottom Tile', dimensions: '1000 x 500 x 200 mm', weight: 860, quality: 'AZS-33', isCompleted: false, completedAt: null, qcStatus: 'Pending', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false } },
    ]
  },
  {
    id: 'cust-04',
    customerName: 'Schott Glass Pharmaceutical Packaging',
    mNo: 'M-66120-SC-2026',
    oaNo: 'OA-SC-2026-3310',
    quality: 'High Purity Fused Silica & Zirconia Composite',
    totalQuantity: 6,
    totalWeight: 5100,
    weightUnit: 'kg',
    blockDetails: 'Ultra-pure feeder bowl and tubing orifice refractory blocks for borosilicate pharmaceutical vials.',
    clearanceNo: 'MC-SC-2026-119',
    clearanceDate: '2026-04-02',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Dr. M. Deepa (Pharma Glass Compliance Head)',
    createdAt: '2026-04-02 08:15',
    uploadedFiles: [
      { name: 'Schott_LOM_Feeder.xlsx', type: 'LOM', size: '11.5 KB', timestamp: '2026-04-02' },
    ],
    blocks: [
      { id: 'BLK-S01', tag: 'SCH-FB-01', name: 'Feeder Bowl Block Alpha', dimensions: '800 x 800 x 350 mm', weight: 950, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-02 16:00', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-S02', tag: 'SCH-FB-02', name: 'Feeder Bowl Block Beta', dimensions: '800 x 800 x 350 mm', weight: 950, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-03 09:30', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-S03', tag: 'SCH-TB-01', name: 'Tubing Orifice Ring Support', dimensions: '600 x 600 x 250 mm', weight: 800, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-03 14:10', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-S04', tag: 'SCH-TB-02', name: 'Tubing Orifice Ring Support', dimensions: '600 x 600 x 250 mm', weight: 800, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-04 11:00', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-S05', tag: 'SCH-CR-01', name: 'Crucible Skimmer Block', dimensions: '700 x 400 x 300 mm', weight: 800, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-04 15:45', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
      { id: 'BLK-S06', tag: 'SCH-CR-02', name: 'Crucible Skimmer Block', dimensions: '700 x 400 x 300 mm', weight: 800, quality: 'Pure Silica Composite', isCompleted: true, completedAt: '2026-04-05 10:00', qcStatus: 'Passed', stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: true, machiningCutting: true, qualityInspection: true, readyForDispatch: true } },
    ]
  },
  {
    id: 'cust-05',
    customerName: 'Guardian Glass Automotive Float Division',
    mNo: 'M-55891-GG-2026',
    oaNo: 'OA-GG-2026-7721',
    quality: 'AZS-41 Fusion Cast (High Density Grade-A)',
    totalQuantity: 14,
    totalWeight: 17200,
    weightUnit: 'kg',
    blockDetails: 'Heavy-duty basin bottom paving tiles and weir blocks for windshield laminated glass melting furnace.',
    clearanceNo: 'MC-GG-2026-302',
    clearanceDate: '2026-04-03',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Eng. R. Narayanan (Lead QA Assessor)',
    createdAt: '2026-04-03 16:00',
    uploadedFiles: [
      { name: 'Guardian_LOM_Auto.xlsx', type: 'LOM', size: '17.2 KB', timestamp: '2026-04-03' },
    ],
    blocks: Array.from({ length: 14 }, (_, i) => ({
      id: `BLK-G${String(i + 1).padStart(2, '0')}`,
      tag: `GG-PV-${String(i + 1).padStart(2, '0')}`,
      name: `Bottom Paving Tile Unit ${i + 1}`,
      dimensions: '1400 x 600 x 350 mm',
      weight: 1228,
      quality: 'AZS-41 High Density',
      isCompleted: i < 4,
      completedAt: i < 4 ? '2026-04-04 12:00' : null,
      qcStatus: i < 4 ? 'Passed' : i === 4 ? 'In Review' : 'Pending',
      stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: i < 6, machiningCutting: i < 5, qualityInspection: i < 4, readyForDispatch: i < 4 }
    }))
  },
  {
    id: 'cust-06',
    customerName: 'Owens Corning Fiberglass Reinforcements',
    mNo: 'M-44109-OC-2026',
    oaNo: 'OA-OC-2026-9904',
    quality: 'High-Chrome Corundum Refractory (Grade CR-95)',
    totalQuantity: 7,
    totalWeight: 8400,
    weightUnit: 'kg',
    blockDetails: 'Extreme erosion resistant chromic oxide refractory blocks for E-glass fiberglass continuous melting.',
    clearanceNo: 'MC-OC-2026-788',
    clearanceDate: '2026-04-04',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Dr. V. Rajesh (Head of QA & Metallurgy)',
    createdAt: '2026-04-04 10:10',
    uploadedFiles: [
      { name: 'OwensCorning_LOM.xlsx', type: 'LOM', size: '12.9 KB', timestamp: '2026-04-04' },
      { name: 'OwensCorning_MC.xlsx', type: 'MC', size: '10.4 KB', timestamp: '2026-04-04' },
    ],
    blocks: Array.from({ length: 7 }, (_, i) => ({
      id: `BLK-O${String(i + 1).padStart(2, '0')}`,
      tag: `OC-CR-${String(i + 1).padStart(2, '0')}`,
      name: `Chrome Corundum Bushing Block ${i + 1}`,
      dimensions: '1000 x 500 x 400 mm',
      weight: 1200,
      quality: 'Grade CR-95 Chromic',
      isCompleted: i < 2,
      completedAt: i < 2 ? '2026-04-04 17:30' : null,
      qcStatus: i < 2 ? 'Passed' : 'Pending',
      stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: i < 3, machiningCutting: i < 2, qualityInspection: i < 2, readyForDispatch: i < 2 }
    }))
  },
  {
    id: 'cust-07',
    customerName: 'Tata Steel Tubes & Advanced Materials',
    mNo: 'M-33201-TS-2026',
    oaNo: 'OA-TS-2026-1188',
    quality: 'Magnesite-Spinel Ultra Refractory',
    totalQuantity: 9,
    totalWeight: 10800,
    weightUnit: 'kg',
    blockDetails: 'High thermal shock resistant blocks for continuous casting tundish and reheating zones.',
    clearanceNo: 'MC-TS-2026-554',
    clearanceDate: '2026-04-04',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Eng. P. Karthik (Senior QA Auditor)',
    createdAt: '2026-04-04 15:20',
    uploadedFiles: [
      { name: 'TataSteel_LOM_Tundish.xlsx', type: 'LOM', size: '15.6 KB', timestamp: '2026-04-04' },
    ],
    blocks: Array.from({ length: 9 }, (_, i) => ({
      id: `BLK-T${String(i + 1).padStart(2, '0')}`,
      tag: `TS-SP-${String(i + 1).padStart(2, '0')}`,
      name: `Tundish Impact Block ${i + 1}`,
      dimensions: '1100 x 550 x 300 mm',
      weight: 1200,
      quality: 'Magnesite-Spinel',
      isCompleted: i < 6,
      completedAt: i < 6 ? '2026-04-05 09:15' : null,
      qcStatus: i < 6 ? 'Passed' : 'Pending',
      stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: i < 7, machiningCutting: i < 6, qualityInspection: i < 6, readyForDispatch: i < 6 }
    }))
  },
  {
    id: 'cust-08',
    customerName: 'Hindalco Industries Alumina Smelter Division',
    mNo: 'M-22904-HI-2026',
    oaNo: 'OA-HI-2026-8802',
    quality: 'Silicon Carbide (SiC) Bonded High Strength Refractory',
    totalQuantity: 10,
    totalWeight: 8900,
    weightUnit: 'kg',
    blockDetails: 'Thermal conductivity sidewall blocks for aluminum electrolysis pot lining.',
    clearanceNo: 'MC-HI-2026-921',
    clearanceDate: '2026-04-05',
    clearanceStatus: 'Approved & Cleared',
    inspectorName: 'Dr. V. Rajesh (Head of QA & Metallurgy)',
    createdAt: '2026-04-05 08:30',
    uploadedFiles: [
      { name: 'Hindalco_LOM_PotLining.xlsx', type: 'LOM', size: '14.1 KB', timestamp: '2026-04-05' },
    ],
    blocks: Array.from({ length: 10 }, (_, i) => ({
      id: `BLK-H${String(i + 1).padStart(2, '0')}`,
      tag: `HI-SIC-${String(i + 1).padStart(2, '0')}`,
      name: `Pot Sidewall SiC Block ${i + 1}`,
      dimensions: '900 x 450 x 300 mm',
      weight: 890,
      quality: 'Nitride-Bonded SiC',
      isCompleted: i < 7,
      completedAt: i < 7 ? '2026-04-05 11:30' : null,
      qcStatus: i < 7 ? 'Passed' : 'Pending',
      stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: i < 8, machiningCutting: i < 7, qualityInspection: i < 7, readyForDispatch: i < 7 }
    }))
  }
];

/**
 * Intelligent regex and text parsing algorithm to extract structured data from raw content.
 */
export function extractFromRawContent(text, existingData = {}) {
  const result = {
    customerName: existingData.customerName || '',
    mNo: existingData.mNo || '',
    oaNo: existingData.oaNo || '',
    quality: existingData.quality || '',
    totalQuantity: existingData.totalQuantity || 0,
    totalWeight: existingData.totalWeight || 0,
    weightUnit: existingData.weightUnit || 'kg',
    blockDetails: existingData.blockDetails || '',
    clearanceNo: existingData.clearanceNo || '',
    clearanceDate: existingData.clearanceDate || '',
    clearanceStatus: existingData.clearanceStatus || 'In Process',
    inspectorName: existingData.inspectorName || '',
    blocks: existingData.blocks ? [...existingData.blocks] : []
  };

  if (!text || typeof text !== 'string') return result;

  const lines = text.split(/\r?\n/);

  // 1. Extract Customer Name
  const customerPatterns = [
    /(?:Customer|Client|Buyer|Party|Customer\s*Name|Sold\s*To|M\/s)\s*[:=\-–]\s*([^\r\n,;]+)/i,
    /(?:Saint-Gobain[^\r\n,;]*|Corning[^\r\n,;]*|AGC[^\r\n,;]*|Asahi[^\r\n,;]*|Schott[^\r\n,;]*|Guardian[^\r\n,;]*|Owens[^\r\n,;]*|Tata[^\r\n,;]*|Hindalco[^\r\n,;]*)/i
  ];
  for (const pat of customerPatterns) {
    const match = text.match(pat);
    if (match) {
      result.customerName = (match[1] || match[0]).trim();
      break;
    }
  }

  // 2. Extract M.No
  const mNoPatterns = [
    /(?:M\.?\s*No|Mfg\.?\s*No|Manufacturing\s*No|Material\s*No|Mill\s*No|Job\s*No|M\s*Number)\s*[:=\-–#]\s*([A-Za-z0-9\-_/]+)/i,
    /\b(M-[0-9A-Z\-_/]+)\b/i
  ];
  for (const pat of mNoPatterns) {
    const match = text.match(pat);
    if (match) {
      result.mNo = (match[1] || match[0]).trim();
      break;
    }
  }

  // 3. Extract OA.No
  const oaPatterns = [
    /(?:OA\.?\s*No|Order\s*Acceptance\s*No|OA\s*Number|Order\s*Ack|OA\s*#)\s*[:=\-–#]\s*([A-Za-z0-9\-_/]+)/i,
    /\b(OA-[0-9A-Z\-_/]+)\b/i
  ];
  for (const pat of oaPatterns) {
    const match = text.match(pat);
    if (match) {
      result.oaNo = (match[1] || match[0]).trim();
      break;
    }
  }

  // 4. Extract Quality
  const qualityPatterns = [
    /(?:Quality|Grade|Material\s*Grade|Material\s*Spec|Spec|Quality\s*Spec)\s*[:=\-–]\s*([^\r\n,;]+)/i,
    /\b(AZS-?\d{2,3}[A-Za-z0-9\s-]*|High\s*Alumina[A-Za-z0-9\s-]*|Fused\s*Cast[A-Za-z0-9\s-]*|Zirconia[A-Za-z0-9\s-]*|SiC[A-Za-z0-9\s-]*|Silicon\s*Carbide|Magnesite[A-Za-z0-9\s-]*|Corundum[A-Za-z0-9\s-]*)\b/i
  ];
  for (const pat of qualityPatterns) {
    const match = text.match(pat);
    if (match) {
      result.quality = (match[1] || match[0]).trim();
      break;
    }
  }

  // 5. Extract Total Weight
  const weightPatterns = [
    /(?:Total\s*Weight|Net\s*Weight|Gross\s*Weight|Batch\s*Weight|Weight)\s*[:=\-–]\s*([\d,.]+)\s*(kg|KG|Kg|MT|Tons|Ton|lbs)?/i,
    /([\d,.]+)\s*(?:kg|KG|Kg|MT)\b/i
  ];
  for (const pat of weightPatterns) {
    const match = text.match(pat);
    if (match) {
      const rawNum = match[1].replace(/,/g, '');
      const parsedNum = parseFloat(rawNum);
      if (!isNaN(parsedNum)) {
        result.totalWeight = parsedNum;
        if (match[2]) {
          result.weightUnit = match[2].toLowerCase().includes('mt') || match[2].toLowerCase().includes('ton') ? 'MT' : 'kg';
        }
        break;
      }
    }
  }

  // 6. Extract Total Quantity
  const qtyPatterns = [
    /(?:Total\s*Quantity|Total\s*Qty|Qty|Quantity|Total\s*Blocks|No\s*of\s*Blocks)\s*[:=\-–]\s*(\d+)/i
  ];
  for (const pat of qtyPatterns) {
    const match = text.match(pat);
    if (match) {
      const parsedQty = parseInt(match[1], 10);
      if (!isNaN(parsedQty)) {
        result.totalQuantity = parsedQty;
        break;
      }
    }
  }

  // 7. Extract Block Details
  const blockDetailsPatterns = [
    /(?:Block\s*Details|Description|Item\s*Description|Product\s*Details|Scope\s*of\s*Work)\s*[:=\-–]\s*([^\r\n]+)/i
  ];
  for (const pat of blockDetailsPatterns) {
    const match = text.match(pat);
    if (match) {
      result.blockDetails = (match[1] || '').trim();
      break;
    }
  }

  // 8. Extract Clearance Number
  const mcPatterns = [
    /(?:Clearance\s*No|MC\s*No|Manufacturing\s*Clearance\s*No|Certificate\s*No)\s*[:=\-–]\s*([A-Za-z0-9\-_/]+)/i
  ];
  for (const pat of mcPatterns) {
    const match = text.match(pat);
    if (match) {
      result.clearanceNo = match[1].trim();
      result.clearanceStatus = 'Approved & Cleared';
      break;
    }
  }

  const inspectorMatch = text.match(/(?:Approved\s*By|Inspected\s*By|QA\s*Inspector|Clearance\s*Sign-off)\s*[:=\-–]\s*([^\r\n,;]+)/i);
  if (inspectorMatch) {
    result.inspectorName = inspectorMatch[1].trim();
  }

  // 9. Extract Block rows
  const parsedBlocks = parseBlocksFromLines(lines, result);
  if (parsedBlocks.length > 0) {
    result.blocks = parsedBlocks;
    result.totalQuantity = parsedBlocks.length;
    result.totalWeight = parsedBlocks.reduce((sum, b) => sum + (b.weight || 0), 0);
  } else if (result.blocks.length === 0 && result.totalQuantity > 0) {
    result.blocks = generateBlocksFromSummary(result);
  }

  return result;
}

function parseBlocksFromLines(lines, context) {
  const blocks = [];
  let blockIndex = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.toLowerCase().includes('customer:')) continue;

    const dimMatch = trimmed.match(/(\d+\s*[\*xX×]\s*\d+(?:\s*[\*xX×]\s*\d+)?(?:\s*mm|\s*cm)?)/);
    const tagMatch = trimmed.match(/\b([A-Z]{2,4}-[A-Z0-9]{2,6}(?:-[0-9]{1,4})?|BLK-[0-9]{2,4})\b/i);
    const weightMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:kg|KG|Kg|MT)/);

    if (dimMatch || tagMatch || (trimmed.toLowerCase().includes('block') && weightMatch)) {
      const parts = trimmed.split(/[,|\t;]/).map(s => s.trim()).filter(Boolean);
      const tag = tagMatch ? tagMatch[1] : `BLK-${String(blockIndex).padStart(3, '0')}`;
      const dimensions = dimMatch ? dimMatch[1] : (parts[2] || '1200 x 600 x 400 mm');
      const weight = weightMatch ? parseFloat(weightMatch[1]) : (parseFloat(parts[3]) || 850);
      const name = parts[1] || `Furnace Block ${blockIndex}`;
      const quality = context.quality || 'AZS-41 Refractory';

      blocks.push({
        id: `BLK-${String(blockIndex).padStart(3, '0')}`,
        tag: tag,
        name: name,
        dimensions: dimensions,
        weight: weight,
        quality: quality,
        mNo: context.mNo || 'M-SG-2026',
        oaNo: context.oaNo || 'OA-SG-2026',
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
      blockIndex++;
    }
  }

  return blocks;
}

function generateBlocksFromSummary(context) {
  const qty = Math.min(context.totalQuantity || 8, 40);
  const avgWeight = context.totalWeight > 0 ? Math.round(context.totalWeight / qty) : 950;
  const blocks = [];

  for (let i = 1; i <= qty; i++) {
    const isInitialCompleted = i <= Math.ceil(qty * 0.3);
    blocks.push({
      id: `BLK-${String(i).padStart(3, '0')}`,
      tag: `BLK-TAG-${String(i).padStart(2, '0')}`,
      name: `Refractory Block Unit ${i}`,
      dimensions: '1200 x 600 x 400 mm',
      weight: avgWeight,
      quality: context.quality || 'AZS-41 Fused Cast',
      mNo: context.mNo || 'M-SG-2026',
      oaNo: context.oaNo || 'OA-SG-2026',
      isCompleted: isInitialCompleted,
      completedAt: isInitialCompleted ? new Date().toLocaleString() : null,
      qcStatus: isInitialCompleted ? 'Passed' : 'Pending',
      stages: {
        lomVerified: true,
        bomAllocated: true,
        mcApproved: true,
        moldingCasting: isInitialCompleted,
        machiningCutting: isInitialCompleted,
        qualityInspection: isInitialCompleted,
        readyForDispatch: isInitialCompleted,
      },
      notes: isInitialCompleted ? 'Quality clearance verified.' : 'Scheduled for machining.'
    });
  }

  return blocks;
}

export async function parseUploadedFile(file, fileCategory = 'LOM', currentData = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          let fullText = '';
          const sheetData = [];

          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            sheetData.push(...json);
            json.forEach(row => {
              if (Array.isArray(row)) fullText += row.join(' | ') + '\n';
            });
          });

          const extracted = extractFromSheetData(sheetData, fullText, fileCategory, currentData);
          resolve({
            extracted,
            rawText: fullText,
            fileName: file.name,
            fileSize: file.size,
            fileType: fileCategory
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          let parsed;
          if (fileName.endsWith('.json')) {
            const json = JSON.parse(text);
            parsed = json.extracted ? json.extracted : extractFromRawContent(JSON.stringify(json), currentData);
          } else {
            parsed = extractFromRawContent(text, currentData);
          }
          resolve({
            extracted: parsed,
            rawText: text,
            fileName: file.name,
            fileSize: file.size,
            fileType: fileCategory
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    }
  });
}

function extractFromSheetData(rows, fullText, fileCategory, currentData) {
  const baseExtracted = extractFromRawContent(fullText, currentData);
  const tableBlocks = [];
  let headerIndex = -1;
  let colMap = { tag: -1, name: -1, dimensions: -1, weight: -1, quality: -1, mNo: -1, oaNo: -1, status: -1 };

  for (let r = 0; r < Math.min(rows.length, 15); r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    const rowStr = row.join(' ').toLowerCase();

    if (rowStr.includes('block') || rowStr.includes('tag') || rowStr.includes('dimension') || rowStr.includes('item')) {
      headerIndex = r;
      row.forEach((cell, cIdx) => {
        const c = String(cell).toLowerCase().trim();
        if (c.includes('tag') || c.includes('block code') || c.includes('item no') || c.includes('block no')) colMap.tag = cIdx;
        if (c.includes('description') || c.includes('name') || c.includes('block name') || c.includes('part')) colMap.name = cIdx;
        if (c.includes('dimension') || c.includes('size') || c.includes('l x w x h')) colMap.dimensions = cIdx;
        if (c.includes('weight') || c.includes('wt') || c.includes('mass')) colMap.weight = cIdx;
        if (c.includes('grade') || c.includes('quality') || c.includes('spec') || c.includes('material')) colMap.quality = cIdx;
        if (c.includes('m.no') || c.includes('m no') || c.includes('mfg')) colMap.mNo = cIdx;
        if (c.includes('oa.no') || c.includes('oa no') || c.includes('oa')) colMap.oaNo = cIdx;
        if (c.includes('status') || c.includes('clearance') || c.includes('qc')) colMap.status = cIdx;
      });
      break;
    }
  }

  if (headerIndex !== -1) {
    for (let r = headerIndex + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.every(cell => !cell)) continue;

      const tagVal = colMap.tag !== -1 && row[colMap.tag] ? String(row[colMap.tag]).trim() : `BLK-${String(tableBlocks.length + 1).padStart(3, '0')}`;
      const nameVal = colMap.name !== -1 && row[colMap.name] ? String(row[colMap.name]).trim() : `Refractory Block ${tableBlocks.length + 1}`;
      const dimVal = colMap.dimensions !== -1 && row[colMap.dimensions] ? String(row[colMap.dimensions]).trim() : '1200 x 600 x 400 mm';
      const rawWeight = colMap.weight !== -1 && row[colMap.weight] ? String(row[colMap.weight]).replace(/[^\d.]/g, '') : '850';
      const weightVal = parseFloat(rawWeight) || 850;
      const qualityVal = colMap.quality !== -1 && row[colMap.quality] ? String(row[colMap.quality]).trim() : (baseExtracted.quality || 'AZS-41');
      const mNoVal = colMap.mNo !== -1 && row[colMap.mNo] ? String(row[colMap.mNo]).trim() : (baseExtracted.mNo || 'M-SG-2026');
      const oaNoVal = colMap.oaNo !== -1 && row[colMap.oaNo] ? String(row[colMap.oaNo]).trim() : (baseExtracted.oaNo || 'OA-SG-2026');

      if (tagVal && (dimVal || weightVal)) {
        tableBlocks.push({
          id: `BLK-${String(tableBlocks.length + 1).padStart(3, '0')}`,
          tag: tagVal,
          name: nameVal,
          dimensions: dimVal,
          weight: weightVal,
          quality: qualityVal,
          mNo: mNoVal,
          oaNo: oaNoVal,
          isCompleted: false,
          completedAt: null,
          qcStatus: 'Pending',
          stages: { lomVerified: true, bomAllocated: true, mcApproved: true, moldingCasting: false, machiningCutting: false, qualityInspection: false, readyForDispatch: false },
          notes: ''
        });
      }
    }
  }

  if (tableBlocks.length > 0) {
    baseExtracted.blocks = tableBlocks;
    baseExtracted.totalQuantity = tableBlocks.length;
    baseExtracted.totalWeight = tableBlocks.reduce((acc, b) => acc + b.weight, 0);
  }

  return baseExtracted;
}

export function downloadSampleTemplate(type = 'LOM') {
  const wb = XLSX.utils.book_new();
  let data = [];
  let filename = '';

  if (type === 'LOM') {
    filename = 'Sample_List_Of_Material_LOM.xlsx';
    data = [
      ['LIST OF MATERIAL (LOM) - SAINT-GOBAIN REFRACTORIES'],
      ['Customer Name:', 'Saint-Gobain Glass India Ltd (Sriperumbudur)'],
      ['M.No:', 'M-88492-SG-2026', 'OA.No:', 'OA-SG-2026-4491'],
      ['Quality / Grade:', 'AZS-41 Electrically Fused Cast Refractory'],
      ['Block Details:', 'Basin Sidewall & Forehearth Channel Blocks'],
      ['Total Quantity:', 6, 'Total Weight (kg):', 6800],
      [],
      ['Block ID', 'Block Tag', 'Block Description', 'Dimensions (mm)', 'Weight (kg)', 'Quality Grade', 'M.No', 'OA.No'],
      ['BLK-001', 'BW-Z1-01', 'Basin Wall Corner Block', '1200 x 600 x 400 mm', 1250, 'AZS-41 High ZrO2', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
      ['BLK-002', 'BW-Z1-02', 'Basin Wall Interlock Block', '1200 x 600 x 400 mm', 1245, 'AZS-41 High ZrO2', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
      ['BLK-003', 'BW-Z1-03', 'Basin Wall Sidewall Block A', '1000 x 500 x 400 mm', 980, 'AZS-41 High ZrO2', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
      ['BLK-004', 'BW-Z1-04', 'Basin Wall Sidewall Block B', '1000 x 500 x 400 mm', 985, 'AZS-41 High ZrO2', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
      ['BLK-005', 'TC-Z2-01', 'Throat Channel Cover Block', '1400 x 700 x 450 mm', 1650, 'AZS-41 Special Cast', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
      ['BLK-006', 'EP-Z3-01', 'Electrode Port Surrounding Block', '1100 x 550 x 380 mm', 690, 'AZS-41 High Density', 'M-88492-SG-2026', 'OA-SG-2026-4491'],
    ];
  } else if (type === 'BOM') {
    filename = 'Sample_Bill_Of_Material_BOM.xlsx';
    data = [
      ['BILL OF MATERIAL (BOM) & ORDER SPECIFICATION'],
      ['Customer Name:', 'Saint-Gobain Glass India Ltd'],
      ['M.No:', 'M-88492-SG-2026', 'OA.No:', 'OA-SG-2026-4491'],
      ['Project Title:', 'Float Glass Furnace Line-3 Basin Overhaul'],
      ['Quality / Spec:', 'AZS-41 Fusion Cast High Zirconia Class-A'],
      ['Total Batch Weight:', '14850 kg', 'Total Blocks:', 12],
      [],
      ['Item #', 'Sub-Component', 'Raw Material Mix', 'Required Weight (kg)', 'Allocated Stock'],
      [1, 'ZrO2 Pure Baddeleyite', 'High Purity 99.5% Zirconia', 6100, 'Warehouse Bay-04'],
      [2, 'Al2O3 Calcined Alumina', 'Ultra-Fine Grain Alumina', 7200, 'Silo-2'],
      [3, 'SiO2 Pure Quartz', 'Fused Silica Powder', 1550, 'Silo-5'],
    ];
  } else {
    filename = 'Sample_Manufacturing_Clearance_MC.xlsx';
    data = [
      ['MANUFACTURING CLEARANCE CERTIFICATE (MC)'],
      ['Clearance No:', 'MC-SG-REF-2026-8849'],
      ['Customer Name:', 'Saint-Gobain Glass India Ltd'],
      ['M.No:', 'M-88492-SG-2026', 'OA.No:', 'OA-SG-2026-4491'],
      ['Clearance Date:', '2026-03-28'],
      ['Clearance Status:', 'APPROVED FOR FULL PRODUCTION'],
      ['QA Inspector:', 'Dr. V. Rajesh (Head of Metallurgy)'],
      ['Technical Approval:', 'Design drawings verified, thermal expansion model approved.'],
      [],
      ['Stage Name', 'Verification Status', 'Sign-Off Date'],
      ['LOM Verification', 'VERIFIED & MATCHED', '2026-03-28'],
      ['BOM Allocation', 'ALLOCATED & RESERVED', '2026-03-28'],
      ['Molding & Cast Pattern', 'APPROVED', '2026-03-28'],
      ['CNC Machining Program', 'RELEASED', '2026-03-28'],
    ];
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, type);
  XLSX.writeFile(wb, filename);
}

export const SAMPLE_DATASETS = {
  refractory: { id: 'refractory', extracted: INITIAL_CUSTOMERS[0] },
  corning: { id: 'corning', extracted: INITIAL_CUSTOMERS[1] },
};

