
// Ruleta.jsx — Página del juego de ruleta europea
// Maneja la lógica del juego completa dentro de un useEffect,
// exponiendo funciones al objeto window para que el JSX pueda
// llamarlas mediante eventos onClick.

import { useEffect, useContext } from 'react';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

function Ruleta() {
  // Obtiene el token JWT del contexto de autenticación para las llamadas a la API
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // ── Constantes del juego ─────────────────────────────────
    // Orden real de los números en una ruleta europea (0–36)
    const NUMBERS = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,
                     24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
    // Conjunto de números rojos según las reglas oficiales de la ruleta
    const RED_NUMS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
    // Ángulo que ocupa cada segmento de la rueda (360° / 37 números)
    const SLICE    = 360 / NUMBERS.length;

    // ── Estado mutable del juego (no usa useState para evitar re-renders) ──
    let balance  = 0;      // Saldo actual del usuario
    let bet      = 0;      // Monto apostado en la ronda actual
    let chip     = 1;      // Valor de la ficha seleccionada ($1 por defecto)
    let betType  = null;   // Tipo de apuesta elegida (ej. 'red', 'even', 'dozen1')
    let spinning = false;  // Bandera para evitar múltiples giros simultáneos

    // ── Construir rueda SVG ──────────────────────────────────
    // Genera dinámicamente los paths SVG de cada segmento de la rueda
    // usando geometría circular (arcos y coordenadas polares → cartesianas)
    function buildWheel() {
      const g   = document.getElementById('wheel-group');
      if (!g) return;
      const n   = NUMBERS.length;
      const r   = 123, cx = 125, cy = 125; // radio y centro del SVG (250×250)
      const arc = 2 * Math.PI / n;          // arco en radianes por segmento
      let html  = '';
      for (let i = 0; i < n; i++) {
        // Ángulos de inicio y fin del segmento, rotados para que el 0 quede arriba
        const a0  = -Math.PI / 2 + i * arc;
        const a1  = a0 + arc;
        const mid = (a0 + a1) / 2; // ángulo central del segmento (para el texto)

        // Coordenadas cartesianas del arco exterior del segmento
        const x0  = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1  = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);

        const num = NUMBERS[i];
        // Color: verde para 0, rojo para números rojos, negro para el resto
        const fill = num === 0 ? '#1b5e20' : RED_NUMS.has(num) ? '#b71c1c' : '#111';

        // Posición del texto del número (a radio 88, más cerca del centro)
        const tr  = 88;
        const tx  = cx + tr * Math.cos(mid);
        const ty  = cy + tr * Math.sin(mid);
        // Rotación del texto para que quede perpendicular al radio
        const rot = (mid * 180 / Math.PI) + 90;

        // Path SVG del segmento (triángulo desde el centro hasta el arco)
        html += `<path d="M${cx},${cy}L${x0.toFixed(2)},${y0.toFixed(2)}A${r},${r} 0 0,1 ${x1.toFixed(2)},${y1.toFixed(2)}Z" fill="${fill}" stroke="#d4a017" stroke-width="0.6"/>`;
        // Texto del número rotado sobre el segmento
        html += `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" fill="white" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot.toFixed(2)},${tx.toFixed(2)},${ty.toFixed(2)})">${num}</text>`;
      }
      g.innerHTML = html;
    }

    // ── Selección de ficha ───────────────────────────────────
    // Actualiza el valor de chip y resalta visualmente la ficha elegida
    function selectChip(v, el) {
      chip = v;
      document.querySelectorAll('.r-chip').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    // ── Selección de apuesta ─────────────────────────────────
    // Guarda el tipo de apuesta, resalta la opción y acumula el valor de la ficha
    function selectBet(t, el) {
      betType = t;
      document.querySelectorAll('.bet-opt').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      bet += chip; // cada click añade el valor de la ficha actual al monto apostado
      document.getElementById('r-bet-display').textContent = '$' + bet;
    }

    // ── Limpiar apuesta ──────────────────────────────────────
    // Resetea el monto y tipo de apuesta sin afectar el saldo
    function clearBet() {
      bet = 0; betType = null;
      document.getElementById('r-bet-display').textContent = '$0';
      document.querySelectorAll('.bet-opt').forEach(o => o.classList.remove('selected'));
    }

    // ── Girar la ruleta ──────────────────────────────────────
    // Valida la apuesta, descuenta el saldo, elige un número ganador al azar
    // y anima la rueda SVG con easing hacia el segmento ganador
    function spinRoulette() {
      if (spinning) return; // evita doble giro
      if (!betType) { setMsg('neutral', 'Elige un tipo de apuesta primero'); return; }
      if (bet === 0) { setMsg('neutral', 'Agrega fichas a tu apuesta'); return; }
      if (bet > balance) { setMsg('lose', 'Saldo insuficiente'); return; }

      // Guarda la apuesta y la descuenta del saldo antes de girar
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

      // Número ganador elegido aleatoriamente
      const winIdx = Math.floor(Math.random() * NUMBERS.length);
      const winNum = NUMBERS[winIdx];

      // Ángulo central del segmento ganador en la rueda
      const segCenter = winIdx * SLICE + SLICE / 2;

      // La rueda da entre 5 y 8 vueltas completas antes de detenerse
      const spins = 5 + Math.floor(Math.random() * 4);
      const targetAngle = -(spins * 360 + segCenter);

      // Lee el ángulo actual de la rueda para continuar desde donde está
      const g = document.getElementById('wheel-group');
      let currentAngle = 0;
      const m = (g.style.transform || '').match(/rotate\(([-\d.]+)deg\)/);
      if (m) currentAngle = parseFloat(m[1]);

      const totalRot = targetAngle - (currentAngle % 360 < 0 ? currentAngle % 360 + 360 : currentAngle % 360);
      const dur = 4800; // duración de la animación en ms
      let start = null;

      // Función de easing: desacelera suavemente al final del giro
      function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

      // Bucle de animación con requestAnimationFrame
      function frame(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1); // progreso de 0 a 1
        g.style.transform = `rotate(${(currentAngle + totalRot * easeOut(p)).toFixed(3)}deg)`;
        if (p < 1) { requestAnimationFrame(frame); }
        else { spinning = false; showResult(winNum, betAmount, betTypeSaved); }
      }
      requestAnimationFrame(frame);
    }

    // ── Mostrar resultado ────────────────────────────────────
    // Actualiza el panel de resultado con el número ganador, su color
    // y paridad, luego calcula la ganancia y actualiza el saldo
    function showResult(num, betAmount, betTypeSaved) {
      const colorName = num === 0 ? 'Verde' : RED_NUMS.has(num) ? 'Rojo' : 'Negro';
      const col = num === 0 ? '#66bb6a' : RED_NUMS.has(num) ? '#ef5350' : '#fff';
      document.getElementById('result-num').style.color = col;
      document.getElementById('result-num').textContent = num;
      // Muestra color y paridad (excepto para el 0)
      document.getElementById('result-lbl').textContent = colorName + (num > 0 ? ' · ' + (num % 2 === 0 ? 'Par' : 'Impar') : '');

      const win = checkWin(num, betAmount, betTypeSaved);
      if (win > 0) {
        balance += win;
        document.getElementById('r-balance').textContent = '$' + balance;
        setMsg('win', '¡Ganaste $' + win + '!');
      } else {
        setMsg('lose', 'Salió ' + num + ' (' + colorName + '). Perdiste $' + betAmount);
      }
      syncBalance(); // persiste el nuevo saldo en la BD
    }

    // ── Calcular ganancia ────────────────────────────────────
    // Devuelve el payout según el tipo de apuesta y el número ganador.
    // Las apuestas simples (1:1) devuelven bet*2, las docenas (2:1) bet*3,
    // y el pleno al 0 (35:1) devuelve bet*36.
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

    // ── Mensaje de estado ────────────────────────────────────
    // Cambia el estilo y texto del cuadro de mensajes inferior
    // según el tipo: 'win' (verde), 'lose' (rojo), 'neutral' (gris)
    function setMsg(type, txt) {
      const el = document.getElementById('r-msg');
      if (!el) return;
      el.className = 'r-msg-box r-msg-' + type;
      el.textContent = txt;
    }

    // ── Sincronizar saldo con el backend ─────────────────────
    // Envía el saldo actualizado a la API para persistirlo en la BD.
    // Los errores se ignoran silenciosamente para no interrumpir el juego.
    function syncBalance() {
      apiRequest('/auth/balance', {
        method: 'PATCH',
        body: JSON.stringify({ balance }),
      }, token).catch(() => {});
    }

    // ── Exponer funciones al scope global ────────────────────
    // Necesario porque el JSX usa onClick con window.xxx ya que las
    // funciones se definen dentro del useEffect y no son accesibles
    // directamente desde los atributos del JSX renderizado
    window.rSelectChip   = selectChip;
    window.rSelectBet    = selectBet;
    window.rClearBet     = clearBet;
    window.rSpinRoulette = spinRoulette;

    // Construye la rueda SVG al montar el componente
    buildWheel();

    // Carga el saldo real del usuario desde la BD al entrar a la página
    apiRequest('/auth/me', {}, token).then(data => {
      balance = data.balance ?? 0;
      const el = document.getElementById('r-balance');
      if (el) el.textContent = '$' + balance;
    }).catch(() => {});

    // Limpieza al desmontar: elimina las funciones globales para evitar memory leaks
    return () => {
      delete window.rSelectChip;
      delete window.rSelectBet;
      delete window.rClearBet;
      delete window.rSpinRoulette;
    };
  }, []); // [] → solo se ejecuta una vez al montar el componente

  return (
    <>
      <NavbarCasino />
      <div style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '2rem 1rem', marginTop: '90px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', color: '#d4a017', letterSpacing: 2, marginBottom: '1.5rem' }}>RULETA</h1>

          {/* Grid principal: columna izquierda = rueda, columna derecha = controles */}
          <div className="r-main-grid">

            {/* ── Rueda SVG ──────────────────────────────────
                El SVG contiene un <g id="wheel-group"> vacío que buildWheel()
                rellena con los segmentos. La animación de giro se aplica
                sobre ese <g> con CSS transform rotate().
                El triángulo dorado en la parte superior es el indicador fijo. */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <svg id="roulette-wheel" viewBox="0 0 250 250" style={{ width: '100%', maxWidth: 250, height: 'auto' }}>
                {/* Grupo rotable que contiene todos los segmentos generados por buildWheel() */}
                <g id="wheel-group" style={{ transformOrigin: '125px 125px' }}></g>
                {/* Centro decorativo de la rueda */}
                <circle cx="125" cy="125" r="22" fill="#111" stroke="#444" strokeWidth="2"/>
                <circle cx="125" cy="125" r="7"  fill="#d4a017"/>
                {/* Indicador fijo (punta dorada en la cima) */}
                <polygon points="125,5 119,24 131,24" fill="#d4a017"/>
              </svg>

              {/* Panel de resultado: muestra el número ganador y su color/paridad */}
              <div style={{ textAlign: 'center', minHeight: 56 }}>
                <div id="result-num" style={{ fontSize: 40, fontWeight: 700, color: '#d4a017' }}>—</div>
                <div id="result-lbl" style={{ fontSize: 12, color: '#555', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>HAZ TU APUESTA Y GIRA</div>
              </div>
            </div>

            {/* ── Panel de controles ──────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Selector de fichas: cada ficha tiene un valor distinto ($1,$5,$10,$25) */}
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

              {/* Opciones de apuesta: cada botón llama a rSelectBet con su tipo */}
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
                    onClick={(e) => window.rSelectBet(t, e.currentTarget)}>
                    {label}
                    <span style={{ fontSize: 10, color: '#666' }}>paga {odds}</span>
                  </div>
                ))}
              </div>

              {/* Indicadores de saldo y apuesta actual */}
              <div style={styles.balanceRow}>
                <span style={styles.balLbl}>Saldo</span>
                <span id="r-balance" style={styles.balVal}>$0</span>
              </div>
              <div style={{...styles.balanceRow, borderTop: 'none', paddingTop: 0}}>
                <span style={styles.balLbl}>Apuesta actual</span>
                <span id="r-bet-display" style={styles.balVal}>$0</span>
              </div>

              {/* Botones de acción: Girar inicia la animación, Limpiar resetea la apuesta */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.rSpinRoulette()} style={styles.btnMain}>Girar</button>
                <button onClick={() => window.rClearBet()} style={styles.btnClear}>Limpiar</button>
              </div>

              {/* Cuadro de mensajes: cambia color según resultado (win/lose/neutral) */}
              <div id="r-msg" className="r-msg-box r-msg-neutral">
                Selecciona apuesta y ficha
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterCasino />

      {/* ── Estilos CSS en línea ────────────────────────────────
          Se incluyen aquí para mantener todos los estilos específicos
          de la ruleta en el mismo archivo sin necesidad de un CSS externo */}
      <style>{`
        .r-main-grid {
          display: grid;
          grid-template-columns: 265px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        /* En móvil, apila rueda y controles en una sola columna */
        @media (max-width: 600px) {
          .r-main-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Fichas: escala al pasar el cursor, anillo dorado cuando está seleccionada */
        .r-chip { transition: transform .15s, box-shadow .15s; }
        .r-chip:hover { transform: scale(1.1); }
        .r-chip.selected { box-shadow: 0 0 0 3px #d4a017, 0 0 0 5px #111; }

        /* Opciones de apuesta: borde dorado y fondo cálido cuando está seleccionada */
        .bet-opt {
          padding: 9px 6px;
          border: 1px solid #2a2a2a;
          border-radius: 7px;
          background: #1a1a1a;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          color: #ccc;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: all .15s;
          user-select: none;
        }
        .bet-opt:hover { border-color: #555; background: #222; }
        .bet-opt.selected { border-color: #d4a017; background: #1e1800; color: #d4a017; }
        .bet-opt.selected span { color: #a07810; }

        /* Cuadro de mensajes con tres variantes de color */
        .r-msg-box { padding:12px; border-radius:8px; font-size:14px; font-weight:600;
          text-align:center; min-height:44px; display:flex; align-items:center; justify-content:center; }
        .r-msg-win     { background:#1a2e1a; color:#66bb6a; border:1px solid #2e7d32; }
        .r-msg-lose    { background:#2e1010; color:#ef5350; border:1px solid #c62828; }
        .r-msg-neutral { background:#1a1a1a; color:#888;    border:1px solid #2a2a2a; }
      `}</style>
    </>
  );
}

// ── Objeto de estilos reutilizables ──────────────────────────
// Se define fuera del componente para no recrearse en cada render
const styles = {
  sectionLabel: { fontSize:12, color:'#888', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase' },
  balanceRow:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderTop:'1px solid #222' },
  balLbl:       { fontSize:13, color:'#888' },
  balVal:       { fontSize:18, fontWeight:700, color:'#d4a017' },
  btnMain:      { flex:1, padding:13, border:'1px solid #d4a017', borderRadius:8, background:'transparent',
                  color:'#d4a017', fontSize:15, fontWeight:700, cursor:'pointer', letterSpacing:'.5px',
                  transition:'all .15s' },
  btnClear:     { padding:'13px 18px', border:'1px solid #333', borderRadius:8, background:'transparent',
                  color:'#888', fontSize:14, cursor:'pointer', transition:'all .15s' },
};

export default Ruleta;
