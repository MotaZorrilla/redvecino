let resolveConfirm = null;
let resolveCallback = null;

export function createConfirmResolver() {
    return {
        wait: () => new Promise((resolve) => { resolveConfirm = resolve; }),
        resolve: (val) => { if (resolveConfirm) { resolveConfirm(val); resolveConfirm = null; } },
        open: false,
        title: '',
        message: '',
    };
}

export function getConfirmResolver() {
    return resolveConfirm;
}

export function setConfirmResolver(fn) {
    resolveCallback = fn;
}

export function showConfirm(title, message, danger = false) {
    return new Promise((resolve) => {
        if (resolveCallback) {
            resolveCallback({ title, message, danger, resolve, open: true });
        } else {
            resolve(window.confirm(message));
        }
    });
}
