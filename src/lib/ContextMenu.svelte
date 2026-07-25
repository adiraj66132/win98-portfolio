<script>
  import { contextMenu, hideContextMenu, openWindow, showDialog } from '../stores.js';

  function arrangeIcons() { hideContextMenu(); }
  function refresh() { hideContextMenu(); location.reload(); }
  function paste() { hideContextMenu(); }
  function about() { hideContextMenu(); openWindow('about', { title: 'About Me', icon: 'About Me', iconNum: '02', width: 480, height: 440 }); }
  function properties() { hideContextMenu(); showDialog('Display Properties\n\nThis portfolio does not support display settings.', 'Display Properties'); }
</script>

<svelte:window on:click={hideContextMenu} on:contextmenu|preventDefault />

{#if $contextMenu.visible}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="ctx" style="left:{$contextMenu.x}px; top:{$contextMenu.y}px;" on:click|stopPropagation>
    <button class="ctx-item" on:click={arrangeIcons}>
      <span class="ctx-icon">📐</span> Arrange Icons ►
    </button>
    <button class="ctx-item" on:click={refresh}>
      <span class="ctx-icon">🔄</span> Refresh
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item disabled">
      <span class="ctx-icon">📋</span> Paste
    </button>
    <button class="ctx-item disabled">
      <span class="ctx-icon">📋</span> Paste Shortcut
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" on:click={about}>
      <span class="ctx-icon">ℹ️</span> About This Portfolio
    </button>
    <div class="ctx-sep"></div>
    <button class="ctx-item" on:click={properties}>
      <span class="ctx-icon">🖥️</span> Properties
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
    box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
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
