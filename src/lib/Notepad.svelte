<script>
  import { onMount } from 'svelte';
  import { windows, writeFile, readFile } from '../stores.js';

  export let id;

  let text = '';
  let saved = true;

  $: filePath = $windows[id]?.filePath;

  onMount(() => {
    if (filePath) {
      const c = readFile(filePath);
      if (c != null) text = c;
    } else {
      text = `Welcome to Notepad!\n\nThis is a Windows 98 portfolio.\nDrag the windows around.\nDouble-click desktop icons.\nOpen the Start menu.\nPlay Minesweeper!\n\nHave fun exploring!`;
    }
  });

  function handleInput() {
    saved = false;
  }

  function save() {
    if (filePath) { writeFile(filePath, text); saved = true; }
  }

  function handleKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
  }
</script>

<textarea class="notepad" bind:value={text} on:input={handleInput} on:keydown={handleKeydown} placeholder="Start typing..."></textarea>

<div class="notepad-status">
  <span>{filePath ? filePath.split('/').pop() : 'Untitled'}{saved ? '' : ' *'}</span>
</div>

<style>
  .notepad {
    width: 100%; height: calc(100% - 20px); border: none; resize: none;
    font-family: "VT323", monospace; font-size: 14px; padding: 4px; outline: none;
    background: #fff; color: #000; line-height: 1.3; display: block;
  }
  .notepad-status {
    height: 20px; padding: 1px 4px; font-size: 12px; border-top: 1px solid #808080;
    background: #c0c0c0; display: flex; align-items: center;
  }
</style>
