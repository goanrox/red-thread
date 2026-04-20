// Screens.jsx — Red Thread UI Kit
// CasesScreen, HubScreen, InterrogationScreen, AccuseScreen, ProfileScreen

const { useState, useEffect, useRef } = React;

// ── Sample data ───────────────────────────────────────────────────────────────
const CASE = {
  id: 'thornwood', title: 'The Thornwood Affair',
  subtitle: 'A winter house party. A body in the library. Six suspects, no exits.',
  category: 'country-house', difficulty: 2, estimatedMinutes: 45,
  setting: 'Yorkshire, 1934', isNew: true,
  suspects: [
    { id: 's1', name: 'Lady Cecily Voss', role: 'The Hostess', level: 72, initials: 'CV', bg: '#2a1a1a' },
    { id: 's2', name: 'Dr. Edmund Pryce', role: 'The Physician', level: 38, initials: 'EP', bg: '#1a1a2a' },
    { id: 's3', name: 'Nora Blackwell', role: 'The Secretary', level: 55, initials: 'NB', bg: '#1a2a1a' },
    { id: 's4', name: 'Col. James Rook', role: 'War Veteran', level: 20, initials: 'JR', bg: '#2a2a1a' },
  ],
  victim: { name: 'Lord Henry Thornwood', occupation: 'Estate Owner' },
  clues: [
    { id:'c1', title:'Broken Pocket Watch', type:'physical', severity:'critical', desc:'Stopped at 11:47 PM.' },
    { id:'c2', title:'Unsigned Letter', type:'document', severity:'high', desc:'Found in the fireplace grate.' },
    { id:'c3', title:'Laudanum Bottle', type:'physical', severity:'critical', desc:'Half-empty, fingerprints smudged.' },
    { id:'c4', title:'Muddy Boots', type:'observation', severity:'supporting', desc:'Size 10, near the conservatory.' },
    { id:'c5', title:'Torn Glove', type:'physical', severity:'high', desc:'Monogram "E.P." stitched in gold.' },
    { id:'c6', title:'Witness Testimony', type:'testimony', severity:'supporting', desc:'Maid heard arguing at midnight.' },
  ],
  timeline: [
    { time: '9:00 PM', text: 'Guests arrive for dinner. Lord Thornwood appears agitated.', isKey: false },
    { time: '10:30 PM', text: 'Argument heard between Thornwood and Lady Voss in the study.', isKey: true },
    { time: '11:00 PM', text: 'Thornwood excuses himself. Last seen heading to the library.', isKey: true },
    { time: '11:47 PM', text: 'Pocket watch stops. Cause of death established.', isKey: true },
    { time: '12:15 AM', text: 'Body discovered by the housemaid during rounds.', isKey: false },
  ],
  questions: [
    { id:'q1', text:'Where were you at 11 PM?', response:'I was in the drawing room with the other guests. You can ask any of them.' },
    { id:'q2', text:'Did you argue with Lord Thornwood?', response:'We had a... disagreement. Over business matters. Nothing more.' },
    { id:'q3', text:'What is your relationship with the victim?', response:'We were acquainted through mutual connections. Nothing more.' },
  ],
};

const LOCKED_CASES = [
  { id:'bellamy', title:'The Bellamy Gala', subtitle:'Champagne, poison, and a room full of perfect alibis.', category:'noir', difficulty:3, estimatedMinutes:50, setting:'Paris, 1928', isLocked:true, suspectCount:6, clueCount:10 },
  { id:'coldwater', title:'The Coldwater File', subtitle:'A case from 1978. Someone remembers. Someone wishes they didn\'t.', category:'cold-case', difficulty:4, estimatedMinutes:60, setting:'Yorkshire, 1978', isLocked:true, suspectCount:5, clueCount:14 },
];

// ── Cases Library Screen ───────────────────────────────────────────────────────
function CasesScreen({ navigate, progress }) {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id:'all', label:'All Cases' }, { id:'country-house', label:'Country House' },
    { id:'noir', label:'Noir' }, { id:'cold-case', label:'Cold Case' },
  ];
  const allCards = [
    { ...CASE, suspectCount: CASE.suspects.length, clueCount: CASE.clues.length,
      progress: progress.cluesFound > 0 ? progress : undefined },
    ...LOCKED_CASES,
  ];
  const filtered = filter === 'all' ? allCards : allCards.filter(c => c.category === filter);

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background:'#141414', borderBottom:'0.5px solid rgba(255,255,255,0.08)', padding:'60px 4% 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:24, height:2, background:'#E50914', flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#aaaaaa' }}>CASE REGISTRY</span>
        </div>
        <h1 style={{ fontSize:'clamp(2.4rem,5vw,3.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:12, lineHeight:1.05 }}>Case Files</h1>
        <p style={{ fontSize:15, color:'#aaaaaa', maxWidth:480, lineHeight:1.6 }}>Each case is a closed world. One killer. One truth. Everything else is misdirection.</p>
      </div>

      {/* Filter bar */}
      <div style={{ position:'sticky', top:68, zIndex:30, background:'rgba(20,20,20,0.95)', backdropFilter:'blur(24px)', borderBottom:'0.5px solid rgba(255,255,255,0.07)', padding:'12px 4%' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'7px 16px', borderRadius:4, fontSize:9, fontWeight:700,
              letterSpacing:'0.35em', textTransform:'uppercase', cursor:'pointer', whiteSpace:'nowrap', border:'none',
              ...(filter === f.id
                ? { background:'#fff', color:'#000' }
                : { background:'rgba(255,255,255,0.08)', color:'#aaaaaa', border:'1px solid rgba(255,255,255,0.1)' })
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding:'40px 4% 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
          {filtered.map(c => (
            <CaseCard key={c.id} {...c} onClick={() => !c.isLocked && navigate('hub')} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Investigation Hub ─────────────────────────────────────────────────────────
function HubScreen({ navigate, progress, setProgress }) {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id:'overview', label:'Overview' }, { id:'suspects', label:'Suspects' },
    { id:'evidence', label:'Evidence' }, { id:'timeline', label:'Timeline' },
    { id:'notes', label:'Notes' },
  ];
  const discovered = CASE.clues.slice(0, progress.cluesFound);
  const pct = Math.round((progress.cluesFound / CASE.clues.length) * 100);

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <div style={{ position:'relative', minHeight:320, overflow:'hidden',
        background:'radial-gradient(ellipse at 65% 40%,#2a0808,#150404,#080808)' }}>
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to right,rgba(20,20,20,0.93) 30%,rgba(20,20,20,0.4) 70%,transparent)' }} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to top,rgba(20,20,20,1) 0%,transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:10, padding:'60px 4% 40px' }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#aaaaaa', marginBottom:12 }}>CASE FILE · SEASON 1</p>
          <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.04em', marginBottom:16, lineHeight:1.05 }}>
            {CASE.title}
          </h1>
          <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:16 }}>
            <span style={{ color:'#aaaaaa', fontSize:13 }}>{CASE.suspects.length} suspects</span>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ color:'#aaaaaa', fontSize:13 }}>{CASE.clues.length} clues</span>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ color:'#aaaaaa', fontSize:13 }}>{CASE.setting}</span>
            <span style={{ border:'1px solid rgba(255,255,255,0.4)', color:'rgba(255,255,255,0.7)', fontSize:10, padding:'1px 6px', fontWeight:500 }}>TV-MA</span>
            <span style={{ color:'#4cdd8a', fontSize:13, fontWeight:700 }}>85% Match</span>
          </div>
          {progress.cluesFound > 0 && (
            <div style={{ width: 240, height:3, background:'rgba(255,255,255,0.1)', borderRadius:99, marginBottom:20, overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:'#E50914' }} />
            </div>
          )}
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={() => navigate('interrogate')} style={{ padding:'12px 28px', borderRadius:4, background:'#fff', color:'#000', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
              ▶ {progress.cluesFound > 0 ? 'Continue' : 'Investigate'}
            </button>
            <button onClick={() => navigate('evidence')} style={{ padding:'12px 28px', borderRadius:4, background:'rgba(109,109,110,0.7)', color:'#fff', fontWeight:600, fontSize:14, border:'none', cursor:'pointer', backdropFilter:'blur(4px)' }}>
              ⓘ Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ position:'sticky', top:68, zIndex:30, background:'rgba(20,20,20,0.97)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', padding:'0 4%' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'14px 20px', fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase',
            border:'none', borderBottom:`2px solid ${tab===t.id ? '#E50914' : 'transparent'}`,
            background:'none', cursor:'pointer', whiteSpace:'nowrap',
            color: tab===t.id ? '#fff' : 'rgba(255,255,255,0.35)',
            transition:'color 200ms, border-color 200ms',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding:'32px 4% 80px' }}>
        {tab === 'overview' && <OverviewTab navigate={navigate} discovered={discovered} setProgress={setProgress} progress={progress} />}
        {tab === 'suspects' && <SuspectsTab navigate={navigate} />}
        {tab === 'evidence' && <EvidenceTab discovered={discovered} />}
        {tab === 'timeline' && <TimelineTab />}
        {tab === 'notes' && <NotesTab />}
      </div>

      {/* Accusation CTA */}
      {progress.cluesFound >= 3 && (
        <div style={{ position:'fixed', bottom:24, left:0, right:0, display:'flex', justifyContent:'center', zIndex:30 }}>
          <button onClick={() => navigate('accuse')} style={{
            display:'flex', alignItems:'center', gap:16, padding:'16px 32px',
            background:'#E50914', border:'none', borderRadius:4, cursor:'pointer',
            boxShadow:'0 12px 40px rgba(229,9,20,0.5)',
          }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'#fff' }}>
              The evidence is mounting. Make your accusation.
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ navigate, discovered, setProgress, progress }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32, maxWidth:860 }}>
      {/* Victim */}
      <section>
        <SectionHeader label="The Victim" />
        <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, padding:24 }}>
          <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(229,9,20,0.1)', border:'1px solid rgba(229,9,20,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>💀</div>
            <div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Victim</p>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', marginBottom:4 }}>{CASE.victim.name}</h2>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:12 }}>{CASE.victim.occupation}</p>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>Found dead in the Thornwood library shortly after midnight. Cause of death: asphyxiation. The household was sealed. No one had left the grounds.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Suspects preview */}
      <section>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <SectionHeader label="Persons of Interest" inline />
          <button onClick={() => navigate('interrogate')} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', background:'none', border:'none', cursor:'pointer' }}>Begin Interrogations →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
          {CASE.suspects.map(s => (
            <button key={s.id} onClick={() => navigate('interrogate')} style={{
              background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden', cursor:'pointer', textAlign:'left'
            }}>
              <div style={{ height:70, background:`radial-gradient(circle at 30% 30%,${s.bg}cc,${s.bg})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:20, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{s.initials}</span>
              </div>
              <div style={{ padding:'10px 12px' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:6 }}>{s.name}</p>
                <div style={{ height:2, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:`${s.level}%`, height:'100%', background: s.level >= 60 ? '#E50914' : s.level >= 30 ? '#E50914' : 'rgba(255,255,255,0.2)' }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
      {/* Discover clues CTA */}
      {progress.cluesFound < CASE.clues.length && (
        <section>
          <SectionHeader label="Evidence Collection" />
          <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, padding:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:14, color:'#aaaaaa', marginBottom:4 }}>{progress.cluesFound} of {CASE.clues.length} clues discovered</p>
              <div style={{ width:200, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ width:`${(progress.cluesFound/CASE.clues.length)*100}%`, height:'100%', background:'#E50914' }} />
              </div>
            </div>
            <button onClick={() => setProgress(p => ({...p, cluesFound: Math.min(p.cluesFound+1, CASE.clues.length)}))}
              style={{ padding:'10px 20px', borderRadius:4, background:'rgba(229,9,20,0.12)', color:'#E50914', border:'1px solid rgba(229,9,20,0.25)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              + Discover Clue
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function SuspectsTab({ navigate }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16, maxWidth:900 }}>
      {CASE.suspects.map((s, i) => (
        <div key={s.id} style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:160, background:`radial-gradient(circle at 30% 30%,${s.bg}cc,${s.bg})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:40, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>{s.initials}</span>
            <div style={{ position:'absolute', top:12, right:12 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', padding:'2px 8px', borderRadius:4,
                ...(s.level >= 60 ? { border:'1px solid rgba(229,9,20,0.5)', color:'#E50914', background:'rgba(10,5,10,0.7)' }
                  : s.level >= 30 ? { border:'1px solid rgba(229,9,20,0.3)', color:'rgba(229,9,20,0.7)', background:'rgba(10,8,5,0.7)' }
                  : { border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.4)', background:'rgba(10,10,20,0.7)' })
              }}>{s.level >= 60 ? 'High' : s.level >= 30 ? 'Medium' : 'Low'} risk</span>
            </div>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(26,26,26,0.98),transparent)', padding:'16px 16px 14px' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:2 }}>{s.role}</p>
              <h3 style={{ fontSize:17, fontWeight:700, color:'#fff' }}>{s.name}</h3>
            </div>
          </div>
          <div style={{ padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>Suspicion Index</span>
              <span style={{ fontSize:10, color: s.level >= 30 ? '#E50914' : 'rgba(255,255,255,0.25)' }}>{s.level}%</span>
            </div>
            <div style={{ height:2, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
              <div style={{ width:`${s.level}%`, height:'100%', background: s.level >= 30 ? '#E50914' : 'rgba(255,255,255,0.2)' }} />
            </div>
            <button onClick={() => navigate('interrogate')} style={{ width:'100%', padding:'10px', borderRadius:4, fontSize:9, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase', border:'0.5px solid rgba(229,9,20,0.4)', color:'#E50914', background:'transparent', cursor:'pointer' }}>
              Interrogate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EvidenceTab({ discovered }) {
  const [selected, setSelected] = useState(null);
  const locked = CASE.clues.filter(c => !discovered.find(d => d.id === c.id));
  return (
    <div style={{ maxWidth:860 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12, marginBottom:24 }}>
        {discovered.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:4, padding:16, textAlign:'left', cursor:'pointer', width:'100%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <span style={{ fontSize:15, fontWeight:600, color:'#fff' }}>{c.title}</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 8px', borderRadius:4,
                ...(c.severity === 'critical' || c.severity === 'high'
                  ? { color:'#E50914', border:'1px solid rgba(229,9,20,0.25)', background:'rgba(229,9,20,0.06)' }
                  : { color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.08)', background:'transparent' })
              }}>{c.severity}</span>
            </div>
            <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:6 }}>{c.type}</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{c.desc}</p>
          </button>
        ))}
      </div>
      {locked.length > 0 && (
        <div>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:12 }}>{locked.length} undiscovered</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
            {locked.map(c => (
              <div key={c.id} style={{ padding:'14px 16px', borderRadius:4, background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>🔒</span>
                <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>Redacted</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(4px)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={() => setSelected(null)}>
          <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, maxWidth:480, width:'100%', padding:28 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontSize:20 }}>✕</button>
            </div>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.65 }}>{selected.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineTab() {
  return (
    <div style={{ maxWidth:640, position:'relative' }}>
      <div style={{ position:'absolute', left:88, top:0, bottom:0, width:1, background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.15),transparent)' }} />
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {CASE.timeline.map((ev, i) => (
          <div key={i} style={{ display:'flex', gap:24, position:'relative' }}>
            <div style={{ width:80, textAlign:'right', paddingTop:4, flexShrink:0 }}>
              <span style={{ fontSize:12, fontWeight:700, fontFamily:'monospace', color: ev.isKey ? '#E50914' : 'rgba(255,255,255,0.35)' }}>{ev.time}</span>
            </div>
            <div style={{ position:'absolute', left:82, top:6, width:12, height:12, borderRadius:'50%',
              border:`1.5px solid ${ev.isKey ? '#E50914' : 'rgba(255,255,255,0.2)'}`,
              background: ev.isKey ? 'rgba(229,9,20,0.2)' : '#141414',
              boxShadow: ev.isKey ? '0 0 8px rgba(229,9,20,0.4)' : 'none' }} />
            <div style={{ flex:1, marginLeft:24, padding:16, borderRadius:4,
              background: ev.isKey ? '#1a1a1a' : '#0f0f0f',
              border:`0.5px solid ${ev.isKey ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}` }}>
              <p style={{ fontSize:13, lineHeight:1.6, color: ev.isKey ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)' }}>{ev.text}</p>
              {ev.isKey && <span style={{ display:'inline-block', marginTop:8, fontSize:9, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>Key Event</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab() {
  const [val, setVal] = useState('');
  return (
    <div style={{ maxWidth:600 }}>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>Private investigation notes.</p>
      <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="Record your observations, suspicions, and theories here."
        style={{ width:'100%', height:280, padding:24, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'rgba(255,255,255,0.75)', fontSize:14, lineHeight:1.7, resize:'none', fontFamily:'Inter,sans-serif', outline:'none' }} />
      <p style={{ fontSize:9, color:'rgba(255,255,255,0.2)', marginTop:8, fontFamily:'monospace' }}>Auto-saved · {val.length} chars</p>
    </div>
  );
}

// ── Interrogation Screen ───────────────────────────────────────────────────────
function InterrogationScreen({ navigate }) {
  const suspect = CASE.suspects[0];
  const [messages, setMessages] = useState([
    { id:'intro', type:'suspect', text:`Good evening, Detective. I must say, I find this whole business rather distasteful. I've already told the constable everything I know about poor Lord Thornwood's death.` }
  ]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState([]);
  const endRef = useRef(null);
  const available = CASE.questions.filter(q => !asked.includes(q.id));

  useEffect(() => { endRef.current?.parentElement?.scrollTo(0, endRef.current.offsetTop); }, [messages, typing]);

  function ask(q) {
    setMessages(m => [...m, { id:`q-${q.id}`, type:'player', text:q.text }]);
    setAsked(a => [...a, q.id]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id:`a-${q.id}`, type:'suspect', text:q.response }]);
    }, 1200);
  }

  return (
    <div style={{ display:'flex', height:'calc(100vh - 68px)', marginTop:68, maxWidth:1060, margin:'68px auto 0', padding:'0 4%' }}>
      {/* Left: suspect profile */}
      <div style={{ width:260, flexShrink:0, background:'#1a1a1a', borderRadius:4, marginRight:20, padding:28, display:'flex', flexDirection:'column', gap:20, overflow:'hidden' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle at 30% 30%,${suspect.bg}cc,${suspect.bg})`, border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{suspect.initials}</div>
          <h3 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:4 }}>{suspect.name}</h3>
          <p style={{ fontSize:10, color:'#666', letterSpacing:'0.08em', textTransform:'uppercase' }}>{suspect.role}</p>
        </div>
        <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:10, color:'#666' }}>Suspicion</span>
            <span style={{ fontSize:10, color:'#E50914' }}>{suspect.level}%</span>
          </div>
          <div style={{ height:6, borderRadius:99, background:'#222', overflow:'hidden' }}>
            <div style={{ width:`${suspect.level}%`, height:'100%', background:'#E50914', borderRadius:99 }} />
          </div>
        </div>
        <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />
        <div>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase', color:'#666', marginBottom:8 }}>Background</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>Lady of Thornwood Estate. Inherited the manor through marriage. Known for her sharp wit and sharper tongue.</p>
        </div>
        <button onClick={() => navigate('hub')} style={{ marginTop:'auto', padding:'10px', borderRadius:4, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'#aaaaaa', fontSize:12, cursor:'pointer' }}>← Back to Hub</button>
      </div>

      {/* Right: chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <div style={{ padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>{suspect.name} · Interrogation</p>
        </div>
        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16, paddingRight:4, paddingBottom:8 }}>
          {messages.map(msg => msg.type === 'player' ? (
            <div key={msg.id} style={{ display:'flex', justifyContent:'flex-end' }}>
              <div style={{ maxWidth:'70%', padding:'12px 16px', borderRadius:'16px 16px 4px 16px', background:'rgba(229,9,20,0.12)', border:'1px solid rgba(229,9,20,0.25)', color:'#fff', fontSize:14, lineHeight:1.55 }}>{msg.text}</div>
            </div>
          ) : (
            <div key={msg.id} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`radial-gradient(circle at 30% 30%,${suspect.bg}cc,${suspect.bg})`, border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)', flexShrink:0 }}>{suspect.initials}</div>
              <div style={{ maxWidth:'80%', padding:'12px 16px', borderRadius:'16px 16px 16px 4px', background:'#222', color:'#fff', fontSize:14, lineHeight:1.65 }}>{msg.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`radial-gradient(circle at 30% 30%,${suspect.bg}cc,${suspect.bg})`, flexShrink:0 }} />
              <div style={{ padding:'12px 18px', borderRadius:'16px 16px 16px 4px', background:'#222', display:'flex', gap:5 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#aaa', animation:`typingDot 1.2s infinite ${i*200}ms` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* Questions */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:16 }}>
          {available.length === 0 ? (
            <p style={{ fontSize:13, color:'#666', textAlign:'center', padding:'16px 0' }}>All questions exhausted.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:180, overflowY:'auto' }}>
              <p style={{ fontSize:9, color:'#666', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase' }}>{available.length} question{available.length!==1?'s':''} available</p>
              {available.map(q => (
                <button key={q.id} onClick={() => !typing && ask(q)} disabled={typing}
                  style={{ textAlign:'left', padding:'12px 16px', borderRadius:4, background:'#222', color:'#fff', border:'1px solid rgba(255,255,255,0.08)', borderLeft:'3px solid #E50914', fontSize:14, cursor:typing?'not-allowed':'pointer', opacity:typing?0.5:1 }}>
                  {q.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Accusation Screen ─────────────────────────────────────────────────────────
function AccuseScreen({ navigate, progress }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('select');

  return (
    <div style={{ paddingTop:68, minHeight:'100vh', background:'#141414' }}>
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:400, background:'radial-gradient(ellipse,rgba(229,9,20,0.06),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'60px 4% 80px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'#E50914', marginBottom:12 }}>The Accusation</p>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:16, lineHeight:1.05 }}>Who Killed {CASE.victim.name}?</h1>
          <p style={{ fontSize:16, color:'#aaaaaa', maxWidth:480, margin:'0 auto', lineHeight:1.55 }}>This accusation is final. There is no recall. Choose with conviction.</p>
        </div>

        {step === 'select' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
            {CASE.suspects.map((s, i) => (
              <button key={s.id} onClick={() => { setSelected(s); setStep('confirm1'); }}
                style={{ textAlign:'left', background:'#1a1a1a', border:`1px solid ${selected?.id===s.id ? '#E50914' : 'rgba(255,255,255,0.08)'}`, borderRadius:4, overflow:'hidden', cursor:'pointer', boxShadow: selected?.id===s.id ? '0 0 0 1px #E50914' : 'none' }}>
                <div style={{ height:120, background:`radial-gradient(circle at 30% 30%,${s.bg}cc,${s.bg})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>{s.initials}</div>
                <div style={{ height:2, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                  <div style={{ width:`${s.level}%`, height:'100%', background: s.level>=60 ? '#E50914' : '#666' }} />
                </div>
                <div style={{ padding:'12px 14px' }}>
                  <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:2 }}>{s.name}</p>
                  <p style={{ fontSize:10, color:'#666', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>{s.role}</p>
                  <p style={{ fontSize:10, color:'#666' }}>{s.level >= 30 ? Math.min(2, Math.floor(s.level/30)) : 0} clues linked</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'confirm1' && selected && (
          <div style={{ maxWidth:440, margin:'0 auto' }}>
            <div style={{ background:'#1a1a1a', border:'1px solid rgba(229,9,20,0.2)', borderRadius:4, padding:24, marginBottom:20 }}>
              <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:16 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:`radial-gradient(circle at 30% 30%,${selected.bg}cc,${selected.bg})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff' }}>{selected.initials}</div>
                <div><p style={{ fontSize:20, fontWeight:700, color:'#fff' }}>{selected.name}</p><p style={{ fontSize:11, color:'#666' }}>{selected.role}</p></div>
              </div>
              <p style={{ fontSize:13, color:'#aaaaaa', lineHeight:1.6 }}>Are you certain this individual murdered Lord Thornwood? Review the evidence before proceeding.</p>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => { setSelected(null); setStep('select'); }} style={{ flex:1, padding:'13px', borderRadius:4, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'#aaaaaa', fontSize:14, cursor:'pointer' }}>← Reconsider</button>
              <button onClick={() => setStep('confirm2')} style={{ flex:1, padding:'13px', borderRadius:4, background:'#E50914', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>I'm Certain →</button>
            </div>
          </div>
        )}

        {step === 'confirm2' && selected && (
          <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center' }}>
            <div style={{ background:'rgba(229,9,20,0.08)', border:'1px solid rgba(229,9,20,0.25)', borderRadius:4, padding:32, marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16, color:'#E50914' }}>
                <span>⚠️</span>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'#E50914' }}>Final Warning</span>
                <span>⚠️</span>
              </div>
              <p style={{ fontSize:18, color:'#fff', fontWeight:700, marginBottom:12 }}>This accusation is final.</p>
              <p style={{ fontSize:14, color:'#aaaaaa', lineHeight:1.6 }}>You are about to accuse <strong style={{ color:'#fff' }}>{selected.name}</strong> of the murder of {CASE.victim.name}. There is no second chance.</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={() => navigate('result')} style={{ width:'100%', padding:'14px', borderRadius:4, background:'#E50914', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                Yes — Accuse {selected.name}
              </button>
              <button onClick={() => setStep('confirm1')} style={{ width:'100%', padding:'12px', borderRadius:4, background:'transparent', color:'#aaaaaa', border:'1px solid rgba(255,255,255,0.1)', fontSize:14, cursor:'pointer' }}>← Go Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ navigate }) {
  const correct = Math.random() > 0.5;
  const stats = [
    { label:'Base Points', value:800 }, { label:'Clue Bonus', value:150 },
    { label:'Accuracy', value:'74%' }, { label:'Total', value:950, accent:true },
  ];
  return (
    <div style={{ paddingTop:68, minHeight:'100vh', background:'#141414', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:600, height:400, background:`radial-gradient(ellipse,${correct ? 'rgba(76,221,138,0.08)' : 'rgba(229,9,20,0.08)'},transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ maxWidth:520, width:'100%', padding:'0 24px', textAlign:'center' }}>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color: correct ? '#4cdd8a' : '#E50914', marginBottom:16 }}>{correct ? 'CASE SOLVED' : 'WRONG ACCUSATION'}</p>
        <div style={{ fontSize:72, marginBottom:20 }}>{correct ? '✅' : '❌'}</div>
        <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:12 }}>You accused Lady Cecily Voss</h1>
        <p style={{ fontSize:16, color:'#aaaaaa', marginBottom:40 }}>{correct ? 'Your instincts were correct. Justice is served.' : 'The killer was Dr. Edmund Pryce.'}</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:'#1a1a1a', border:`1px solid ${s.accent ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius:4, padding:'16px 20px', textAlign:'center', minWidth:100 }}>
              <p style={{ fontSize:26, fontWeight:700, color: s.accent ? '#E50914' : '#fff', marginBottom:4 }}>{s.value}</p>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'#666' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('cases')} style={{ padding:'12px 28px', borderRadius:4, background:'#fff', color:'#000', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>▶ Browse Cases</button>
          <button onClick={() => navigate('profile')} style={{ padding:'12px 28px', borderRadius:4, background:'rgba(109,109,110,0.7)', color:'#fff', fontWeight:600, fontSize:14, border:'none', cursor:'pointer' }}>View Profile</button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────
function ProfileScreen({ navigate, progress }) {
  const solved = progress.cluesFound >= CASE.clues.length ? 1 : 0;
  return (
    <div style={{ paddingTop:68, minHeight:'100vh' }}>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 4% 80px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:24, height:2, background:'#E50914' }} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#aaaaaa' }}>YOUR RECORD</span>
        </div>
        <h1 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:8 }}>Detective Profile</h1>
        <p style={{ fontSize:17, color:'#aaaaaa', marginBottom:40 }}>Every case tells a story. This one is yours.</p>

        {/* Rank card */}
        <div style={{ background:'linear-gradient(160deg,#0d0a0a,#0a0707)', border:'1px solid rgba(229,9,20,0.2)', borderRadius:4, padding:28, marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
            <div><p style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Current Rank</p><h2 style={{ fontSize:28, fontWeight:700, color:'#E50914' }}>Rookie</h2></div>
            <div style={{ textAlign:'right' }}><p style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Total Score</p><p style={{ fontSize:28, fontWeight:700, color:'#fff' }}>0</p></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:10, color:'#666', textTransform:'uppercase' }}>Rookie</span>
            <span style={{ fontSize:10, color:'#666', textTransform:'uppercase' }}>Investigator</span>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ width:'5%', height:'100%', background:'#E50914' }} />
          </div>
          <p style={{ fontSize:10, color:'#666', marginTop:6, textAlign:'right' }}>500 points to Investigator</p>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[{ label:'Cases Started', val:1 }, { label:'Cases Solved', val:solved, accent:true }, { label:'Cases Done', val:solved }, { label:'Accuracy', val:'—', accent:solved>0 }].map(s => (
            <div key={s.label} style={{ background:'#1a1a1a', border:`1px solid ${s.accent ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius:4, padding:20, textAlign:'center' }}>
              <p style={{ fontSize:26, fontWeight:700, color: s.accent ? '#E50914' : '#fff', marginBottom:6 }}>{s.val}</p>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'#666' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Case history */}
        <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ width:4, height:20, background:'#E50914', borderRadius:2 }} />
            <p style={{ fontSize:16, fontWeight:700, color:'#e5e5e5' }}>Case History</p>
          </div>
          {solved > 0 ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#E50914', flexShrink:0 }} />
                <div><p style={{ fontSize:15, fontWeight:600, color:'#fff' }}>{CASE.title}</p><p style={{ fontSize:10, color:'#666', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>Solved · 950 pts</p></div>
              </div>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'3px 10px', borderRadius:4, background:'rgba(76,221,138,0.1)', border:'1px solid rgba(76,221,138,0.2)', color:'#4cdd8a' }}>✓ SOLVED</span>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <p style={{ fontSize:16, color:'#666', marginBottom:8 }}>No cases on record yet.</p>
              <p style={{ fontSize:13, color:'#444', marginBottom:24 }}>Start with The Thornwood Affair.</p>
              <button onClick={() => navigate('hub')} style={{ padding:'11px 24px', borderRadius:4, background:'#fff', color:'#000', fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>Investigate Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function SectionHeader({ label, inline }) {
  if (inline) return <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>{label}</span>;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
      <div style={{ height:1, width:20, background:'rgba(255,255,255,0.3)', flexShrink:0 }} />
      <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>{label}</span>
      <div style={{ flex:1, height:1, background:'linear-gradient(to right,rgba(255,255,255,0.2),transparent)' }} />
    </div>
  );
}

Object.assign(window, { CasesScreen, HubScreen, InterrogationScreen, AccuseScreen, ResultScreen, ProfileScreen, SectionHeader });
