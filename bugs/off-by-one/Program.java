// Arrays: sum [1, 2, 3] with an off-by-one loop, and read the last element with [-1].
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static Object sumBroken() {
        int[] a = {1, 2, 3};
        int s = 0;
        for (int i = 0; i <= a.length; i++) s += a[i]; // ~broken
        return s;
    }
    static Object sumFixed() {
        int[] a = {1, 2, 3};
        int s = 0;
        for (int i = 0; i < a.length; i++) s += a[i]; // ~fixed
        return s;
    }
    static Object lastBroken() { int[] a = {1, 2, 3}; return a[-1]; } // ~broken
    static Object lastFixed() { int[] a = {1, 2, 3}; return a[a.length - 1]; } // ~fixed

    public static void main(String[] args) {
        check("sum-inclusive-loop", Program::sumBroken, Program::sumFixed);
        check("last-element", Program::lastBroken, Program::lastFixed);
    }
}
