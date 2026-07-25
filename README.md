# Windows 98 Portfolio

A personal portfolio website themed as Windows 98, built with Svelte.

<img width="1346" height="718" alt="image" src="https://github.com/user-attachments/assets/83b17f9c-0f0c-4389-86bd-9f97f7879588" />


## Features

- **Desktop** with auto-aligned icons, right-click context menu (New, Paste, Arrange, Refresh)
- **Start Menu** with Programs, Shut Down
- **Window Manager** with drag, resize, minimize, maximize, close — Win98-style shadows
- **File System** backed by localStorage with folder/file CRUD
- **File Explorer** — browse, create, delete, copy/paste files
- **Notepad** — text editor that reads/writes from the file system
- **Paint** — 16 tools, 28-color palette, 5 brush sizes, zoom, canvas drawing
- **Internet Explorer** — iframe-based browser with Wikipedia REST API fallback for blocked pages
- **Command Prompt** — MS-DOS-like terminal: `dir`, `cd`, `copy`, `del`, `md`, `rd`, `type`, `edit`, `cls`, `mem`, `help`, `resume`
- **Minesweeper** — classic game
- **Shut Down** — animated shutdown dialog with restart
- **About Me / Projects / Resume** pages

## Tech Stack

- [Svelte](https://svelte.dev) + [Vite](https://vitejs.dev)
- localStorage for persistence
- [Windows 98 Icon Pack](https://win98icons.alexmeub.com/)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
