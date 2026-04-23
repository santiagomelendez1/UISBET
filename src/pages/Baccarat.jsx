import { useEffect } from 'react';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Baccarat() {
  useEffect(() => {
    const SUITS = ['♠', '♥', '♦', '♣'];
    const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    function makeDeck() {
      const d = [];
      for (const s of SUITS) for (const r of RANKS) {
        const n = parseInt(r);
        const v = isNaN(n) ? 0 : n === 1 ? 1 : n > 9 ? 0 : n;
        d.push({ r, s, v });
      }
      return d.sort(() => Math.random() - 0.5);
    }

    let deck    = makeDeck();
    let balance = 500;
    let bet     = 0;
    let chip    = 1;
    let betType = null;
    let dealing = false;

    function drawCard() { if (deck.length < 6) deck = makeDeck(); return deck.pop(); }
    function handVal(hand) { return hand.reduce((a, c) => a + c.v, 0) % 10; }
    function isRed(s) { return s === '♥' || s === '♦'; }

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

    function selectChip(v, el) {
      chip = v;
      document.querySelectorAll('.b-chip').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    function selectBet(t, el) {
      betType = t;
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      bet += chip;
      document.getElementById('b-bet-display').textContent = '$' + bet;
    }

    function clearBet() {
      bet = 0; betType = null;
      document.getElementById('b-bet-display').textContent = '$0';
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
    }

    function deal() {
      if (dealing) return;
      if (!betType)      { setMsg('neutral', 'Elige a quién apostar primero'); return; }
      if (bet === 0)     { setMsg('neutral', 'Agrega fichas a tu apuesta');    return; }
      if (bet > balance) { setMsg('lose',    'Saldo insuficiente');             return; }

      const betAmount    = bet;
      const betTypeSaved = betType;
      balance -= betAmount;
      document.getElementById('b-balance').textContent = '$' + balance;
      bet = 0; betType = null;
      document.getElementById('b-bet-display').textContent = '$0';
      document.querySelectorAll('.b-bet-opt').forEach(b => b.classList.remove('selected'));
      dealing = true;

      const p  = [drawCard(), drawCard()];
      const b  = [drawCard(), drawCard()];
      const pv = handVal(p), bv = handVal(b);
      let pDraw = null;

      if (pv < 8 && bv < 8) {
        if (pv <= 5) { pDraw = drawCard(); p.push(pDraw); }
        if      (bv <= 2)                                              { b.push(drawCard()); }
        else if (bv === 3 && (pDraw === null || pDraw.v !== 8))        { b.push(drawCard()); }
        else if (bv === 4 && pDraw && [2,3,4,5,6,7].includes(pDraw.v)){ b.push(drawCard()); }
        else if (bv === 5 && pDraw && [4,5,6,7].includes(pDraw.v))    { b.push(drawCard()); }
        else if (bv === 6 && pDraw && [6,7].includes(pDraw.v))        { b.push(drawCard()); }
      }

      renderCards('player-cards', p);
      renderCards('banker-cards', b);
      const pf = handVal(p), bf = handVal(b);
      document.getElementById('player-score').textContent = pf;
      document.getElementById('banker-score').textContent = bf;

      const winner = pf > bf ? 'player' : bf > pf ? 'banker' : 'tie';
      let payout = 0;
      if      (betTypeSaved === 'player' && winner === 'player') payout = Math.floor(betAmount * 2);
      else if (betTypeSaved === 'banker' && winner === 'banker') payout = Math.floor(betAmount * 1.95);
      else if (betTypeSaved === 'tie'    && winner === 'tie')    payout = Math.floor(betAmount * 9);

      if (payout > 0) {
        balance += payout;
        document.getElementById('b-balance').textContent = '$' + balance;
        const wn = winner === 'player' ? 'Jugador' : winner === 'banker' ? 'Banca' : 'Empate';
        setMsg('win', '¡Ganó ' + wn + '! Cobras $' + payout + ' 🎉');
      } else {
        const wn = winner === 'player' ? 'Jugador' : winner === 'banker' ? 'Banca' : 'Empate';
        setMsg('lose', 'Ganó ' + wn + ' (' + pf + ' vs ' + bf + '). Perdiste $' + betAmount);
      }
      dealing = false;
    }

    function setMsg(type, txt) {
      const el = document.getElementById('b-msg');
      if (!el) return;
      el.className = 'b-msg-box b-msg-' + type;
      el.textContent = txt;
    }

    window.bSelectChip = selectChip;
    window.bSelectBet  = selectBet;
    window.bClearBet   = clearBet;
    window.bDeal       = deal;

    return () => {
      delete window.bSelectChip;
      delete window.bSelectBet;
      delete window.bClearBet;
      delete window.bDeal;
    };
  }, []);

  const chipList = [
    { v: 1,  bg: '#1e4d1e', bc: '#2e7d32' },
    { v: 5,  bg: '#1a3a5c', bc: '#1565c0' },
    { v: 10, bg: '#4a2800', bc: '#e65100' },
    { v: 25, bg: '#4a1010', bc: '#c62828' },
  ];

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
            🃏 BACARÁ
          </h1>

          {/* ── Mesa ── */}
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: '1.5rem',
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>

            {/* Jugador */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: 1.5 }}>JUGADOR</div>
              <div id="player-cards" style={{ display: 'flex', gap: 6, minHeight: 90, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
              </div>
              <div id="player-score" className="b-score-bubble">—</div>
            </div>

            {/* VS */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#444', alignSelf: 'center' }}>VS</div>

            {/* Banca */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: 1.5 }}>BANCA</div>
              <div id="banker-cards" style={{ display: 'flex', gap: 6, minHeight: 90, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
                <div className="bac-card hidden"><div className="bac-rank">?</div></div>
              </div>
              <div id="banker-score" className="b-score-bubble">—</div>
            </div>
          </div>

          {/* ── Opciones de apuesta ── */}
          <span className="b-section-label">¿A quién apostás?</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {betOpts.map(([t, name, odds]) => (
              <div key={t} className="b-bet-opt"
                onClick={(e) => window.bSelectBet(t, e.currentTarget)}>
                <div className="b-bet-name">{name}</div>
                <div className="b-bet-odds">{odds}</div>
              </div>
            ))}
          </div>

          {/* ── Fichas ── */}
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

          {/* ── Saldo ── */}
          <div className="b-balance-row">
            <span className="b-bal-lbl">Saldo</span>
            <span id="b-balance" className="b-bal-val">$500</span>
          </div>
          <div className="b-balance-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="b-bal-lbl">Apuesta actual</span>
            <span id="b-bet-display" className="b-bal-val">$0</span>
          </div>

          {/* ── Botones ── */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="b-btn-main"  onClick={() => window.bDeal()}>Repartir</button>
            <button className="b-btn-clear" onClick={() => window.bClearBet()}>Limpiar</button>
          </div>

          <div id="b-msg" className="b-msg-box b-msg-neutral">
            Selecciona tu apuesta y reparte
          </div>
        </div>
      </div>

      <FooterCasino />

      <style>{`
        .b-section-label { font-size:12px; color:#888; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }

        .bac-card {
          width:54px; height:78px; border:1px solid #333; border-radius:6px;
          background:#1a1a1a; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:2px;
        }
        .bac-card.red    { color: #ef5350; }
        .bac-card.black  { color: #fff; }
        .bac-card.hidden { color: #333; }
        .bac-rank { font-size:16px; font-weight:700; line-height:1; }
        .bac-suit { font-size:14px; line-height:1; }

        .b-score-bubble {
          width:38px; height:38px; border-radius:50%; background:#111;
          border:1px solid #d4a017; display:flex; align-items:center;
          justify-content:center; font-size:17px; font-weight:700; color:#d4a017;
        }

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

        .b-chip { transition: transform .15s, box-shadow .15s; }
        .b-chip:hover { transform: scale(1.1); }
        .b-chip.selected { box-shadow: 0 0 0 3px #d4a017, 0 0 0 5px #111; }

        .b-balance-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-top:1px solid #222; }
        .b-bal-lbl { font-size:13px; color:#888; }
        .b-bal-val { font-size:18px; font-weight:700; color:#d4a017; }

        .b-btn-main {
          flex:1; padding:13px; border:1px solid #d4a017; border-radius:8px;
          background:transparent; color:#d4a017; font-size:15px; font-weight:700;
          cursor:pointer; letter-spacing:.5px; transition:all .15s;
        }
        .b-btn-main:hover  { background:#d4a017; color:#111; }
        .b-btn-main:active { transform:scale(.98); }
        .b-btn-clear {
          padding:13px 18px; border:1px solid #333; border-radius:8px;
          background:transparent; color:#888; font-size:14px; cursor:pointer; transition:all .15s;
        }
        .b-btn-clear:hover { border-color:#555; color:#ccc; }

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
