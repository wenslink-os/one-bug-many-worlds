// Wrap-around: which slot is index -1 in a ring of 5, and what is -7 divided by 2 (rounded down)?
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

const slotBroken = () => { const i = -1; return i % 5; }; // ~broken
const slotFixed = () => { const i = -1; return ((i % 5) + 5) % 5; }; // ~fixed
const divBroken = () => Math.trunc(-7 / 2); // ~broken
const divFixed = () => Math.floor(-7 / 2); // ~fixed

check("ring-slot", slotBroken, slotFixed);
check("floor-division", divBroken, divFixed);
