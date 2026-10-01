// Text: how long is "a" plus an emoji, and are two spellings of "e with acute" equal?
import java.text.Normalizer;
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static final String EMOJI = "a\uD83D\uDE00";
    static Object lengthBroken() { return EMOJI.length(); } // ~broken
    static Object lengthFixed() { return EMOJI.codePointCount(0, EMOJI.length()); } // ~fixed
    static Object equalBroken() { return "\u00e9".equals("e\u0301"); } // ~broken
    static Object equalFixed() {
        return Normalizer.normalize("\u00e9", Normalizer.Form.NFC).equals(Normalizer.normalize("e\u0301", Normalizer.Form.NFC)); // ~fixed
    }

    public static void main(String[] args) {
        check("emoji-length", Program::lengthBroken, Program::lengthFixed);
        check("accent-equality", Program::equalBroken, Program::equalFixed);
    }
}
