import {splitRunes, substring, substr} from "../unicode-tools/utools.ts";
import * as T from "https://deno.land/std/testing/asserts.ts";
Deno.test("runes", () => {
    T.assertEquals(splitRunes("👩🏻‍🤝‍🧑🏻👩🏿‍🤝‍👩🏻👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿"), ["👩🏻‍🤝‍🧑🏻", "👩🏿‍🤝‍👩🏻", "👩🏾‍🤝‍👩🏻", "👩🏽‍🤝‍🧑🏿"]);
    T.assertEquals(splitRunes(""), []);
    T.assertEquals(splitRunes("hej ❤️ 𝐛a\u0308 👩🏿‍🤝‍👩🏻"), ["h", "e", "j", " ", "❤️", " ", "𝐛", "a\u0308", " ", "👩🏿‍🤝‍👩🏻"]);
    T.assertEquals(splitRunes("𝐚̊𝐚̈𝐨̈"), ["𝐚̊", "𝐚̈", "𝐨̈"]);
});
Deno.test("substring", () => {
    T.assertEquals(substring("apa", 1), "pa");
    T.assertEquals(substring("", 1), "");
    T.assertEquals(substring("apa hej", 2, 4), "a he");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1, 100), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 4, 2), "a👩🏾‍🤝‍👩🏻");
});
Deno.test("substr", () => {
    T.assertEquals(substr("apa", 1), "pa");
    T.assertEquals(substr("", 1), "");
    T.assertEquals(substr("apa hej", 2, 6), "a he");
    T.assertEquals(substr("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1, 100), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substr("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substr("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 4, 6), "a👩🏾‍🤝‍👩🏻");
});