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
  let date = '';
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    time = `${h}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`;
    date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
</script>

<div class="taskbar">
  <button class="start-btn" on:click>
    <div class="start-flag">
      <div class="flag-stripe red"></div>
      <div class="flag-stripe green"></div>
      <div class="flag-stripe blue"></div>
      <div class="flag-stripe yellow"></div>
    </div>
    <span class="start-text">Start</span>
  </button>
  <div class="sep"></div>
  <div class="task-buttons">
    {#each taskList as t (t.id)}
      <button class="task-btn" class:active={t.active} on:click={() => handleClick(t.id)}>
        <img class="task-icon" src="/icons/{t.iconNum || '01'}-16.png" alt="" width="16" height="16">
        <span class="task-title">{t.title}</span>
      </button>
    {/each}
  </div>
  <div class="tray">
    <svg class="tray-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="3" height="6" fill="#000"/>
      <polygon points="4,5 8,1 8,15 4,11" fill="#000"/>
      <polygon points="9,3 13,1 13,15 9,13" fill="none" stroke="#000" stroke-width="1"/>
      <rect x="10" y="5" width="1" height="6" fill="#000"/>
    </svg>
    <div class="clock" title={date}>{time}</div>
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
  .start-flag {
    width: 16px;
    height: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    flex-shrink: 0;
  }
  .flag-stripe { border: 0.5px solid rgba(0,0,0,0.2); }
  .red { background: #ff0000; }
  .green { background: #00aa00; }
  .blue { background: #0000ff; }
  .yellow { background: #ffaa00; }
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
    cursor: default;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
    min-width: 0;
    flex-shrink: 1;
  }
  .task-btn:hover:not(.active) {
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #808080;
    border-right: 2px solid #808080;
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
    white-space: nowrap;
  }
</style>
