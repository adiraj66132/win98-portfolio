<div class="ie">
  <div class="ie-header">
    <img src="/icons/04.png" alt="" width="32" height="32">
    <h2>Internet Explorer</h2>
  </div>
  <p class="subtitle">This page cannot be displayed.</p>
  <div class="url-bar">
    <span>Address:</span>
    <input type="text" value="http://www.microsoft.com" readonly>
    <button class="win-btn">Go</button>
  </div>
  <div class="ie-page">
    <p>⚠️ <b>The page you are looking for is currently unavailable.</b></p>
    <p class="dim">The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
    <hr>
    <p class="dim small">Please try the following:</p>
    <ul class="dim small">
      <li>Click the Refresh button</li>
      <li>Check your connection settings</li>
      <li>Visit the portfolio instead! 😉</li>
    </ul>
  </div>
</div>

<style>
  .ie {
    padding: 12px;
    text-align: center;
    font-size: 13px;
  }
  .ie-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .ie-header img { image-rendering: pixelated; }
  h2 { color: #000080; font-size: 16px; }
  .subtitle { color: #808080; margin-bottom: 12px; }
  .url-bar {
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    padding: 3px 6px;
    margin-bottom: 12px;
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
  .ie-page {
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    padding: 16px;
    background: #fff;
    text-align: left;
  }
  .dim { color: #808080; }
  .small { font-size: 12px; }
  hr { margin: 10px 0; border: none; border-top: 1px solid #808080; border-bottom: 1px solid #fff; }
  ul { margin-left: 16px; margin-top: 4px; }
</style>
