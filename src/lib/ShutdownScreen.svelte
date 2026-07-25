<script>
  import { shutdownPhase, confirmShutdown, cancelShutdown, restartDesktop, iconPath } from '../stores.js';

  let choice = 'shutdown';

  function handleKeydown(e) {
    if ($shutdownPhase !== 'confirm') return;
    if (e.key === 'Enter') confirmShutdown();
    if (e.key === 'Escape') cancelShutdown();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $shutdownPhase === 'confirm'}
  <div class="overlay">
    <div class="sd-dialog">
      <div class="sd-titlebar">
        <img class="sd-icon" src="/Windows%2098%20icons/shut_down_normal-0.png" alt="" width="16" height="16">
        <span>Shut Down Windows</span>
      </div>
      <div class="sd-body">
        <div class="sd-logo">
          <img src={iconPath('14')} alt="" width="48" height="48">
        </div>
        <div class="sd-content">
          <p class="sd-question">What do you want the computer to do?</p>
          <label class="sd-option">
            <input type="radio" name="shutdown" value="shutdown" bind:group={choice} checked>
            <span>Shut down the computer?</span>
          </label>
          <label class="sd-option">
            <input type="radio" name="shutdown" value="restart" bind:group={choice}>
            <span>Restart the computer?</span>
          </label>
          <label class="sd-option">
            <input type="radio" name="shutdown" value="restart-dos" bind:group={choice}>
            <span>Restart the computer in MS-DOS mode?</span>
          </label>
        </div>
      </div>
      <div class="sd-buttons">
        <button class="sd-btn sd-btn-default" on:click={confirmShutdown}>Yes</button>
        <button class="sd-btn" on:click={cancelShutdown}>No</button>
        <button class="sd-btn" on:click={cancelShutdown}>Help</button>
      </div>
    </div>
  </div>

{:else if $shutdownPhase === 'shutting-down'}
  <div class="shutdown-screen">
    <div class="shutdown-inner">
      <img src={iconPath('14', 48)} alt="" width="64" height="64" class="shutdown-logo">
      <div class="shutdown-text">Windows is shutting down...</div>
      <div class="shutdown-dots">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </div>
  </div>

{:else if $shutdownPhase === 'safe-to-turn-off'}
  <div class="off-screen">
    <div class="off-inner">
      <div class="off-logo">
        <img src={iconPath('14')} alt="" width="32" height="32" style="opacity:0.3;">
      </div>
      <div class="off-text">It is now safe to turn off your computer.</div>
      <button class="restart-btn" on:click={restartDesktop}>Restart</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.3);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
  }
  .sd-dialog {
    background: #c0c0c0;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    width: 400px; box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
  }
  .sd-titlebar {
    display: flex; align-items: center; gap: 4px; padding: 2px 3px;
    background: linear-gradient(90deg, #000080, #1084d0); color: #fff;
    font-weight: bold; height: 22px; font-size: 13px;
  }
  .sd-icon { flex-shrink: 0; }
  .sd-body {
    display: flex; gap: 16px; padding: 16px 16px 8px; align-items: flex-start;
  }
  .sd-logo { flex-shrink: 0; }
  .sd-content { flex: 1; font-size: 13px; }
  .sd-question { margin: 0 0 12px; }
  .sd-option { display: flex; align-items: center; gap: 6px; cursor: pointer; margin-bottom: 6px; }
  .sd-option input { cursor: pointer; width: 14px; height: 14px; }
  .sd-buttons {
    display: flex; justify-content: center; gap: 8px; padding: 8px 16px 14px;
  }
  .sd-btn {
    padding: 2px 24px; min-width: 75px; height: 24px;
    border: none;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    background: #c0c0c0; font-family: "VT323", monospace; font-size: 13px; cursor: pointer;
  }
  .sd-btn:active {
    border-top: 2px solid #404040; border-left: 2px solid #404040;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
  }
  .sd-btn-default {
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #808080; border-right: 2px solid #808080;
    font-weight: bold;
  }

  .shutdown-screen {
    position: fixed; inset: 0; background: #008080;
    z-index: 10000; display: flex; align-items: center; justify-content: center;
  }
  .shutdown-inner { text-align: center; }
  .shutdown-logo { margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto; }
  .shutdown-text {
    font-size: 20px; color: #fff; text-shadow: 1px 1px 0 #000;
    animation: blink 1s ease-in-out infinite alternate;
  }
  @keyframes blink {
    from { opacity: 1; } to { opacity: 0.3; }
  }
  .shutdown-dots { margin-top: 12px; display: flex; gap: 6px; justify-content: center; }
  .dot {
    width: 8px; height: 8px; background: #fff; border-radius: 50%;
    animation: dotAnim 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  .dot:nth-child(3) { }
  @keyframes dotAnim {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.6); }
    40% { opacity: 1; transform: scale(1); }
  }

  .off-screen {
    position: fixed; inset: 0; background: #000;
    z-index: 10001; display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.8s ease-in;
  }
  .off-inner { text-align: center; }
  .off-logo { margin-bottom: 16px; }
  .off-logo svg { opacity: 0.3; }
  .off-text {
    font-family: "VT323", monospace; font-size: 22px; color: #ff8800;
    text-shadow: 0 0 10px rgba(255,136,0,0.5);
    letter-spacing: 1px; margin-bottom: 24px;
  }
  .restart-btn {
    padding: 4px 24px; border: 2px solid #ff8800; background: transparent;
    color: #ff8800; font-family: "VT323", monospace; font-size: 14px;
    cursor: pointer; letter-spacing: 1px;
  }
  .restart-btn:hover { background: rgba(255,136,0,0.15); }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
