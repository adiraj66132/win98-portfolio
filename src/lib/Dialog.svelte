<script>
  import { dialog, closeDialog, iconPath } from '../stores.js';
</script>

{#if $dialog.visible}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="overlay" on:click|self={closeDialog}>
    <div class="dialog">
      <div class="dialog-titlebar">
        <span class="titlebar-text">{$dialog.title}</span>
        <button class="close-btn" on:click={closeDialog}>✕</button>
      </div>
      <div class="dialog-body">
        <img class="dialog-icon" src={iconPath('13', 16)} alt="" width="32" height="32">
        <div class="dialog-text">{$dialog.text}</div>
      </div>
      <div class="dialog-buttons">
        <button class="win-btn" on:click={closeDialog}>OK</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog {
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    min-width: 340px;
    max-width: 440px;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .dialog-titlebar {
    display: flex;
    align-items: center;
    padding: 1px 2px;
    background: linear-gradient(90deg, #000080, #1084d0);
    color: #fff;
    font-weight: bold;
    height: 20px;
    font-size: 13px;
    gap: 4px;
  }
  .titlebar-text { flex: 1; padding-left: 2px; }
  .close-btn {
    width: 16px;
    height: 14px;
    border: none;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    border-bottom: 1px solid #404040;
    border-right: 1px solid #404040;
    background: #c0c0c0;
    color: #000;
    font-size: 9px;
    font-family: "VT323", monospace;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .close-btn:active {
    border-top: 1px solid #404040;
    border-left: 1px solid #404040;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
  }
  .dialog-body {
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .dialog-icon { flex-shrink: 0; }
  .dialog-text { flex: 1; line-height: 1.4; white-space: pre-line; font-size: 13px; }
  .dialog-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 4px 16px 12px;
  }
  .win-btn {
    padding: 2px 20px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-family: "VT323", monospace;
    font-size: 13px;
    cursor: pointer;
    min-width: 80px;
    height: 24px;
  }
  .win-btn:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
  }
  .win-btn:focus {
    outline: 1px dotted #000;
    outline-offset: -4px;
  }
</style>
