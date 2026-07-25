<script>
  import { get } from 'svelte/store';
  import { listDir, createFolder, deleteItem, readFile, writeFile, createFile, openWindow, fileSystem } from '../stores.js';

  export let id;

  let lines = ['Microsoft(R) Windows 98', '(C)Copyright Microsoft Corp 1981-1998.', ''];
  let input = '';
  let cwd = '/';
  let scrollEl;
  let inputEl;

  function prompt() {
    let p = cwd === '/' ? 'C:\\' : 'C:' + cwd.replace(/\//g, '\\');
    return p + '>';
  }

  function addLine(text) {
    lines = [...lines, text];
  }

  function scrollBottom() {
    if (scrollEl) setTimeout(() => { scrollEl.scrollTop = scrollEl.scrollHeight; }, 10);
  }

  function run(cmd) {
    addLine(prompt() + cmd);
    const parts = cmd.trim().split(/\s+/);
    const verb = parts[0] ? parts[0].toLowerCase() : '';
    const args = parts.slice(1);

    if (!verb) { scrollBottom(); return; }

    switch (verb) {
      case 'cls': lines = []; break;

      case 'dir':
        dirCmd(args);
        break;

      case 'cd':
      case 'chdir':
        cdCmd(args);
        break;

      case 'md':
      case 'mkdir':
        mdCmd(args);
        break;

      case 'rd':
      case 'rmdir':
        rdCmd(args);
        break;

      case 'del':
        delCmd(args);
        break;

      case 'copy':
        copyCmd(args);
        break;

      case 'move':
        moveCmd(args);
        break;

      case 'type':
        typeCmd(args);
        break;

      case 'edit':
        editCmd(args);
        break;

      case 'format':
        addLine('WARNING: Formatting drive ' + (args[0] || '?') + '...');
        addLine('This operation is not supported in this environment.');
        break;

      case 'fdisk':
        addLine('FDISK utility');
        addLine('WARNING: This operation is not available in this environment.');
        break;

      case 'mem':
        memCmd();
        break;

      case 'resume':
        addLine('');
        addLine('=== RESUME ===');
        addLine('');
        addLine('--- Experience ---');
        addLine('Full-Stack Developer - Freelance');
        addLine('  2023 - Present');
        addLine('  Building web apps, tools, and custom solutions.');
        addLine('  Specializing in JavaScript, Python, and creative coding.');
        addLine('');
        addLine('Open Source Contributor - Various Projects');
        addLine('  2022 - Present');
        addLine('  Contributing to Linux configs, Arduino projects, and web tools.');
        addLine('');
        addLine('--- Education ---');
        addLine('Self-Taught Developer');
        addLine('  Learning by building. Every project is a new skill unlocked.');
        addLine('');
        addLine('--- Projects ---');
        addLine('  Pixel Forge - Pixel art editor with layers');
        addLine('  Chat App - Real-time messaging platform');
        addLine('  Weather App - Clean weather interface');
        addLine('  Forum - Community discussion platform');
        addLine('  Mini Browser - Lightweight web browser');
        addLine('');
        addLine('--- Contact ---');
        addLine('  Email: adirajk03@gmail.com');
        addLine('  GitHub: github.com/adiraj66132');
        addLine('');
        break;

      case 'help':
        addLine('Available commands:');
        addLine('  DIR    CD    COPY   MOVE   DEL   MD   RD');
        addLine('  CLS    TYPE  EDIT   FORMAT FDISK MEM  HELP  RESUME');
        break;

      default:
        addLine('Bad command or file name: ' + verb);
    }
    scrollBottom();
  }

  function resolvePath(p) {
    if (!p) return cwd;
    if (p.startsWith('/') || p.match(/^[a-zA-Z]:\\?/)) {
      let r = p.replace(/^[a-zA-Z]:[\\\/]?/, '/');
      r = '/' + r.replace(/^\/+/, '').replace(/\/+$/, '');
      if (r === '/') return '/';
      return r;
    }
    let base = cwd === '/' ? '' : cwd;
    p.split('/').forEach(seg => {
      if (seg === '..') base = base.split('/').slice(0, -1).join('/') || '';
      else if (seg !== '.' && seg) base = base + '/' + seg;
    });
    return base || '/';
  }

  function dirCmd(args) {
    const target = resolvePath(args[0] || '');
    const items = listDir(target);
    const dir = target === '/' ? '\\' : target.replace(/\//g, '\\');
    addLine(' Volume in drive C has no label');
    addLine(' Directory of C:' + dir);
    addLine('');
    let dirs = 0, files = 0;
    items.forEach(item => {
      if (item.type === 'folder') {
        addLine('  <DIR>          ' + item.name);
        dirs++;
      } else {
        const size = (item.content || '').length;
        addLine('  ' + String(size).padStart(12) + '  ' + item.name);
        files++;
      }
    });
    addLine('        ' + files + ' File(s)');
    addLine('        ' + dirs + ' Dir(s)');
  }

  function cdCmd(args) {
    if (!args[0]) {
      addLine(cwd === '/' ? 'C:\\' : 'C:' + cwd.replace(/\//g, '\\'));
      return;
    }
    const target = resolvePath(args[0]);
    if (args[0] === '..' || args[0] === '/') { cwd = target; return; }
    const fs = get(fileSystem);
    if (target === '/' || (fs[target] && fs[target].type === 'folder')) { cwd = target; }
    else addLine('The system cannot find the path specified.');
  }

  function mdCmd(args) {
    if (!args[0]) { addLine('The syntax of the command is incorrect.'); return; }
    const p = resolvePath(args[0]);
    createFolder(p);
    addLine('Created directory: ' + p);
  }

  function rdCmd(args) {
    if (!args[0]) { addLine('The syntax of the command is incorrect.'); return; }
    const p = resolvePath(args[0]);
    const items = listDir(p);
    if (items.length) { addLine('The directory is not empty.'); return; }
    deleteItem(p);
    addLine('Removed directory: ' + p);
  }

  function delCmd(args) {
    if (!args[0]) { addLine('The syntax of the command is incorrect.'); return; }
    const p = resolvePath(args[0]);
    const items = listDir(p.replace(/\/[^/]+$/, '') || '/');
    const name = p.split('/').pop();
    const found = items.find(i => i.name === name && i.type === 'file');
    if (!found) { addLine('File not found: ' + name); return; }
    deleteItem(p);
    addLine('Deleted file: ' + name);
  }

  function copyCmd(args) {
    if (args.length < 2) { addLine('The syntax of the command is incorrect.'); return; }
    const src = resolvePath(args[0]);
    const dst = resolvePath(args[1]);
    const fs = get(fileSystem);
    let dstName = dst;
    if (fs[dst] && fs[dst].type === 'folder') dstName = dst + '/' + args[0].split('/').pop();
    const content = readFile(src);
    if (content === null) { addLine('File not found: ' + args[0]); return; }
    writeFile(dstName, content);
    addLine('        1 file(s) copied.');
  }

  function moveCmd(args) {
    if (args.length < 2) { addLine('The syntax of the command is incorrect.'); return; }
    const src = resolvePath(args[0]);
    const dst = resolvePath(args[1]);
    const fs = get(fileSystem);
    let dstName = dst;
    if (fs[dst] && fs[dst].type === 'folder') dstName = dst + '/' + args[0].split('/').pop();
    const content = readFile(src);
    if (content === null) { addLine('File not found: ' + args[0]); return; }
    writeFile(dstName, content);
    deleteItem(src);
    addLine('        1 file(s) moved.');
  }

  function typeCmd(args) {
    if (!args[0]) { addLine('The syntax of the command is incorrect.'); return; }
    const p = resolvePath(args[0]);
    const content = readFile(p);
    if (content === null) { addLine('File not found: ' + args[0]); return; }
    content.split('\n').forEach(line => addLine(line));
  }

  function editCmd(args) {
    if (!args[0]) { addLine('The syntax of the command is incorrect.'); return; }
    const p = resolvePath(args[0]);
    const name = p.split('/').pop();
    const content = readFile(p);
    if (content === null) { createFile(p, ''); }
    openWindow('notepad', { title: name + ' - Notepad', icon: 'Notepad', iconNum: '102', width: 420, height: 360, filePath: p });
    addLine('Opening ' + name + ' in Notepad...');
  }

  function memCmd() {
    const kb = (performance.memory && performance.memory.usedJSHeapSize ? Math.round(performance.memory.usedJSHeapSize / 1024) : 'N/A');
    const total = (performance.memory && performance.memory.jsHeapSizeLimit ? Math.round(performance.memory.jsHeapSizeLimit / 1024) : 'N/A');
    const nav = navigator;
    addLine('Memory Type        Total         Used         Free');
    addLine('─────────────────────────────────────────────────────');
    addLine('Physical Memory:   ' + String(total).padStart(10) + ' KB');
    addLine('  In use:          ' + String(kb).padStart(10) + ' KB');
    addLine('');
    addLine('Browser: ' + nav.userAgent);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      run(input);
      input = '';
      scrollBottom();
    }
  }

  function focusInput() {
    if (inputEl) inputEl.focus();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="cmd" on:click={focusInput}>
  <div class="cmd-output" bind:this={scrollEl}>
    {#each lines as line}
      <div class="cmd-line">{line}</div>
    {/each}
    <div class="cmd-input-line">
      {prompt()}<input type="text" bind:this={inputEl} bind:value={input} on:keydown={handleKeydown} class="cmd-input" autofocus>
    </div>
  </div>
</div>

<style>
  .cmd {
    width: 100%; height: 100%; background: #000;
    font-family: 'Courier New', Courier, monospace; font-size: 14px;
    color: #c0c0c0; overflow: hidden; display: flex;
  }
  .cmd-output {
    flex: 1; overflow-y: auto; padding: 4px; white-space: pre;
    scrollbar-width: thin; scrollbar-color: #c0c0c0 #000;
  }
  .cmd-output::-webkit-scrollbar { width: 14px; }
  .cmd-output::-webkit-scrollbar-track { background: #000; }
  .cmd-output::-webkit-scrollbar-thumb { background: #c0c0c0; border: 2px solid #000; }
  .cmd-line { white-space: pre-wrap; word-break: break-all; line-height: 1.3; }
  .cmd-input-line { white-space: pre; display: flex; line-height: 1.3; }
  .cmd-input {
    background: none; border: none; color: #c0c0c0;
    font-family: 'Courier New', Courier, monospace; font-size: 14px;
    outline: none; flex: 1; caret-color: #c0c0c0;
  }
</style>
