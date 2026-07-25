let _clip = null;

export function setClipboard(item) { _clip = item; }
export function getClipboard() { return _clip; }
export function clearClipboard() { _clip = null; }
