<script>
  import { createFolder, createFile, deleteItem, listDir, openWindow, iconPath, readFile } from '../stores.js';
  import { setClipboard } from './clipboard.js';

  export let id;

  let currentPath = '/';
  let items = [];
  let showCtx = false;
  let ctxItem = null;
  let ctxX = 0, ctxY = 0;

  function refresh() {
    items = listDir(currentPath);
  }
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

  function hideCtx() { showCtx = false; }

  function doNewFolder() {
    const name = prompt('Folder name:');
    if (name) { createFolder((currentPath === '/' ? '' : currentPath) + '/' + name); refresh(); }
    hideCtx();
  }

  function doNewFile() {
    const name = prompt('File name:');
    if (name) { createFile((currentPath === '/' ? '' : currentPath) + '/' + name, ''); refresh(); }
    hideCtx();
  }

  function doDelete() {
    if (ctxItem && confirm('Delete "' + ctxItem.name + '"?')) { deleteItem(ctxItem.path); refresh(); }
    hideCtx();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div class="explorer" on:contextmenu={onBgCtx} on:click={hideCtx}>
  <div class="addr-bar">
    <button class="up-btn" on:click={goUp} disabled={currentPath === '/'}>Up</button>
    <span class="addr-path">C:{currentPath === '/' ? '\\' : currentPath.replace(/\//g, '\\')}</span>
  </div>
  <div class="folder-view">
    {#if currentPath !== '/'}
      <button class="folder-item" on:dblclick={goUp}>
        <img src={iconPath('07')} alt="" width="32" height="32">
        <span>..</span>
      </button>
    {/if}
    {#each items as item (item.path)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
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
</div>

{#if showCtx}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
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
  .explorer { height: 100%; display: flex; flex-direction: column; background: #fff; }
  .addr-bar {
    display: flex; align-items: center; gap: 4px; padding: 3px 4px;
    background: #c0c0c0; border-bottom: 1px solid #808080; flex-shrink: 0;
  }
  .up-btn {
    padding: 1px 6px; cursor: pointer; font-family: "VT323", monospace; font-size: 13px;
    border-top: 1px solid #fff; border-left: 1px solid #fff;
    border-bottom: 1px solid #404040; border-right: 1px solid #404040;
    background: #c0c0c0;
  }
  .up-btn:active { border-top: 1px solid #404040; border-left: 1px solid #404040; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }
  .up-btn:disabled { color: #808080; }
  .addr-path { font-size: 13px; padding: 1px 4px; flex: 1; }
  .folder-view {
    flex: 1; padding: 4px; display: flex; flex-wrap: wrap; gap: 2px;
    align-content: flex-start; overflow: auto;
  }
  .folder-item {
    width: 74px; padding: 4px 2px; display: flex; flex-direction: column;
    align-items: center; gap: 2px; cursor: pointer; border: 1px solid transparent;
    background: none; font-family: "VT323", monospace; font-size: 12px; color: #000;
  }
  .folder-item:hover { border-color: #000080; background: rgba(0,0,128,0.15); }
  .folder-item img { image-rendering: pixelated; }
  .folder-item span { text-align: center; word-wrap: break-word; max-width: 70px; line-height: 1.1; }
  .empty-msg { padding: 16px; color: #808080; font-size: 13px; width: 100%; text-align: center; }
  .ctx-overlay { position: fixed; inset: 0; z-index: 9999; }
  .ctx-menu {
    position: fixed; background: #c0c0c0;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    min-width: 120px; padding: 2px; box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .ctx-item {
    display: block; width: 100%; position: relative;
    padding: 3px 16px; cursor: default; font-size: 13px;
    font-family: "VT323", monospace; border: none; background: none;
    text-align: left; color: #000;
  }
  .ctx-item:hover { background: #000080; color: #fff; }
  .ctx-sub {
    display: none; position: absolute; left: 100%; top: 0;
    background: #c0c0c0;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    min-width: 120px; padding: 2px; box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .ctx-item:hover > .ctx-sub { display: block; }
  .ctx-sub { z-index: 10; }
</style>
