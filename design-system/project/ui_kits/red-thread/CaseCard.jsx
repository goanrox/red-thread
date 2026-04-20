// CaseCard.jsx — Red Thread UI Kit

const CATEGORY_BG = {
  'country-house': 'linear-gradient(135deg,#1a0e06,#2e1a08,#150c04)',
  'noir': 'linear-gradient(135deg,#060814,#0d1a2e,#040810)',
  'cold-case': 'linear-gradient(135deg,#060c12,#0d1e2e,#040a10)',
  'psychological': 'linear-gradient(135deg,#120612,#2e0e2e,#0d040d)',
  'locked-room': 'linear-gradient(135deg,#080808,#181818,#0a0a0a)',
  'conspiracy': 'linear-gradient(135deg,#061206,#0e2e0e,#040d04)',
};

function DifficultyDots({ level }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ width: 5, height: 5, borderRadius: '50%',
          background: i < level ? '#E50914' : 'rgba(255,255,255,0.15)' }} />
      ))}
    </div>
  );
}

function CaseCard({ id, title, subtitle, category, difficulty, estimatedMinutes,
  setting, isNew, suspectCount, clueCount, progress, isLocked, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const inProgress = progress && progress.cluesFound > 0 && !progress.isComplete;
  const isComplete = progress?.isComplete;
  const progressPct = progress?.totalClues > 0
    ? Math.round((progress.cluesFound / progress.totalClues) * 100) : 0;

  const ctaLabel = isLocked ? 'Restricted' : isComplete ? 'Reopen Case' : inProgress ? 'Continue' : 'Investigate';
  const ctaStyle = isLocked
    ? { border: '1px dashed rgba(255,255,255,0.08)', color: '#444', background: 'transparent' }
    : isComplete
    ? { border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', background: 'transparent' }
    : inProgress
    ? { background: 'rgba(229,9,20,0.15)', color: '#E50914', border: '1px solid rgba(229,9,20,0.25)' }
    : { background: '#fff', color: '#000' };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick} style={{
        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4, overflow: 'hidden', cursor: isLocked ? 'default' : 'pointer',
        transform: hovered && !isLocked ? 'scale(1.03) translateY(-2px)' : 'none',
        boxShadow: hovered && !isLocked ? '0 16px 48px rgba(0,0,0,0.8)' : '0 4px 20px rgba(0,0,0,0.5)',
        borderColor: hovered && !isLocked ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
        transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
      }}>
      {/* Image panel */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: CATEGORY_BG[category] || '#1a1a1a' }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top,rgba(26,26,26,1) 0%,rgba(26,26,26,0.3) 40%,transparent 70%)' }} />
        {/* badges */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ background: 'rgba(229,9,20,0.85)', color: '#fff', fontSize: 9,
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '2px 7px', borderRadius: 2 }}>
            {category?.replace(/-/g, ' ')}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
          {isNew && !isComplete && <span style={{ background: '#E50914', color: '#fff', fontSize: 9,
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2 }}>NEW</span>}
          {isComplete && <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2,
            ...(progress?.isCorrect ? { background: 'rgba(30,180,60,0.2)', color: '#4cdd8a', border: '1px solid rgba(76,221,138,0.3)' }
              : { background: 'rgba(229,9,20,0.15)', color: '#E50914', border: '1px solid rgba(229,9,20,0.3)' })
          }}>{progress?.isCorrect ? '✓ SOLVED' : '✗ FAILED'}</span>}
        </div>
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 24, opacity: 0.4, marginBottom: 6 }}>🔒</div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#666' }}>CLASSIFIED</p>
          </div>
        )}
        {inProgress && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: '#E50914' }} />
          </div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{title}</h3>
          <p style={{ fontSize: 12, color: '#aaaaaa', lineHeight: 1.5 }}>{subtitle}</p>
        </div>
        {setting && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666' }}>{setting}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DifficultyDots level={difficulty} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#666' }}>{estimatedMinutes}m</span>
            {clueCount > 0 && <span style={{ fontSize: 10, color: '#666' }}>{clueCount} clues</span>}
            {suspectCount > 0 && <span style={{ fontSize: 10, color: '#666' }}>{suspectCount} suspects</span>}
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ ...ctaStyle, padding: '10px', textAlign: 'center', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: isLocked ? 'default' : 'pointer' }}>
          {ctaLabel}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CaseCard, DifficultyDots, CATEGORY_BG });
