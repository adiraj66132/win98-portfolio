<script>
  import { shutdownPhase, confirmShutdown, cancelShutdown } from '../stores.js';
</script>

{#if $shutdownPhase === 'confirm'}
  <div class="overlay">
    <div class="dialog">
      <div class="titlebar">
        <span>Shut Down Windows</span>
      </div>
      <div class="body">
        <div class="icon-area">
          <div class="win-logo">
            <div class="flag">
              <div class="stripe red"></div>
              <div class="stripe green"></div>
              <div class="stripe blue"></div>
              <div class="stripe yellow"></div>
            </div>
          </div>
        </div>
        <div class="content">
          <p>What do you want the computer to do?</p>
          <div class="options">
            <label class="option">
              <input type="radio" name="shutdown" value="shutdown" checked>
              <span>Shut down the computer?</span>
            </label>
            <label class="option">
              <input type="radio" name="shutdown" value="restart">
              <span>Restart the computer?</span>
            </label>
            <label class="option">
              <input type="radio" name="shutdown" value="restart-dos">
              <span>Restart the computer in MS-DOS mode?</span>
            </label>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="win-btn" on:click={confirmShutdown}>Yes</button>
        <button class="win-btn" on:click={cancelShutdown}>No</button>
        <button class="win-btn" on:click={cancelShutdown}>Help</button>
      </div>
    </div>
  </div>

{:else if $shutdownPhase === 'shutting-down'}
  <div class="shutdown-screen">
    <div class="shutdown-inner">
      <div class="win-logo">
        <div class="flag">
          <div class="stripe red"></div>
          <div class="stripe green"></div>
          <div class="stripe blue"></div>
          <div class="stripe yellow"></div>
        </div>
      </div>
      <div class="shutdown-text">Windows is shutting down...</div>
    </div>
  </div>

{:else if $shutdownPhase === 'safe-to-turn-off'}
  <div class="off-screen">
    <div class="off-text">It is now safe to turn off your computer.</div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
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
    width: 420px;
  }
  .titlebar {
    display: flex;
    align-items: center;
    padding: 1px 3px;
    background: linear-gradient(90deg, #000080, #1084d0);
    color: #fff;
    font-weight: bold;
    height: 20px;
    font-size: 13px;
  }
  .body {
    display: flex;
    gap: 16px;
    padding: 16px;
    align-items: flex-start;
  }
  .icon-area {
    flex-shrink: 0;
  }
  .win-logo .flag {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    width: 40px;
  }
  .flag .stripe { width: 18px; height: 18px; border: 0.5px solid rgba(0,0,0,0.2); }
  .red { background: #ff0000; }
  .green { background: #00aa00; }
  .blue { background: #0000ff; }
  .yellow { background: #ffaa00; }
  .content { flex: 1; font-size: 13px; }
  .content p { margin-bottom: 12px; }
  .options { display: flex; flex-direction: column; gap: 6px; }
  .option { display: flex; align-items: center; gap: 6px; cursor: pointer; }
  .option input { cursor: pointer; }
  .buttons {
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

  .shutdown-screen {
    position: fixed;
    inset: 0;
    background: #008080;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-in;
  }
  .shutdown-inner {
    text-align: center;
  }
  .shutdown-inner .win-logo .flag {
    width: 60px;
    margin: 0 auto 16px;
  }
  .shutdown-inner .flag .stripe { width: 28px; height: 28px; }
  .shutdown-text {
    font-size: 18px;
    color: #fff;
    text-shadow: 1px 1px 0 #000;
  }

  .off-screen {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease-in;
  }
  .off-text {
    font-family: "VT323", monospace;
    font-size: 24px;
    color: #ff8800;
    text-shadow: 0 0 8px rgba(255,136,0,0.4);
    letter-spacing: 1px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
