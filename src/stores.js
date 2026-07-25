import { writable } from 'svelte/store';

let nextZ = 100;

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
  shutdownPhase.set('confirm');
}

export function confirmShutdown() {
  shutdownPhase.set('shutting-down');
  setTimeout(() => {
    shutdownPhase.set('safe-to-turn-off');
    setTimeout(() => {
      window.close();
    }, 4000);
  }, 2000);
}

export function cancelShutdown() {
  shutdownPhase.set(null);
}
