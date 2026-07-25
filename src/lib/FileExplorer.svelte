<script>
  import { createFolder, createFile, deleteItem, listDir, openWindow, iconPath, readFile, closeWindow } from '../stores.js';
  import { setClipboard } from './clipboard.js';

  export let id;

  let currentPath = '/';
  let items = [];
  let showCtx = false;
  let ctxItem = null;
  let ctxX = 0, ctxY = 0;
  let openMenu = null;

  function refresh() { items = listDir(currentPath); }
  $: refresh();

  function goUp() {
    if (currentPath === '/') return;
    currentPath = currentPath.replace(/\/$/, '').split('/').slice(0, -1).join('/') || '/';
  }

  function goTo(path) { currentPath = path; }

  function onItemDblClick(item) {
    if (item.type === 'folder') goTo(item.path);
    else openWindow('notepad', { title: item.name + ' - Notepad', icon: 'Notepad', iconNum: '102', width: 420, height: 360, filePath: item.path });
  }

  function onCtx(e, item) { e.preventDefault(); e.stopPropagation(); ctxItem = item; ctxX = e.clientX; ctxY = e.clientY; showCtx = true; }
  function onBgCtx(e) { e.preventDefault(); ctxItem = null; ctxX = e.clientX; ctxY = e.clientY; showCtx = true; }
  function hideCtx() { showCtx = false; openMenu = null; }

  function doNewFolder() {
    const name = prompt('Folder name:'); if (name) { createFolder((currentPath === '/' ? '' : currentPath) + '/' + name); refresh(); }
    hideCtx();
  }
  function doNewFile() {
    const name = prompt('File name:'); if (name) { createFile((currentPath === '/' ? '' : currentPath) + '/' + name, ''); refresh(); }
    hideCtx();
  }
  function doDelete() {
    if (ctxItem && confirm('Delete "' + ctxItem.name + '"?')) { deleteItem(ctxItem.path); refresh(); }
    hideCtx();
  }

  function doMenu(a) {
    openMenu = null;
    if (a === 'exit') closeWindow(id);
    else if (a === 'refresh') refresh();
    else if (a === 'newfolder') doNewFolder();
    else if (a === 'newfile') doNewFile();
  }
</script>

<div class="explorer" on:contextmenu={onBgCtx} on:click={hideCtx}>
  <div class="menubar" on:mouseleave={() => openMenu = null}>
    <div class="menu-trigger" class:menu-open={openMenu === 'File'} on:click|stopPropagation={() => openMenu = openMenu === 'File' ? null : 'File'} on:mouseenter={() => { if (openMenu) openMenu = 'File'; }}>File
      {#if openMenu === 'File'}
        <div class="menu-drop">
          <button class="menu-item" on:click|stopPropagation={() => doMenu('newfolder')}>New &gt; Folder</button>
          <button class="menu-item" on:click|stopPropagation={() => doMenu('newfile')}>New &gt; Text File</button>
          <div class="menu-sep"></div>
          <button class="menu-item" on:click|stopPropagation={() => doMenu('exit')}>Exit</button>
        </div>
      {/if}
    </div>
    <div class="menu-trigger" class:menu-open={openMenu === 'View'} on:click|stopPropagation={() => openMenu = openMenu === 'View' ? null : 'View'} on:mouseenter={() => { if (openMenu) openMenu = 'View'; }}>View
      {#if openMenu === 'View'}
        <div class="menu-drop">
          <button class="menu-item" on:click|stopPropagation={() => doMenu('refresh')}>Refresh</button>
        </div>
      {/if}
    </div>
  </div>

  <div class="toolbar">
    <button class="tb-btn" on:click={goUp} disabled={currentPath === '/'} title="Up">
      <img src={iconPath('71')} alt="" width="16" height="16"> Up
    </button>
  </div>

  <div class="addr-bar">
    <span class="addr-label">Address</span>
    <div class="addr-input-box">
      <span class="addr-input">C:{currentPath === '/' ? '\\' : currentPath.replace(/\//g, '\\')}</span>
    </div>
  </div>

  <div class="folder-view">
    {#if currentPath !== '/'}
      <button class="folder-item" on:dblclick={goUp}>
        <img src={iconPath('07')} alt="" width="32" height="32">
        <span>..</span>
      </button>
    {/if}
    {#each items as item (item.path)}
      <button
        class="folder-item"
        on:dblclick={() => onItemDblClick(item)}
        on:contextmenu={(e) => onCtx(e, item)}
      >
        <img src={iconPath(item.type === 'folder' ? '07' : '102')} alt="" width="32" height="32">
        <span>{item.name}</span>
      </button>
    {/each}
    {#if items.length === 0 && currentPath !== '/'}
      <div class="empty-msg">(empty)</div>
    {/if}
  </div>

  <div class="statusbar">
    <span class="status-text">{items.length} object(s)</span>
  </div>
</div>

{#if showCtx}
  <div class="ctx-overlay" on:click={hideCtx}>
    <div class="ctx-menu" style="left:{ctxX}px; top:{ctxY}px;" on:click|stopPropagation>
      {#if ctxItem}
        <button class="ctx-item" on:click={() => { setClipboard({ name: ctxItem.name, path: ctxItem.path, content: ctxItem.type === 'file' ? readFile(ctxItem.path) : '' }); hideCtx(); }}>Copy</button>
        <button class="ctx-item" on:click={doDelete}>Delete</button>
      {:else}
        <div class="ctx-item has-sub" on:click={(e) => e.stopPropagation()}>New &#9654;
          <div class="ctx-sub">
            <button class="ctx-item" on:click|stopPropagation={doNewFolder}>Folder</button>
            <button class="ctx-item" on:click|stopPropagation={doNewFile}>Text File</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .explorer { height: 100%; display: flex; flex-direction: column; background: #fff; font-family: "VT323", monospace; font-size: 13px; }
  .menubar {
    display: flex; background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0;
    padding: 1px 0; gap: 0;
  }
  .menu-trigger {
    position: relative; padding: 2px 8px; cursor: default; user-select: none;
  }
  .menu-trigger:hover, .menu-open { background: #000080; color: #fff; }
  .menu-drop {
    position: absolute; top: 100%; left: 0; z-index: 100; min-width: 160px;
    background: #c0c0c0; padding: 2px;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
  }
  .menu-item { display: block; width: 100%; padding: 2px 16px; cursor: default; background: none; border: none; font-family: inherit; font-size: 13px; text-align: left; color: #000; }
  .menu-item:hover { background: #000080; color: #fff; }
  .menu-sep { height: 1px; background: #808080; margin: 2px 0; }

  .toolbar {
    display: flex; align-items: center; gap: 2px; padding: 2px 3px;
    background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0;
  }
  .tb-btn {
    display: flex; align-items: center; gap: 2px; padding: 1px 6px; cursor: pointer;
    font-family: inherit; font-size: 12px;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    background: #c0c0c0;
  }
  .tb-btn:active { border-top: 2px solid #404040; border-left: 2px solid #404040; border-bottom: 2px solid #fff; border-right: 2px solid #fff; }
  .tb-btn:disabled { color: #808080; }
  .tb-btn img { image-rendering: pixelated; }

  .addr-bar {
    display: flex; align-items: center; gap: 4px; padding: 2px 4px;
    background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0;
  }
  .addr-label { font-size: 13px; flex-shrink: 0; font-weight: bold; }
  .addr-input-box {
    flex: 1; padding: 1px 3px; height: 20px; display: flex; align-items: center;
    border-top: 2px solid #808080; border-left: 2px solid #808080;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
    background: #fff;
  }
  .addr-input { font-size: 13px; color: #000; }

  .folder-view {
    flex: 1; padding: 4px; display: flex; flex-wrap: wrap; gap: 2px;
    align-content: flex-start; overflow: auto;
    border-top: 2px solid #808080; border-left: 2px solid #808080;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
    margin: 0 2px 2px;
  }
  .folder-item {
    width: 74px; padding: 4px 2px; display: flex; flex-direction: column;
    align-items: center; gap: 2px; cursor: pointer; border: 1px solid transparent;
    background: none; font-family: inherit; font-size: 12px; color: #000;
  }
  .folder-item:hover { border-color: #000080; background: rgba(0,0,128,0.15); }
  .folder-item img { image-rendering: pixelated; }
  .folder-item span { text-align: center; word-wrap: break-word; max-width: 70px; line-height: 1.1; }
  .empty-msg { padding: 16px; color: #808080; width: 100%; text-align: center; }

  .statusbar {
    display: flex; padding: 1px 4px; flex-shrink: 0; height: 18px;
    align-items: center;
    border-top: 2px solid #808080; border-left: 2px solid #808080;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
    margin: 0 2px 2px;
  }
  .status-text { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .ctx-overlay { position: fixed; inset: 0; z-index: 9999; }
  .ctx-menu {
    position: fixed; background: #c0c0c0;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    min-width: 120px; padding: 2px; box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .ctx-item { display: block; width: 100%; padding: 3px 16px; cursor: default; font-size: 13px; font-family: inherit; border: none; background: none; text-align: left; color: #000; }
  .ctx-item:hover { background: #000080; color: #fff; }
  .has-sub { position: relative; }
  .ctx-sub {
    display: none; position: absolute; left: 100%; top: 0;
    background: #c0c0c0;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    min-width: 120px; padding: 2px; box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .has-sub:hover > .ctx-sub { display: block; }
</style>