// Big numbers: what is 2147483647 + 1, and what is 9007199254740992 + 1?
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

// JavaScript numbers are 64-bit floats, so 32-bit overflow never happens here.
const smallBroken = () => 2147483647 + 1; // ~broken
const smallFixed = () => 2147483647 + 1; // ~fixed
// The same floats stop counting exactly above 2^53.
const idBroken = () => 9007199254740992 + 1; // ~broken
const idFixed = () => 9007199254740992n + 1n; // ~fixed

check("int32-max-plus-one", smallBroken, smallFixed);
check("id-above-2-pow-53", idBroken, idFixed);
