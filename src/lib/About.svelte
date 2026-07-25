<script>
  import { openWindow, closeWindow } from '../stores.js';

  function gotoProjects() {
    closeWindow('about');
    openWindow('projects', { title: 'Projects', icon: 'Projects', iconNum: '07', width: 540, height: 420 });
  }
</script>

<div class="about">
  <div class="section-header">
    <img src="/icons/02.png" alt="" width="32" height="32">
    <h2>About Me</h2>
  </div>
  <div class="about-body">
    <div class="about-photo">
      <img src="/icons/02.png" alt="" width="64" height="64">
    </div>
    <div class="about-text">
      <p><b>Hey there! I'm a developer who builds cool stuff.</b></p>
      <p>I love creating web apps, tinkering with hardware, and customizing my Linux desktop.</p>
      <p>This portfolio is a love letter to Windows 98 — drag the windows around, open folders, play Minesweeper!</p>
    </div>
  </div>
  <div class="section-header">
    <img src="/icons/14-16.png" alt="" width="16" height="16">
    <h2>Skills</h2>
  </div>
  <div class="skills">
    <span class="skill">HTML/CSS</span>
    <span class="skill">JavaScript</span>
    <span class="skill">Python</span>
    <span class="skill">Arduino</span>
    <span class="skill">Linux</span>
    <span class="skill">Hyprland</span>
    <span class="skill">Pixel Art</span>
    <span class="skill">Web Dev</span>
  </div>
  <div class="section-header">
    <img src="/icons/08-16.png" alt="" width="16" height="16">
    <h2>Featured Projects</h2>
  </div>
  <button class="project-card" on:click={gotoProjects}>
    <img src="/icons/20.png" alt="" width="24" height="24">
    <div>
      <b>Pixel Forge</b>
      <p>A pixel art editor with layers and animation support.</p>
    </div>
  </button>
  <button class="project-card" on:click={gotoProjects}>
    <img src="/icons/28.png" alt="" width="24" height="24">
    <div>
      <b>Chat App</b>
      <p>Real-time chat application with rooms and user presence.</p>
    </div>
  </button>
  <button class="project-card" on:click={gotoProjects}>
    <img src="/icons/29.png" alt="" width="24" height="24">
    <div>
      <b>Forum</b>
      <p>A community forum with categories and threading.</p>
    </div>
  </button>
</div>

<style>
  .about {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    line-height: 1.3;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    border-bottom: 2px solid #808080;
    border-top: 1px solid #fff;
  }
  .section-header img { image-rendering: pixelated; }
  h2 { font-size: 14px; color: #000080; font-family: "VT323", monospace; }
  .about-body { display: flex; gap: 12px; align-items: flex-start; padding: 4px 0; }
  .about-photo {
    width: 72px;
    height: 72px;
    border: 2px solid;
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
    background: #c0c0c0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .about-photo img { image-rendering: pixelated; }
  .about-text { flex: 1; }
  .about-text p { margin-bottom: 4px; }
  .skills { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px 0; }
  .skill {
    display: inline-block;
    background: #000080;
    color: #fff;
    padding: 1px 6px;
    font-size: 12px;
  }
  .project-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    border: 2px solid;
    border-top-color: #fff;
    border-left-color: #fff;
    border-bottom-color: #808080;
    border-right-color: #808080;
    background: #c0c0c0;
    cursor: pointer;
    font-family: "VT323", monospace;
    font-size: 13px;
    text-align: left;
    width: 100%;
    color: #000;
  }
  .project-card:active {
    border-top-color: #808080;
    border-left-color: #808080;
    border-bottom-color: #fff;
    border-right-color: #fff;
  }
  .project-card b { color: #000080; font-size: 14px; }
  .project-card img { image-rendering: pixelated; flex-shrink: 0; }
  .project-card p { margin-top: 2px; color: #404040; font-size: 12px; }
</style>
