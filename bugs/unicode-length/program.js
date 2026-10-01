// Text: how long is "a" plus an emoji, and are two spellings of "e with acute" equal?
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

const lengthBroken = () => "a\u{1F600}".length; // ~broken
const lengthFixed = () => [..."a\u{1F600}"].length; // ~fixed
const equalBroken = () => "\u00e9" === "e\u0301"; // ~broken
const equalFixed = () => "\u00e9".normalize("NFC") === "e\u0301".normalize("NFC"); // ~fixed

check("emoji-length", lengthBroken, lengthFixed);
check("accent-equality", equalBroken, equalFixed);
