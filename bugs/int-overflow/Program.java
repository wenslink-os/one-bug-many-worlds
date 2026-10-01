// Big numbers: what is 2147483647 + 1, and what is 9007199254740992 + 1?
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static Object smallBroken() {
        int counter = Integer.MAX_VALUE; // ~broken
        return counter + 1;
    }
    static Object smallFixed() {
        long counter = Integer.MAX_VALUE; // ~fixed
        return counter + 1;
    }
    // long holds 64 bits exactly, so ids above 2^53 are fine.
    static Object idBroken() {
        long id = 9007199254740992L; // ~broken
        return id + 1;
    }
    static Object idFixed() {
        long id = 9007199254740992L; // ~fixed
        return id + 1;
    }

    public static void main(String[] args) {
        check("int32-max-plus-one", Program::smallBroken, Program::smallFixed);
        check("id-above-2-pow-53", Program::idBroken, Program::idFixed);
    }
}
