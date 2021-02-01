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
  if (i >= str.length) return 0;
  let cur = str.codePointAt(i)!;
  let width = codePointWidth(cur);
  let next = str.codePointAt(i + width)!;
  let inEmojiSeq = false;
  let breakHere = true;
  let regionalIndictors = 0;

  // shortcut for ascii
  if (!(cur & 0xff80) && !(next & 0xff80) && cur !== 0xd) {
    return 1;
  }
  while (next) {
    // loop only for being able to break, i.e. jump forward as soon as
    // a rule is triggered.
    while (true) {
      // http://unicode.org/reports/tr29/#GB3
      // Do not break between a CR and LF. Otherwise, break before and after controls.
      // GB3 	CR 	× 	LF
      // GB4 	(Control | CR | LF) 	÷
      // GB5 		÷ 	(Control | CR | LF)
      if (
        isControl(cur) || isCR(cur) || isLF(cur) || isControl(next) ||
        isCR(next) || isLF(next)
      ) {
        if (isCR(cur) && isLF(next)) {
          breakHere = false;
          break;
        }
        return width;
      }

      // http://unicode.org/reports/tr29/#GB6
      // Do not break Hangul syllable sequences.
      // GB6 	L 	× 	(L | V | LV | LVT)
      if (
        isL(cur) && (isL(next) || isV(next) || isLV(next) || isLVT(next))
      ) {
        breakHere = false;
        break;
      }

      // GB7 	(LV | V) 	× 	(V | T)
      if ((isLV(cur) || isV(cur)) && (isV(next) || isT(next))) {
        breakHere = false;
        break;
      }
      // GB8 	(LVT | T) 	× 	T
      if ((isLVT(cur) || isT(cur)) && isT(next)) {
        breakHere = false;
        break;
      }

      // Do not break before extending characters or ZWJ.
      // GB9 	  	× 	(Extend | ZWJ)
      if (isZWJ(next) || isExtend(next)) {
        breakHere = false;
        break;
      }
      // Do not break before SpacingMarks, or after Prepend characters.
      // GB9a 	  	× 	SpacingMark
      if (isSpacingMark(next)) {
        breakHere = false;
        break;
      }
      // GB9b 	Prepend 	×
      if (isPrepend(cur)) {
        breakHere = false;
        break;
      }

      // Do not break within emoji flag sequences. That is, do not break
      // between regional indicator (RI) symbols if there is an odd number
      // of RI characters before the break point.
      // GB12 	sot (RI RI)* RI 	× 	RI
      // GB13 	[^RI] (RI RI)* RI 	× 	RI
      if (isRegionalIndicator(cur)) {
        regionalIndictors++;
        if (isRegionalIndicator(next) && regionalIndictors % 2 === 1) {
          breakHere = false;
          break;
        }
      } else {
        regionalIndictors = 0;
      }

      // Otherwise, break everywhere.
      // GB999 	Any 	÷ 	Any
      break;
    }

    // regardless of whether a rule was triggered or not, the
    // emoji-sequence rules need to be checked, so they are outside
    // the jump-forward lood

    // Do not break within emoji modifier sequences or emoji zwj sequences.
    // GB11 	\p{Extended_Pictographic} Extend* ZWJ 	× 	\p{Extended_Pictographic}
    if (inEmojiSeq) {
      if (isZWJ(cur) && isExtendedPictographic(next)) {
        breakHere = false;
      }
      if (!isExtend(cur) || isZWJ(cur)) {
        inEmojiSeq = false;
      }
    }
    if (isExtendedPictographic(cur)) {
      if (isExtend(next) || isZWJ(next)) {
        inEmojiSeq = true;
      }
    }
    if (breakHere) {
      return width;
    }

    // didn't break, update values and continue with next codePoint
    breakHere = true;
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
    yield string.substr(runeStart, runeWidth);
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

  const length = safeEnd - safeStart;
  const substr = Array(length);
  const itr = iterateGraphemes(string);
  while (safeStart--) {
    const { done, value } = itr.next();
    if (done) {
      return "";
    }
  }
  for (let i = 0; i < length; i++) {
    const { done, value } = itr.next();
    if (done) break;
    substr[i] = value;
  }
  itr.return();
  return substr.join("");
}
