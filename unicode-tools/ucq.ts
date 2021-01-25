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

function filePath(fileName: string) {
  return fromFileUrl(join(dirname(import.meta.url), fileName));
}

const FileWriter = async (fileName: string) => {
  const encoder = new TextEncoder();
  const openFile = await Deno.open(
    filePath(fileName),
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
const names = [
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
type Names = typeof names[number];
function name(row: string[]): Record<Names, string> {
  return row.reduce((acc, value, index) => {
    acc[names[index]] = value;
    return acc;
  }, {} as Record<Names, string>);
}
async function ucd() {
  if (!_ucd) {
    const unicodeFile = filePath("UnicodeData.txt");
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
  const fileData = await Deno.readTextFile(filePath(fileName));

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
const inSetOrBlock = (set: Array<number>, blocks: string[]) =>
  `((s: Set<number>) => (v: number) => ${or(...blocks, "s.has(v)")})(new Set([${
    set.map(hex).join(", ")
  }]))`;
const inSet = (set: Array<number>) =>
  `((s: Set<number>) => (v: number) => s.has(v))(new Set([${
    set.map(hex).join(", ")
  }]))`;

function makeCompactRule(numbers: number[], threshold: number) {
  numbers = numbers.sort((a, b) => a - b);
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
  const blockExprs = blocks.map(([from, to]) => between(from, to));

  if (rest.length && blockExprs.length) {
    if (rest.length === 1) {
      return or(equalTo(rest[0]), ...blockExprs);
    }
    return inSetOrBlock(rest, blockExprs);
  } else if (rest.length) {
    if (rest.length === 1) {
      return `(v:number) => ${equalTo(rest[0])}`;
    }
    return inSet(rest);
  } else {
    return `(v:number) => ${or(...blockExprs)}`;
  }
}

async function writeGraphemeSupport() {
  const properties = await parsePropertyFile("GraphemeBreakProperty.txt");
  const emoji = await parsePropertyFile("emoji-data.txt");

  const { write, writeLn, close } = await FileWriter(
    "grapheme-break-property.ts",
  );

  await writeLn(`export const graphemeBreakProp = {`);

  const hex = (n: number) => `0x${n.toString(16)}`;

  for (const [prop, values] of Object.entries(properties)) {
    // LVT is huge and has small predictable gaps
    console.log(`working with '${prop}'`);
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
      const threshold = bigThresholds.includes(prop) ? 100 : 20;
      await writeLn(`  is${prop}: ${makeCompactRule(values, threshold)},`);
    }
  }
  await writeLn(
    `  // from emoji-data.txt, needed for rule http://unicode.org/reports/tr29/#GB11`,
  );
  await writeLn(
    `  isExtendedPictographic: ${
      makeCompactRule(emoji.ExtendedPictographic, 100)
    },`,
  );
  await writeLn(`}`);
  await close();
}

async function writeLatinDecompositions() {
  // example rows
  //00C5;LATIN CAPITAL LETTER A WITH RING ABOVE;Lu;0;L;0041 030A;;;;N;LATIN CAPITAL LETTER A RING;;;00E5;
  //00E5;LATIN SMALL LETTER A WITH RING ABOVE;Ll;0;L;0061 030A;;;;N;LATIN SMALL LETTER A RING;;00C5;;00C5

  const { write, writeLn, close } = await FileWriter("decompositions.ts");

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

  if (Deno.args.length > 0) {
    const { flags, unknown } = parseFlags(Deno.args);
    if (flags.help) {
      console.log(names);
      console.log(
        "exact, [from-to] (inclusive), /regex/, or nothing for <not-empty>",
      );
      console.log("The categories");
      for (const [abbr, desc] of Object.entries(categories)) {
        console.log(`${abbr}: ${desc}`);
      }
    } else if (unknown.length === 1 && unknown[0] === "list") {
      console.log(flags);
      const criteria: Partial<Record<Names, (val: string) => boolean>> = {};
      for (const flag in flags) {
        if (!names.includes(flag as Names)) {
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
    }
  } else {
    //    showValuesCompact((await parsePropertyFile("GraphemeBreakProperty.txt")).Extend)
    writeGraphemeSupport();
    writeLatinDecompositions();
    console.log("wrote combining-chars.ts and grapheme-break-property.ts");
  }
}
