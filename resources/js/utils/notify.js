const listeners = new Set();

export function addToastListener(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function toast(message, type = 'success') {
    listeners.forEach(fn => fn({ message, type, id: Date.now() }));
}
