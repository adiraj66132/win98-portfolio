<script>
  import { showDialog } from '../stores.js';

  const ROWS = 9, COLS = 9, MINES = 10;
  let board = [];
  let revealed = 0;
  let gameOver = false;
  let started = false;
  let timer = 0;
  let timerIv = null;
  let face = '🙂';

  function init() {
    board = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, num: 0 }))
    );
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c].mine) continue;
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) cnt++;
          }
        }
        board[r][c].num = cnt;
      }
    }
    board = board;
  }

  init();

  function click(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    if (!started) {
      started = true;
      timerIv = setInterval(() => { timer++; }, 1000);
    }
    if (board[r][c].mine) {
      gameOver = true;
      clearInterval(timerIv);
      face = '😵';
      revealAll();
      return;
    }
    reveal(r, c);
    board = board;
    checkWin();
  }

  function reveal(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged || cell.mine) return;
    cell.revealed = true;
    revealed++;
    if (cell.num === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(r + dr, c + dc);
        }
      }
    }
  }

  function flag(e, r, c) {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    board[r][c].flagged = !board[r][c].flagged;
    board = board;
  }

  function checkWin() {
    if (revealed === ROWS * COLS - MINES) {
      gameOver = true;
      clearInterval(timerIv);
      face = '😎';
      showDialog('You won! 🎉');
    }
  }

  function revealAll() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        board[r][c].revealed = true;
      }
    }
    board = board;
  }

  function reset() {
    if (timerIv) clearInterval(timerIv);
    timer = 0;
    revealed = 0;
    gameOver = false;
    started = false;
    face = '🙂';
    init();
  }

  $: remaining = MINES - board.flat().filter(c => c.flagged).length;
  $: timerStr = String(timer).padStart(3, '0');
  $: remainingStr = String(Math.max(0, remaining)).padStart(3, '0');

  import { onMount, onDestroy } from 'svelte';
  onDestroy(() => { if (timerIv) clearInterval(timerIv); });
</script>

<div class="ms">
  <div class="ms-header">
    <div class="counter">{remainingStr}</div>
    <button class="face-btn" on:click={reset}>{face}</button>
    <div class="counter">{timerStr}</div>
  </div>
  <div class="grid" style="grid-template-columns: repeat({COLS}, 18px);">
    {#each board as row, r}
      {#each row as cell, c}
        <button
          class="cell"
          class:revealed={cell.revealed}
          class:mine-cell={cell.revealed && cell.mine}
          class:flagged={cell.flagged && !cell.revealed}
          data-num={cell.revealed && !cell.mine && cell.num > 0 ? cell.num : undefined}
          on:click={() => click(r, c)}
          on:contextmenu={(e) => flag(e, r, c)}
        >
          {#if cell.revealed}
            {#if cell.mine}💣{:else if cell.num > 0}{cell.num}{/if}
          {/if}
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .ms {
    padding: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .ms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 4px 6px;
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    background: #c0c0c0;
  }
  .counter {
    background: #000;
    color: #ff0000;
    font-family: "VT323", monospace;
    font-size: 20px;
    padding: 1px 4px;
    min-width: 42px;
    text-align: center;
    letter-spacing: 2px;
    border: 1px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
  }
  .face-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .face-btn:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
  }
  .grid {
    display: grid;
    gap: 0;
    border: 3px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
  }
  .cell {
    width: 18px;
    height: 18px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    font-family: "VT323", monospace;
    color: #000;
  }
  .cell.revealed {
    border: 1px solid #808080;
    background: #c0c0c0;
  }
  .cell.mine-cell { background: #ff0000; }
  .cell.flagged::after { content: "🚩"; font-size: 11px; }
  .cell[data-num="1"] { color: #0000ff; }
  .cell[data-num="2"] { color: #008000; }
  .cell[data-num="3"] { color: #ff0000; }
  .cell[data-num="4"] { color: #000080; }
  .cell[data-num="5"] { color: #800000; }
  .cell[data-num="6"] { color: #008080; }
  .cell[data-num="7"] { color: #000; }
  .cell[data-num="8"] { color: #808080; }
</style>
