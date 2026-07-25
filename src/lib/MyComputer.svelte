<script>
  import { openWindow, iconPath } from '../stores.js';
</script>

<div class="folder-view">
  <button class="folder-item" on:dblclick={() => openWindow('projects', { title: 'Projects', icon: 'Projects', iconNum: '07', width: 540, height: 420 })}>
    <img src={iconPath('07')} alt="" width="32" height="32">
    <span>Projects</span>
  </button>
  <button class="folder-item" on:dblclick={() => openWindow('resume', { title: 'Resume', icon: 'Resume', iconNum: '16', width: 500, height: 460 })}>
    <img src={iconPath('16')} alt="" width="32" height="32">
    <span>Resume.doc</span>
  </button>
  <button class="folder-item">
    <img src={iconPath('17')} alt="" width="32" height="32">
    <span>Printers</span>
  </button>
  <button class="folder-item">
    <img src={iconPath('33')} alt="" width="32" height="32">
    <span>CD Drive (D:)</span>
  </button>
  <button class="folder-item">
    <img src={iconPath('33')} alt="" width="32" height="32">
    <span>3½ Floppy (A:)</span>
  </button>
  <button class="folder-item">
    <img src={iconPath('12')} alt="" width="32" height="32">
    <span>Local Disk (C:)</span>
  </button>
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
