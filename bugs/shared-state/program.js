// Shared state: a grid built from one row, and a default value that is reused.
function show(fn) { try { return String(fn()); } catch (e) { return "ERROR " + e.constructor.name; } }
function check(id, broken, fixed) { console.log("CHECK " + id + "|" + show(broken) + "|" + show(fixed)); }

function gridBroken() {
  const grid = new Array(3).fill([]); // ~broken
  grid[0].push(1);
  return grid.flat().length;
}
function gridFixed() {
  const grid = Array.from({ length: 3 }, () => []); // ~fixed
  grid[0].push(1);
  return grid.flat().length;
}

// JavaScript evaluates a default value again on every call, so this is safe.
function addItem(item, bucket = []) { bucket.push(item); return bucket; } // ~broken
function addItemFixed(item, bucket = []) { bucket.push(item); return bucket; } // ~fixed
const bucketBroken = () => { addItem(1); return addItem(2).length; };
const bucketFixed = () => { addItemFixed(1); return addItemFixed(2).length; };

check("grid-rows", gridBroken, gridFixed);
check("reused-bucket", bucketBroken, bucketFixed);
