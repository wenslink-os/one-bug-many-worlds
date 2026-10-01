# Shared state: a grid built from one row, and a default value that is reused.
def show(fn):
    try:
        v = fn()
        if isinstance(v, bool):
            return "true" if v else "false"
        return str(v)
    except Exception as e:
        return "ERROR " + type(e).__name__


def check(id, broken, fixed):
    print("CHECK " + id + "|" + show(broken) + "|" + show(fixed))


def grid_broken():
    grid = [[]] * 3  # ~broken
    grid[0].append(1)
    return sum(len(row) for row in grid)


def grid_fixed():
    grid = [[] for _ in range(3)]  # ~fixed
    grid[0].append(1)
    return sum(len(row) for row in grid)


def add_item(item, bucket=[]):  # ~broken
    bucket.append(item)
    return bucket


def add_item_fixed(item, bucket=None):  # ~fixed
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket


def bucket_broken():
    add_item(1)
    return len(add_item(2))


def bucket_fixed():
    add_item_fixed(1)
    return len(add_item_fixed(2))


check("grid-rows", grid_broken, grid_fixed)
check("reused-bucket", bucket_broken, bucket_fixed)
