// Money and floating point: add ten dimes, then compare 0.1 + 0.2 with 0.3.
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

function tenDimesBroken() {
  let total = 0;
  for (let i = 0; i < 10; i++) total += 0.1; // ~broken
  return total;
}
function tenDimesFixed() {
  let cents = 0;
  for (let i = 0; i < 10; i++) cents += 10; // ~fixed
  return Math.floor(cents / 100) + "." + String(cents % 100).padStart(2, "0");
}
const equalBroken = () => 0.1 + 0.2 === 0.3; // ~broken
const equalFixed = () => Math.round(0.1 * 100) + Math.round(0.2 * 100) === Math.round(0.3 * 100); // ~fixed

check("ten-dimes", tenDimesBroken, tenDimesFixed);
check("equals-point-three", equalBroken, equalFixed);
