<script>
  import { onMount } from 'svelte';
  import { showDialog, closeWindow } from '../stores.js';

  export let id;

  let canvas;
  let ctx;
  let tool = 'pencil';
  let fgColor = '#000000';
  let bgColor = '#ffffff';
  let lineSize = 0;
  let drawing = false;
  let startX, startY, lastX, lastY;
  let savedImg = null;
  let openMenu = null;
  let statusText = 'Draws a free-form line one pixel wide.';
  let cw = 640, ch = 480;
  let zoom = 1;
  let imageStore = null;

  let polyPts = [];
  let curvePhase = 0;
  let curveP1 = null;
  let freePts = [];

  const COLORS = [
    '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
    '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff',
    '#c08080','#408080','#ff8000','#80ff00','#00ff80','#0080ff','#8000ff','#ff0080',
    '#804000','#400080','#008040','#004080',
  ];

  const SIZES = [1, 2, 4, 6, 8];
  const SIZE_LABELS = ['1px','2px','4px','6px','8px'];
  const ERASER_SIZES = [4, 8, 12, 16, 20];

  const TOOL_LIST = [
    ['free-sel',    'rect-sel'],
    ['eraser',      'fill'],
    ['picker',      'zoom'],
    ['pencil',      'brush'],
    ['airbrush',    'text'],
    ['line',        'curve'],
    ['rect',        'poly'],
    ['ellipse',     'rrect'],
  ];

  const STATUS_MAP = {
    'pencil': 'Draws a free-form line one pixel wide.',
    'brush': 'Draws using the selected brush shape and size.',
    'eraser': 'Erases a portion of the picture.',
    'fill': 'Fills an area with the current foreground color.',
    'picker': 'Picks a color from the picture.',
    'zoom': 'Zooms the picture in or out.',
    'line': 'Draws a straight line.',
    'rect': 'Draws a rectangle.',
    'ellipse': 'Draws an ellipse.',
    'rrect': 'Draws a rounded rectangle.',
    'airbrush': 'Draws using an airbrush.',
    'text': 'Inserts text.',
    'curve': 'Draws a curved line.',
    'poly': 'Draws a polygon.',
    'free-sel': 'Selects a free-form part.',
    'rect-sel': 'Selects a rectangular part.',
  };

  const MENU_ITEMS = {
    'File': [
      { l: 'New', a: 'new' },
      { l: 'Open...', a: 'open' },
      { l: 'Save', a: 'save' },
      { l: 'Save As...', a: 'saveas' },
      { t: 'sep' },
      { l: 'Exit', a: 'exit' },
    ],
    'Edit': [
      { l: 'Undo', a: 'undo', d: true },
      { t: 'sep' },
      { l: 'Cut', a: 'cut', d: true },
      { l: 'Copy', a: 'copy', d: true },
      { l: 'Paste', a: 'paste', d: true },
      { t: 'sep' },
      { l: 'Select All', a: 'selall' },
    ],
    'View': [
      { l: 'Tool Box', a: 'tbtog', c: true },
      { l: 'Color Box', a: 'cbtog', c: true },
      { l: 'Status Bar', a: 'sbtog', c: true },
      { t: 'sep' },
      { l: 'Normal Size', a: 'z1' },
      { l: 'Large Size', a: 'z2' },
    ],
    'Image': [
      { l: 'Invert Colors', a: 'invert' },
      { l: 'Clear Image', a: 'clear' },
    ],
    'Help': [
      { l: 'About Paint', a: 'about' },
    ],
  };

  let showTB = true, showCB = true, showSB = true;

  onMount(() => {
    ctx = canvas.getContext('2d');
    initCanvas();
  });

  function initCanvas() {
    canvas.width = cw;
    canvas.height = ch;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function scPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom };
  }

  function setStroke(t) {
    ctx.strokeStyle = t === 'eraser' || t === 'eraser-line' ? bgColor : fgColor;
    ctx.fillStyle = fgColor;
    if (t === 'pencil') ctx.lineWidth = 1;
    else if (t === 'eraser') ctx.lineWidth = ERASER_SIZES[lineSize] || 8;
    else ctx.lineWidth = SIZES[lineSize];
  }

  function startDraw(e) {
    const p = scPos(e);
    startX = p.x; startY = p.y; lastX = p.x; lastY = p.y;

    if (tool === 'picker') {
      const d = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
      fgColor = '#' + [d[0],d[1],d[2]].map(v => v.toString(16).padStart(2,'0')).join('');
      return;
    }
    if (tool === 'fill') { floodFill(Math.round(p.x), Math.round(p.y), fgColor); return; }
    if (tool === 'zoom') { zoom = zoom === 1 ? 2 : 1; resizeZoom(); return; }
    if (tool === 'text') {
      const t = prompt('Text:');
      if (t) { ctx.fillStyle = fgColor; ctx.font = '12px VT323,monospace'; ctx.fillText(t, p.x, p.y + 12); syncStore(); }
      return;
    }

    if (tool === 'curve') {
      if (curvePhase === 0) {
        savedImg = ctx.getImageData(0, 0, cw, ch);
        curveP1 = { x: p.x, y: p.y };
        curvePhase = 1;
        statusText = 'Click end point, then drag to curve.';
        return;
      }
      if (curvePhase === 1) {
        ctx.putImageData(savedImg, 0, 0);
        ctx.strokeStyle = fgColor; ctx.lineWidth = SIZES[lineSize];
        ctx.beginPath(); ctx.moveTo(curveP1.x, curveP1.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        savedImg = ctx.getImageData(0, 0, cw, ch);
        startX = p.x; startY = p.y;
        curvePhase = 2;
        statusText = 'Click and drag to bend the curve.';
        return;
      }
      if (curvePhase === 2) {
        savedImg = ctx.getImageData(0, 0, cw, ch);
        drawing = true;
        return;
      }
    }

    if (tool === 'poly') {
      polyPts.push({ x: p.x, y: p.y });
      if (polyPts.length === 1) {
        savedImg = ctx.getImageData(0, 0, cw, ch);
        statusText = 'Click to add points, double-click to finish.';
        return;
      }
      ctx.putImageData(savedImg, 0, 0);
      ctx.strokeStyle = fgColor; ctx.lineWidth = SIZES[lineSize];
      ctx.beginPath();
      ctx.moveTo(polyPts[0].x, polyPts[0].y);
      for (let i = 1; i < polyPts.length; i++) ctx.lineTo(polyPts[i].x, polyPts[i].y);
      ctx.stroke();
      savedImg = ctx.getImageData(0, 0, cw, ch);
      return;
    }

    if (tool === 'free-sel') {
      savedImg = ctx.getImageData(0, 0, cw, ch);
      freePts = [{ x: p.x, y: p.y }];
      drawing = true;
      ctx.strokeStyle = fgColor; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      return;
    }

    drawing = true;
    savedImg = ctx.getImageData(0, 0, cw, ch);
    setStroke(tool);

    if (['pencil','brush','eraser'].includes(tool)) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
  }

  function moveDraw(e) {
    if (!drawing) return;
    const p = scPos(e);
    statusText = Math.round(p.x) + ',' + Math.round(p.y);

    if (tool === 'free-sel') {
      freePts.push({ x: p.x, y: p.y });
      ctx.putImageData(savedImg, 0, 0);
      ctx.strokeStyle = '#000080'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(freePts[0].x, freePts[0].y);
      for (let i = 1; i < freePts.length; i++) ctx.lineTo(freePts[i].x, freePts[i].y);
      ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    if (tool === 'curve' && curvePhase === 2) {
      ctx.putImageData(savedImg, 0, 0);
      ctx.strokeStyle = fgColor; ctx.lineWidth = SIZES[lineSize];
      ctx.beginPath(); ctx.moveTo(curveP1.x, curveP1.y);
      ctx.quadraticCurveTo(p.x, p.y, startX, startY);
      ctx.stroke();
      return;
    }

    if (['pencil','brush','eraser'].includes(tool)) {
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastX = p.x; lastY = p.y;
    } else if (tool === 'airbrush') {
      for (let i = 0; i < 15; i++) {
        ctx.fillRect(p.x + (Math.random() - 0.5) * SIZES[lineSize] * 6, p.y + (Math.random() - 0.5) * SIZES[lineSize] * 6, 1, 1);
      }
    } else if (['line','rect','ellipse','rrect'].includes(tool)) {
      ctx.putImageData(savedImg, 0, 0);
      setStroke(tool);
      previewShape(tool, startX, startY, p.x, p.y);
    }
  }

  function endDraw(e) {
    const p = scPos(e);
    if (tool === 'free-sel' && drawing) {
      drawing = false;
      ctx.setLineDash([]);
      ctx.putImageData(savedImg, 0, 0);
      ctx.strokeStyle = '#000080'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(freePts[0].x, freePts[0].y);
      for (let i = 1; i < freePts.length; i++) ctx.lineTo(freePts[i].x, freePts[i].y);
      ctx.closePath(); ctx.stroke();
      syncStore();
      return;
    }
    if (tool === 'curve' && curvePhase === 2 && drawing) {
      curvePhase = 0; drawing = false;
      ctx.putImageData(savedImg, 0, 0);
      ctx.strokeStyle = fgColor; ctx.lineWidth = SIZES[lineSize];
      ctx.beginPath(); ctx.moveTo(curveP1.x, curveP1.y);
      ctx.quadraticCurveTo(p.x, p.y, startX, startY);
      ctx.stroke();
      syncStore();
      statusText = STATUS_MAP.curve;
      return;
    }
    if (!drawing) return;
    drawing = false;
    if (['line','rect','ellipse','rrect'].includes(tool)) {
      ctx.putImageData(savedImg, 0, 0);
      setStroke(tool);
      drawShape(tool, startX, startY, p.x, p.y);
    }
    syncStore();
  }

  function dblClick(e) {
    if (tool === 'poly' && polyPts.length >= 2) {
      ctx.strokeStyle = fgColor; ctx.lineWidth = SIZES[lineSize];
      ctx.beginPath(); ctx.moveTo(polyPts[0].x, polyPts[0].y);
      for (let i = 1; i < polyPts.length; i++) ctx.lineTo(polyPts[i].x, polyPts[i].y);
      ctx.closePath(); ctx.stroke();
      polyPts = [];
      syncStore();
      statusText = STATUS_MAP.poly;
    }
    if (tool === 'curve' && curvePhase > 0) {
      curvePhase = 0;
      statusText = STATUS_MAP.curve;
    }
  }

  function previewShape(shape, x1, y1, x2, y2) {
    ctx.beginPath();
    if (shape === 'line') { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
    else if (shape === 'rect') { ctx.strokeRect(x1, y1, x2 - x1, y2 - y1); return; }
    else if (shape === 'ellipse') { ctx.ellipse((x1+x2)/2, (y1+y2)/2, Math.abs(x2-x1)/2, Math.abs(y2-y1)/2, 0, 0, Math.PI*2); }
    else if (shape === 'rrect') { roundRect(x1, y1, x2 - x1, y2 - y1, 8); }
    ctx.stroke();
  }

  function drawShape(shape, x1, y1, x2, y2) {
    ctx.beginPath();
    if (shape === 'line') { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
    else if (shape === 'rect') { ctx.strokeRect(x1, y1, x2 - x1, y2 - y1); return; }
    else if (shape === 'ellipse') { ctx.ellipse((x1+x2)/2, (y1+y2)/2, Math.abs(x2-x1)/2, Math.abs(y2-y1)/2, 0, 0, Math.PI*2); }
    else if (shape === 'rrect') { roundRect(x1, y1, x2 - x1, y2 - y1, 8); }
    ctx.stroke();
  }

  function roundRect(x, y, w, h, r) {
    if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; }
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  }

  function syncStore() { imageStore = ctx.getImageData(0, 0, cw, ch); }

  function floodFill(sx, sy, fc) {
    const w = cw, h = ch;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const si = (sy * w + sx) * 4;
    const tr = d[si], tg = d[si+1], tb = d[si+2];
    const fr = parseInt(fc.slice(1,3),16), fg = parseInt(fc.slice(3,5),16), fb = parseInt(fc.slice(5,7),16);
    if (tr === fr && tg === fg && tb === fb) return;
    const stack = [[sx,sy]];
    const vis = new Uint8Array(w * h);
    while (stack.length) {
      const [x,y] = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      const i = y * w + x;
      if (vis[i]) continue;
      const pi = i * 4;
      if (d[pi] !== tr || d[pi+1] !== tg || d[pi+2] !== tb) continue;
      vis[i] = 1;
      d[pi] = fr; d[pi+1] = fg; d[pi+2] = fb;
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(img, 0, 0);
    syncStore();
  }

  function resizeZoom() {
    if (!imageStore) imageStore = ctx.getImageData(0, 0, cw, ch);
    canvas.width = cw * zoom;
    canvas.height = ch * zoom;
    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.putImageData(imageStore, 0, 0);
  }

  function clearAll() { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch); syncStore(); }
  function invertAll() {
    const img = ctx.getImageData(0, 0, cw, ch);
    for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 255 - img.data[i]; img.data[i+1] = 255 - img.data[i+1]; img.data[i+2] = 255 - img.data[i+2]; }
    ctx.putImageData(img, 0, 0);
    syncStore();
  }

  function saveImg() {
    const n = prompt('File name:', 'untitled.png');
    if (!n) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = n;
    a.click();
  }

  function doMenu(m, a) {
    openMenu = null;
    if (a === 'exit') closeWindow(id);
    else if (a === 'clear' || a === 'new') clearAll();
    else if (a === 'save' || a === 'saveas') saveImg();
    else if (a === 'invert') invertAll();
    else if (a === 'selall') {}
    else if (a === 'tbtog') showTB = !showTB;
    else if (a === 'cbtog') showCB = !showCB;
    else if (a === 'sbtog') showSB = !showSB;
    else if (a === 'z1') { zoom = 1; resizeZoom(); }
    else if (a === 'z2') { zoom = 2; resizeZoom(); }
    else if (a === 'about') showDialog('Microsoft Paint\nWindows 98 Edition\n\n© Microsoft Corporation 1981-1998', 'About Paint');
  }

  function setTool(t) {
    if (tool === 'poly') polyPts = [];
    if (tool === 'curve') curvePhase = 0;
    tool = t;
    statusText = STATUS_MAP[t] || '';
  }

  function keyH(e) { if (e.key === 'Escape') { openMenu = null; if (curvePhase) curvePhase = 0; polyPts = []; } }
</script>

<svelte:window on:keydown={keyH} />

<div class="p98">
  <div class="p98-menubar" on:mouseleave={() => openMenu = null}>
    {#each Object.entries(MENU_ITEMS) as [name, items]}
      <button class="p98-mbtn" class:active={openMenu === name}
        on:click={() => openMenu = openMenu === name ? null : name}
        on:mouseenter={() => { if (openMenu) openMenu = name; }}>
        {name}
        {#if openMenu === name}
          <div class="p98-drop">
            {#each items as item}
              {#if item.t === 'sep'}
                <div class="p98-sep"></div>
              {:else}
                <button class="p98-ditem" class:dis={item.d} on:click|stopPropagation={() => doMenu(name, item.a)}>
                  {#if item.c}<span class="p98-chk">{' '}</span>{/if}
                  {item.l}
                </button>
              {/if}
            {/each}
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <div class="p98-body">
    {#if showTB}
      <div class="p98-tb">
        <div class="p98-tgrid">
          {#each TOOL_LIST as row}
            {#each row as t}
              <button class="p98-tbtn" class:act={tool === t} on:click={() => setTool(t)}>
                <svg width="16" height="16" viewBox="0 0 16 16" style="display:block;">
                  {#if t === 'pencil'}
                    <path d="M3 13l1-4 6-6 3 3-6 6-4 1z" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'brush'}
                    <path d="M5 11c-1 2-3 3-4 3 2-1 3-2 4-3 1-2 1-4 3-6l2-2c2-2 4-3 6-3-1 2-3 4-5 6l-2 2c-2 1-3 2-4 3z" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'eraser'}
                    <rect x="3" y="3" width="10" height="10" fill="#fff" stroke="#000" stroke-width="1"/>
                  {:else if t === 'fill'}
                    <path d="M8 2L2 8l4 4 6-6-2-2z" fill="none" stroke="#000" stroke-width="1.3"/>
                    <rect x="7" y="7" width="2" height="2" fill="#888" transform="rotate(45 8 8)"/>
                  {:else if t === 'picker'}
                    <path d="M10 2l4 4-8 8-4-4z" fill="none" stroke="#000" stroke-width="1.3"/>
                    <circle cx="6" cy="10" r="1.2" fill="#000"/>
                  {:else if t === 'zoom'}
                    <circle cx="6" cy="6" r="4" fill="none" stroke="#000" stroke-width="1.3"/>
                    <line x1="9" y1="9" x2="14" y2="14" stroke="#000" stroke-width="1.5"/>
                  {:else if t === 'airbrush'}
                    <circle cx="8" cy="3" r="1" fill="#000"/>
                    <circle cx="4" cy="7" r=".8" fill="#888"/>
                    <circle cx="10" cy="6" r=".7" fill="#888"/>
                    <circle cx="7" cy="10" r=".6" fill="#888"/>
                    <circle cx="11" cy="10" r=".5" fill="#888"/>
                  {:else if t === 'text'}
                    <text x="3" y="13" font-size="13" font-family="serif" fill="#000">A</text>
                  {:else if t === 'line'}
                    <line x1="2" y1="14" x2="14" y2="2" stroke="#000" stroke-width="1.5"/>
                  {:else if t === 'curve'}
                    <path d="M2 14c4-4 7-2 12-2" fill="none" stroke="#000" stroke-width="1.3"/>
                    <circle cx="12" cy="12" r="1.2" fill="#000"/>
                  {:else if t === 'rect'}
                    <rect x="2" y="2" width="12" height="12" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'poly'}
                    <polygon points="8,2 14,7 12,13 4,13 2,7" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'ellipse'}
                    <ellipse cx="8" cy="8" rx="6" ry="5" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'rrect'}
                    <rect x="2.5" y="2.5" width="11" height="11" rx="2" ry="2" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'free-sel'}
                    <path d="M2 3l2 5 3 1 2 4 4-1-1-4-3-2-1-4z" fill="none" stroke="#000" stroke-width="1.3"/>
                  {:else if t === 'rect-sel'}
                    <rect x="2" y="2" width="12" height="12" fill="none" stroke="#000" stroke-width="1.3" stroke-dasharray="2,1.5"/>
                  {/if}
                </svg>
              </button>
            {/each}
          {/each}
        </div>
        <div class="p98-opts">
          <div class="p98-opt-in">
            {#each SIZES as s, i}
              <button class="p98-sbtn" class:act={lineSize === i} on:click={() => lineSize = i} title={SIZE_LABELS[i]}>
                <div class="p98-sdot" style="width:{Math.max(3, s * 3)}px;height:{Math.max(3, s * 3)}px;background:{fgColor};"></div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <div class="p98-cvarea">
      <div class="p98-cvwrap">
        <canvas bind:this={canvas}
          on:mousedown={startDraw} on:mousemove={moveDraw} on:mouseup={endDraw} on:dblclick={dblClick} on:mouseleave={() => { drawing = false; if (curvePhase === 2) curvePhase = 0; }}
          style="cursor:crosshair;"></canvas>
      </div>
    </div>
  </div>

  {#if showCB}
    <div class="p98-pal">
      <div class="p98-fgbg">
        <div class="p98-bgsw" style="background:{bgColor};"></div>
        <div class="p98-fgsw" style="background:{fgColor};"></div>
      </div>
      <div class="p98-clrs">
        {#each COLORS as c}
          <button class="p98-csw" style="background:{c};" on:click={() => fgColor = c} on:contextmenu|preventDefault={() => bgColor = c}></button>
        {/each}
      </div>
    </div>
  {/if}

  {#if showSB}
    <div class="p98-sbar">
      <span class="p98-stxt">{statusText}</span>
    </div>
  {/if}
</div>

<style>
.p98 { height:100%; display:flex; flex-direction:column; background:#c0c0c0; font-family:"VT323",monospace; font-size:12px; color:#000; }

/* menu bar */
.p98-menubar { display:flex; padding:1px 0; flex-shrink:0; height:21px; align-items:center; border-bottom:2px solid #808080; background:#c0c0c0; z-index:100; }
.p98-mbtn { position:relative; padding:1px 8px; cursor:default; font-size:12px; font-family:"VT323",monospace; border:none; background:none; color:#000; height:100%; white-space:nowrap; }
.p98-mbtn:hover, .p98-mbtn.active { background:#000080; color:#fff; }
.p98-drop { position:absolute; top:100%; left:0; background:#c0c0c0; border:2px solid; border-color:#fff #404040 #404040 #fff; min-width:160px; padding:2px; z-index:200; }
.p98-ditem { display:block; width:100%; padding:2px 20px 2px 4px; cursor:default; font-size:12px; font-family:"VT323",monospace; border:none; background:none; text-align:left; color:#000; white-space:nowrap; }
.p98-ditem:hover { background:#000080; color:#fff; }
.p98-ditem.dis { color:#808080; } .p98-ditem.dis:hover { background:none; color:#808080; }
.p98-chk { width:14px; display:inline-block; }
.p98-sep { height:2px; margin:2px; border-top:1px solid #808080; border-bottom:1px solid #fff; }

/* body */
.p98-body { flex:1; display:flex; overflow:hidden; }

/* toolbox */
.p98-tb { width:52px; background:#c0c0c0; border-right:2px solid #808080; display:flex; flex-direction:column; flex-shrink:0; }
.p98-tgrid { display:grid; grid-template-columns:1fr 1fr; gap:0; padding:2px; }
.p98-tbtn { width:24px; height:24px; padding:0; border:2px solid; border-color:#fff #404040 #404040 #fff; background:#c0c0c0; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.p98-tbtn:active, .p98-tbtn.act { border-color:#404040 #fff #fff #404040; background:#a0a0a0; }
.p98-opts { border-top:2px solid #808080; margin:0; padding:4px 2px; flex:1; }
.p98-opt-in { display:flex; flex-direction:column; align-items:center; gap:2px; }
.p98-sbtn { width:28px; height:18px; border:1px solid transparent; cursor:pointer; background:none; display:flex; align-items:center; justify-content:center; }
.p98-sbtn.act { border:1px solid #000080; background:rgba(0,0,128,0.1); }
.p98-sdot { border-radius:50%; border:1px solid #808080; }

/* canvas area */
.p98-cvarea { flex:1; overflow:auto; background:#808080; border:3px solid; border-color:#808080 #fff #fff #808080; }
.p98-cvwrap { display:inline-block; }
.p98-cvwrap canvas { display:block; background:#fff; }

/* palette */
.p98-pal { height:34px; flex-shrink:0; display:flex; align-items:center; padding:1px 4px; gap:4px; background:#c0c0c0; border-top:2px solid #808080; }
.p98-fgbg { position:relative; width:26px; height:22px; border:2px solid; border-color:#808080 #fff #fff #808080; padding:2px; flex-shrink:0; }
.p98-bgsw { position:absolute; bottom:2px; right:2px; width:16px; height:16px; border:1px solid #000; }
.p98-fgsw { position:absolute; top:2px; left:2px; width:16px; height:16px; border:1px solid #000; z-index:1; }
.p98-clrs { display:flex; flex-wrap:wrap; gap:1px; }
.p98-csw { width:12px; height:12px; border:1px solid #808080; cursor:pointer; padding:0; }
.p98-csw:hover { border-color:#000; }

/* status bar */
.p98-sbar { height:20px; flex-shrink:0; display:flex; align-items:center; padding:1px 4px; border-top:2px solid #fff; background:#c0c0c0; font-size:12px; }
.p98-stxt { flex:1; overflow:hidden; white-space:nowrap; }
</style>
