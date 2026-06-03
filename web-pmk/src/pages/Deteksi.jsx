import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'https://storm-audacious-catfish.ngrok-free.dev';

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconCow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v6c0 3.3-2.7 6-6 6H10c-3.3 0-6-2.7-6-6V8z"/>
    <path d="M8 4V2M16 4V2"/>
    <circle cx="9" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/>
    <path d="M9.5 15.5c.7.7 1.4 1 2.5 1s1.8-.3 2.5-1"/>
    <path d="M2 8h2M20 8h2"/>
  </svg>
);
const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconCamera = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconFile = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMicroscope = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-4"/><path d="M14 7l-1-2M14 7l1-2"/>
    <path d="M9 5 7.5 8M9 5l1.5 3"/><circle cx="9.5" cy="11.5" r="2.5"/>
    <path d="M14 10a4.5 4.5 0 0 1-9 0V7l1.5-3h6L14 7v3z"/>
  </svg>
);

// ── Symptom groups (camelCase key = FormData field name) ───────────────────────
const SYMPTOM_GROUPS = [
  {
    label: 'Gejala Mulut & Lidah',
    items: [
      { key: 'blistersOnMouth',  label: 'Lepuh di mulut' },
      { key: 'blistersOnGums',   label: 'Lepuh di gusi' },
      { key: 'blistersOnTongue', label: 'Lepuh di lidah' },
      { key: 'soresOnMouth',     label: 'Luka di mulut' },
      { key: 'soresOnGums',      label: 'Luka di gusi' },
      { key: 'soresOnTongue',    label: 'Luka di lidah' },
    ],
  },
  {
    label: 'Gejala Kaki & Gerak',
    items: [
      { key: 'blistersOnHooves',  label: 'Lepuh di kuku' },
      { key: 'soresOnHooves',     label: 'Luka di kuku' },
      { key: 'difficultyWalking', label: 'Sulit berjalan' },
      { key: 'lameness',          label: 'Pincang' },
      { key: 'cracklingSound',    label: 'Bunyi krek saat jalan' },
    ],
  },
  {
    label: 'Gejala Sistemik',
    items: [
      { key: 'lossOfAppetite',     label: 'Nafsu makan turun' },
      { key: 'fatigue',            label: 'Lesu / lemah' },
      { key: 'depression',         label: 'Depresi / murung' },
      { key: 'chills',             label: 'Menggigil' },
      { key: 'sweats',             label: 'Berkeringat' },
      { key: 'shortnessOfBreath',  label: 'Sesak napas' },
      { key: 'chestDiscomfort',    label: 'Tidak nyaman di dada' },
      { key: 'painlessLumps',      label: 'Benjolan tidak nyeri' },
    ],
  },
  {
    label: 'Pembengkakan',
    items: [
      { key: 'swellingInNeck',        label: 'Bengkak di leher' },
      { key: 'swellingInAbdomen',     label: 'Bengkak di perut' },
      { key: 'swellingInLimb',        label: 'Bengkak di anggota' },
      { key: 'swellingInExtremities', label: 'Bengkak di ujung kaki' },
      { key: 'swellingInMuscle',      label: 'Bengkak di otot' },
    ],
  },
];

// Build initial symptom state: all false
const initSymptoms = () => {
  const s = {};
  SYMPTOM_GROUPS.forEach(g => g.items.forEach(i => { s[i.key] = false; }));
  return s;
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" },
  nav: { background: '#1B4332', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: 640, margin: '0 auto', padding: '32px 20px 80px' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  sectionLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4332', marginBottom: 16 },
  sectionLine: { flex: 1, height: 1, background: '#E5E7EB' },
  subLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', margin: '18px 0 10px' },
  subLine: { flex: 1, height: 1, background: '#F3F4F6' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  input: { width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontFamily: "'DM Sans', system-ui", fontSize: 15, color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  hint: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  symptomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 },
};

const focusStyle = (e) => { e.target.style.borderColor = '#1B4332'; e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.1)'; };
const blurStyle  = (e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; };

// ── Symptom checkbox component ─────────────────────────────────────────────────
function SymptomCheckbox({ label, checked, onChange }) {
  return (
    <label
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: checked ? '#F0FDF4' : '#FAFAF8',
        border: `1.5px solid ${checked ? '#86EFAC' : '#E5E7EB'}`,
        borderRadius: 10, padding: '9px 12px', cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s', userSelect: 'none',
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: checked ? '#1B4332' : '#fff',
        border: `1.5px solid ${checked ? '#1B4332' : '#D1D5DB'}`,
        transition: 'background 0.15s, border-color 0.15s',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </span>
      <span style={{ fontSize: 13, color: checked ? '#166534' : '#374151', fontWeight: checked ? 500 : 400, lineHeight: 1.3 }}>
        {label}
      </span>
    </label>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Deteksi() {
  const [isLoading, setIsLoading] = useState(false);
  const [fotoName, setFotoName]   = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isDragging, setIsDragging]   = useState(false);
  const navigate = useNavigate();

  const [foto, setFoto]           = useState(null);
  const [suhuTubuh, setSuhuTubuh] = useState('');
  const [age, setAge]             = useState('');
  const [symptoms, setSymptoms]   = useState(initSymptoms());

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFoto(file);
    setFotoName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setFotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const toggleSymptom = (key) =>
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto) { alert('Silakan upload foto sapi terlebih dahulu.'); return; }
    setIsLoading(true);

    // ── Build FormData — semua key camelCase ───────────────────────────────
    const fd = new FormData();
    fd.append('file', foto);                        // gambar → key 'file'
    if (age)      fd.append('age', age);            // numerik
    if (suhuTubuh) fd.append('temperature', suhuTubuh); // numerik

    // semua symptom → '1' kalau aktif, '0' kalau tidak
    SYMPTOM_GROUPS.forEach(group =>
      group.items.forEach(({ key }) =>
        fd.append(key, symptoms[key] ? '1' : '0')
      )
    );
    // ──────────────────────────────────────────────────────────────────────

    try {
      const response = await fetch(`${API_URL}/predict`, { method: 'POST', body: fd });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(err.error || `Server error ${response.status}`);
      }
      const result = await response.json();
      navigate('/hasil', {
        state: {
          statusPMK: result.hasil_prediksi,
          akurasi:   result.confidence_score,
          detail:    result.detail,
        },
      });
    } catch (err) {
      alert('Gagal menghubungi server: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#4ADE80', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B4332' }}>
            <IconCow />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>CattleCare</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Beranda', to: '/', icon: <IconHome /> }, { label: 'Riwayat', to: '/riwayat', icon: <IconList /> }].map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div style={s.container}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#111827', letterSpacing: '-0.3px', margin: '0 0 4px' }}>Deteksi Gejala PMK</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Lengkapi data visual dan klinis berikut untuk hasil analisis terbaik.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── CARD 1: CNN — Upload Foto ── */}
          <div style={s.card}>
            <div style={s.sectionLabel}>
              <IconCamera />
              <span>Model CNN — Data Visual</span>
              <div style={s.sectionLine} />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Foto Area Mulut / Kuku Sapi</label>
              <input type="file" accept="image/*" id="foto-input" style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])} />

              <div
                onClick={() => document.getElementById('foto-input').click()}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragging ? '#1B4332' : fotoPreview ? '#BBF7D0' : '#D1D5DB'}`,
                  borderRadius: 12, background: isDragging ? '#F0FDF4' : fotoPreview ? '#F0FDF4' : '#FAFAF8',
                  cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
                  overflow: 'hidden', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {fotoPreview ? (
                  <div style={{ width: '100%', position: 'relative' }}>
                    <img src={fotoPreview} alt="Preview" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block', borderRadius: 10 }} />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 18, height: 18, background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                          <IconCheck />
                        </div>
                        <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{fotoName}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Klik untuk ganti</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '28px 24px' }}>
                    <div style={{ width: 52, height: 52, background: isDragging ? '#BBF7D0' : '#E5E7EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: isDragging ? '#1B4332' : '#9CA3AF', transition: 'background 0.2s' }}>
                      <IconUpload />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isDragging ? '#1B4332' : '#374151', marginBottom: 4 }}>
                      {isDragging ? 'Lepaskan foto di sini' : 'Drag & drop foto, atau klik untuk pilih'}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>JPG, PNG, WEBP hingga 10MB</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, height: 34, padding: '0 16px', background: '#fff', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                      <IconFile /> Pilih File
                    </div>
                  </div>
                )}
              </div>
              <div style={s.hint}>Pastikan foto jelas dan fokus pada area mulut atau kuku yang bergejala.</div>
            </div>
          </div>

          {/* ── CARD 2: ANN — Data Klinis ── */}
          <div style={s.card}>
            <div style={s.sectionLabel}>
              <IconActivity />
              <span>Model ANN — Data Klinis</span>
              <div style={s.sectionLine} />
            </div>

            {/* Numerik */}
            <div style={s.formGrid}>
              <div style={s.formGroup}>
                <label style={s.label}>Suhu Tubuh (°C) <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number" step="0.1" min="35" max="43"
                  value={suhuTubuh} onChange={e => setSuhuTubuh(e.target.value)} required
                  placeholder="Cth: 38.5" style={s.input}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <div style={s.hint}>Normal: 38.0 – 39.5°C</div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Umur Sapi (tahun)</label>
                <input
                  type="number" step="0.5" min="0" max="30"
                  value={age} onChange={e => setAge(e.target.value)}
                  placeholder="Cth: 3" style={s.input}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
            </div>

            {/* Symptom groups */}
            {SYMPTOM_GROUPS.map(group => (
              <div key={group.label}>
                <div style={s.subLabel}>
                  <span>{group.label}</span>
                  <div style={s.subLine} />
                </div>
                <div style={s.symptomGrid}>
                  {group.items.map(({ key, label }) => (
                    <SymptomCheckbox
                      key={key}
                      label={label}
                      checked={symptoms[key]}
                      onChange={() => toggleSymptom(key)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Counter badge */}
            {(() => {
              const count = Object.values(symptoms).filter(Boolean).length;
              return count > 0 ? (
                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#166534', fontWeight: 500 }}>
                  <IconCheck /> {count} gejala dipilih
                </div>
              ) : null;
            })()}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit" disabled={isLoading || !foto}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 52,
              background: isLoading || !foto ? '#D1D5DB' : '#1B4332',
              color: '#fff', border: 'none', borderRadius: 12,
              fontFamily: "'DM Sans', system-ui", fontSize: 16, fontWeight: 700,
              cursor: isLoading || !foto ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s, transform 0.1s', letterSpacing: '0.01em',
            }}
            onMouseEnter={e => !isLoading && foto && (e.currentTarget.style.background = '#15532e')}
            onMouseLeave={e => !isLoading && (e.currentTarget.style.background = foto ? '#1B4332' : '#D1D5DB')}
            onMouseDown={e => !isLoading && (e.currentTarget.style.transform = 'scale(0.99)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? (
              <>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                AI Sedang Menganalisis...
              </>
            ) : (
              <><IconMicroscope /> Analisis Sekarang</>
            )}
          </button>

          {!foto && (
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
              Upload foto sapi untuk mengaktifkan tombol analisis
            </p>
          )}
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default Deteksi;
