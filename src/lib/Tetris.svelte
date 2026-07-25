<script>
  import { onMount, onDestroy } from 'svelte';

  export let id;

  const COLS = 10, ROWS = 20;
  const PIECES = [
    { shape: [[1,1,1,1]], color: '#00ffff' },
    { shape: [[1,1],[1,1]], color: '#ffff00' },
    { shape: [[0,1,0],[1,1,1]], color: '#c000c0' },
    { shape: [[1,0,0],[1,1,1]], color: '#00ff00' },
    { shape: [[0,0,1],[1,1,1]], color: '#ff0000' },
    { shape: [[1,1,0],[0,1,1]], color: '#0000ff' },
    { shape: [[0,1,1],[1,1,0]], color: '#ff8000' },
  ];

  let board = [];
  let current = null;
  let next = null;
  let pos = { x: 0, y: 0 };
  let score = 0;
  let lines = 0;
  let level = 0;
  let gameOver = false;
  let paused = false;
  let started = false;
  let tick = null;
  let gameRef;

  function emptyBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(0)); }

  function randomPiece() { const p = PIECES[Math.floor(Math.random() * PIECES.length)]; return { shape: p.shape.map(r => [...r]), color: p.color }; }

  function spawn() {
    current = next || randomPiece();
    next = randomPiece();
    pos = { x: Math.floor((COLS - current.shape[0].length) / 2), y: 0 };
    if (collides(pos.x, pos.y, current.shape)) { gameOver = true; current = null; }
  }

  function collides(x, y, shape) {
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c, ny = y + r;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
    return false;
  }

  function lock() {
    if (!current) return;
    const sz = current.shape;
    const nb = board.map(r => [...r]);
    for (let r = 0; r < sz.length; r++) for (let c = 0; c < sz[r].length; c++) {
      if (!sz[r][c]) continue;
      const y = pos.y + r, x = pos.x + c;
      if (y >= 0) nb[y][x] = current.color;
    }
    board = nb;
    clearLines();
    spawn();
  }

  function clearLines() {
    let cleared = 0;
    const kept = [];
    for (let r = 0; r < ROWS; r++) {
      if (board[r].every(c => c)) cleared++;
      else kept.push(board[r]);
    }
    while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0));
    board = kept;
    if (cleared) {
      lines += cleared;
      const pts = { 1: 100, 2: 300, 3: 500, 4: 800 };
      score += (pts[cleared] || 0) * (level + 1);
      level = Math.floor(lines / 10);
    }
  }

  function rotate() {
    if (!current) return;
    const s = current.shape;
    const rot = s[0].map((_, i) => s.map(r => r[i]).reverse());
    if (!collides(pos.x, pos.y, rot)) current = { ...current, shape: rot };
  }

  function move(dx, dy) {
    if (!current) return;
    if (!collides(pos.x + dx, pos.y + dy, current.shape)) { pos = { x: pos.x + dx, y: pos.y + dy }; return true; }
    if (dy === 1) { lock(); }
    return false;
  }

  function hardDrop() {
    if (!current) return;
    while (!collides(pos.x, pos.y + 1, current.shape)) pos = { x: pos.x, y: pos.y + 1 };
    lock();
  }

  function step() { if (!paused && !gameOver && current) move(0, 1); }

  function startGame() {
    board = emptyBoard();
    score = 0; lines = 0; level = 0;
    gameOver = false; paused = false; started = true;
    spawn();
  }

  function togglePause() { if (!gameOver && started) paused = !paused; }

  function keydown(e) {
    if (!started || gameOver) { if (e.key === 'Enter' || e.key === ' ') { startGame(); } return; }
    if (e.key === 'p') { togglePause(); e.preventDefault(); return; }
    if (paused) return;
    if (e.key === 'ArrowLeft') move(-1, 0);
    else if (e.key === 'ArrowRight') move(1, 0);
    else if (e.key === 'ArrowDown') move(0, 1);
    else if (e.key === 'ArrowUp') { rotate(); e.preventDefault(); }
    else if (e.key === ' ') { hardDrop(); e.preventDefault(); }
  }

  onMount(() => { startGame(); tick = setInterval(step, 500); });
  onDestroy(() => { if (tick) clearInterval(tick); });
</script>

<svelte:window on:keydown={keydown} />

<div class="tetris">
  <div class="game-area">
    <div class="board" bind:this={gameRef}>
      {#each board as row, r}
        {#each row as cell, c}
          <div class="cell" class:filled={!!cell} style={cell ? 'background:' + cell : ''}></div>
        {/each}
      {/each}
      {#if current && !gameOver}
        {#each current.shape as row, r}
          {#each row as cell, c}
            {#if cell}
              <div class="cell cell-cur" style="background:{current.color}; left:{ (pos.x + c) * 24 }px; top:{ (pos.y + r) * 24 }px;"></div>
            {/if}
          {/each}
        {/each}
      {/if}
    </div>
    <div class="side">
      <div class="info-box">
        <div class="info-label">Score</div>
        <div class="info-val">{score}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Lines</div>
        <div class="info-val">{lines}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Level</div>
        <div class="info-val">{level}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Next</div>
        <div class="next-box">
          {#if next}
            {#each next.shape as row}
              <div class="next-row">
                {#each row as cell}
                  <div class="next-cell" class:filled={!!cell} style={cell ? 'background:' + next.color : ''}></div>
                {/each}
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <div class="info-box ctrls">
        <button class="tet-btn" on:click={startGame} disabled={started && !gameOver}>New Game</button>
        <button class="tet-btn" on:click={togglePause} disabled={!started || gameOver}>{paused ? 'Resume' : 'Pause'}</button>
      </div>
    </div>
  </div>
  {#if gameOver}
    <div class="overlay">
      <div class="over-box">
        <div class="over-title">Game Over</div>
        <div class="over-score">Score: {score}</div>
        <button class="tet-btn tet-btn-lg" on:click={startGame}>Play Again</button>
      </div>
    </div>
  {/if}
  {#if paused && !gameOver}
    <div class="overlay">
      <div class="over-box">
        <div class="over-title">Paused</div>
        <button class="tet-btn tet-btn-lg" on:click={togglePause}>Resume</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .tetris { height: 100%; display: flex; flex-direction: column; background: #c0c0c0; font-family: "VT323", monospace; padding: 4px; position: relative; }
  .game-area { display: flex; gap: 8px; flex: 1; justify-content: center; align-items: flex-start; }
  .board { position: relative; width: 248px; height: 488px; display: flex; flex-wrap: wrap; border: 4px solid; border-top-color: #808080; border-left-color: #808080; border-bottom-color: #fff; border-right-color: #fff; background: #000; overflow: hidden; }
  .cell { width: 24px; height: 24px; border: 1px solid #333; }
  .cell.filled { border-color: #555; border-top-color: #888; border-left-color: #888; border-bottom-color: #222; border-right-color: #222; }
  .cell-cur { position: absolute; border: 1px solid #000; border-top-color: rgba(255,255,255,0.4); border-left-color: rgba(255,255,255,0.4); border-bottom-color: rgba(0,0,0,0.4); border-right-color: rgba(0,0,0,0.4); }
  .side { display: flex; flex-direction: column; gap: 6px; min-width: 110px; }
  .info-box { background: #c0c0c0; padding: 4px; border: 2px solid; border-top-color: #808080; border-left-color: #808080; border-bottom-color: #fff; border-right-color: #fff; }
  .info-label { font-size: 13px; font-weight: bold; margin-bottom: 2px; }
  .info-val { font-size: 18px; }
  .next-box { display: flex; flex-direction: column; align-items: center; gap: 0; padding: 4px; }
  .next-row { display: flex; }
  .next-cell { width: 20px; height: 20px; border: 1px solid #555; }
  .next-cell.filled { border-top-color: #888; border-left-color: #888; border-bottom-color: #222; border-right-color: #222; }
  .ctrls { display: flex; flex-direction: column; gap: 4px; }
  .tet-btn { padding: 3px 12px; font-family: inherit; font-size: 13px; border-top: 2px solid #fff; border-left: 2px solid #fff; border-bottom: 2px solid #404040; border-right: 2px solid #404040; background: #c0c0c0; cursor: pointer; }
  .tet-btn:active { border-top: 2px solid #404040; border-left: 2px solid #404040; border-bottom: 2px solid #fff; border-right: 2px solid #fff; }
  .tet-btn:disabled { color: #808080; }
  .tet-btn-lg { padding: 6px 24px; font-size: 16px; margin-top: 8px; }
  .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10; }
  .over-box { background: #c0c0c0; padding: 20px 32px; text-align: center; border-top: 2px solid #fff; border-left: 2px solid #fff; border-bottom: 2px solid #404040; border-right: 2px solid #404040; }
  .over-title { font-size: 22px; font-weight: bold; margin-bottom: 8px; }
  .over-score { font-size: 16px; margin-bottom: 4px; }
</style>