import { parseFlags } from "https://deno.land/x/cliffy@v0.16.0/flags/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.83.0/path/mod.ts";
import { iterateGraphemes } from "./graphemes.ts";

/**
 *
 * @param criteria
 */
async function list(
  criteria: Partial<Record<Names, (val: string) => boolean>>,
) {
  function includeRow(row: Record<Names, string>): boolean {
    return Object.entries(criteria).every(([field, pred]) =>
      pred && pred(row[<Names> field])
    );
  }
  return (await ucd()).map(name).filter(includeRow);
}

function inSourceDir(fileName: string) {
  return fromFileUrl(join(dirname(import.meta.url), fileName));
}

const FileWriter = async (fileName: string) => {
  const encoder = new TextEncoder();
  const openFile = await Deno.open(
    fileName,
    { write: true, create: true, truncate: true },
  );

  async function write(text: string) {
    return await openFile.write(encoder.encode(text));
  }
  async function writeLn(text: string) {
    await write(text);
    return write("\n");
  }
  async function close() {
    await openFile.close();
  }

  return { write, writeLn, close };
};

/** rows are:  */
let _ucd: string[][];

const categories = {
  Lu: "Letter, Uppercase",
  Ll: "Letter, Lowercase",
  Lt: "Letter, Titlecase",
  Lm: "Letter, Modifier",
  Lo: "Letter, Other",
  Mn: "Mark, Nonspacing",
  Mc: "Mark, Spacing Combining",
  Me: "Mark, Enclosing",
  Nd: "Number, Decimal Digit",
  Nl: "Number, Letter",
  No: "Number, Other",
  Pc: "Punctuation, Connector",
  Pd: "Punctuation, Dash",
  Ps: "Punctuation, Open",
  Pe: "Punctuation, Close",
  Pi:
    "Punctuation, Initial quote (may behave like Ps or Pe depending on usage)",
  Pf: "Punctuation, Final quote (may behave like Ps or Pe depending on usage)",
  Po: "Punctuation, Other",
  Sm: "Symbol, Math",
  Sc: "Symbol, Currency",
  Sk: "Symbol, Modifier",
  So: "Symbol, Other",
  Zs: "Separator, Space",
  Zl: "Separator, Line",
  Zp: "Separator, Paragraph",
  Cc: "Other, Control",
  Cf: "Other, Format",
  Cs: "Other, Surrogate",
  Co: "Other, Private Use",
  Cn: "Other, Not Assigned (no characters in the file have this property)",
};

//http://www.unicode.org/Public/5.1.0/ucd/UCD.html#UnicodeData.txt
const fieldNames = [
  "code",
  "name",
  "category", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#General_Category_Values
  "combiningClass", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Canonical_Combining_Class_Values
  "bidirectional", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Bidi_Class_Values
  "decomposition", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Bidi_Class_Values
  "numeric0",
  "numeric1",
  "numeric2",
  "bidiMirrored",
  "unicode1Name",
  "isoComment",
  "simpleUppercase", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Case_Mappings
  "simpleLowercase", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Case_Mappings
  "simpleTitlecase", //https://www.unicode.org/Public/5.1.0/ucd/UCD.html#Case_Mappings
] as const;
type Names = typeof fieldNames[number];
function name(row: string[]): Record<Names, string> {
  return row.reduce((acc, value, index) => {
    acc[fieldNames[index]] = value;
    return acc;
  }, {} as Record<Names, string>);
}
async function ucd() {
  if (!_ucd) {
    const unicodeFile = inSourceDir("UnicodeData.txt");
    let fileData: string;
    try {
      fileData = await Deno.readTextFile(unicodeFile);
    } catch (e) {
      console.log(`Unable to read file '${unicodeFile}'`, e);
      Deno.exit(1);
    }
    const rows = fileData.split(/\r?\n/);
    _ucd = rows.map((row) => row.split(";"));
  }
  return _ucd;
}

async function parsePropertyFile(fileName: string) {
  const fileData = await Deno.readTextFile(inSourceDir(fileName));

  return fileData.split(/\r?\n/).filter((line) => !/^\s*(#.*)?$/.test(line) // remove comments and empty lines
  ).map((line) =>
    /(([A-Z0-9]+)(..([A-Z0-9]+))?)\s*;\s*(\S+)\s*#(.*)$/.exec(line) || []
  ).reduce((props, [, , from, , to, prop, comment]) => {
    if (/<reserved/.test(comment)) {
      return props;
    }
    prop = prop.replace(/_/g, "");
    const lower = parseInt(from, 16);
    const upper = parseInt(to || from, 16);
    props[prop] ??= new Array<number>();
    const p = props[prop];
    for (let i = lower; i <= upper; i++) {
      p.push(i);
    }
    return props;
  }, {} as Record<string, Array<number>>);
}

function showValuesCompact(numbers: number[]) {
  numbers = numbers.sort((a, b) => a - b);
  const hex = (n: number) => `0x${n.toString(16)}`;
  let lastNumber = numbers[0];
  let firstInCluser = numbers[0];
  for (let i = 1; i <= numbers.length; i++) {
    const n = numbers[i];
    if (lastNumber + 1 !== n) {
      if (lastNumber === firstInCluser) {
        console.log(`${hex(firstInCluser)}`);
      } else {
        console.log(
          `${hex(firstInCluser)}, ${hex(lastNumber)} [${lastNumber -
            firstInCluser}]`,
        );
      }
      console.log(`[${n - lastNumber}]`);
      firstInCluser = n;
    }
    lastNumber = n;
  }
}

const hex = (n: number) => `0x${n.toString(16)}`;

const between = (a: number, b: number) => `(v >= ${hex(a)} && v <= ${hex(b)})`;
const or = (...preds: string[]) => preds.join(" || ");
const and = (...preds: string[]) => preds.join(" && ");
const equalTo = (v: number) => `(v === ${hex(v)})`;

/**
 * Code to compress the unicode property data.
 * All the code points for a particular property will be encoded into a string that
 * looks like this:
 * ((s: Set<number>) => (v: number) => s.has(v))(strToSet("ace", "gikp"))
 * This to conserve space in the generated source file.
 * It is a function that takes a set and returns a function that takes a number
 * that gives a boolean. It is then given a set constructed from the encoded strings.
 * The strings in the example will give a set that has the code points for
 * "a", "c", "e", and "g", "h", "i", and "k" "l" "m" "n" "o" "p",
 * i.e the first string is a list of characters, and the second a list of character ranges.
 * This made the source file be 5kiB instead of 23kiB.
 */
function makeCompactRule(numbers: number[], threshold: number) {
  numbers = numbers.sort((a, b) => a - b);
  const bigblocks = [];
  const blocks = [];
  const rest = [];
  let lastNumber = numbers[0];
  let firstInCluser = numbers[0];
  if (numbers.length === 1) {
    return `(v:number) => ${equalTo(numbers[0])}`;
  }
  for (let i = 1; i <= numbers.length; i++) {
    const n = numbers[i];
    if (lastNumber + 1 !== n) {
      if (lastNumber === firstInCluser) {
        rest.push(lastNumber);
      } else {
        const blockSize = lastNumber - firstInCluser;
        if (blockSize > threshold) {
          bigblocks.push([firstInCluser, lastNumber]);
        } else if (blockSize > 2) {
          blocks.push([firstInCluser, lastNumber]);
        } else {
          for (let i = firstInCluser; i <= lastNumber; i++) {
            rest.push(i);
          }
        }
      }
      firstInCluser = n;
    }
    lastNumber = n;
  }

  const escape = (n: number) =>
    ['"', "\u0000", "\u000e", "\u001f", "\t", "\n", "\r", "\u2028", "\u2029"]
      .map(tcp).includes(n);
  const fcp = (cp: number) => {
    if (escape(cp)) {
      return `\\u{${cp.toString(16)}}`;
    } else {
      return String.fromCodePoint(cp);
    }
  };
  const tcp = (cp: string) => cp.codePointAt(0);
  const blockString = `"${(blocks.map((b) => b.map(fcp).join("")).join(""))}"`;
  const restStr = `"${rest.map(fcp).join("")}"`;

  if (rest.length === 0 && blocks.length + bigblocks.length < 5) {
    bigblocks.push(...blocks);
    const betweens = bigblocks.map(([from, to]) => between(from, to));
    return `(v: number) => ${or(...betweens)}`;
  }

  const betweens = bigblocks.map(([from, to]) => between(from, to));
  return `((s: Set<number>) => (v: number) => ${or(...betweens, "s.has(v)")})` +
    `(strToSet(${restStr}, ${blockString}))`;
}

async function writeGraphemeSupport(fileName: string, threshold: number) {
  const properties = await parsePropertyFile("GraphemeBreakProperty.txt");
  const emoji = await parsePropertyFile("emoji-data.txt");

  const { write, writeLn, close } = await FileWriter(fileName);

  /*
   * Code to decompress the unicode property data.
   * See description further up
   */
  await writeLn(`
  const cp = (s:string) => s.codePointAt(0)!;
  const r = (a: number, b: number) => Array((b-a+1)).fill(0).map((_,i)=>i+a)
  const strR = (rs: string) => {
    const range = [];
    const cps = [...rs];
    for (let i = 0; i < cps.length; i+=2) {
      range.push(r(cp(cps[i]), cp(cps[i+1])))
    }
    return range.flat();
  }
  const strToSet = (s: string, r: string) => {
    return [...s].map(c => cp(c))
    .concat(strR(r))
    .reduce((s, c) => s.add(c), new Set<number>());
  }

  `.replace(/^[ ]{2}/mg, ""));

  await writeLn(`export const graphemeBreakProp = {`);

  const hex = (n: number) => `0x${n.toString(16)}`;

  for (const [prop, values] of Object.entries(properties)) {
    // LVT is huge and has small predictable gaps
    const from = 0xAC00, to = 0xD7A3;
    const bigThresholds = [
      "Extend",
    ];

    if (prop === "LVT") {
      await writeLn(
        `  // shorter (and faster!) than the whole table (${values.length} entries)`,
      );
      await writeLn(
        `  is${prop}: (v: number) => ${
          and(between(from, to), `!((v-${hex(from)}) % 28)`)
        },`,
      );
    } else if (prop === "LV") {
      await writeLn(
        `  // shorter (and faster!) than the whole table (${values.length} entries)`,
      );
      await writeLn(
        `  is${prop}: (v: number) => ${
          and(between(from, to), `((v-${hex(from)}) % 28)`)
        },`,
      );
    } else {
      await writeLn(`  is${prop}: ${makeCompactRule(values, threshold)},`);
    }
  }
  await writeLn(
    `  // from emoji-data.txt, needed for rule http://unicode.org/reports/tr29/#GB11`,
  );
  await writeLn(
    `  isExtendedPictographic: ${
      makeCompactRule(emoji.ExtendedPictographic, threshold)
    },`,
  );
  await writeLn(`}`);
  await close();
}

async function writeLatinDecompositions(fileName: string) {
  const { write, writeLn, close } = await FileWriter(fileName);

  const compositions: { [composed: string]: string } = {};
  const parseCodePoint = (p: string) => String.fromCodePoint(parseInt(p, 16));

  await writeLn("export const decompositionMap: {[char: string]: string} = {");

  for (
    const { code, name, decomposition } of await list({
      name: (val) => /LATIN (CAPITAL|SMALL) LETTER . WITH/.test(val),
      decomposition: (val) => !!val.length && !/</.test(val),
    })
  ) {
    const decomposedStr = decomposition.split(" ").map(parseCodePoint).join(
      "",
    );
    await writeLn(`  "${parseCodePoint(code)}": "${decomposedStr}",`);
  }
  await writeLn("};");

  await writeLn(`
export const decomposeChars = (text: string) =>
    text.replace(/./g, ch => decompositionMap[ch] || ch);`);

  await close();
}

if (import.meta.main) {
  const u = (b: string) => String.fromCodePoint(parseInt(b, 16));
  const U = (b: string) => b.length === 4 ? `\\u${b}` : `\\u{${b}}`;
  const displayRow = (row: Record<Names, string>) => {
    let decomposition = "";
    if (row.decomposition.length) {
      const m = row.decomposition.match(/(<[^>]+>)?\s*((([A-Z0-9]+)\s*)+)/)!;
      const [, tag, rawBytes] = m;
      const bytes = rawBytes.match(/[A-Z0-9]{4}/g)!;
      decomposition = `${tag ?? ""}"${bytes.map(U).join("")}" "${
        bytes.map(u).join("")
      }"`;
    }
    console.log(
      U(row.code),
      u(row.code),
      row.category,
      `"${row.name}"`,
      decomposition,
      row.unicode1Name,
    );
  };

  const { flags, unknown } = parseFlags(Deno.args);
  if (unknown.length > 0) {
    if (flags.help) {
      printUsage();
    } else if (unknown.length === 1 && unknown[0] === "list") {
      console.log(flags);
      const criteria: Partial<Record<Names, (val: string) => boolean>> = {};
      for (const flag in flags) {
        if (!fieldNames.includes(flag as Names)) {
          throw `${flag} is not a field in UnicodeData.txt (use --help)`;
        }
        const val = flags[flag];
        const rangeLiteral = /^\[([a-f0-9]+)-([a-f0-9]+)\]$/;
        const regexLiteral = /^\/(.+)\/(\w*)$/;
        if (val === true) {
          console.log(`Filtering out rows with empty '${flag}' fields`);
          criteria[<Names> flag] = (field) => !!field && field.length > 0;
        } else if (rangeLiteral.test(val)) {
          const match = rangeLiteral.exec(val);
          console.log(
            `Filtering rows where ${match![1]} <= '${flag}' < ${match![2]}`,
          );
          criteria[<Names> flag] = (field) => {
            const val = parseInt(field, 16);
            return (val >= parseInt(match![1], 16) &&
              val <= parseInt(match![2], 16));
          };
        } else if (regexLiteral.test(val)) {
          const match = regexLiteral.exec(val);
          const r = new RegExp(match![1], match![2]);
          console.log(`Filtering rows where '${flag}' ~= ${r.toString()}`);
          criteria[<Names> flag] = (val) => r.test(val);
        } else {
          console.log(
            `Filtering rows where '${flag}' == '${val}' (case insensitive)`,
          );

          criteria[<Names> flag] = (v) =>
            !!v && v.toLowerCase() == val.toLowerCase();
        }
      }

      (await list(criteria)).forEach(displayRow);
    } else if (unknown.length > 0 && unknown[0] === "info") {
      for (const rune of iterateGraphemes(unknown.slice(1).join(" "))) {
        console.log(`${rune}:`);
        for (const codePoint of rune) {
          (await list({
            code: (val) => parseInt(val, 16) === codePoint.codePointAt(0),
          })).forEach(displayRow);
        }
        console.log();
      }
    } else if (unknown.length > 0 && unknown[0] === "create") {
      const threshold = +flags.threshold ?? 500;
      const files: Record<string, (f: string) => void> = {
        "decompositions": (f: string) => writeLatinDecompositions(f),
        "graphemes": (f: string) => writeGraphemeSupport(f, threshold),
      };
      const { entries, keys } = Object;
      for (const [flag, value] of entries(flags)) {
        if (flag === "threshold") continue;
        if (!(flag in files)) {
          console.log(`Unknown file to create: ${flag}.`);
          console.log(`Available files are: ${keys(files).join(", ")}`);
          continue;
        }
        const fileName = flags[flag];
        if (fileName === true) {
          throw `Must supply filename to --${flag}`;
        }
        await files[flag](fileName);
        console.log(`wrote ${flag} to ${fileName}`);
      }
    } else {
      console.log(`unknown command '${unknown[0]}'`);
      printUsage();
    }
  } else {
    printUsage();
  }
}
function printUsage() {
  console.log(
    `
    usage: ucq [cmd] [flags] [files]

    commands:

      info <text> iterate over any graphemes of the text and print info about their code points

      create [--decompositions [filename]] [--graphemes [filename]]
        creates the .ts-files for decompositionsand graphemes respectively

      list [--<field> [value]]+
        search for a verbatim value --category "Mn", (see below for categories)
        or a range of hex-values --code [1f601-1f620]
        or a regex --name '/LATIN.*CAPITAL.* C /'

    Available field names:
    ${fieldNames.map((n) => `  - ${n}\n`).join("")}
    Available categories:
    ${Object.entries(categories).map(([c, d]) => `  -${c}: ${d}\n`).join("")}
    `
      .replace(/^[ ]{4}/mg, ""),
  );
}
