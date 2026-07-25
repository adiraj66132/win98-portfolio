<script>
  import { onMount } from 'svelte';

  let progress = 0;
  let done = false;
  let removed = false;

  onMount(() => {
    const iv = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(iv);
        setTimeout(() => { done = true; }, 300);
        setTimeout(() => { removed = true; }, 800);
      }
    }, 200);
    return () => clearInterval(iv);
  });
</script>

{#if !removed}
  <div class="boot" class:fade={done}>
    <div class="boot-inner">
      <div class="win-logo">
        <div class="flag">
          <div class="stripe red"></div>
          <div class="stripe green"></div>
          <div class="stripe blue"></div>
          <div class="stripe yellow"></div>
        </div>
      </div>
      <div class="title">Windows 98</div>
      <div class="track">
        <div class="bar" style="width:{progress}%"></div>
      </div>
      <div class="sub">Starting Windows 98...</div>
    </div>
  </div>
{/if}

<style>
  .boot {
    position: fixed;
    inset: 0;
    background: #008080;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s;
  }
  .boot.fade { opacity: 0; pointer-events: none; }
  .boot-inner {
    text-align: center;
  }
  .win-logo {
    display: inline-block;
    margin-bottom: 16px;
  }
  .flag {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    width: 60px;
    transform: perspective(200px) rotateY(-10deg);
  }
  .stripe {
    width: 28px;
    height: 28px;
    border: 1px solid rgba(0,0,0,0.3);
  }
  .red { background: #ff0000; }
  .green { background: #00aa00; }
  .blue { background: #0000ff; }
  .yellow { background: #ffaa00; }
  .title {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 0 #000;
    letter-spacing: 2px;
    font-family: "VT323", monospace;
  }
  .track {
    width: 220px;
    height: 18px;
    border: 2px solid #808080;
    border-top-color: #404040;
    border-left-color: #404040;
    margin: 24px auto 0;
    padding: 2px;
    background: #c0c0c0;
  }
  .bar {
    height: 100%;
    background: #000080;
    transition: width 0.3s;
  }
  .sub {
    margin-top: 12px;
    font-size: 12px;
    color: #c0c0c0;
  }
</style>
