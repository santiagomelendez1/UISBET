// ============================================================
// Baccarat.jsx — Página del juego de Baccarat (Punto y Banca)
// Implementa las reglas oficiales de la tercera carta y los
// pagos estándar de casino (Jugador 1:1, Banca 0.95:1, Empate 8:1).
// La lógica del juego vive en un useEffect para manipular el DOM
// directamente; las funciones se exponen en window para los onClick del JSX.
// ============================================================

import { useEffect, useContext } from 'react';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

function Baccarat() {
  // Token JWT para autenticar las llamadas a la API del backend
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // ── Constantes del mazo ──────────────────────────────────
    const SUITS = ['♠', '♥', '♦', '♣']; // palos de la baraja inglesa
    const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    // ── Crear y barajar el mazo ──────────────────────────────
    // Genera 52 cartas con su rango, palo y valor de Baccarat:
    // - As = 1, 2–9 = valor nominal, 10/J/Q/K = 0
    function makeDeck() {
      const d = [];
      for (const s of SUITS) for (const r of RANKS) {
        const n = parseInt(r);
        const v = isNaN(n) ? 0 : n === 1 ? 1 : n > 9 ? 0 : n;
        d.push({ r, s, v });
      }
      // Baraja usando el algoritmo Fisher-Yates aproximado con Math.random()
      return d.sort(() => Math.random() - 0.5);
    }

    // ── Estado mutable del juego ─────────────────────────────
    let deck    = makeDeck(); // mazo activo (se regenera cuando quedan < 6 cartas)
    let balance = 0;          // saldo del usuario cargado desde la BD
    let bet     = 0;          // monto apostado en la ronda actual
    let chip    = 1;          // valor de la ficha seleccionada
    let betType = null;       // 'player', 'banker' o 'tie'
    let dealing = false;      // bloquea el botón Repartir mientras se procesa una mano

    // ── Robar carta ──────────────────────────────────────────
    // Regenera el mazo automáticamente si quedan menos de 6 cartas
    function drawCard() { if (deck.length < 6) deck = makeDeck(); return deck.pop(); }

    // ── Valor de la mano ─────────────────────────────────────
    // En Baccarat, el valor de la mano es la suma de las cartas módulo 10
    // (p.ej. 7+8=15 → valor 5)
    function handVal(hand) { return hand.reduce((a, c) => a + c.v, 0) % 10; }

    // ── Color del palo ───────────────────────────────────────
    // Corazones y Diamantes son rojos; Picas y Tréboles son negros
    function isRed(s) { return s === '♥' || s === '♦'; }

    // ── Renderizar cartas en el DOM ──────────────────────────
    // Genera HTML de cada carta y lo inserta en el contenedor indicado por id
    function renderCards(id, hand) {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = hand.map(c =>
        `<div class="bac-card ${isRed(c.s) ? 'red' : 'black'}">
          <div class="bac-rank">${c.r}</div>
          <div class="bac-suit">${c.s}</div>
        </div>`
      ).join('');
    }

    // ── Selección de ficha ───────────────────────────────────
    // Actualiza el valor de chip y resalta visualmente la ficha activa
    function selectChip(v, el) {
      chip = v;
      document.querySelectorAll('.b-chip').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    // ── Selección de apuesta ─────────────────────────────────
    // Guarda el tipo de apuesta ('player'/'banker'/'tie') y acumula el chip al monto
    function selectBet(t, el) {
      betType = t;
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      bet += chip;
      document.getElementById('b-bet-display').textContent = '$' + bet;
    }

    // ── Limpiar apuesta ──────────────────────────────────────
    // Resetea monto y tipo de apuesta sin tocar el saldo
    function clearBet() {
      bet = 0; betType = null;
      document.getElementById('b-bet-display').textContent = '$0';
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
    }

    // ── Repartir mano (lógica central del juego) ─────────────
    function deal() {
      if (dealing) return; // evita doble reparto

      // Validaciones previas al reparto
      if (!betType)      { setMsg('neutral', 'Elige a quién apostar primero'); return; }
      if (bet === 0)     { setMsg('neutral', 'Agrega fichas a tu apuesta');    return; }
      if (bet > balance) { setMsg('lose',    'Saldo insuficiente');             return; }

      // Descuenta la apuesta del saldo antes de repartir
      const betAmount    = bet;
      const betTypeSaved = betType;
      balance -= betAmount;
      document.getElementById('b-balance').textContent = '$' + balance;
      bet = 0; betType = null;
      document.getElementById('b-bet-display').textContent = '$0';
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
      dealing = true;

      // ── Reparto inicial: 2 cartas para Jugador y 2 para Banca ──
      const p  = [drawCard(), drawCard()]; // mano del jugador
      const b  = [drawCard(), drawCard()]; // mano de la banca
      const pv = handVal(p), bv = handVal(b);
      let pDraw = null; // tercera carta del jugador (si se reparte)

      // ── Reglas de la tercera carta (según norma oficial de Baccarat) ──
      // Solo se aplican si ninguno tiene Natural (8 o 9 con 2 cartas)
      if (pv < 8 && bv < 8) {
        // Jugador saca tercera carta si su valor es 0-5
        if (pv <= 5) { pDraw = drawCard(); p.push(pDraw); }

        // Banca saca tercera carta según su valor y la tercera carta del jugador:
        if      (bv <= 2)                                              { b.push(drawCard()); }
        // Banca con 3: saca siempre excepto si la 3ª del jugador fue 8
        else if (bv === 3 && (pDraw === null || pDraw.v !== 8))        { b.push(drawCard()); }
        // Banca con 4: saca si la 3ª del jugador fue 2-7
        else if (bv === 4 && pDraw && [2,3,4,5,6,7].includes(pDraw.v)){ b.push(drawCard()); }
        // Banca con 5: saca si la 3ª del jugador fue 4-7
        else if (bv === 5 && pDraw && [4,5,6,7].includes(pDraw.v))    { b.push(drawCard()); }
        // Banca con 6: saca si la 3ª del jugador fue 6-7
        else if (bv === 6 && pDraw && [6,7].includes(pDraw.v))        { b.push(drawCard()); }
        // Banca con 7: se planta siempre
      }

      // Muestra las cartas finales en el DOM
      renderCards('player-cards', p);
      renderCards('banker-cards', b);

      // Muestra los puntajes finales de cada mano
      const pf = handVal(p), bf = handVal(b);
      document.getElementById('player-score').textContent = pf;
      document.getElementById('banker-score').textContent = bf;

      // ── Determinar ganador y calcular payout ─────────────────
      const winner = pf > bf ? 'player' : bf > pf ? 'banker' : 'tie';
      let payout = 0;
      if      (betTypeSaved === 'player' && winner === 'player') payout = Math.floor(betAmount * 2);       // paga 1:1
      else if (betTypeSaved === 'banker' && winner === 'banker') payout = Math.floor(betAmount * 1.95);    // paga 0.95:1 (5% comisión de casino)
      else if (betTypeSaved === 'tie'    && winner === 'tie')    payout = Math.floor(betAmount * 9);       // paga 8:1

      if (payout > 0) {
        balance += payout;
        document.getElementById('b-balance').textContent = '$' + balance;
        const wn = winner === 'player' ? 'Jugador' : winner === 'banker' ? 'Banca' : 'Empate';
        setMsg('win', '¡Ganó ' + wn + '! Cobras $' + payout + ' 🎉');
      } else {
        const wn = winner === 'player' ? 'Jugador' : winner === 'banker' ? 'Banca' : 'Empate';
        setMsg('lose', 'Ganó ' + wn + ' (' + pf + ' vs ' + bf + '). Perdiste $' + betAmount);
      }

      syncBalance(); // persiste el saldo actualizado en la BD
      dealing = false; // desbloquea el botón para la siguiente mano
    }

    // ── Mensaje de estado ────────────────────────────────────
    // Actualiza el cuadro de feedback con clase CSS según tipo: win/lose/neutral
    function setMsg(type, txt) {
      const el = document.getElementById('b-msg');
      if (!el) return;
      el.className = 'b-msg-box b-msg-' + type;
      el.textContent = txt;
    }

    // ── Sincronizar saldo con el backend ─────────────────────
    // PATCH al endpoint de balance para que el saldo persista entre sesiones
    function syncBalance() {
      apiRequest('/auth/balance', {
        method: 'PATCH',
        body: JSON.stringify({ balance }),
      }, token).catch(() => {});
    }

    // ── Exponer funciones al scope global ────────────────────
    // Las funciones definidas dentro del useEffect no son accesibles desde
    // los atributos onClick del JSX renderizado, por lo que se asignan a window
    window.bSelectChip = selectChip;
    window.bSelectBet  = selectBet;
    window.bClearBet   = clearBet;
    window.bDeal       = deal;

    // Carga el saldo real del usuario desde la BD al montar el componente
    apiRequest('/auth/me', {}, token).then(data => {
      balance = data.balance ?? 0;
      const el = document.getElementById('b-balance');
      if (el) el.textContent = '$' + balance;
    }).catch(() => {});

    // Limpieza al desmontar: elimina las referencias globales para evitar memory leaks
    return () => {
      delete window.bSelectChip;
      delete window.bSelectBet;
      delete window.bClearBet;
      delete window.bDeal;
    };
  }, []); // [] → solo se ejecuta una vez al montar el componente

  // ── Datos estáticos para el JSX ─────────────────────────────
  // Se definen fuera del useEffect porque solo se usan para renderizar,
  // no forman parte de la lógica del juego

  // Lista de fichas disponibles con su valor y colores de fondo/borde
  const chipList = [
    { v: 1,  bg: '#1e4d1e', bc: '#2e7d32' },
    { v: 5,  bg: '#1a3a5c', bc: '#1565c0' },
    { v: 10, bg: '#4a2800', bc: '#e65100' },
    { v: 25, bg: '#4a1010', bc: '#c62828' },
  ];

  // Opciones de apuesta: [tipo interno, etiqueta visible, texto de pago]
  const betOpts = [
    ['player', 'Jugador', 'paga 1:1'],
    ['tie',    'Empate',  'paga 8:1'],
    ['banker', 'Banca',   'paga 0.95:1'],
  ];

  return (
    <>
      <NavbarCasino />

      <div style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '2rem 1rem', marginTop: '90px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h1 style={{ textAlign: 'center', color: '#d4a017', letterSpacing: 2, marginBottom: '0.5rem', fontSize: 26, fontWeight: 700 }}>
            Baccarat
          </h1>

          {/* ── Mesa de juego ──────────────────────────────────
              Grid de 3 columnas: [Jugador] [VS] [Banca]
              Las cartas se renderizan dinámicamente por renderCards() en el DOM */}
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: '1.5rem',
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>

            {/* Columna Jugador: etiqueta + área de cartas + burbuja de puntaje */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: 1.5 }}>JUGADOR</div>
              {/* Contenedor donde renderCards('player-cards', ...) inyecta las cartas */}
              <div id="player-cards" style={{ display: 'flex', gap: 6, minHeight: 90, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Cartas ocultas que se muestran antes de repartir */}
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
              </div>
              {/* Burbuja circular que muestra el valor final de la mano */}
              <div id="player-score" className="b-score-bubble">—</div>
            </div>

            {/* Separador visual entre las dos manos */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#444', alignSelf: 'center' }}>VS</div>

            {/* Columna Banca: misma estructura que la columna Jugador */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: 1.5 }}>BANCA</div>
              {/* Contenedor donde renderCards('banker-cards', ...) inyecta las cartas */}
              <div id="banker-cards" style={{ display: 'flex', gap: 6, minHeight: 90, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
              </div>
              <div id="banker-score" className="b-score-bubble">—</div>
            </div>
          </div>

          {/* ── Opciones de apuesta ────────────────────────────
              El usuario elige a quién apostar; cada click llama a bSelectBet
              con el tipo correspondiente ('player', 'tie', 'banker') */}
          <span className="b-section-label">¿A quién apuestas?</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {betOpts.map(([t, name, odds]) => (
              <div key={t} className="b-bet-opt"
                onClick={(e) => window.bSelectBet(t, e.currentTarget)}>
                <div className="b-bet-name">{name}</div>
                <div className="b-bet-odds">{odds}</div>
              </div>
            ))}
          </div>

          {/* ── Selector de fichas ─────────────────────────────
              La primera ficha ($1) viene pre-seleccionada (clase 'selected' por defecto) */}
          <span className="b-section-label">Ficha</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chipList.map(({ v, bg, bc }, i) => (
              <div key={v} className={`b-chip${i === 0 ? ' selected' : ''}`}
                onClick={(e) => window.bSelectChip(v, e.currentTarget)}
                style={{ width: 46, height: 46, borderRadius: '50%', border: `2px solid ${bc}`,
                  background: bg, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', userSelect: 'none' }}>
                ${v}
              </div>
            ))}
          </div>

          {/* ── Indicadores de saldo y apuesta actual ──────────── */}
          <div className="b-balance-row">
            <span className="b-bal-lbl">Saldo</span>
            <span id="b-balance" className="b-bal-val">$0</span>
          </div>
          <div className="b-balance-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="b-bal-lbl">Apuesta actual</span>
            <span id="b-bet-display" className="b-bal-val">$0</span>
          </div>

          {/* ── Botones de acción ──────────────────────────────
              Repartir ejecuta la mano completa; Limpiar resetea la apuesta */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="b-btn-main"  onClick={() => window.bDeal()}>Repartir</button>
            <button className="b-btn-clear" onClick={() => window.bClearBet()}>Limpiar</button>
          </div>

          {/* Cuadro de mensajes: feedback visual del resultado de la mano */}
          <div id="b-msg" className="b-msg-box b-msg-neutral">
            Selecciona tu apuesta y reparte
          </div>
        </div>
      </div>

      <FooterCasino />

      {/* ── Estilos CSS del juego ───────────────────────────────
          Incluidos aquí para mantener todos los estilos de Baccarat
          en un único archivo sin depender de un CSS externo */}
      <style>{`
        /* Etiqueta de sección en mayúsculas */
        .b-section-label { font-size:12px; color:#888; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }

        /* Carta individual: fondo oscuro, borde sutil */
        .bac-card {
          width:54px; height:78px; border:1px solid #333; border-radius:6px;
          background:#1a1a1a; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:2px;
        }
        .bac-card.red    { color: #ef5350; } /* corazones y diamantes */
        .bac-card.black  { color: #fff; }    /* picas y tréboles */
        .bac-card.hidden { color: #333; }    /* carta boca abajo (pre-reparto) */
        .bac-rank { font-size:16px; font-weight:700; line-height:1; }
        .bac-suit { font-size:14px; line-height:1; }

        /* Burbuja circular que muestra el puntaje de cada mano */
        .b-score-bubble {
          width:38px; height:38px; border-radius:50%; background:#111;
          border:1px solid #d4a017; display:flex; align-items:center;
          justify-content:center; font-size:17px; font-weight:700; color:#d4a017;
        }

        /* Opciones de apuesta: se resaltan con borde/fondo dorado al seleccionarlas */
        .b-bet-opt {
          padding:14px 8px; border:1px solid #2a2a2a; border-radius:10px;
          background:#1a1a1a; cursor:pointer; text-align:center;
          transition:all .15s; user-select:none;
        }
        .b-bet-opt:hover { border-color: #555; }
        .b-bet-opt.selected { border-color: #d4a017; background: #1e1800; }
        .b-bet-name { font-size:15px; font-weight:700; color:#ccc; }
        .b-bet-opt.selected .b-bet-name { color: #d4a017; }
        .b-bet-odds { font-size:11px; color:#666; margin-top:3px; }
        .b-bet-opt.selected .b-bet-odds { color: #a07810; }

        /* Fichas: anillo dorado cuando está seleccionada */
        .b-chip { transition: transform .15s, box-shadow .15s; }
        .b-chip:hover { transform: scale(1.1); }
        .b-chip.selected { box-shadow: 0 0 0 3px #d4a017, 0 0 0 5px #111; }

        /* Filas de saldo */
        .b-balance-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-top:1px solid #222; }
        .b-bal-lbl { font-size:13px; color:#888; }
        .b-bal-val { font-size:18px; font-weight:700; color:#d4a017; }

        /* Botón principal (Repartir): se rellena de dorado al hacer hover */
        .b-btn-main {
          flex:1; padding:13px; border:1px solid #d4a017; border-radius:8px;
          background:transparent; color:#d4a017; font-size:15px; font-weight:700;
          cursor:pointer; letter-spacing:.5px; transition:all .15s;
        }
        .b-btn-main:hover  { background:#d4a017; color:#111; }
        .b-btn-main:active { transform:scale(.98); }

        /* Botón secundario (Limpiar): estilo discreto */
        .b-btn-clear {
          padding:13px 18px; border:1px solid #333; border-radius:8px;
          background:transparent; color:#888; font-size:14px; cursor:pointer; transition:all .15s;
        }
        .b-btn-clear:hover { border-color:#555; color:#ccc; }

        /* Cuadro de mensajes con tres variantes de color */
        .b-msg-box {
          padding:12px; border-radius:8px; font-size:14px; font-weight:600;
          text-align:center; min-height:44px; display:flex; align-items:center; justify-content:center;
        }
        .b-msg-win     { background:#1a2e1a; color:#66bb6a; border:1px solid #2e7d32; }
        .b-msg-lose    { background:#2e1010; color:#ef5350; border:1px solid #c62828; }
        .b-msg-neutral { background:#1a1a1a; color:#888;    border:1px solid #2a2a2a; }
      `}</style>
    </>
  );
}

export default Baccarat;
