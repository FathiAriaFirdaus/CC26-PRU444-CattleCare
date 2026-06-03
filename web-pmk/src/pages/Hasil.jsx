import { useLocation, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// ── Icons ─────────────────────────────────────────────
const IconCow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v6c0 3.3-2.7 6-6 6H10c-3.3 0-6-2.7-6-6V8z"/>
    <path d="M8 4V2M16 4V2"/>
    <circle cx="9" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/>
    <path d="M9.5 15.5c.7.7 1.4 1 2.5 1s1.8-.3 2.5-1"/>
    <path d="M2 8h2M20 8h2"/>
  </svg>
);
const IconAlertTriangle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4M12 17h.01"/>
  </svg>
);
const IconCheckCircle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2"/>
    <path d="M8 12h8M8 16h5"/>
  </svg>
);
const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.55 2.9 2 2 0 0 1 3.5 .68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.38-.38a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
);
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconFileText = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

function Hasil() {
  const location = useLocation();
  const statusPMK = location.state?.statusPMK || 'Tidak Ada Data';
  const akurasi = location.state?.akurasi || 0;
  const detail = location.state?.detail || null;
  const [lokasiPengguna, setLokasiPengguna] = useState(null);
  const [lokasiKlinik, setLokasiKlinik] = useState(null);
  const [statusLokasi, setStatusLokasi] = useState('Meminta akses lokasi GPS...');
  const isPositif = statusPMK === 'Positif' || (statusPMK && statusPMK.toLowerCase().includes('pmk'));

  useEffect(() => {
    if (isPositif) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setLokasiPengguna([coords.latitude, coords.longitude]);
            setLokasiKlinik([coords.latitude + 0.005, coords.longitude + 0.005]);
            setStatusLokasi('Lokasi ditemukan!');
          },
          () => {
            setLokasiPengguna([-6.3416, 106.7381]);
            setLokasiKlinik([-6.3380, 106.7400]);
            setStatusLokasi('Akses GPS ditolak. Menampilkan rekomendasi default.');
          }
        );
      }
    }
  }, [isPositif]);

  const confColor = isPositif ? '#DC2626' : '#16A34A';
  const confBg = isPositif ? '#FEF2F2' : '#F0FDF4';
  const confBorder = isPositif ? '#FECACA' : '#BBF7D0';

  const tindakanSegera = [
    { icon: <IconLock />, text: 'Isolasi sapi yang terinfeksi' },
    { icon: <IconPhone />, text: 'Hubungi dokter hewan' },
    { icon: <IconShield />, text: 'Disinfeksi kandang' },
    { icon: <IconFileText />, text: 'Laporkan ke Dinas Peternakan' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <nav style={{ background: '#1B4332', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#4ADE80', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B4332' }}>
            <IconCow />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>CattleCare</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Deteksi Lagi', to: '/deteksi' }, { label: 'Riwayat', to: '/riwayat' }].map(item => (
            <Link key={item.to} to={item.to} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 14px', borderRadius: 8 }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Hasil Diagnosis AI</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Berdasarkan analisis gambar dan data gejala klinis yang diberikan.</p>
        </div>

        {/* RESULT BOX */}
        <div style={{ background: confBg, border: `1.5px solid ${confBorder}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: isPositif ? '#FEE2E2' : '#DCFCE7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: confColor, flexShrink: 0 }}>
              {isPositif ? <IconAlertTriangle size={24} /> : <IconCheckCircle size={24} />}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: confColor, marginBottom: 2 }}>Status Diagnosis</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 600, color: confColor, lineHeight: 1.1 }}>
                {isPositif ? 'Terindikasi PMK' : 'Tidak Terdeteksi PMK'}
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#374151' }}>
              <span style={{ fontWeight: 500 }}>Tingkat Keyakinan AI</span>
              <span style={{ fontWeight: 700, color: confColor }}>{akurasi}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${akurasi}%`, height: '100%', background: confColor, borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '12px 16px', fontSize: 14, lineHeight: 1.6, color: '#374151' }}>
            {isPositif ? (
              <><strong style={{ color: confColor }}>Perhatian!</strong> Sistem mendeteksi gejala yang mengarah pada PMK. Segera isolasi sapi dan hubungi dokter hewan terdekat untuk penanganan lebih lanjut.</>
            ) : (
              <><strong style={{ color: '#166534' }}>Kabar Baik!</strong> Sapi tidak menunjukkan gejala PMK yang signifikan. Tetap pantau kondisi sapi dan jaga kebersihan kandang secara rutin.</>
            )}
          </div>
        </div>

        {/* INFO CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: isPositif ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 20 }}>
          {isPositif && (
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 10 }}>Tindakan Segera</div>
              {tindakanSegera.map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', padding: '5px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ color: '#DC2626', flexShrink: 0 }}>{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          )}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 10 }}>Detail Prediksi</div>
            {[
              ['Model', 'CNN + ANN (Late Fusion)'],
              ['Status', statusPMK],
              ['Confidence', `${akurasi}%`],
              ...(detail ? [
                ['CNN Visual', `${detail.cnn_prob_sakit ?? '—'}%`],
                ['ANN Klinis', `${detail.ann_prob_sakit ?? '—'}%`],
              ] : []),
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151', padding: '5px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>{key}</span>
                <span style={{ fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAP */}
        {isPositif && (
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ color: '#1B4332' }}><IconMapPin /></div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Layanan Kesehatan Hewan Terdekat</div>
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>{statusLokasi}</div>
            {lokasiPengguna && lokasiKlinik && (
              <div style={{ height: 360, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                <MapContainer center={lokasiPengguna} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                  <Marker position={lokasiPengguna} icon={userIcon}><Popup><strong>Lokasi Peternakan Anda</strong></Popup></Marker>
                  <Marker position={lokasiKlinik}><Popup><strong>Klinik Hewan Terdekat</strong><br />Tim medis siap menangani kasus PMK.</Popup></Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/deteksi" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, background: '#1B4332', color: '#fff', borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
            <IconSearch /> Deteksi Lagi
          </Link>
          <Link to="/riwayat" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, background: '#fff', color: '#1B4332', border: '1.5px solid #BBF7D0', borderRadius: 12, fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>
            <IconClipboard /> Lihat Riwayat
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600&display=swap');
      `}</style>
    </div>
  );
}

export default Hasil;
