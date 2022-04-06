import {TextStyle, allTextStyles, alphabets} from "./alphabets.ts";
import { monkeyPatchNormalize } from "./normalize.ts";
import { decomposeChars, decompositionMap } from "./unicode-tools/decompositions.ts";
import { composeStyles, translateShortFlags } from "./flags-to-styles.ts";
export type { TextStyle };
export { allTextStyles, composeStyles, translateShortFlags };

// path String.normalize for Deno (only for latin chars)
monkeyPatchNormalize();

type Alphabet = { [index: string]: string };
const erasor: Alphabet = {};

function makeCharMap(alphabets: Record<TextStyle, string>): Map<TextStyle, Alphabet> {
  const styles = new Map<TextStyle, Alphabet>();
  const ascii = alphabets["ASCII"];
  for (const styleName of allTextStyles) {
    const alphabet = alphabets[styleName];
    styles.set(styleName, Array.from(alphabet).reduce((map: Alphabet, char, i)=> {
        map[ascii[i]] = char;
        erasor[char] = ascii[i];
        return map;
    }, {}));
  }
  return styles;
}

export const styleCharMap: Map<TextStyle, Alphabet> = makeCharMap(alphabets);

export function unstyle(text: string) {
  const result: string[] = [];
  for (const char of text) {
    result.push(erasor[char] ?? char);
  }
  return result.join("").normalize();
}


export function style(text: string, style: TextStyle): string {
  text = text.normalize("NFD");
  const alphabet = styleCharMap.get(style);
  if (!alphabet) {
    throw new Error(`No style '${style}' found`);
  }
  const result: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    result.push(alphabet[char] || char);
  }
  const r = result.join("");
  return r.normalize("NFC");
}

const literalRegex = /{([bicsfdm-]+) ([^}]*)}/g;
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
