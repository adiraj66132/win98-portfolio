<script>
  import { windows, windowOrder, minimizeWindow, restoreWindow, focusWindow } from '../stores.js';

  $: taskList = $windowOrder
    .filter(id => $windows[id])
    .map(id => ({
      id,
      title: $windows[id].title,
      icon: $windows[id].icon,
      iconNum: $windows[id].iconNum,
      active: $windows[id].z === Math.max(...$windowOrder.filter(i => $windows[i]).map(i => $windows[i].z)),
      minimized: $windows[id].minimized,
    }));

  function handleClick(id) {
    const w = $windows[id];
    if (w.minimized) restoreWindow(id);
    else if (w.z === Math.max(...$windowOrder.filter(i => $windows[i]).map(i => $windows[i].z))) minimizeWindow(id);
    else focusWindow(id);
  }

  let time = '';
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    time = `${h}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
</script>

<div class="taskbar">
  <button class="start-btn" on:click>
    <img class="start-flag" src="/icons/01.png" alt="" width="16" height="16">
    <span class="start-text">Start</span>
  </button>
  <div class="sep"></div>
  <div class="task-buttons">
    {#each taskList as t (t.id)}
      <button class="task-btn" class:active={t.active} on:click={() => handleClick(t.id)}>
        <img class="task-icon" src="/icons/{t.iconNum || '01'}.png" alt="" width="16" height="16">
        <span class="task-title">{t.title}</span>
      </button>
    {/each}
  </div>
  <div class="tray">
    <img class="tray-icon" src="/icons/38.png" alt="" width="16" height="16">
    <div class="clock">{time}</div>
  </div>
</div>

<style>
  .taskbar {
    height: 30px;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    display: flex;
    align-items: center;
    padding: 2px 3px;
    position: relative;
    z-index: 9000;
    gap: 2px;
    flex-shrink: 0;
  }
  .start-btn {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 1px 5px;
    height: 24px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-family: "VT323", monospace;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    flex-shrink: 0;
  }
  .start-btn:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    padding: 2px 4px 0 6px;
  }
  .start-flag { image-rendering: pixelated; }
  .start-text { letter-spacing: 0.5px; }
  .sep {
    width: 2px;
    height: 22px;
    border-left: 1px solid #808080;
    border-right: 1px solid #fff;
    margin: 0 1px;
    flex-shrink: 0;
  }
  .task-buttons {
    display: flex;
    flex: 1;
    gap: 2px;
    overflow: hidden;
    min-width: 0;
  }
  .task-btn {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    height: 24px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-family: "VT323", monospace;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
    min-width: 0;
    flex-shrink: 1;
  }
  .task-btn.active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    background: repeating-conic-gradient(#c0c0c0 0% 25%, #fff 0% 50%) 50% / 2px 2px;
    font-weight: bold;
  }
  .task-icon { image-rendering: pixelated; flex-shrink: 0; }
  .task-title { overflow: hidden; text-overflow: ellipsis; }
  .tray {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 1px 8px;
    height: 24px;
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    margin-left: auto;
    flex-shrink: 0;
  }
  .tray-icon { image-rendering: pixelated; }
  .clock {
    font-size: 13px;
    font-family: "VT323", monospace;
  }
</style>
