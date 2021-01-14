import {decompositionMap} from "./decompositions.ts";

let min = Infinity, max = 0;
function makeCompositionMap() {
    const recMap: {[k: string]: {[k: string]: string}} = {};
    for (const [c, d] of Object.entries(decompositionMap)) {
        const [d1, d2] = d;
        recMap[d2] ??= {};
        recMap[d2][d1] = c;
        const cNum = c.charCodeAt(0);
        if (cNum < min) { min = cNum; }
        if (cNum > max) { max = cNum; }
    }
    return recMap;
}
export const compositionMap = makeCompositionMap();

/**
 * This does not yet handle multiple combining characters.
 * Deno will handle this natively in the next version (1.7), so I'll leave it like this
 * @param text
 */
export function composeChars(text: string) {
    const result: string[] = [];
    let lastIndex = 0;
    const combiningChars = Object.keys(compositionMap);
    for (let i = 1; i < text.length; i++) {
        const ch = text.charCodeAt(i);
        if (ch < min || ch > max) continue;
        for (const comChar of combiningChars) {
            if (comChar === text[i]) {
                const composed = compositionMap[comChar][text[i-1]];
                if (composed) {
                    result.push(text.substring(lastIndex, i - 1), composed);
                    lastIndex = i + 1;
                }
            }
        }
    }
    result.push(text.substring(lastIndex));
    return result.join("");
}
