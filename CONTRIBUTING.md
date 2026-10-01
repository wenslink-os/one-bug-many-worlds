# Contributing

## Add a language port (Go, Rust, or another)

1. Pick a bug folder in `bugs/`, for example `bugs/off-by-one/`.
2. Add the program using the file name in `tools/langs.js` (`program.go`, `program.rs`). For a new language, add an entry to `tools/langs.js` first: label, file name, comment marker, version command, and how to run it.
3. The program must print one line per check, in the same format as the existing ports:

   ```
   CHECK <check-id>|<broken result>|<fixed result>
   ```

   - Catch exceptions or panics around the broken code and print `ERROR <ErrorName>` as the result.
   - Print booleans as `true` or `false`.
   - Mark the lines that contain the mistake with a trailing `// ~broken` and the lines that fix it with `// ~fixed` (use the language's own comment marker).
4. Run `npm run build`. It runs your program, writes `recorded/<bug>/<lang>.txt`, and updates `site/data.js`.
5. Add the verdicts your language produced to `expected` in the bug's `meta.json`, and a sentence for your language in `worlds`. Verdicts are `silent`, `raises` or `safe`.
6. Run `npm test`. Commit your program, `recorded/`, `site/data.js` and `meta.json`.

## Add a new bug

Create `bugs/<id>/` with `meta.json` (copy an existing one), at least JavaScript and Python programs, then `npm run build` and `npm test`. A good bug has two or more checks, a correct answer that is not controversial, and a fix you can state in one sentence.

## Rules for written content

Explain what happens, not who is to blame. State only what the recorded output supports. Content you add is published under CC BY 4.0, code under MIT.
