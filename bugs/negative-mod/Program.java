// Wrap-around: which slot is index -1 in a ring of 5, and what is -7 divided by 2 (rounded down)?
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static Object slotBroken() { int i = -1; return i % 5; } // ~broken
    static Object slotFixed() { int i = -1; return Math.floorMod(i, 5); } // ~fixed
    static Object divBroken() { int a = -7; return a / 2; } // ~broken
    static Object divFixed() { int a = -7; return Math.floorDiv(a, 2); } // ~fixed

    public static void main(String[] args) {
        check("ring-slot", Program::slotBroken, Program::slotFixed);
        check("floor-division", Program::divBroken, Program::divFixed);
    }
}
