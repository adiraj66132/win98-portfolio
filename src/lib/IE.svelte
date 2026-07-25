<script>
  import { onMount } from 'svelte';
  import { iconPath, windows } from '../stores.js';

  export let id;

  let url = 'https://en.wikipedia.org/wiki/Windows_98';
  let iframe;
  let loading = false;
  let blocked = false;
  let showFallback = false;
  let fallbackHtml = '';
  let errorMsg = '';
  let statusText = 'Ready';
  let fallbackData = null;
  let currentTarget = '';

  onMount(() => navigate(url));

  function parseWikiTitle(target) {
    const m = target.match(/wikipedia\.org\/wiki\/([^#?]+)/);
    return m ? decodeURIComponent(m[1].replace(/_/g, ' ')) : null;
  }

  function isOwnOrigin(target) {
    try {
      const targetUrl = new URL(target);
      return targetUrl.origin === location.origin;
    } catch { return false; }
  }

  function navigate(target) {
    target = target.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(
        target.charAt(0).toUpperCase() + target.slice(1)
      );
    }
    url = target;
    currentTarget = target;
    loading = true;
    blocked = false;
    showFallback = false;
    fallbackHtml = '';
    errorMsg = '';
    fallbackData = null;
    statusText = 'Loading...';

    if (isOwnOrigin(target)) {
      blocked = true;
      errorMsg = 'Cannot display this application within itself.';
      loading = false;
      statusText = 'Blocked';
      if (iframe) iframe.src = 'about:blank';
      return;
    }

    const title = parseWikiTitle(target);
    if (iframe) iframe.src = target;

    if (title) {
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) { fallbackData = data; if (blocked && !showFallback) { showFallback = true; renderFallback(data); statusText = 'Showing text version'; } } })
        .catch(() => {});
    }
  }

  function onIframeLoad() {
    loading = false;
    statusText = 'Done';
    if (!iframe) return;
    try {
      const href = iframe.contentWindow.location.href;
      if (href === 'about:blank') {
        blocked = true;
        errorMsg = 'This site refused to display in a frame due to X-Frame-Options or Content-Security-Policy restrictions.';
        statusText = 'Blocked';
        if (fallbackData) {
          showFallback = true;
          renderFallback(fallbackData);
          statusText = 'Showing text version';
        }
      }
    } catch {
      // Cross-origin page loaded successfully
    }
  }

  function onIframeError() {
    loading = false;
    blocked = true;
    errorMsg = 'The page could not be loaded. Check the address and try again.';
    statusText = 'Error';
    if (fallbackData) {
      showFallback = true;
      renderFallback(fallbackData);
      statusText = 'Showing text version';
    }
  }

  function renderFallback(data) {
    let html = '<div class="wiki-article">';
    html += '<h1 class="wiki-title">' + data.title + '</h1>';
    if (data.thumbnail) {
      html += '<img src="' + data.thumbnail.source + '" alt="' + data.title + '" class="wiki-img">';
    }
    if (data.description) {
      html += '<p class="wiki-desc"><i>' + data.description + '</i></p>';
    }
    html += '<div class="wiki-extract">' + (data.extract_html || data.extract) + '</div>';
    html += '<p class="wiki-footer"><a href="' + (data.content_urls?.desktop?.page || currentTarget) + '" target="_blank">View full article on Wikipedia &#8599;</a></p>';
    html += '</div>';
    fallbackHtml = html;
  }

  function go() { navigate(url); }
  function keydown(e) { if (e.key === 'Enter') go(); }
  function stop() { if (iframe) { iframe.src = 'about:blank'; } loading = false; statusText = 'Cancelled'; }
  function goBack() { try { iframe.contentWindow.history.back(); } catch {} }
  function goForward() { try { iframe.contentWindow.history.forward(); } catch {} }
</script>

<div class="ie">
  <div class="toolbar">
    <button class="nav-btn" on:click={goBack} disabled={!iframe} title="Back">◀</button>
    <button class="nav-btn" on:click={goForward} disabled={!iframe} title="Forward">▶</button>
    <button class="nav-btn" on:click={stop} title="Stop">✕</button>
    <button class="nav-btn" on:click={go} title="Refresh">↻</button>
    {#if loading}
      <div class="loader"></div>
    {/if}
  </div>
  <div class="url-bar">
    <span class="url-label">Address</span>
    <input type="text" bind:value={url} on:keydown={keydown} class="url-input">
    <button class="go-btn" on:click={go}>Go</button>
  </div>
  <div class="browser-body">
    {#if blocked}
      <div class="error-page">
        <div class="error-header">
          <img src={iconPath('04', 32)} alt="" width="32" height="32">
          <div>
            <h2>Cannot display the page</h2>
            <p class="error-reason">{errorMsg}</p>
          </div>
        </div>
        <hr class="error-hr">
        {#if showFallback && fallbackHtml}
          <div class="fallback-note">Wikipedia text version (page could not be embedded):</div>
          <div class="wiki-render">{@html fallbackHtml}</div>
        {:else}
          <div class="error-details">
            <p>The website refused to display in this browser window.</p>
            <p>Possible causes:</p>
            <ul>
              <li>X-Frame-Options restriction</li>
              <li>Content-Security-Policy frame-ancestors restriction</li>
              <li>The site requires a modern browser</li>
            </ul>
            <p>Try opening directly: <a href={currentTarget} target="_blank" class="error-link">{currentTarget}</a></p>
          </div>
        {/if}
      </div>
    {:else}
      <iframe
        bind:this={iframe}
        src="about:blank"
        class="ie-frame"
        title="browser"
        on:load={onIframeLoad}
        on:error={onIframeError}
      ></iframe>
    {/if}
  </div>
  <div class="statusbar">
    <span class="status-text">{statusText}</span>
    <span class="status-zone">Internet</span>
  </div>
</div>

<style>
  .ie {
    padding: 3px; font-size: 13px; display: flex; flex-direction: column; height: 100%;
  }
  .toolbar {
    display: flex; gap: 2px; margin-bottom: 3px; align-items: center;
  }
  .nav-btn {
    width: 24px; height: 22px; border: none;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    background: #c0c0c0; font-size: 11px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-family: "VT323", monospace;
  }
  .nav-btn:active {
    border-top: 2px solid #404040; border-left: 2px solid #404040;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
  }
  .nav-btn:disabled { opacity: 0.5; }
  .loader {
    width: 16px; height: 16px; margin-left: 4px;
    border: 2px solid #808080; border-top: 2px solid #000080; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .url-bar {
    border: 2px solid; border-top-color: #808080; border-left-color: #808080;
    border-bottom-color: #fff; border-right-color: #fff;
    padding: 2px 4px; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;
    background: #fff; height: 24px;
  }
  .url-label { flex-shrink: 0; font-size: 12px; }
  .url-input {
    border: 2px solid; border-top-color: #808080; border-left-color: #808080;
    border-bottom-color: #fff; border-right-color: #fff;
    flex: 1; padding: 1px 4px; font-family: "VT323", monospace; font-size: 13px; background: #fff; height: 18px;
  }
  .go-btn {
    padding: 1px 10px; border: none;
    border-top: 2px solid #fff; border-left: 2px solid #fff;
    border-bottom: 2px solid #404040; border-right: 2px solid #404040;
    background: #c0c0c0; font-family: "VT323", monospace; font-size: 12px; cursor: pointer; height: 20px;
  }
  .go-btn:active {
    border-top: 2px solid #404040; border-left: 2px solid #404040;
    border-bottom: 2px solid #fff; border-right: 2px solid #fff;
  }

  .browser-body {
    flex: 1; border: 2px solid; border-top-color: #808080; border-left-color: #808080;
    border-bottom-color: #fff; border-right-color: #fff;
    background: #fff; overflow: auto; position: relative;
  }
  .ie-frame { width: 100%; height: 100%; border: none; display: block; }

  .error-page { padding: 16px; font-family: "VT323", monospace; color: #000; }
  .error-header { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
  .error-header h2 { margin: 0 0 4px; font-size: 16px; }
  .error-reason { margin: 0; font-size: 13px; color: #333; }
  .error-hr { border: none; border-top: 1px solid #c0c0c0; margin: 12px 0; }
  .error-details { font-size: 13px; line-height: 1.5; }
  .error-details ul { margin: 4px 0 8px 20px; }
  .error-link { color: #00f; text-decoration: underline; }

  .fallback-note { font-size: 12px; color: #666; margin-bottom: 8px; font-style: italic; }

  .wiki-render { font-size: 14px; line-height: 1.5; }
  .wiki-render :global(.wiki-article) { max-width: 100%; }
  .wiki-render :global(.wiki-title) { font-size: 20px; margin: 0 0 8px; }
  .wiki-render :global(.wiki-img) { float: right; margin: 0 0 8px 8px; max-width: 200px; border: 1px solid #c0c0c0; }
  .wiki-render :global(.wiki-desc) { color: #555; margin: 0 0 12px; }
  .wiki-render :global(.wiki-extract) { margin-bottom: 12px; }
  .wiki-render :global(.wiki-extract p) { margin: 0 0 8px; }
  .wiki-render :global(.wiki-footer) { clear: both; border-top: 1px solid #c0c0c0; padding-top: 8px; }
  .wiki-render :global(.wiki-footer a) { color: #00f; text-decoration: underline; }

  .statusbar {
    display: flex; padding: 1px 4px; margin-top: 2px; flex-shrink: 0; height: 18px;
    align-items: center; border: 1px solid; border-top-color: #808080; border-left-color: #808080;
    border-bottom-color: #fff; border-right-color: #fff;
  }
  .status-text { flex: 1; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .status-zone { font-size: 12px; padding-left: 8px; border-left: 1px solid #808080; margin-left: 8px; }
</style>
