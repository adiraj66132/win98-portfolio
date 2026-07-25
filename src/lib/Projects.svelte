<script>
  import { showDialog, iconPath } from '../stores.js';

  const projects = [
    { iconNum: '30', name: 'Weather App', title: 'Weather App', desc: 'A clean weather interface with current conditions and forecasts.', tech: 'JavaScript, API' },
    { iconNum: '35', name: 'Todo List', title: 'Todo List', desc: 'Task management with categories, priorities, and local storage.', tech: 'JavaScript, LocalStorage' },
    { iconNum: '28', name: 'Chat App', title: 'Chat App', desc: 'Real-time chat with rooms, user presence, and message history.', tech: 'WebSocket, Node.js' },
    { iconNum: '20', name: 'Pixel Forge', title: 'Pixel Forge', desc: 'Pixel art editor with layers, animation timeline, and export.', tech: 'Canvas, JavaScript' },
    { iconNum: '29', name: 'Forum', title: 'Forum', desc: 'Community discussion platform with categories and threads.', tech: 'Full-Stack, Database' },
    { iconNum: '04', name: 'Mini Browser', title: 'Mini Browser', desc: 'Lightweight web browser with tabs and bookmark support.', tech: 'Electron, Web APIs' },
    { iconNum: '14', name: 'Hyprland Config', title: 'Hyprland Config', desc: 'Custom Hyprland window manager config with keybinds.', tech: 'Linux, Wayland' },
    { iconNum: '37', name: 'Arduino Projects', title: 'Arduino Projects', desc: 'Hardware projects with sensors, LEDs, and automation.', tech: 'Arduino, C++' },
  ];

  function openProject(p) {
    showDialog(`${p.title}\n\n${p.desc}\n\nTech: ${p.tech}`);
  }
</script>

<div class="folder-view">
  {#each projects as p}
    <button class="folder-item" on:dblclick={() => openProject(p)}>
      <img src={iconPath(p.iconNum)} alt="" width="32" height="32">
      <span>{p.name}</span>
    </button>
  {/each}
</div>

<style>
  .folder-view {
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    align-content: flex-start;
  }
  .folder-item {
    width: 74px;
    padding: 4px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    font-family: "VT323", monospace;
    font-size: 12px;
    color: #000;
  }
  .folder-item:hover { border-color: #000080; background: rgba(0,0,128,0.15); }
  .folder-item img { image-rendering: pixelated; }
  .folder-item span { text-align: center; word-wrap: break-word; max-width: 70px; line-height: 1.1; }
</style>
