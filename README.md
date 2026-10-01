# One bug, many worlds

The same programming mistake, written in several languages. For each bug you predict what every language will do, then see the real output, the fix, and a test you can paste into your own project.

Live page: https://wenslink-os.github.io/one-bug-many-worlds/ (after GitHub Pages is enabled for this repository)

## What you get

Six bugs, each run in JavaScript, Python and Java:

| Bug | The question |
| --- | --- |
| The missing penny | Do ten dimes add up to exactly one dollar? |
| The counter that wrapped | What is 2147483647 + 1, and 9007199254740992 + 1? |
| Three rows, one list | Why does a grid of empty rows share one list? |
| Two letters, three characters | How long is "a" plus an emoji? |
| One step too far | Which language tells you about an out-of-range read? |
| Minus one is not always four | What is -1 mod 5? |

Each language gets a verdict per check, computed from the real program output and never typed in by hand:

- Wrong, no warning: the program runs and returns a wrong answer.
- Stops with an error: the program fails loudly.
- Correct by default: the language does the right thing.

The JavaScript world also runs live in your browser (in a Web Worker) and is compared with the recorded output.

## Run it

Needs Node 20 or newer. Python 3 and Java 11 or newer are needed to re-run those worlds; without them the recorded output in `recorded/` is used.

```
npm run build     # runs every program, refreshes recorded/ and site/data.js
npm test          # checks fixes, verdicts, regression snippets and recorded output
npm run serve     # http://localhost:8080
```

## How it stays honest

`npm test` fails if any of these drift:

- a fixed version does not produce the documented correct answer
- a verdict differs from the claim written in the bug's `meta.json`
- a regression snippet does not pass when run with `node` or `python3`
- `recorded/` or `site/data.js` no longer matches a fresh run

The recorded outputs in this repository were produced with Node v22.22.2, Python 3.12.3 and OpenJDK 21.0.10. Go and Rust runners are wired into `tools/langs.js`, but no Go or Rust ports exist yet and those runners have not been exercised.

## Add a language or a bug

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: add `program.go` or `program.rs` to a bug folder, run `npm run build`, commit the new files in `recorded/`.

## Licenses

- Code: MIT, see [LICENSE](LICENSE).
- Explanations and written content (`meta.json` text, README, CONTRIBUTING): CC BY 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
