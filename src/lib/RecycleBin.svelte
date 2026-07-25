<script>
  import { onMount } from 'svelte';
  import { listTrash, restoreItem, emptyTrash, closeWindow, iconPath } from '../stores.js';

  export let id;

  let items = [];
  let openMenu = null;
  let selected = null;

  function refresh() { items = listTrash(); }
  onMount(refresh);

  function fmtDate(ts) {
    if (!ts) return 'Unknown';
    const d = new Date(ts);
    return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear()+' '+
      d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
  }

  function origPath(item) {
    if (!item._origPath) return 'Unknown';
    return item._origPath.replace(/\//g, '\\');
  }

  function doRestoreAll() { items.forEach(i => restoreItem(i._origPath || i.name)); refresh(); }
  function doRestore(item) { restoreItem(item._origPath || item.name); refresh(); }
  function doEmpty() { if (confirm('Are you sure you want to permanently delete all items?')) { emptyTrash(); refresh(); } }

  function doMenu(a) {
    openMenu = null;
    if (a === 'empty') doEmpty();
    if (a === 'restore') doRestoreAll();
    if (a === 'exit') closeWindow(id);
  }
</script>

<div class="explorer">
  <div class="menubar" on:mouseleave={() => openMenu = null}>
    <div class="menu-trigger" class:menu-open={openMenu === 'File'} on:click|stopPropagation={() => openMenu = openMenu === 'File' ? null : 'File'} on:mouseenter={() => { if (openMenu) openMenu = 'File'; }}>File
      {#if openMenu === 'File'}
        <div class="menu-drop">
          <button class="menu-item" on:click|stopPropagation={() => doMenu('restore')}>Restore All</button>
          <button class="menu-item" on:click|stopPropagation={() => doMenu('empty')}>Empty Recycle Bin</button>
          <div class="menu-sep"></div>
          <button class="menu-item" on:click|stopPropagation={() => doMenu('exit')}>Close</button>
        </div>
      {/if}
    </div>
  </div>

  <div class="addr-bar">
    <span class="addr-label">Address</span>
    <div class="addr-input-box">
      <span class="addr-input">Recycle Bin</span>
    </div>
  </div>

  <div class="main-area">
    {#if items.length > 0}
      <div class="task-pane">
        <div class="task-header">
          <img src={iconPath('09', 32)} alt="" width="32" height="32">
          <span class="task-title">Recycle Bin</span>
        </div>
        <div class="task-links">
          <button class="task-link" on:click={doRestoreAll}>
            <img src={iconPath('35', 16)} alt="" width="16" height="16"> Restore all items
          </button>
          <button class="task-link" on:click={doEmpty}>
            <img src={iconPath('14', 16)} alt="" width="16" height="16"> Empty Recycle Bin
          </button>
        </div>
      </div>
    {/if}
    <div class="folder-view">
      {#if items.length === 0}
        <div class="empty-msg">
          <img src={iconPath('08', 48)} alt="" width="48" height="48">
          <p>Your Recycle Bin is empty.</p>
        </div>
      {:else}
        {#each items as item, i (item.name + i)}
          <button class="folder-item" class:sel={selected === i} on:click={() => selected = i} on:dblclick={() => doRestore(item)}>
            <img src={iconPath(item.type === 'folder' ? '07' : '102')} alt="" width="32" height="32">
            <span class="item-name">{item.name}</span>
            <span class="item-meta">{origPath(item)}</span>
            <span class="item-meta">{fmtDate(item._deletedAt)}</span>
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <div class="statusbar">
    <span class="status-text">{items.length} object{items.length !== 1 ? 's' : ''}</span>
  </div>
</div>

<style>
  .explorer { height: 100%; display: flex; flex-direction: column; background: #fff; font-family: "VT323", monospace; font-size: 13px; }
  .menubar { display: flex; background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0; padding: 1px 0; }
  .menu-trigger { position: relative; padding: 2px 8px; cursor: default; user-select: none; }
  .menu-trigger:hover, .menu-open { background: #000080; color: #fff; }
  .menu-drop { position: absolute; top: 100%; left: 0; z-index: 100; min-width: 160px; background: #c0c0c0; padding: 2px; border-top: 2px solid #fff; border-left: 2px solid #fff; border-bottom: 2px solid #404040; border-right: 2px solid #404040; box-shadow: 3px 3px 0 rgba(0,0,0,0.3); }
  .menu-item { display: block; width: 100%; padding: 2px 16px; cursor: default; background: none; border: none; font-family: inherit; font-size: 13px; text-align: left; color: #000; }
  .menu-item:hover { background: #000080; color: #fff; }
  .menu-sep { height: 1px; background: #808080; margin: 2px 0; }

  .addr-bar { display: flex; align-items: center; gap: 4px; padding: 2px 4px; background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0; }
  .addr-label { font-size: 13px; flex-shrink: 0; font-weight: bold; }
  .addr-input-box { flex: 1; padding: 1px 3px; height: 20px; display: flex; align-items: center; border-top: 2px solid #808080; border-left: 2px solid #808080; border-bottom: 2px solid #fff; border-right: 2px solid #fff; background: #fff; }
  .addr-input { font-size: 13px; color: #000; }

  .main-area { flex: 1; display: flex; overflow: auto; }
  .task-pane { width: 160px; flex-shrink: 0; background: #fff; padding: 8px; border-right: 2px solid #808080; }
  .task-header { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .task-header img { image-rendering: pixelated; }
  .task-title { font-size: 14px; font-weight: bold; }
  .task-links { display: flex; flex-direction: column; gap: 2px; }
  .task-link { display: flex; align-items: center; gap: 4px; padding: 3px 4px; cursor: default; background: none; border: none; font-family: inherit; font-size: 13px; text-align: left; color: #000; width: 100%; }
  .task-link:hover { background: #000080; color: #fff; }
  .task-link img { image-rendering: pixelated; flex-shrink: 0; }

  .folder-view { flex: 1; padding: 8px; display: flex; flex-direction: row; flex-wrap: wrap; gap: 2px; overflow: auto; align-content: flex-start; }
  .empty-msg { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #808080; padding: 48px; width: 100%; }
  .empty-msg p { margin: 0; font-size: 14px; color: #000; }
  .empty-msg img { image-rendering: pixelated; }
  .folder-item { width: 120px; padding: 6px 4px; display: flex; flex-direction: column; align-items: center; gap: 1px; cursor: pointer; border: 1px solid transparent; background: none; font-family: inherit; font-size: 12px; color: #000; }
  .folder-item:hover { border-color: #000080; background: rgba(0,0,128,0.15); }
  .folder-item.sel { border-color: #000080; background: #000080; color: #fff; }
  .folder-item img { image-rendering: pixelated; }
  .item-name { text-align: center; word-wrap: break-word; max-width: 110px; line-height: 1.1; }
  .item-meta { font-size: 10px; color: #666; text-align: center; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sel .item-meta { color: #aac; }

  .statusbar { display: flex; padding: 1px 4px; flex-shrink: 0; height: 18px; align-items: center; border-top: 2px solid #808080; border-left: 2px solid #808080; border-bottom: 2px solid #fff; border-right: 2px solid #fff; margin: 0 2px 2px; }
  .status-text { font-size: 12px; }
</style>