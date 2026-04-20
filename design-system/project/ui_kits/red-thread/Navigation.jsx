// Navigation.jsx — Red Thread UI Kit
// Shared nav + screen router

const { useState, useEffect } = React;

function Navigation({ screen, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.getElementById('rt-app');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 20);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const isHome = screen === 'cases';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 4%', height: 68,
      background: (!isHome || scrolled)
        ? 'rgba(20,20,20,0.97)'
        : 'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition: 'background 300ms, border-color 300ms',
    }}>
      <button onClick={() => navigate('cases')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em' }}>
          <span style={{ color: '#E50914' }}>RED</span>
          <span style={{ color: '#ffffff' }}> THREAD</span>
        </span>
      </button>
      <div style={{ display: 'flex', gap: 24 }}>
        {['Cases','Detective'].map(l => (
          <button key={l} onClick={() => navigate(l === 'Detective' ? 'profile' : 'cases')}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: screen === (l === 'Detective' ? 'profile' : 'cases') ? 600 : 500,
              color: screen === (l === 'Detective' ? 'profile' : 'cases') ? '#fff' : '#aaaaaa',
              transition: 'color 150ms' }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width="20" height="20" fill="none" stroke="#e5e5e5" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
        </svg>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E50914', color: '#fff',
          fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</div>
      </div>
    </nav>
  );
}

Object.assign(window, { Navigation });
