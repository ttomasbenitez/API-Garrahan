
const toNum = v => (v === null || v === '' || v === undefined ? null : Number(v));
const toStr = v => (v === null || v === '' || v === undefined ? null : String(v));
const toFloat = v => (v === null || v === '' || v === undefined ? null : parseFloat(v));
export { toNum, toStr, toFloat };
