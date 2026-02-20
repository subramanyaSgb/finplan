const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const fmt = (n, symbol = '₹') => {
  if (n === undefined || n === null) return `${symbol}0`;
  if (n >= 100000) return `${symbol}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${symbol}${(n / 1000).toFixed(1)}K`;
  return `${symbol}${Math.round(n).toLocaleString('en-IN')}`;
};

export const fmtFull = (n, symbol = '₹') => {
  if (symbol === '₹') return `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
  return `${symbol}${Math.round(n || 0).toLocaleString('en-US')}`;
};

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const fmtDate = (dateStr) => {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  } catch {
    return dateStr;
  }
};

export { MONTHS, WEEKDAYS };
