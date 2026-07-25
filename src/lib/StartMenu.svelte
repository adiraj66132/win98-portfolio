<script>
  import { startMenuOpen, closeStartMenu, openWindow, showDialog, iconPath, startShutdown } from '../stores.js';

  const items = [
    { iconNum: '05', label: 'Programs', bold: true, action: () => openWindow('programs', { title: 'Programs', icon: 'Programs', iconNum: '05', width: 380, height: 320 }) },
    { iconNum: '102', label: 'Notepad', action: () => openWindow('notepad', { title: 'Untitled - Notepad', icon: 'Notepad', iconNum: '102', width: 420, height: 360 }) },
    { iconNum: '44', label: 'Minesweeper', action: () => openWindow('minesweeper', { title: 'Minesweeper', icon: 'Minesweeper', iconNum: '44', width: 230, height: 330 }) },
    { iconNum: '06', label: 'Command Prompt', action: () => openWindow('cmd', { title: 'Command Prompt', icon: 'Cmd', iconNum: '06', width: 620, height: 400 }) },
    { iconNum: '20', label: 'Paint', action: () => openWindow('paint', { title: 'untitled - Paint', icon: 'Paint', iconNum: '20', width: 720, height: 520 }) },
    'sep',
    { iconNum: '02', label: 'About Me', action: () => openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 }) },
    { iconNum: '16', label: 'Resume', action: () => openWindow('resume', { title: 'Resume', icon: 'Resume', iconNum: '16', width: 500, height: 460 }) },
    { iconNum: '04', label: 'Internet Explorer', action: () => openWindow('ie', { title: 'Internet Explorer', icon: 'IE', iconNum: '04', width: 520, height: 440 }) },
    'sep',
    { iconNum: '13', label: 'About Windows', action: () => showDialog('Microsoft Windows 98\nVersion 4.10.1998\n\n© Microsoft Corp 1981-1998\n\nThis product is a web portfolio\nbuilt with Svelte.', 'About Windows') },
    { iconNum: '14', label: 'Shut Down...', action: () => startShutdown() },
  ];

  function handleAction(item) {
    closeStartMenu();
    if (item.action) item.action();
  }
</script>

{#if $startMenuOpen}
  <div class="start-menu">
    <div class="sidebar">
      <span class="sidebar-text">Windows<b>98</b></span>
    </div>
    <div class="menu-items">
      {#each items as item}
        {#if item === 'sep'}
          <div class="sep"></div>
        {:else}
          <button class="menu-item" on:click={() => handleAction(item)}>
            <img class="item-icon" src={iconPath(item.iconNum)} alt="" width="32" height="32">
            <span class="item-label">{#if item.bold}<b>{item.label}</b>{:else}{item.label}{/if}</span>
          </button>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .start-menu {
    position: absolute;
    bottom: 30px;
    left: 2px;
    width: 200px;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    z-index: 9500;
    display: flex;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
    animation: slideUp 0.12s ease-out;
  }
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .sidebar {
    width: 24px;
    background: linear-gradient(to top, #000080, #1084d0);
    display: flex;
    align-items: flex-end;
    padding: 4px 2px;
    flex-shrink: 0;
  }
  .sidebar-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: #c0c0c0;
    font-family: "VT323", monospace;
    font-size: 18px;
    letter-spacing: 1px;
  }
  .sidebar-text b { color: #fff; }
  .menu-items {
    flex: 1;
    padding: 2px 0;
  }
  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 4px 4px;
    cursor: pointer;
    font-family: "VT323", monospace;
    font-size: 13px;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    color: #000;
  }
  .menu-item:hover { background: #000080; color: #fff; }
  .item-icon { image-rendering: pixelated; flex-shrink: 0; }
  .sep {
    height: 2px;
    margin: 2px 4px;
    border-top: 1px solid #808080;
    border-bottom: 1px solid #fff;
  }
</style>
