import { useEffect } from 'react';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Ruleta() {
  useEffect(() => {
    // ── Constantes ──────────────────────────────────────
    const NUMBERS = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,
                     24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
    const RED_NUMS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
    const SLICE    = 360 / NUMBERS.length;

    let balance  = 500;
    let bet      = 0;
    let chip     = 1;
    let betType  = null;
    let spinning = false;

    // ── Construir rueda SVG ──────────────────────────────
    function buildWheel() {
      const g   = document.getElementById('wheel-group');
      if (!g) return;
      const n   = NUMBERS.length;
      const r   = 123, cx = 125, cy = 125;
      const arc = 2 * Math.PI / n;
      let html  = '';
      for (let i = 0; i < n; i++) {
        const a0  = -Math.PI / 2 + i * arc;
        const a1  = a0 + arc;
        const mid = (a0 + a1) / 2;
        const x0  = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1  = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const num = NUMBERS[i];
        const fill = num === 0 ? '#1b5e20' : RED_NUMS.has(num) ? '#b71c1c' : '#111';
        const tr  = 88;
        const tx  = cx + tr * Math.cos(mid);
        const ty  = cy + tr * Math.sin(mid);
        const rot = (mid * 180 / Math.PI) + 90;
        html += `<path d="M${cx},${cy}L${x0.toFixed(2)},${y0.toFixed(2)}A${r},${r} 0 0,1 ${x1.toFixed(2)},${y1.toFixed(2)}Z" fill="${fill}" stroke="#d4a017" stroke-width="0.6"/>`;
        html += `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" fill="white" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot.toFixed(2)},${tx.toFixed(2)},${ty.toFixed(2)})">${num}</text>`;
      }
      g.innerHTML = html;
    }

    function selectChip(v, el) {
      chip = v;
      document.querySelectorAll('.r-chip').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    function selectBet(t, el) {
      betType = t;
      document.querySelectorAll('.bet-opt').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      bet += chip;
      document.getElementById('r-bet-display').textContent = '$' + bet;
    }

    function clearBet() {
      bet = 0; betType = null;
      document.getElementById('r-bet-display').textContent = '$0';
      document.querySelectorAll('.bet-opt').forEach(o => o.classList.remove('selected'));
    }

    function spinRoulette() {
      if (spinning) return;
      if (!betType) { setMsg('neutral', 'Elige un tipo de apuesta primero'); return; }
      if (bet === 0) { setMsg('neutral', 'Agrega fichas a tu apuesta'); return; }
      if (bet > balance) { setMsg('lose', 'Saldo insuficiente'); return; }

      const betAmount = bet;
      const betTypeSaved = betType;
      balance -= betAmount;
      document.getElementById('r-balance').textContent = '$' + balance;
      bet = 0; betType = null;
      document.getElementById('r-bet-display').textContent = '$0';
      document.querySelectorAll('.bet-opt').forEach(o => o.classList.remove('selected'));

      spinning = true;
      document.getElementById('result-num').textContent = '…';
      document.getElementById('result-lbl').textContent = 'Girando…';
      setMsg('neutral', '🎡 La rueda está girando…');

      const winIdx = Math.floor(Math.random() * NUMBERS.length);
      const winNum = NUMBERS[winIdx];
      const segCenter = winIdx * SLICE + SLICE / 2;
      const spins = 5 + Math.floor(Math.random() * 4);
      const targetAngle = -(spins * 360 + segCenter);

      const g = document.getElementById('wheel-group');
      let currentAngle = 0;
      const m = (g.style.transform || '').match(/rotate\(([-\d.]+)deg\)/);
      if (m) currentAngle = parseFloat(m[1]);

      const totalRot = targetAngle - (currentAngle % 360 < 0 ? currentAngle % 360 + 360 : currentAngle % 360);
      const dur = 4800;
      let start = null;

      function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
      function frame(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        g.style.transform = `rotate(${(currentAngle + totalRot * easeOut(p)).toFixed(3)}deg)`;
        if (p < 1) { requestAnimationFrame(frame); }
        else { spinning = false; showResult(winNum, betAmount, betTypeSaved); }
      }
      requestAnimationFrame(frame);
    }

    function showResult(num, betAmount, betTypeSaved) {
      const colorName = num === 0 ? 'Verde' : RED_NUMS.has(num) ? 'Rojo' : 'Negro';
      const col = num === 0 ? '#66bb6a' : RED_NUMS.has(num) ? '#ef5350' : '#fff';
      document.getElementById('result-num').style.color = col;
      document.getElementById('result-num').textContent = num;
      document.getElementById('result-lbl').textContent = colorName + (num > 0 ? ' · ' + (num % 2 === 0 ? 'Par' : 'Impar') : '');
      const win = checkWin(num, betAmount, betTypeSaved);
      if (win > 0) {
        balance += win;
        document.getElementById('r-balance').textContent = '$' + balance;
        setMsg('win', '¡Ganaste $' + win + '! 🎉');
      } else {
        setMsg('lose', 'Salió ' + num + ' (' + colorName + '). Perdiste $' + betAmount);
      }
    }

    function checkWin(num, bet, type) {
      if (type === 'red')    return (RED_NUMS.has(num) && num !== 0) ? bet * 2 : 0;
      if (type === 'black')  return (!RED_NUMS.has(num) && num !== 0) ? bet * 2 : 0;
      if (type === 'even')   return (num !== 0 && num % 2 === 0) ? bet * 2 : 0;
      if (type === 'odd')    return (num !== 0 && num % 2 !== 0) ? bet * 2 : 0;
      if (type === 'low')    return (num >= 1 && num <= 18) ? bet * 2 : 0;
      if (type === 'high')   return (num >= 19 && num <= 36) ? bet * 2 : 0;
      if (type === 'dozen1') return (num >= 1 && num <= 12) ? bet * 3 : 0;
      if (type === 'dozen2') return (num >= 13 && num <= 24) ? bet * 3 : 0;
      if (type === 'dozen3') return (num >= 25 && num <= 36) ? bet * 3 : 0;
      if (type === 'green')  return num === 0 ? bet * 36 : 0;
      return 0;
    }

    function setMsg(type, txt) {
      const el = document.getElementById('r-msg');
      if (!el) return;
      el.className = 'r-msg-box r-msg-' + type;
      el.textContent = txt;
    }

    // Exponer funciones al scope global para los onclick del JSX
    window.rSelectChip   = selectChip;
    window.rSelectBet    = selectBet;
    window.rClearBet     = clearBet;
    window.rSpinRoulette = spinRoulette;

    buildWheel();

    // Limpieza al desmontar
    return () => {
      delete window.rSelectChip;
      delete window.rSelectBet;
      delete window.rClearBet;
      delete window.rSpinRoulette;
    };
  }, []);

  return (
    <>
      <NavbarCasino />
      <div style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '2rem 1rem', marginTop: '90px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', color: '#d4a017', letterSpacing: 2, marginBottom: '1.5rem' }}>🎡 RULETA</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '265px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* Rueda */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <svg id="roulette-wheel" width="250" height="250" viewBox="0 0 250 250">
                <g id="wheel-group" style={{ transformOrigin: '125px 125px' }}></g>
                <circle cx="125" cy="125" r="22" fill="#111" stroke="#444" strokeWidth="2"/>
                <circle cx="125" cy="125" r="7"  fill="#d4a017"/>
                <polygon points="125,5 119,24 131,24" fill="#d4a017"/>
              </svg>
              <div style={{ textAlign: 'center', minHeight: 56 }}>
                <div id="result-num" style={{ fontSize: 40, fontWeight: 700, color: '#d4a017' }}>—</div>
                <div id="result-lbl" style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Haz tu apuesta y gira</div>
              </div>
            </div>

            {/* Panel de apuestas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={styles.sectionLabel}>Ficha</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{v:1,bg:'#1e4d1e',bc:'#2e7d32'},{v:5,bg:'#1a3a5c',bc:'#1565c0'},{v:10,bg:'#4a2800',bc:'#e65100'},{v:25,bg:'#4a1010',bc:'#c62828'}].map(({v,bg,bc}) => (
                  <div key={v} className="r-chip" onClick={(e) => window.rSelectChip(v, e.currentTarget)}
                    style={{ width:46, height:46, borderRadius:'50%', border:`2px solid ${bc}`, background:bg,
                      cursor:'pointer', fontSize:13, fontWeight:700, display:'flex', alignItems:'center',
                      justifyContent:'center', color:'#fff', userSelect:'none' }}>
                    ${v}
                  </div>
                ))}
              </div>

              <div style={{...styles.sectionLabel, marginTop: 4}}>Apuesta</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {[
                  ['red','🔴 Rojo','1:1'],['black','⚫ Negro','1:1'],
                  ['even','Par','1:1'],['odd','Impar','1:1'],
                  ['low','1 – 18','1:1'],['high','19 – 36','1:1'],
                  ['dozen1','1ª Docena','2:1'],['dozen2','2ª Docena','2:1'],
                  ['dozen3','3ª Docena','2:1'],['green','🟢 Cero (0)','35:1'],
                ].map(([t, label, odds]) => (
                  <div key={t} className="bet-opt"
                    onClick={(e) => window.rSelectBet(t, e.currentTarget)}
                    style={styles.betOpt}>
                    {label}
                    <span style={{ fontSize: 10, color: '#666' }}>paga {odds}</span>
                  </div>
                ))}
              </div>

              <div style={styles.balanceRow}>
                <span style={styles.balLbl}>Saldo</span>
                <span id="r-balance" style={styles.balVal}>$500</span>
              </div>
              <div style={{...styles.balanceRow, borderTop: 'none', paddingTop: 0}}>
                <span style={styles.balLbl}>Apuesta actual</span>
                <span id="r-bet-display" style={styles.balVal}>$0</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.rSpinRoulette()} style={styles.btnMain}>Girar</button>
                <button onClick={() => window.rClearBet()} style={styles.btnClear}>Limpiar</button>
              </div>

              <div id="r-msg" className="r-msg-box r-msg-neutral" style={styles.msgNeutral}>
                Selecciona apuesta y ficha
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterCasino />

      <style>{`
        .r-chip.selected { box-shadow: 0 0 0 3px #d4a017, 0 0 0 5px #111; }
        .bet-opt { padding:9px 6px; border:1px solid #2a2a2a; border-radius:7px;
          background:#1a1a1a; cursor:pointer; font-size:13px; font-weight:500;
          text-align:center; color:#ccc; display:flex; flex-direction:column; gap:2px; }
        .bet-opt:hover { border-color:#555; background:#222; }
        .bet-opt.selected { border-color:#d4a017; background:#1e1800; color:#d4a017; }
        .r-msg-box { padding:12px; border-radius:8px; font-size:14px; font-weight:600;
          text-align:center; min-height:44px; display:flex; align-items:center; justify-content:center; }
        .r-msg-win     { background:#1a2e1a; color:#66bb6a; border:1px solid #2e7d32; }
        .r-msg-lose    { background:#2e1010; color:#ef5350; border:1px solid #c62828; }
        .r-msg-neutral { background:#1a1a1a; color:#888;    border:1px solid #2a2a2a; }
      `}</style>
    </>
  );
}

const styles = {
  sectionLabel: { fontSize:12, color:'#888', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase' },
  balanceRow:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderTop:'1px solid #222' },
  balLbl:       { fontSize:13, color:'#888' },
  balVal:       { fontSize:18, fontWeight:700, color:'#d4a017' },
  betOpt:       { padding:'9px 6px', border:'1px solid #2a2a2a', borderRadius:7, background:'#1a1a1a',
                  cursor:'pointer', fontSize:13, display:'flex', flexDirection:'column', gap:2, textAlign:'center', color:'#ccc' },
  btnMain:      { flex:1, padding:13, border:'1px solid #d4a017', borderRadius:8, background:'transparent',
                  color:'#d4a017', fontSize:15, fontWeight:700, cursor:'pointer', letterSpacing:'.5px' },
  btnClear:     { padding:'13px 18px', border:'1px solid #333', borderRadius:8, background:'transparent',
                  color:'#888', fontSize:14, cursor:'pointer' },
  msgNeutral:   { padding:12, borderRadius:8, fontSize:14, fontWeight:600, textAlign:'center',
                  minHeight:44, display:'flex', alignItems:'center', justifyContent:'center',
                  background:'#1a1a1a', color:'#888', border:'1px solid #2a2a2a' },
};

export default Ruleta;