<script>
  import { openWindow, showDialog, closeStartMenu, hideContextMenu, showContextMenu } from '../stores.js';

  const icons = [
    { id: 'mycomputer', iconNum: '01', label: 'My Computer', x: 16, y: 16, action: () => openWindow('mycomputer', { title: 'My Computer', icon: 'My Computer', iconNum: '01', width: 520, height: 400 }) },
    { id: 'projects', iconNum: '08', label: 'Projects', x: 16, y: 96, action: () => openWindow('projects', { title: 'Projects', icon: 'Projects', iconNum: '08', width: 540, height: 420 }) },
    { id: 'about', iconNum: '02', label: 'About Me', x: 16, y: 176, action: () => openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 }) },
    { id: 'resume', iconNum: '16', label: 'Resume', x: 16, y: 256, action: () => openWindow('resume', { title: 'Resume', icon: 'Resume', iconNum: '16', width: 500, height: 460 }) },
    { id: 'notepad', iconNum: '07', label: 'Notepad', x: 16, y: 336, action: () => openWindow('notepad', { title: 'Untitled - Notepad', icon: 'Notepad', iconNum: '07', width: 420, height: 360 }) },
    { id: 'ie', iconNum: '04', label: 'Internet\nExplorer', x: 16, y: 416, action: () => openWindow('ie', { title: 'Internet Explorer', icon: 'IE', iconNum: '04', width: 520, height: 440 }) },
    { id: 'recycle', iconNum: '05', label: 'Recycle Bin', x: 16, y: 500, action: () => showDialog('Recycle Bin is empty.') },
  ];

  let selected = null;

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
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="desktop" on:click={onDesktopClick} on:contextmenu={onContextMenu}>
  {#each icons as icon (icon.id)}
    <button
      class="desktop-icon"
      class:selected={selected === icon.id}
      style="left:{icon.x}px; top:{icon.y}px;"
      on:click={(e) => handleClick(icon, e)}
      on:dblclick={() => handleDblClick(icon)}
    >
      <img class="icon-img" src="/icons/{icon.iconNum}.png" alt="" width="32" height="32">
      <span class="icon-label">{@html icon.label.replace('\n', '<br>')}</span>
    </button>
  {/each}
</div>

<style>
  .desktop {
    width: 100%;
    flex: 1;
    background: #008080;
    position: relative;
    overflow: hidden;
  }
  .desktop-icon {
    width: 72px;
    padding: 4px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
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
    image-rendering: pixelated;
    width: 32px;
    height: 32px;
  }
  .icon-label {
    text-align: center;
    font-size: 13px;
    word-wrap: break-word;
    max-width: 68px;
    line-height: 1.1;
  }
</style>
