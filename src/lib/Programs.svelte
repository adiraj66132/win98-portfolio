<script>
  import { openWindow, iconPath } from '../stores.js';
</script>

<div class="folder-view">
  <button class="folder-item" on:dblclick={() => openWindow('notepad', { title: 'Untitled - Notepad', icon: 'Notepad', iconNum: '102', width: 420, height: 360 })}>
    <img src={iconPath('102')} alt="" width="32" height="32">
    <span>Notepad</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('minesweeper', { title: 'Minesweeper', icon: 'Minesweeper', iconNum: '44', width: 230, height: 330 })}>
    <img src={iconPath('44')} alt="" width="32" height="32">
    <span>Minesweeper</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('paint', { title: 'untitled - Paint', icon: 'Paint', iconNum: '20', width: 720, height: 520 })}>
    <img src={iconPath('20')} alt="" width="32" height="32">
    <span>Paint</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('tetris', { title: 'Tetris', icon: 'Tetris', iconNum: '36', width: 400, height: 620 })}>
    <img src={iconPath('36')} alt="" width="32" height="32">
    <span>Tetris</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('cmd', { title: 'Command Prompt', icon: 'Cmd', iconNum: '06', width: 620, height: 400 })}>
    <img src={iconPath('06')} alt="" width="32" height="32">
    <span>Command Prompt</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('ie', { title: 'Internet Explorer', icon: 'IE', iconNum: '04', width: 520, height: 440 })}>
    <img src={iconPath('04')} alt="" width="32" height="32">
    <span>Internet Explorer</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 })}>
    <img src={iconPath('02')} alt="" width="32" height="32">
    <span>About Me</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('resume', { title: 'Resume', icon: 'Resume', iconNum: '16', width: 500, height: 460 })}>
    <img src={iconPath('16')} alt="" width="32" height="32">
    <span>Resume</span>
  </button>
</div>

<style>
  .folder-view {
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    align-content: flex-start;
  }
  .folder-item {
    width: 74px;
    padding: 4px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    font-family: "VT323", monospace;
    font-size: 12px;
    color: #000;
  }
  .folder-item:hover { border-color: #000080; background: rgba(0,0,128,0.15); }
  .folder-item img { image-rendering: pixelated; }
  .folder-item span { text-align: center; word-wrap: break-word; max-width: 70px; line-height: 1.1; }
</style>
