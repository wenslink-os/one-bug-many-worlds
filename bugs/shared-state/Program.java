// Shared state: a grid built from one row, and a list that is secretly reused.
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

public class Program {
    static String show(Supplier<Object> fn) {
        try { return String.valueOf(fn.get()); } catch (Exception e) { return "ERROR " + e.getClass().getSimpleName(); }
    }
    static void check(String id, Supplier<Object> broken, Supplier<Object> fixed) {
        System.out.println("CHECK " + id + "|" + show(broken) + "|" + show(fixed));
    }

    static Object gridBroken() {
        List<List<Integer>> grid = new ArrayList<>(Collections.nCopies(3, new ArrayList<Integer>())); // ~broken
        grid.get(0).add(1);
        int total = 0;
        for (List<Integer> row : grid) total += row.size();
        return total;
    }
    static Object gridFixed() {
        List<List<Integer>> grid = new ArrayList<>();
        for (int i = 0; i < 3; i++) grid.add(new ArrayList<Integer>()); // ~fixed
        grid.get(0).add(1);
        int total = 0;
        for (List<Integer> row : grid) total += row.size();
        return total;
    }

    // Java has no default arguments; the same mistake is a shared static list.
    static final List<Integer> SHARED = new ArrayList<>(); // ~broken
    static List<Integer> addItem(int item) { SHARED.add(item); return SHARED; }
    static List<Integer> addItemFixed(int item) {
        List<Integer> bucket = new ArrayList<>(); // ~fixed
        bucket.add(item);
        return bucket;
    }
    static Object bucketBroken() { addItem(1); return addItem(2).size(); }
    static Object bucketFixed() { addItemFixed(1); return addItemFixed(2).size(); }

    public static void main(String[] args) {
        check("grid-rows", Program::gridBroken, Program::gridFixed);
        check("reused-bucket", Program::bucketBroken, Program::bucketFixed);
    }
}
