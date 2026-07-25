<script>
  import { iconPath } from '../stores.js';
  let url = 'https://wiby.me';
  let iframe;
  function go() {
    let target = url.trim();
    if (target && !target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    if (target && iframe) iframe.src = target;
  }
  function keydown(e) { if (e.key === 'Enter') go(); }
</script>

<div class="ie">
  <div class="toolbar">
    <button class="nav-btn" on:click={() => iframe && iframe.contentWindow.history.back()}>◀</button>
    <button class="nav-btn" on:click={() => iframe && iframe.contentWindow.history.forward()}>▶</button>
    <button class="nav-btn" on:click={go}>↻</button>
  </div>
  <div class="url-bar">
    <span>Address:</span>
    <input type="text" bind:value={url} on:keydown={keydown}>
    <button class="win-btn" on:click={go}>Go</button>
  </div>
  <iframe bind:this={iframe} src={url} class="ie-frame" title="browser"></iframe>
</div>

<style>
  .ie {
    padding: 4px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .toolbar {
    display: flex;
    gap: 2px;
    margin-bottom: 4px;
  }
  .nav-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nav-btn:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
  }
  .url-bar {
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    padding: 3px 6px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #fff;
  }
  .url-bar span { flex-shrink: 0; font-size: 12px; }
  .url-bar input {
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    flex: 1;
    padding: 1px 4px;
    font-family: "VT323", monospace;
    font-size: 13px;
    background: #fff;
  }
  .win-btn {
    padding: 1px 12px;
    border: none;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    background: #c0c0c0;
    font-family: "VT323", monospace;
    font-size: 13px;
    cursor: pointer;
    height: 22px;
  }
  .win-btn:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
  }
  .ie-frame {
    flex: 1;
    width: 100%;
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    background: #fff;
  }
</style>
