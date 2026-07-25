<script>
  import BootScreen from './lib/BootScreen.svelte';
  import Desktop from './lib/Desktop.svelte';
  import Taskbar from './lib/Taskbar.svelte';
  import StartMenu from './lib/StartMenu.svelte';
  import Window from './lib/Window.svelte';
  import ContextMenu from './lib/ContextMenu.svelte';
  import Dialog from './lib/Dialog.svelte';
  import ShutdownScreen from './lib/ShutdownScreen.svelte';
  import MyComputer from './lib/MyComputer.svelte';
  import Projects from './lib/Projects.svelte';
  import About from './lib/About.svelte';
  import Resume from './lib/Resume.svelte';
  import Notepad from './lib/Notepad.svelte';
  import IE from './lib/IE.svelte';
  import Minesweeper from './lib/Minesweeper.svelte';
  import Programs from './lib/Programs.svelte';
  import FileExplorer from './lib/FileExplorer.svelte';
  import Cmd from './lib/Cmd.svelte';
  import Paint from './lib/Paint.svelte';

  import { windows, windowOrder, toggleStartMenu, showDialog, openWindow } from './stores.js';

  const contentMap = {
    mycomputer: MyComputer,
    projects: Projects,
    about: About,
    resume: Resume,
    notepad: Notepad,
    ie: IE,
    minesweeper: Minesweeper,
    programs: Programs,
    explorer: FileExplorer,
    cmd: Cmd,
    paint: Paint,
  };

  function handleStartClick() {
    toggleStartMenu();
  }
</script>

<BootScreen />

<div class="app">
  <Desktop />

  {#each $windowOrder as id (id)}
    {#if $windows[id] && contentMap[id]}
      <Window {id} data={$windows[id]}>
        <svelte:component this={contentMap[id]} {id} />
      </Window>
    {/if}
  {/each}

  <StartMenu />
  <Taskbar on:click={handleStartClick} />
  <ContextMenu />
  <Dialog />
  <ShutdownScreen />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html, body) {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #008080;
  }

  :global(body) {
    font-family: "VT323", "MS Sans Serif", "Microsoft Sans Serif", Tahoma, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.2;
    user-select: none;
    cursor: default;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
  }

  :global(button) {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }

  :global(img) {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  :global(::-webkit-scrollbar) {
    width: 16px;
    height: 16px;
  }
  :global(::-webkit-scrollbar-track) {
    background: repeating-conic-gradient(#c0c0c0 0% 25%, #fff 0% 50%) 50% / 2px 2px;
  }
  :global(::-webkit-scrollbar-thumb) {
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
  }
  :global(::-webkit-scrollbar-button) {
    display: block;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #404040;
    border-right: 2px solid #404040;
    width: 16px;
    height: 16px;
  }

  .app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
