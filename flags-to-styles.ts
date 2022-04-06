import { allTextStyles, TextStyle } from "./alphabets.ts";

/** ordered in the order they always appears in compounds */
export const styleElements = [
  "ascii",
  "sans-serif",
  "bold",
  "italic",
  "fraktur",
  "monospace",
  "script",
  "double-struck",
  "struck-through"
] as const;

type Style = typeof styleElements[number];

const styleShortOptions: Record<string, Style> = {
  "=": "ascii",
  "b": "bold",
  "i": "italic",
  "c": "script",
  "f": "fraktur",
  "d": "double-struck",
  "s": "sans-serif",
  "m": "monospace",
  "-": "struck-through"
};

export function flagsToStyle(opts: string[]): TextStyle {
  const styles: Style[] = [];
  for (const opt of opts) {
    if (opt.startsWith("--")) {
      styles.push(validateLongFlag(opt.substr(2)));
    } else {
      styles.push(...translateShortFlags(opt.substr(1)));
    }
  }
  return composeStyles(styles);
}

export function validateLongFlag(opt: string) {
  if ((<readonly string[]> styleElements).includes(opt)) {
    return opt as Style;
  } else {
    throw `'--${opt}' is not a valid style`;
  }
}
export function translateShortFlags(opts: string): Style[] {
  const styles: Style[] = [];
  for (const opt of opts) {
    if (styleShortOptions[opt]) {
      styles.push(styleShortOptions[opt]);
    } else {
      throw `${opt} is not a valid option (found in ${opts})`;
    }
  }
  return styles;
}

export function composeStyles(styles: Style[]): TextStyle {
  styles.sort((el1, el2) =>
    styleElements.indexOf(el1) - styleElements.indexOf(el2)
  );
  const styleName = styles.join(" ").toUpperCase();
  if (allTextStyles.includes(<TextStyle> styleName)) {
    return styleName as TextStyle;
  } else {
    throw `There is no ${styleName} available in unicode`;
  }
}
