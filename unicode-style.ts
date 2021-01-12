import {
  allTextStyles,
  letters,
  numbers,
  NumberStyle,
  RowType,
  TextStyle,
} from "./code-points.ts";
import { composeStyles, translateShortFlags } from "./flags-to-styles.ts";
export type { NumberStyle, TextStyle };
export { allTextStyles, composeStyles, translateShortFlags };

type Alphabet = { [index: string]: string };

// Just my personal opinion of what goes together.
const numberStyleForTextStyle: Record<TextStyle, NumberStyle> = {
  "ASCII": "ASCII",
  "BOLD": "BOLD",
  "ITALIC": "SANS-SERIF",
  "BOLD ITALIC": "BOLD",
  "SCRIPT": "SANS-SERIF",
  "BOLD SCRIPT": "BOLD",
  "FRAKTUR": "DOUBLE-STRUCK",
  "DOUBLE-STRUCK": "DOUBLE-STRUCK",
  "BOLD FRAKTUR": "BOLD",
  "SANS-SERIF": "SANS-SERIF",
  "SANS-SERIF BOLD": "SANS-SERIF BOLD",
  "SANS-SERIF ITALIC": "SANS-SERIF",
  "SANS-SERIF BOLD ITALIC": "SANS-SERIF BOLD",
  "MONOSPACE": "MONOSPACE",
};

const erasor: Alphabet = {};
letters.forEach(([code, name, style, type, plain, styled]) => {
  erasor[styled] = plain;
});
numbers.forEach(([code, name, style, type, plain, styled]) => {
  erasor[styled] = plain;
});

function makeAlphabets(letters: RowType[]): Map<TextStyle, Alphabet> {
  const styles = new Map<TextStyle, Alphabet>();
  for (const [code, name, style, type, plain, styled] of letters) {
    let alphabet = styles.get(style);
    if (!alphabet) {
      alphabet = {};
      styles.set(style, alphabet);
    }
    alphabet[plain] = styled;
  }
  return styles;
}

const alphabets = makeAlphabets(letters);
const numberbets = makeAlphabets(numbers);

alphabets.forEach((alphabet, textStyle) => {
  const numberStyle = numberStyleForTextStyle[textStyle];
  Object.assign(alphabet, numberbets.get(numberStyle));
});

// adapted from https://coolaj86.com/articles/how-to-count-unicode-characters-in-javascript/
export function unicodeSplit(str: string): string[] {
  var point;
  var index;
  var width = 0;
  var len = 0;
  var uchars: string[] = [];
  for (index = 0; index < str.length;) {
    point = str.codePointAt(index);
    uchars.push(String.fromCodePoint(point!));
    width = 0;
    while (point) {
      width += 1;
      point = point >> 8;
    }
    index += Math.round(width / 2);
    len += 1;
  }
  return uchars;
}
export function unstyle(text: string) {
  const result: string[] = [];
  const chars = unicodeSplit(text);
  for (const char of chars) {
    result.push(erasor[char] || char);
  }
  return result.join("");
}

export function style(text: string, style: TextStyle): string {
  const alphabet = alphabets.get(style);
  if (!alphabet) {
    throw new Error(`No style '${style}' found`);
  }
  const result: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    result.push(alphabet[char] || char);
  }
  const r = result.join("");
  return r;
}

const literalRegex = /{([bicsfdm]+) ([^}]*)}/g;
const flagsToStyle = (flags: string) =>
  composeStyles(translateShortFlags(flags));
/** Use the syntax of chalk */
export function parseTemplate(template: string) {
  return template.replace(
    literalRegex,
    (_, flags, text) => style(text, flagsToStyle(flags)),
  );
}
