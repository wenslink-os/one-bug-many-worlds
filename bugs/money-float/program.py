# Money and floating point: add ten dimes, then compare 0.1 + 0.2 with 0.3.
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


def ten_dimes_broken():
    total = 0.0
    for _ in range(10):
        total += 0.1  # ~broken
    return total


def ten_dimes_fixed():
    cents = 0
    for _ in range(10):
        cents += 10  # ~fixed
    return f"{cents // 100}.{cents % 100:02d}"


def equal_broken():
    return 0.1 + 0.2 == 0.3  # ~broken


def equal_fixed():
    return round(0.1 * 100) + round(0.2 * 100) == round(0.3 * 100)  # ~fixed


check("ten-dimes", ten_dimes_broken, ten_dimes_fixed)
check("equals-point-three", equal_broken, equal_fixed)
