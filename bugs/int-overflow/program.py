# Big numbers: what is 2147483647 + 1, and what is 9007199254740992 + 1?
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


# Python integers grow as needed, so neither line can overflow.
def small_broken():
    return 2147483647 + 1  # ~broken


def small_fixed():
    return 2147483647 + 1  # ~fixed


def id_broken():
    return 9007199254740992 + 1  # ~broken


def id_fixed():
    return 9007199254740992 + 1  # ~fixed


check("int32-max-plus-one", small_broken, small_fixed)
check("id-above-2-pow-53", id_broken, id_fixed)
