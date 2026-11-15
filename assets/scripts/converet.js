// taken from https://github.com/integrityofstellar/mars-clock/blob/main/src/main.rs

let MARS_SOL_LENGTH = 88775.244;
let MARS_EPOCH = 2451549.5;
let EARTH_SECONDS_PER_DAY = 86400;
let MARS_TO_EARTH_DAYS = MARS_SOL_LENGTH / EARTH_SECONDS_PER_DAY;
let MARS_MIDNIGHT_OFFSET = -0.00018518;

/**
 * @typedef MarsTime
 * @property {number} amt
 * @property {number} ls
 */

const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;
// Equivalent of Rust's f64::fract (keeps the sign of the input)
const fract = (x) => x - Math.trunc(x);

/**
 * @param {Date} earthTime
 * @returns {number}
 */
export function earthTimeToJulianDate(earthTime) {
  // Rust uses whole seconds from timestamp(), so floor to match
  const timestamp = Math.floor(earthTime.getTime() / 1000);
  return 2440587.5 + timestamp / EARTH_SECONDS_PER_DAY;
}

/**
 * @param {number} jd
 * @returns {number} solar longitude in degrees
 */
function calculateSolarLongitude(jd) {
  const mAlpha = 19.387;
  const mPhi = 0.08992;
  const mEpsilon = 0.42184;
  const mTau = 1.90258;

  const t = (jd - 2451545.0) / 36525.0;
  const m = toRadians(19.387 + 0.52402075 * t);

  const alpha = toRadians(mAlpha + mPhi * (jd - MARS_EPOCH));
  const pbs = mEpsilon * Math.sin(alpha + mTau - m);

  const ls =
    (alpha + 2.0 * mEpsilon * Math.sin(alpha - m) - pbs + Math.PI) %
    (2.0 * Math.PI);
  return toDegrees(ls);
}

/**
 * @param {Date} earthTime
 * @returns {MarsTime}
 */
export function earthTimeToMarsTime(earthTime) {
  const julianDate = earthTimeToJulianDate(earthTime);
  const marsSol = (julianDate - MARS_EPOCH) / MARS_TO_EARTH_DAYS;

  const amt = ((fract(marsSol + MARS_MIDNIGHT_OFFSET) * 24.0 + 24.0) % 24.0);
  const ls = calculateSolarLongitude(julianDate);

  return { amt, ls };
}

/**
 * @param {MarsTime} marsTime
 * @returns {string}
 */
export function formatMarsTime(marsTime) {
  const pad = (n) => String(n).padStart(2, "0");
  const frac = fract(marsTime.amt);

  const hours = Math.trunc(marsTime.amt);
  const minutes = Math.trunc(frac * 60) % 60;
  const seconds = Math.trunc(frac * 3600) % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `AMT (LMST at 0°): ${pad(hours)}:${pad(minutes)}:${pad(seconds)}  Ls${marsTime.ls.toFixed(2)}°`;
}
