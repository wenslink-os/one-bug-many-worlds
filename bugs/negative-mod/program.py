# Wrap-around: which slot is index -1 in a ring of 5, and what is -7 divided by 2 (rounded down)?
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



def slot_broken():
    i = -1
    return i % 5  # ~broken


def slot_fixed():
    i = -1
    return i % 5  # ~fixed


def div_broken():
    return -7 // 2  # ~broken


def div_fixed():
    return -7 // 2  # ~fixed


check("ring-slot", slot_broken, slot_fixed)
check("floor-division", div_broken, div_fixed)
