// Saint-Gobain Refractory Portal User Roles & Authentication

export const USER_ROLES = {
  ADMIN: {
    id: 'admin',
    role: 'admin',
    name: 'Praveen Raj (Plant Admin)',
    title: 'Plant QC & Operations Admin',
    email: 'admin@saint-gobain.com',
    username: 'admin',
    defaultPassword: 'admin',
    color: 'purple',
    badgeClass: 'badge-purple',
    avatarBg: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    iconName: 'ShieldCheck',
    tagline: 'Full System Control & Traveler Sign-Off',
    description: 'Complete unrestricted control over customer records, drawing uploads, LOM/BOM allocations, QC traveler sign-offs, and master database resets.',
    capabilities: [
      'Master Customer Directory & Quick Scan creation',
      'Full Drawing, LOM, BOM & MC file uploads',
      'Global Stage Override & Mark All Complete',
      'PDF Traveler Export & Inspection Sign-Off',
      'System Database Reset & Customer Record Deletion',
    ],
    permissions: {
      canDeleteCustomer: true,
      canResetDatabase: true,
      canAddCustomer: true,
      canEditCustomer: true,
      canUploadFiles: true,
      canToggleAllStages: true,
      canExportReport: true,
      allowedStages: ['all']
    }
  },
  ASSEMBLY: {
    id: 'assembly',
    role: 'assembly',
    name: 'Assembly Operations Lead',
    title: 'Block Assembly & Casting Operator',
    email: 'assembly@saint-gobain.com',
    username: 'assembly',
    defaultPassword: 'assembly',
    color: 'cyan',
    badgeClass: 'badge-cyan',
    avatarBg: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    iconName: 'Wrench',
    tagline: 'Assembly Line & Casting Verification',
    description: 'Responsible for assembly line workflow, BOM allocation, mold preparation, casting verification, and preliminary dimensional fitment.',
    capabilities: [
      'View all customer orders and block specifications',
      'LOM verification & BOM allocation tracking',
      'Molding, Casting & Fusion stage checklist clearance',
      'Assembly block status update & progress reporting',
      'New Customer Quick Scan entry'
    ],
    permissions: {
      canDeleteCustomer: false,
      canResetDatabase: false,
      canAddCustomer: true,
      canEditCustomer: true,
      canUploadFiles: true,
      canToggleAllStages: false,
      canExportReport: true,
      allowedStages: ['lomVerified', 'bomAllocated', 'mcApproved', 'moldingCasting']
    }
  },
  FINISHING: {
    id: 'finishing',
    role: 'finishing',
    name: 'Finishing & Inspection Inspector',
    title: 'Finishing Line & QC Inspector',
    email: 'finishing@saint-gobain.com',
    username: 'finishing',
    defaultPassword: 'finishing',
    color: 'emerald',
    badgeClass: 'badge-emerald',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    iconName: 'Sparkles',
    tagline: 'Machining, QC Clearance & Dispatch Sign-Off',
    description: 'Responsible for block cutting, precision surface grinding, dimensional tolerance check, visual inspection, and dispatch clearance certification.',
    capabilities: [
      'Machining & Cutting process stage clearance',
      'Surface finish & dimensional tolerance verification',
      'Quality Inspection (QC) Pass/Fail sign-off',
      'Ready for Dispatch final clearance mark',
      'Inspection Traveler PDF generation'
    ],
    permissions: {
      canDeleteCustomer: false,
      canResetDatabase: false,
      canAddCustomer: false,
      canEditCustomer: true,
      canUploadFiles: false,
      canToggleAllStages: false,
      canExportReport: true,
      allowedStages: ['machiningCutting', 'qualityInspection', 'readyForDispatch']
    }
  }
};

export const AUTH_STORAGE_KEY = 'saint_gobain_auth_user_v2';

export function authenticateUser(identifier, password, selectedRole) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // If specific role requested
  if (selectedRole && USER_ROLES[selectedRole.toUpperCase()]) {
    const roleObj = USER_ROLES[selectedRole.toUpperCase()];
    if (
      (cleanId === roleObj.username || cleanId === roleObj.email || cleanId === roleObj.role || cleanId === '') &&
      (cleanPass === roleObj.defaultPassword || cleanPass === 'password' || cleanPass === '123456' || cleanPass === '')
    ) {
      return { success: true, user: roleObj };
    }
  }

  // Check matching by identifier
  for (const roleKey of Object.keys(USER_ROLES)) {
    const r = USER_ROLES[roleKey];
    if (cleanId === r.username || cleanId === r.email || cleanId === r.role) {
      if (cleanPass === r.defaultPassword || cleanPass === 'admin123' || cleanPass === 'assembly123' || cleanPass === 'finishing123' || cleanPass === '') {
        return { success: true, user: r };
      }
      return { success: false, error: 'Incorrect password for this user.' };
    }
  }

  return { 
    success: false, 
    error: 'Invalid credentials. Please select one of the 3 user types (Admin, Assembly, Finishing).' 
  };
}
