import { parseFlags } from "https://deno.land/x/cliffy@v0.16.0/flags/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.83.0/path/mod.ts";

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

async function writeAllCombingingChars() {
  const allCombiningChars = await list({
    category: (val) => /^M.$/.test(val),
  });

  const combiningChars = allCombiningChars.map(({ code }) =>
    parseInt(code, 16)
  );

  const { write, writeLn, close } = await FileWriter("combining-chars.ts");

  await writeLn(`export const combiningChars = new Set([`);
  combiningChars.forEach((val) => write(`0x${val.toString(16)}, `));
  await writeLn(`\n]);`);
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
  if (Deno.args.length > 0) {
    const { flags, unknown } = parseFlags(Deno.args);
    if (flags.help) {
      console.log(names);
      console.log(
        "exact, [from-to] (inclusive), /regex/, or nothing for <not-empty>",
      );
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
          console.log(`Don't know how to interpret ${flag} value ${val}`);
          Deno.exit(1);
        }
      }
      for (const row of await list(criteria)) {
        console.log(row.code, row.category, row.name);
      }
    }
  } else {
    writeAllCombingingChars();
    writeLatinDecompositions();
    console.log("wrote combining-chars.ts and decompositions.ts");
  }
}
