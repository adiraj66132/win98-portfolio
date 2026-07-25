<script>
  let text = `Welcome to Notepad!\n\nThis is a Windows 98 portfolio.\nDrag the windows around.\nDouble-click desktop icons.\nOpen the Start menu.\nPlay Minesweeper!\n\nHave fun exploring!`;
</script>

<textarea class="notepad" bind:value={text} placeholder="Start typing..."></textarea>

<style>
  .notepad {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    font-family: "VT323", monospace;
    font-size: 14px;
    padding: 4px;
    outline: none;
    background: #fff;
    color: #000;
    line-height: 1.3;
  }
</style>
