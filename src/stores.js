import { writable, get } from 'svelte/store';

let nextZ = 100;

const iconDir = '/Windows%2098%20icons/';

const icon32 = {
  '01': 'computer_win.png',
  '02': 'user_card.png',
  '03': 'address_book_card.png',
  '04': 'msie1-0.png',
  '05': 'program_manager-0.png',
  '06': 'chip_ramdrive-0.png',
  '07': 'directory_closed-0.png',
  '08': 'recycle_bin_empty-0.png',
  '12': 'hard_disk_drive-0.png',
  '13': 'help_book_big-0.png',
  '14': 'shut_down_normal-0.png',
  '16': 'notepad_file-0.png',
  '17': 'printer_slim-0.png',
  '20': 'paint_old-0.png',
  '28': 'outlook_express-0.png',
  '29': 'newspaper.png',
  '30': 'connected_world-0.png',
  '33': 'desktop-0.png',
  '35': 'check-0.png',
  '44': 'minesweeper-0.png',
  '102': 'notepad_file-0.png',
};

const icon16 = {
  '01': 'computer-0.png',
  '02': 'address_book_card_copy-1.png',
  '03': 'address_book_card_copy-1.png',
  '04': 'msie1-3.png',
  '05': 'directory_closed-1.png',
  '06': 'chip_ramdrive-1.png',
  '07': 'directory_closed-1.png',
  '08': 'recycle_bin_empty-1.png',
  '12': 'hard_disk_drive-1.png',
  '13': 'help_book_big-1.png',
  '14': 'shut_down_normal-1.png',
  '16': 'notepad_file-1.png',
  '17': 'printer_slim-1.png',
  '20': 'paint_old-1.png',
  '44': 'minesweeper-0.png',
  '102': 'notepad_file-1.png',
};

export function iconPath(num, size = 32) {
  const map = size === 16 ? icon16 : icon32;
  return iconDir + (map[num] || 'computer_win.png');
}

export const windows = writable({});
export const windowOrder = writable([]);
export const activeWindow = writable(null);

export const startMenuOpen = writable(false);
export const contextMenu = writable({ visible: false, x: 0, y: 0 });
export const dialog = writable({ visible: false, text: '', title: 'Portfolio' });
export const shutdownPhase = writable(null); // null | 'confirm' | 'shutting-down' | 'safe-to-turn-off'

export function openWindow(id, config) {
  windows.update(w => {
    if (w[id]) {
      if (w[id].minimized) {
        return { ...w, [id]: { ...w[id], minimized: false } };
      }
      return w;
    }
    return {
      ...w,
      [id]: {
        ...config,
        minimized: false,
        maximized: false,
        z: ++nextZ,
        x: 80 + Object.keys(w).length * 30,
        y: 30 + Object.keys(w).length * 25,
      }
    };
  });
  windowOrder.update(o => o.includes(id) ? o : [...o, id]);
  focusWindow(id);
}

export function closeWindow(id) {
  windows.update(w => {
    const next = { ...w };
    delete next[id];
    return next;
  });
  windowOrder.update(o => o.filter(w => w !== id));
  activeWindow.update(a => a === id ? null : a);
}

export function minimizeWindow(id) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], minimized: true }
  }));
}

export function restoreWindow(id) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], minimized: false }
  }));
  activeWindow.set(id);
}

export function maximizeWindow(id) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], maximized: !w[id].maximized }
  }));
}

export function focusWindow(id) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], z: ++nextZ }
  }));
  activeWindow.set(id);
}

export function updatePosition(id, x, y) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], x, y }
  }));
}

export function updateSize(id, width, height) {
  windows.update(w => ({
    ...w,
    [id]: { ...w[id], width, height }
  }));
}

export function toggleStartMenu() {
  startMenuOpen.update(v => !v);
}

export function closeStartMenu() {
  startMenuOpen.set(false);
}

export function showContextMenu(x, y) {
  contextMenu.set({ visible: true, x, y });
}

export function hideContextMenu() {
  contextMenu.set({ visible: false, x: 0, y: 0 });
}

export function showDialog(text, title = 'Portfolio') {
  dialog.set({ visible: true, text, title });
}

export function closeDialog() {
  dialog.set({ visible: false, text: '', title: 'Portfolio' });
}

export function startShutdown() {
  closeStartMenu();
  shutdownPhase.set('confirm');
}

export function confirmShutdown() {
  shutdownPhase.set('shutting-down');
  setTimeout(() => {
    shutdownPhase.set('safe-to-turn-off');
  }, 4000);
}

export function cancelShutdown() {
  shutdownPhase.set(null);
}

export function restartDesktop() {
  shutdownPhase.set(null);
}

// File system
const FS_KEY = 'win98-fs';

function norm(p) {
  p = '/' + p.replace(/^\/+/, '');
  if (p !== '/') p = p.replace(/\/+$/, '');
  return p;
}
function base(p) { return p === '/' ? '/' : p.replace(/\/$/, '').split('/').pop(); }

export const fileSystem = writable(
  (() => { try { const d = localStorage.getItem(FS_KEY); return d ? JSON.parse(d) : { '/': { type: 'folder' } }; } catch { return { '/': { type: 'folder' } }; } })()
);
fileSystem.subscribe(fs => { try { localStorage.setItem(FS_KEY, JSON.stringify(fs)); } catch {} });

export function listDir(dirPath) {
  const fs = get(fileSystem);
  dirPath = norm(dirPath);
  const prefix = dirPath === '/' ? '/' : dirPath + '/';
  const out = [];
  for (const p in fs) {
    if (p === dirPath) continue;
    if (p.startsWith(prefix) && !p.slice(prefix.length).includes('/')) {
      out.push({ name: base(p), path: p, ...fs[p] });
    }
  }
  out.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return out;
}

export function createFolder(path) {
  path = norm(path);
  fileSystem.update(fs => fs[path] ? fs : { ...fs, [path]: { type: 'folder' } });
}

export function createFile(path, content = '') {
  path = norm(path);
  fileSystem.update(fs => fs[path] ? fs : { ...fs, [path]: { type: 'file', content } });
}

export function deleteItem(path) {
  path = norm(path);
  if (path === '/') return;
  fileSystem.update(fs => {
    const prefix = path + '/';
    const next = {};
    for (const p in fs) if (p !== path && !p.startsWith(prefix)) next[p] = fs[p];
    return next;
  });
}

export function readFile(path) {
  path = norm(path);
  const item = get(fileSystem)[path];
  return item && item.type === 'file' ? item.content : null;
}

export function writeFile(path, content) {
  path = norm(path);
  fileSystem.update(fs => ({ ...fs, [path]: { type: 'file', content } }));
}

export const refreshFlash = writable(0);
export function triggerRefresh() { refreshFlash.update(n => n + 1); }
