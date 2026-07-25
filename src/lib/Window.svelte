<script>
  import { focusWindow, closeWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize } from '../stores.js';

  export let id;
  export let data;

  let dragState = null;
  let resizeState = null;

  function onTitleMouseDown(e) {
    if (e.target.tagName === 'BUTTON') return;
    focusWindow(id);
    if (data.maximized) return;
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: data.x,
      origTop: data.y,
    };
    e.preventDefault();
  }

  function onResizeMouseDown(e) {
    focusWindow(id);
    if (data.maximized) return;
    resizeState = {
      startX: e.clientX,
      startY: e.clientY,
      origW: data.width,
      origH: data.height,
    };
    e.preventDefault();
    e.stopPropagation();
  }

  function onMouseMove(e) {
    if (dragState) {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      updatePosition(id, dragState.origLeft + dx, dragState.origTop + dy);
    }
    if (resizeState) {
      const dx = e.clientX - resizeState.startX;
      const dy = e.clientY - resizeState.startY;
      updateSize(id, Math.max(200, resizeState.origW + dx), Math.max(120, resizeState.origH + dy));
    }
  }

  function onMouseUp() {
    dragState = null;
    resizeState = null;
  }

  function onTitleDblClick(e) {
    if (e.target.tagName === 'BUTTON') return;
    maximizeWindow(id);
  }

  $: isActive = data.z >= 100;
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div
  class="win"
  class:maximized={data.maximized}
  class:minimized={data.minimized}
  class:inactive={!isActive}
  style="left:{data.x}px; top:{data.y}px; width:{data.width}px; height:{data.height}px; z-index:{data.z};"
  on:mousedown={() => focusWindow(id)}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="titlebar" on:mousedown={onTitleMouseDown} on:dblclick={onTitleDblClick}>
    <img class="titlebar-icon" src="/icons/{data.iconNum || '01'}.png" alt="" width="16" height="16">
    <span class="titlebar-text">{data.title}</span>
    <div class="titlebar-btns">
      <button class="tbtn" on:click|stopPropagation={() => minimizeWindow(id)}>
        <span class="tbtn-inner">_</span>
      </button>
      <button class="tbtn" on:click|stopPropagation={() => maximizeWindow(id)}>
        <span class="tbtn-inner">{data.maximized ? '❐' : '□'}</span>
      </button>
      <button class="tbtn tbtn-close" on:click|stopPropagation={() => closeWindow(id)}>
        <span class="tbtn-inner">✕</span>
      </button>
    </div>
  </div>

  <div class="menubar">
    <span class="menu-item">File</span>
    <span class="menu-item">Edit</span>
    <span class="menu-item">View</span>
    <span class="menu-item">Help</span>
  </div>

  <div class="body">
    <slot />
  </div>

  <div class="statusbar">
    <div class="status-section">Ready</div>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="resize-handle" on:mousedown={onResizeMouseDown}></div>
</div>

<style>
  .win {
    position: absolute;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    min-width: 200px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    font-family: "VT323", monospace;
    font-size: 13px;
  }
  .win.maximized {
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: calc(100vh - 30px) !important;
    border: none;
  }
  .win.minimized { display: none; }

  .titlebar {
    display: flex;
    align-items: center;
    padding: 1px 2px;
    background: linear-gradient(90deg, #000080, #1084d0);
    color: #fff;
    font-weight: bold;
    font-size: 13px;
    gap: 3px;
    cursor: default;
    flex-shrink: 0;
    height: 20px;
  }
  .inactive .titlebar {
    background: linear-gradient(90deg, #808080, #b0b0b0);
  }
  .titlebar-icon { image-rendering: pixelated; flex-shrink: 0; }
  .titlebar-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 2px; }

  .titlebar-btns { display: flex; gap: 2px; flex-shrink: 0; }
  .tbtn {
    width: 16px;
    height: 14px;
    border: none;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    border-bottom: 1px solid #404040;
    border-right: 1px solid #404040;
    background: #c0c0c0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    color: #000;
    font-size: 10px;
    font-family: "VT323", monospace;
  }
  .tbtn:active {
    border-top: 1px solid #404040;
    border-left: 1px solid #404040;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
  }
  .tbtn-inner { pointer-events: none; font-size: 11px; line-height: 1; }

  .menubar {
    display: flex;
    padding: 0;
    border-bottom: 1px solid #808080;
    flex-shrink: 0;
    height: 18px;
    align-items: center;
  }
  .menubar .menu-item {
    padding: 1px 6px;
    cursor: pointer;
    font-size: 13px;
  }
  .menubar .menu-item:hover { background: #000080; color: #fff; }

  .body {
    flex: 1;
    overflow: auto;
    background: #fff;
    border: 2px solid #808080;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    margin: 0 2px;
  }

  .statusbar {
    display: flex;
    padding: 1px 2px;
    flex-shrink: 0;
    height: 18px;
    align-items: center;
  }
  .status-section {
    border: 1px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    padding: 0 4px;
    flex: 1;
    font-size: 12px;
    height: 14px;
    line-height: 14px;
  }

  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
    background: linear-gradient(135deg, transparent 30%, #808080 30%, #808080 35%, transparent 35%, transparent 50%, #808080 50%, #808080 55%, transparent 55%, transparent 70%, #808080 70%, #808080 75%, transparent 75%);
  }
</style>
