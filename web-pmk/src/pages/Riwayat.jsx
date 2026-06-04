import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconAlert = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4M12 17h.01"/>
  </svg>
);
const IconCheck = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

function Riwayat() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchRiwayat = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_URL}/riwayat`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hapus = async (id) => {
    if (!window.confirm(`Hapus riwayat #${id}?`)) return;
    try {
      await fetch(`${API_URL}/riwayat/${id}`, { method: 'DELETE' });
      setData(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  useEffect(() => { fetchRiwayat(); }, []);

  const total   = data.length;
  const positif = data.filter(d => d.hasil_prediksi === 'Terindikasi PMK').length;
  const negatif = data.filter(d => d.hasil_prediksi === 'Sapi Sehat').length;

  const isSakit = (r) => r.hasil_prediksi === 'Terindikasi PMK';

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: '#1B4332', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#4ADE80', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B4332' }}>
            <IconCow />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>CattleCare</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Beranda', to: '/', icon: <IconHome /> }, { label: 'Deteksi', to: '/deteksi', icon: <IconSearch /> }].map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Riwayat Prediksi</h1>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Semua hasil deteksi PMK yang pernah dilakukan.</p>
          </div>
          <button onClick={fetchRiwayat} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'DM Sans', system-ui", fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <IconRefresh /> Refresh
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Prediksi', value: total,   color: '#111827', bg: '#F9FAFB', border: 'rgba(0,0,0,0.06)' },
            { label: 'Terindikasi PMK', value: positif, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
            { label: 'Sapi Sehat',     value: negatif, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 32, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* TABLE / STATE */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#1B4332', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14 }}>Memuat data...</div>
          </div>
        ) : error ? (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ color: '#DC2626', marginTop: 2 }}><IconAlert size={20} /></div>
            <div>
              <div style={{ fontWeight: 600, color: '#DC2626', marginBottom: 4 }}>Koneksi Gagal</div>
              <div style={{ fontSize: 13, color: '#991B1B' }}>{error}. Pastikan backend sudah berjalan.</div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Belum ada data prediksi</div>
            <div style={{ fontSize: 13 }}>Lakukan deteksi pertama kamu di halaman Deteksi.</div>
            <Link to="/deteksi" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, height: 40, padding: '0 20px', background: '#1B4332', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              <IconSearch /> Mulai Deteksi
            </Link>
          </div>
        ) : (
          <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['ID', 'Waktu', 'Suhu Input', 'Umur', 'Gejala', 'CNN', 'ANN', 'Hasil', 'Confidence', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAF8', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '11px 14px', color: '#9CA3AF', fontSize: 12 }}>#{row.id}</td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', color: '#374151' }}>{row.tanggal}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 500 }}>{row.suhu_input}°C</td>
                    <td style={{ padding: '11px 14px', color: '#374151' }}>{row.age_input ? `${row.age_input} thn` : '—'}</td>
                    <td style={{ padding: '11px 14px', color: '#374151' }}>{row.jumlah_gejala} gejala</td>
                    <td style={{ padding: '11px 14px', color: '#374151' }}>{row.cnn_prob_sakit}%</td>
                    <td style={{ padding: '11px 14px', color: '#374151' }}>{row.ann_prob_sakit}%</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: isSakit(row) ? '#FEF2F2' : '#F0FDF4', color: isSakit(row) ? '#DC2626' : '#16A34A', whiteSpace: 'nowrap' }}>
                        {isSakit(row) ? <IconAlert size={11} /> : <IconCheck size={11} />}
                        {isSakit(row) ? 'PMK' : 'Sehat'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 52, height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${row.confidence_score}%`, height: '100%', background: isSakit(row) ? '#DC2626' : '#16A34A', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{row.confidence_score}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <button onClick={() => hapus(row.id)} title="Hapus" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'none', border: '1px solid #E5E7EB', borderRadius: 6, cursor: 'pointer', color: '#9CA3AF' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FECACA'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Riwayat;
