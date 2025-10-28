
const toNum = v => (v === null || v === '' || v === undefined ? null : Number(v));
const toStr = v => (v === null || v === '' || v === undefined ? null : String(v));
const toFloat = v => (v === null || v === '' || v === undefined ? null : parseFloat(v));

const getError = (message, code) => {
  const err = new Error(message);
  err.status = 404;
  err.code = code;
  return err;
};
export { toNum, toStr, toFloat, getError };
