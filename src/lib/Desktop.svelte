<script>
  import { openWindow, showDialog, closeStartMenu, hideContextMenu, showContextMenu, iconPath, refreshFlash } from '../stores.js';

  let flashing = false;
  $: if ($refreshFlash) {
    setTimeout(() => { flashing = true; setTimeout(() => flashing = false, 150); }, 80);
  }

  const GAP = 80;
  const OFFSET = 16;
  const TASKBAR = 30;

  const icons = [
    { id: 'mycomputer', iconNum: '01', label: 'My Computer', tip: 'View files and folders on your computer', action: () => openWindow('mycomputer', { title: 'My Computer', icon: 'My Computer', iconNum: '01', width: 520, height: 400 }) },
    { id: 'projects', iconNum: '07', label: 'Projects', tip: 'Open folder: Projects', action: () => openWindow('projects', { title: 'Projects', icon: 'Projects', iconNum: '07', width: 540, height: 420 }) },
    { id: 'about', iconNum: '02', label: 'About Me', tip: 'About this developer', action: () => openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 }) },
    { id: 'resume', iconNum: '16', label: 'Resume', tip: 'Open resume document', action: () => openWindow('resume', { title: 'Resume', icon: 'Resume', iconNum: '16', width: 500, height: 460 }) },
    { id: 'notepad', iconNum: '102', label: 'Notepad', tip: 'Open Notepad text editor', action: () => openWindow('notepad', { title: 'Untitled - Notepad', icon: 'Notepad', iconNum: '102', width: 420, height: 360 }) },
    { id: 'ie', iconNum: '04', label: 'Internet\nExplorer', tip: 'Browse the World Wide Web', action: () => openWindow('ie', { title: 'Internet Explorer', icon: 'IE', iconNum: '04', width: 520, height: 440 }) },
    { id: 'cmd', iconNum: '06', label: 'Command\nPrompt', tip: 'MS-DOS command line', action: () => openWindow('cmd', { title: 'Command Prompt', icon: 'Cmd', iconNum: '06', width: 620, height: 400 }) },
    { id: 'paint', iconNum: '20', label: 'Paint', tip: 'Drawing application', action: () => openWindow('paint', { title: 'untitled - Paint', icon: 'Paint', iconNum: '20', width: 680, height: 480 }) },
    { id: 'explorer', iconNum: '07', label: 'File\nExplorer', tip: 'Browse files and folders', action: () => openWindow('explorer', { title: 'File Explorer', icon: 'Explorer', iconNum: '07', width: 520, height: 400 }) },
    { id: 'tetris', iconNum: '36', label: 'Tetris', tip: 'Classic block-stacking puzzle', action: () => openWindow('tetris', { title: 'Tetris', icon: 'Tetris', iconNum: '36', width: 400, height: 620 }) },
    { id: 'recycle', iconNum: '08', label: 'Recycle Bin', tip: 'Contains deleted files and folders', action: () => openWindow('recycle', { title: 'Recycle Bin', icon: 'Recycle Bin', iconNum: '08', width: 520, height: 400 }) },
  ];

  let winH = 600;
  function onResize() { winH = window.innerHeight; }

  $: perCol = Math.max(1, Math.floor((winH - TASKBAR - OFFSET) / GAP));

  function iconPos(idx) {
    const col = Math.floor(idx / perCol);
    const row = idx % perCol;
    return { left: OFFSET + col * 80, top: OFFSET + row * GAP };
  }

  let selected = null;
  let hoveredTip = '';
  let loadedCount = 0;
  let loaded = false;

  function handleIconLoad() {
    loadedCount++;
    if (loadedCount >= icons.length) loaded = true;
  }

  function handleClick(icon, e) {
    e.stopPropagation();
    selected = icon.id;
    closeStartMenu();
    hideContextMenu();
  }

  function handleDblClick(icon) {
    icon.action();
  }

  function onDesktopClick() {
    selected = null;
    closeStartMenu();
    hideContextMenu();
  }

  function onContextMenu(e) {
    e.preventDefault();
    closeStartMenu();
    showContextMenu(e.clientX, e.clientY);
  }

  import { onMount } from 'svelte';
  onMount(() => { winH = window.innerHeight; window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize); });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="desktop" class:flashing on:click={onDesktopClick} on:contextmenu={onContextMenu}>
  {#each icons as icon, idx (icon.id)}
    {@const pos = iconPos(idx)}
    <button
      class="desktop-icon"
      class:selected={selected === icon.id}
      style="left:{pos.left}px; top:{pos.top}px;"
      on:click={(e) => handleClick(icon, e)}
      on:dblclick={() => handleDblClick(icon)}
      on:mouseenter={() => hoveredTip = icon.id}
      on:mouseleave={() => hoveredTip = ''}
    >
      <img class="icon-img" class:loaded src={iconPath(icon.iconNum)} alt="" width="32" height="32" on:load={handleIconLoad}>
      <span class="icon-label">{@html icon.label.replace('\n', '<br>')}</span>
      {#if hoveredTip === icon.id}
        <div class="tooltip">{icon.tip}</div>
      {/if}
    </button>
  {/each}
</div>

<style>
  .desktop {
    width: 100%;
    flex: 1;
    background: #008080;
    background-image: url('/win98bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    transition: opacity 0.15s;
  }
  .desktop.flashing {
    opacity: 0.85;
  }
  .desktop-icon {
    width: 72px;
    padding: 4px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: default;
    border: 1px solid transparent;
    position: absolute;
    background: none;
    font-family: "VT323", monospace;
    font-size: 13px;
    color: #fff;
    text-shadow: 1px 1px 0 #000;
  }
  .desktop-icon:hover { border-color: rgba(255,255,255,0.4); background: rgba(0,0,128,0.3); }
  .desktop-icon.selected {
    border-color: #fff;
    background: #000080;
    color: #fff;
    text-shadow: none;
  }
  .icon-img {
    width: 32px;
    height: 32px;
    opacity: 0;
    transition: opacity 0.2s ease-in;
  }
  .icon-img.loaded {
    opacity: 1;
  }
  .icon-label {
    text-align: center;
    font-size: 13px;
    word-wrap: break-word;
    max-width: 68px;
    line-height: 1.1;
  }
  .tooltip {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffffcc;
    color: #000;
    padding: 2px 6px;
    font-size: 14px;
    max-width: 160px;
    word-wrap: break-word;
    white-space: normal;
    border: 1px solid #000;
    pointer-events: none;
    z-index: 10;
    box-shadow: 1px 1px 0 rgba(0,0,0,0.3);
  }
</style>
