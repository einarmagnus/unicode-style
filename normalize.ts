import {decompositionMap, decomposeChars} from "./unicode-tools/decompositions.ts";

let min = Infinity, max = 0;
interface CompositionMap {
    [k: string]: {
        [k: string]: string
    }
}
function makeCompositionMap() {
    const recMap: CompositionMap = {};
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
type Normalization = "NFC" | "NFD" | "NFKC" | "NFKD";
export function monkeyPatchNormalize():void {
    // check if String.normalize works, if it does, then use that
    if ("ä".normalize("NFD").length === 2) {
        return;
    }
    const compositionMap = makeCompositionMap();
    const origNormalize = String.prototype.normalize;

    String.prototype.normalize = function(form: Normalization) {
        if (form === "NFC") {
            return composeChars(<string>this, compositionMap);
        } else if (form === "NFD") {
            return decomposeChars(<string>this);
        } else {
            return origNormalize.apply(this, [form]);
        }
    }
}

/**
 * This does not yet handle multiple combining characters.
 * Deno will handle this natively in the next version (1.7), so I'll leave it like this
 * @param text
 */
function composeChars(text: string, compositionMap: CompositionMap) {
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
