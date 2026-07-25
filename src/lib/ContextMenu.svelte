<script>
  import { contextMenu, hideContextMenu, openWindow, showDialog, createFolder, createFile, iconPath, triggerRefresh } from '../stores.js';
  import { getClipboard, setClipboard, clearClipboard } from '../lib/clipboard.js';

  function arrangeIcons() { hideContextMenu(); showDialog('Desktop icons have been arranged.', 'Arrange Icons'); }
  function refresh() { hideContextMenu(); triggerRefresh(); }
  function about() { hideContextMenu(); openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 }); }
  function properties() { hideContextMenu(); showDialog('Display Properties\n\nThis portfolio does not support display settings.', 'Display Properties'); }

  let newOpen = false;

  function newFolder() { hideContextMenu(); const n = prompt('Folder name:'); if (n) createFolder('/' + n); }
  function newTextFile() { hideContextMenu(); const n = prompt('File name:'); if (n) createFile('/' + n, ''); }
  function pasteItem() {
    hideContextMenu();
    const item = getClipboard();
    if (!item) { showDialog('No items to paste.', 'Paste'); return; }
    createFile('/' + item.name, item.content || '');
    clearClipboard();
    showDialog('"' + item.name + '" pasted.', 'Paste');
  }
</script>

<svelte:window on:click={hideContextMenu} on:contextmenu|preventDefault />

{#if $contextMenu.visible}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="ctx" style="left:{$contextMenu.x}px; top:{$contextMenu.y}px;" on:click|stopPropagation>
    <div class="ctx-item" on:click={(e) => { e.stopPropagation(); newOpen = !newOpen; }} on:mouseenter={() => newOpen = true} on:mouseleave={() => newOpen = false}>
      <span class="ctx-icon"><img src={iconPath('07', 16)} alt="" width="16" height="16"></span> New <span class="ctx-arrow">&#9654;</span>
      {#if newOpen}
        <div class="ctx-sub">
          <button class="ctx-item" on:click|stopPropagation={newFolder}><span class="ctx-icon"><img src={iconPath('07', 16)} alt="" width="16" height="16"></span> Folder</button>
          <button class="ctx-item" on:click|stopPropagation={newTextFile}><span class="ctx-icon"><img src={iconPath('102', 16)} alt="" width="16" height="16"></span> Text File</button>
        </div>
      {/if}
    </div>
    <button class="ctx-item" on:click={arrangeIcons}>
      <span class="ctx-icon"><img src={iconPath('35', 16)} alt="" width="16" height="16"></span> Arrange Icons
    </button>
    <button class="ctx-item" on:click={refresh}>
      <span class="ctx-icon"><img src={iconPath('30', 16)} alt="" width="16" height="16"></span> Refresh
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" on:click={pasteItem}>
      <span class="ctx-icon"><img src={iconPath('102', 16)} alt="" width="16" height="16"></span> Paste
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" on:click={about}>
      <span class="ctx-icon"><img src={iconPath('13', 16)} alt="" width="16" height="16"></span> About This Portfolio
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" on:click={properties}>
      <span class="ctx-icon"><img src={iconPath('33', 16)} alt="" width="16" height="16"></span> Properties
    </button>
  </div>
{/if}

<style>
  .ctx {
    position: fixed;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    min-width: 180px;
    z-index: 9998;
    padding: 2px;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .ctx-item {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 3px 20px 3px 4px;
    cursor: default;
    font-size: 13px;
    font-family: "VT323", monospace;
    border: none;
    background: none;
    text-align: left;
    color: #000;
  }
  .ctx-item:hover { background: #000080; color: #fff; }
  .ctx-item.disabled { color: #808080; }
  .ctx-item.disabled:hover { background: none; color: #808080; }
  .ctx-icon { font-size: 14px; width: 18px; text-align: center; }
  .ctx-sep {
    height: 2px;
    margin: 2px;
    border-top: 1px solid #808080;
    border-bottom: 1px solid #fff;
  }
</style>
