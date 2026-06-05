export function generatePassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

export function formatCurrency(amount) {
    if (amount == null) return '$0';
    return '$' + Number(amount).toLocaleString('es-CL');
}

export function shortenAddress(address) {
    if (!address) return '';
    const parts = address.split(',');
    return parts[0]?.trim() || address;
}
