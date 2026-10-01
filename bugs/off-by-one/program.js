// Arrays: sum [1, 2, 3] with an off-by-one loop, and read the last element with [-1].
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

function sumBroken() {
  const a = [1, 2, 3];
  let s = 0;
  for (let i = 0; i <= a.length; i++) s += a[i]; // ~broken
  return s;
}
function sumFixed() {
  const a = [1, 2, 3];
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]; // ~fixed
  return s;
}
const lastBroken = () => [1, 2, 3][-1]; // ~broken
const lastFixed = () => [1, 2, 3].at(-1); // ~fixed

check("sum-inclusive-loop", sumBroken, sumFixed);
check("last-element", lastBroken, lastFixed);
