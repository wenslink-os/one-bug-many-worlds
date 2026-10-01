# Arrays: sum [1, 2, 3] with an off-by-one loop, and read the last element with [-1].
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



def sum_broken():
    a = [1, 2, 3]
    s = 0
    for i in range(len(a) + 1):  # ~broken
        s += a[i]
    return s


def sum_fixed():
    a = [1, 2, 3]
    s = 0
    for i in range(len(a)):  # ~fixed
        s += a[i]
    return s


def last_broken():
    return [1, 2, 3][-1]  # ~broken


def last_fixed():
    return [1, 2, 3][-1]  # ~fixed


check("sum-inclusive-loop", sum_broken, sum_fixed)
check("last-element", last_broken, last_fixed)
