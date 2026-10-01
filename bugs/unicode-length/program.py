# Text: how long is "a" plus an emoji, and are two spellings of "e with acute" equal?
import unicodedata


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



def length_broken():
    return len("a\U0001F600")  # ~broken


def length_fixed():
    return len("a\U0001F600")  # ~fixed


def equal_broken():
    return "\u00e9" == "e\u0301"  # ~broken


def equal_fixed():
    return unicodedata.normalize("NFC", "\u00e9") == unicodedata.normalize("NFC", "e\u0301")  # ~fixed


check("emoji-length", length_broken, length_fixed)
check("accent-equality", equal_broken, equal_fixed)
