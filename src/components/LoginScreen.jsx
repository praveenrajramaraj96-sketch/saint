import React, { useState } from 'react';
import { 
  Factory, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  Sun, 
  Moon, 
  ArrowRight, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { USER_ROLES } from '../utils/auth';

export default function LoginScreen({ onLogin, theme, onToggleTheme }) {
  const [selectedRoleKey, setSelectedRoleKey] = useState('ADMIN');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeRole = USER_ROLES[selectedRoleKey];

  // Quick switch role selection
  const handleSelectRole = (key) => {
    setSelectedRoleKey(key);
    setError('');
    const roleObj = USER_ROLES[key];
    setUsername(roleObj.username);
    setPassword(roleObj.defaultPassword);
  };

  // Instant 1-click login for a specific role
  const handleDirectLogin = (key) => {
    const roleObj = USER_ROLES[key];
    setIsLoading(true);
    setTimeout(() => {
      onLogin(roleObj);
    }, 250);
  };

  // Submit from form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanUser = username.trim().toLowerCase();
    let matchedRole = null;

    for (const key of Object.keys(USER_ROLES)) {
      const r = USER_ROLES[key];
      if (cleanUser === r.username || cleanUser === r.email || cleanUser === r.role || cleanUser === key.toLowerCase()) {
        matchedRole = r;
        break;
      }
    }

    if (!matchedRole) {
      matchedRole = USER_ROLES[selectedRoleKey];
    }

    setTimeout(() => {
      setIsLoading(false);
      onLogin(matchedRole);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      position: 'relative',
      background: 'var(--bg-app)',
    }}>
      {/* Background Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Floating Controls */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '2rem',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <button
          onClick={onToggleTheme}
          className="btn btn-sm btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            padding: '0.55rem 0.85rem',
            background: 'var(--bg-glass-strong)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
          <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>

      {/* Main Login Container */}
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            color: '#04101e',
            marginBottom: '0.25rem'
          }}>
            <Factory size={34} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              SAINT-GOBAIN REFRACTORIES
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              PORTAL v2.6
            </span>
          </div>

          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.2
          }}>
            Finishing & Assembly MES
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            lineHeight: 1.5
          }}>
            Select your operator role below to access customer manufacturing travelers, block process flow checklists, and quality clearance.
          </p>
        </div>

        {/* 3 User Types Interactive Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}>
          {/* 1. ADMIN USER */}
          <div 
            onClick={() => handleSelectRole('ADMIN')}
            style={{
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              background: selectedRoleKey === 'ADMIN' ? 'var(--gradient-card)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedRoleKey === 'ADMIN' ? '2px solid rgba(168, 85, 247, 0.8)' : '1px solid var(--border-color)',
              boxShadow: selectedRoleKey === 'ADMIN' ? '0 12px 30px rgba(168, 85, 247, 0.2)' : 'var(--shadow-sm)',
              position: 'relative',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            {selectedRoleKey === 'ADMIN' && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'var(--accent-purple)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '2px 10px',
                borderRadius: '999px',
                letterSpacing: '0.05em'
              }}>
                Selected
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: USER_ROLES.ADMIN.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}>
                  <ShieldCheck size={26} />
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                  Full Admin Access
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Admin
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
                Plant QC & Operations Admin
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                Complete administrative control to create/delete customers, upload drawings, override all stages, and export traveler PDFs.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-purple)" /> All Customer Workspaces & Quick Scan
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-purple)" /> Document Parser & Drawing Uploads
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-purple)" /> Full Stage Override & DB Reset
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDirectLogin('ADMIN');
              }}
              className="btn btn-sm"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                color: '#ffffff',
                fontWeight: '700',
                padding: '0.65rem 1rem',
                border: 'none',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
              }}
            >
              Sign In as Admin <ArrowRight size={15} />
            </button>
          </div>

          {/* 2. ASSEMBLY USER */}
          <div 
            onClick={() => handleSelectRole('ASSEMBLY')}
            style={{
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              background: selectedRoleKey === 'ASSEMBLY' ? 'var(--gradient-card)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedRoleKey === 'ASSEMBLY' ? '2px solid rgba(0, 242, 254, 0.8)' : '1px solid var(--border-color)',
              boxShadow: selectedRoleKey === 'ASSEMBLY' ? '0 12px 30px rgba(0, 242, 254, 0.2)' : 'var(--shadow-sm)',
              position: 'relative',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            {selectedRoleKey === 'ASSEMBLY' && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'var(--accent-cyan)',
                color: '#04101e',
                fontSize: '0.65rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '2px 10px',
                borderRadius: '999px',
                letterSpacing: '0.05em'
              }}>
                Selected
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: USER_ROLES.ASSEMBLY.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#04101e',
                  boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)'
                }}>
                  <Wrench size={26} />
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                  Assembly Floor
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Assembly
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
                Block Assembly & Casting Operator
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                Focused on assembly shop-floor operations: BOM allocation, mold preparation, casting verification, and assembly checklists.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-cyan)" /> LOM Verification & BOM Allocation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-cyan)" /> Mold, Fusion & Casting Clearance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-cyan)" /> Block Assembly Stage Checklist
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDirectLogin('ASSEMBLY');
              }}
              className="btn btn-sm btn-primary"
              style={{
                width: '100%',
                fontWeight: '700',
                padding: '0.65rem 1rem',
              }}
            >
              Sign In as Assembly <ArrowRight size={15} />
            </button>
          </div>

          {/* 3. FINISHING USER */}
          <div 
            onClick={() => handleSelectRole('FINISHING')}
            style={{
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              background: selectedRoleKey === 'FINISHING' ? 'var(--gradient-card)' : 'rgba(255, 255, 255, 0.02)',
              border: selectedRoleKey === 'FINISHING' ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid var(--border-color)',
              boxShadow: selectedRoleKey === 'FINISHING' ? '0 12px 30px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)',
              position: 'relative',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            {selectedRoleKey === 'FINISHING' && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'var(--accent-emerald)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '2px 10px',
                borderRadius: '999px',
                letterSpacing: '0.05em'
              }}>
                Selected
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: USER_ROLES.FINISHING.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}>
                  <Sparkles size={26} />
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  Finishing & QC
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Finishing
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
                Finishing Line & QC Inspector
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                Focused on finishing, precision surface machining, dimensional tolerances, final QC inspection approval, and dispatch sign-off.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-emerald)" /> Machining & Cutting Stage Clearance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-emerald)" /> QC Inspection Approval & Tolerances
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="var(--accent-emerald)" /> Ready for Dispatch Sign-off
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDirectLogin('FINISHING');
              }}
              className="btn btn-sm btn-emerald"
              style={{
                width: '100%',
                fontWeight: '700',
                padding: '0.65rem 1rem',
              }}
            >
              Sign In as Finishing <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div className="glass-panel" style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-md)',
          maxWidth: '680px',
          margin: '0 auto',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Direct Operator Sign-In
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Selected Role: <span style={{ fontWeight: '700', color: activeRole.color === 'purple' ? 'var(--accent-purple)' : activeRole.color === 'cyan' ? 'var(--accent-cyan)' : 'var(--accent-emerald)' }}>{activeRole.name}</span>
              </p>
            </div>
            <span className={`badge ${activeRole.badgeClass}`}>
              Role: {activeRole.role.toUpperCase()}
            </span>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Operator Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, assembly, or finishing"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Quick identifiers: <code style={{ color: 'var(--accent-purple)' }}>admin</code> · <code style={{ color: 'var(--accent-cyan)' }}>assembly</code> · <code style={{ color: 'var(--accent-emerald)' }}>finishing</code>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Operator Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                padding: '0.75rem',
                fontWeight: '800',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? 'Authenticating...' : `Enter Manufacturing Portal as ${activeRole.name}`}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer / System Verification Badge */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} color="var(--accent-cyan)" /> Saint-Gobain Refractories Plant #4
          </div>
          <div>•</div>
          <div>ISO 9001:2015 & ISO 14001 Certified Quality MES</div>
          <div>•</div>
          <div>Role-Based Access Control (RBAC) Active</div>
        </div>
      </div>
    </div>
  );
}
