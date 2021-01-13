import {TextStyle, allTextStyles, alphabets} from "./alphabets.ts";
import { composeStyles, translateShortFlags } from "./flags-to-styles.ts";
export type { TextStyle };
export { allTextStyles, composeStyles, translateShortFlags };

type Alphabet = { [index: string]: string };
const erasor: Alphabet = {};

function makeCharMap(alphabets: Record<TextStyle, string>): Map<TextStyle, Alphabet> {
  const styles = new Map<TextStyle, Alphabet>();
  const ascii = alphabets["ASCII"];
  for (const styleName of allTextStyles) {
    const alphabet = alphabets[styleName];
    styles.set(styleName, unicodeSplit(alphabet).reduce((map: Alphabet, char, i)=> {
        map[ascii[i]] = char;
        erasor[char] = ascii[i];
        return map;
    }, {}));
  }
  return styles;
}

const charMap = makeCharMap(alphabets);

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
    result.push(erasor[char] ?? char);
  }
  return result.join("");
}

export function style(text: string, style: TextStyle): string {
  const alphabet = charMap.get(style);
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
    (all, flags, text) => {
        try {
            return style(text, flagsToStyle(flags));
        } catch (e) {
            return all;
        }
    });
}
