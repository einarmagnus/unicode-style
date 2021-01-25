import { graphemeBreakProp } from "./grapheme-break-property.ts";

const codePointWidth = (codePoint: number) => {
  return codePoint >= 0x010000 ? 2 : 1;
};

/**
 * This is like String.length() but counts grapheme clusters, i.e. what we perceive as
 * characters. `"👩🏽‍🤝‍👩🏻a\u030a🇮🇸".length` is `18`, countGraphemes("👩🏽‍🤝‍👩🏻a\u030a🇮🇸") is `3`.
 * console.log("👩🏽‍🤝‍👩🏻a\u030a🇮🇸") will print `👩🏽‍🤝‍👩🏻å🇮🇸`. The `🇮🇸` is an icelandic flag on
 * systems that support it.
 * @param string
 */
export function countGraphemes(string: string) {
  let len = 0;
  for (const ch of iterateGraphemes(string)) {
    len++;
  }
  return len;
}

// these can maybe be sped up with some tricks
const {
  isControl,
  isExtend,
  isRegionalIndicator,
  isCR,
  isLF,
  isL,
  isLV,
  isLVT,
  isPrepend,
  isSpacingMark,
  isT,
  isV,
  isZWJ,
  isExtendedPictographic,
} = graphemeBreakProp;

/**
 * Finds the with of the grapheme gluster that starts at position `i` in `str`
 * @param str the string to look in
 * @param i the position to start at
 */
const getGraphemeWidth = (str: string, i: number): number => {
  if (i >= str.length) return i;
  let cur = str.codePointAt(i)!;
  let width = codePointWidth(cur);
  let next = str.codePointAt(i + width)!;
  let prev: number | undefined = undefined;
  let inEmojiSeq = false;
  const hex = (n: number | undefined) => `0x${n?.toString(16) ?? "??"}`;
  const u = (n: number) => String.fromCodePoint(n);
  while (next) {
    // rule GB11 see more below
    if (inEmojiSeq) {
      if (isZWJ(cur)) {
        // don't break
      } else if (isExtendedPictographic(cur) || isExtend(cur)) {
        if (!(isExtend(next) || isZWJ(next))) {
          return width;
        }
      } else {
        return width;
      }
    } // http://unicode.org/reports/tr29/#GB3
    // Do not break between a CR and LF. Otherwise, break before and after controls.
    // GB3 	CR 	× 	LF
    // GB4 	(Control | CR | LF) 	÷
    // GB5 		÷ 	(Control | CR | LF)
    else if (isControl(cur)) {
      if (isCR(cur) && isLF(next)) {
        return 2;
      }
      return 1;
    } // http://unicode.org/reports/tr29/#GB6
    // Do not break Hangul syllable sequences.
    else if (
      isL(cur) && (isL(next) || isV(next) || isLV(next) || isLVT(next))
    ) {
      // GB6 	L 	× 	(L | V | LV | LVT)
    } else if ((isLV(cur) || isV(cur)) && (isV(next) || isT(next))) {
      // GB7 	(LV | V) 	× 	(V | T)
    } else if ((isLVT(cur) || isT(cur)) && isT(next)) {
      // GB8 	(LVT | T) 	× 	T
    } // Do not break within emoji modifier sequences or emoji zwj sequences.
    // need to keep this before GB9
    // GB11 	\p{Extended_Pictographic} Extend* ZWJ 	× 	\p{Extended_Pictographic}
    else if (isExtendedPictographic(cur)) {
      if (isExtend(next) || isZWJ(next)) {
        inEmojiSeq = true;
      } else {
        return width;
      }
    } else if (isZWJ(next) || isExtend(next)) {
      // Do not break before extending characters or ZWJ.
      // GB9 	  	× 	(Extend | ZWJ)
    } else if (isSpacingMark(next)) {
      // Do not break before SpacingMarks, or after Prepend characters.
      // GB9a 	  	× 	SpacingMark
    } else if (prev && isPrepend(prev)) {
      // GB9b 	Prepend 	×
    } // Do not break within emoji flag sequences. That is, do not break
    // between regional indicator (RI) symbols if there is an odd number
    // of RI characters before the break point.
    // GB12 	sot (RI RI)* RI 	× 	RI
    // GB13 	[^RI] (RI RI)* RI 	× 	RI
    else if (isRegionalIndicator(cur)) {
      if (isRegionalIndicator(next)) {
        return width + codePointWidth(next);
      } else {
        return width;
      }
    } // Otherwise, break everywhere.
    // GB999 	Any 	÷ 	Any
    else {
      return width;
    }

    // didn't break, update values and continue with next codePoint
    prev = cur;
    cur = next;
    width += codePointWidth(cur);
    next = str.codePointAt(i + width)!;
  }
  return width;
};

/**
 * Creates an iterator over the string's grapheme clusters.
 * Where `for (let ch of "👩🏽‍🤝‍👩🏻a\u030a🇮🇸")` will give you these substrings:
 * `"👩", "🏽", "\u200d", "🤝", "\u200d", "👩", "🏻", "a", "\u030a", "🇮", "🇸"`
 * `for (let ch of iterateGraphemes("👩🏽‍🤝‍👩🏻a\u030a🇮🇸"))` will give you
 * `"👩🏽‍🤝‍👩🏻", "a\u030a", "🇮🇸"`
 *
 * It comes at a significant speed penalty, but follows the spec to the best of my ability
 * @link http://unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules
 * @param string the string to split
 */
export function* iterateGraphemes(string: string) {
  if (typeof string !== "string") {
    string = String(string);
  }
  if (string.length === 0) return;
  let runeStart = 0;
  let runeWidth = 1;
  do {
    runeWidth = getGraphemeWidth(string, runeStart);
    const rune = string.substr(runeStart, runeWidth);
    yield rune;
    runeStart += runeWidth;
  } while (runeStart < string.length);
}

/**
 * Splits the string into an array of grapheme clusters.
 * Where `Array.from("👩🏽‍🤝‍👩🏻a\u030a🇮🇸")` will give you
 * `["👩", "🏽", "\u200d", "🤝", "\u200d", "👩", "🏻", "a", "\u030a", "🇮", "🇸"]`
 * `splitGraphemes("👩🏽‍🤝‍👩🏻a\u030a🇮🇸")` will give you
 * `["👩🏽‍🤝‍👩🏻", "a\u030a", "🇮🇸"]`
 *
 * It comes at a significant speed penalty, but follows the spec to the best of my ability
 * @link http://unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules
 * @param string the string to split
 */
export function splitGraphemes(string: string) {
  return Array.from(iterateGraphemes(string));
}

/**
 * The substring() method returns the part of the string between the start
 * and end indexes, or to the end of the string.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
 *
 * @param string the string to work on
 * @param start the start index, will be 0 if omitted
 * @param end the end index, will be the end of the string if omitted
 */
export function substring(string: string, start?: number, end?: number) {
  if (start === undefined) return string;

  let safeStart = Number.isInteger(+start) ? +start : 0;
  if (safeStart < 0) safeStart = 0;

  let safeEnd = Number.isInteger(+end!) ? +end! : string.length;

  if (safeEnd < safeStart) {
    [safeStart, safeEnd] = [safeEnd, safeStart];
  }

  const substr = [];
  const itr = iterateGraphemes(string);
  let length = safeEnd - safeStart;
  while (safeStart--) {
    const { done, value } = itr.next();
    if (done) {
      return "";
    }
  }
  while (length--) {
    const { done, value } = itr.next();
    if (done) break;
    substr.push(value);
  }
  itr.return();
  return substr.join("");
}
