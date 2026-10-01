// Money and floating point: add ten dimes, then compare 0.1 + 0.2 with 0.3.
import java.util.Locale;
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static Object tenDimesBroken() {
        double total = 0.0;
        for (int i = 0; i < 10; i++) total += 0.1; // ~broken
        return total;
    }
    static Object tenDimesFixed() {
        int cents = 0;
        for (int i = 0; i < 10; i++) cents += 10; // ~fixed
        return String.format(Locale.ROOT, "%d.%02d", cents / 100, cents % 100);
    }
    static Object equalBroken() { return 0.1 + 0.2 == 0.3; } // ~broken
    static Object equalFixed() { return Math.round(0.1 * 100) + Math.round(0.2 * 100) == Math.round(0.3 * 100); } // ~fixed

    public static void main(String[] args) {
        check("ten-dimes", Program::tenDimesBroken, Program::tenDimesFixed);
        check("equals-point-three", Program::equalBroken, Program::equalFixed);
    }
}
