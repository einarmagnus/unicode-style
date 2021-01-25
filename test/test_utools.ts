import {countGraphemes, iterateGraphemes, substring} from "../unicode-tools/graphemes.ts";
import * as T from "https://deno.land/std/testing/asserts.ts";

const hex = (n: number) => n.toString(16);
const u = (ch: string) => ch.charCodeAt(0).toString(16);
const U = (ch: string) => ch.codePointAt(0)?.toString(16);


Deno.test("runes", () => {
    const splitRunes = (str: string) => Array.from(iterateGraphemes(str));

    T.assertEquals(splitRunes("abcd"), ["a", "b", "c", "d"]);
    T.assertEquals(splitRunes("👩🏻‍🤝‍🧑🏻👩🏿‍🤝‍👩🏻👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿"), ["👩🏻‍🤝‍🧑🏻", "👩🏿‍🤝‍👩🏻", "👩🏾‍🤝‍👩🏻", "👩🏽‍🤝‍🧑🏿"]);
    T.assertEquals(splitRunes(""), []);
    T.assertEquals(splitRunes("hej ❤️ 𝐛a\u0308 👩🏿‍🤝‍👩🏻"), ["h", "e", "j", " ", "❤️", " ", "𝐛", "a\u0308", " ", "👩🏿‍🤝‍👩🏻"]);
    T.assertEquals(splitRunes("𝐚̊𝐚̈𝐨̈"), ["𝐚̊", "𝐚̈", "𝐨̈"]);
    T.assertEquals(splitRunes("\u030a\u030ao"), ["\u030a\u030a", "o"]);
    T.assertEquals(splitRunes("o\u{e01ed}👩🏽‍🤝‍🧑🏿"), ["o\u{e01ed}", "👩🏽‍🤝‍🧑🏿"]);
    T.assertEquals(splitRunes("🇸🇪🇮🇸 🇸🇪 🇮🇸"), ["🇸🇪", "🇮🇸", " ", "🇸🇪", " ", "🇮🇸"]);
    T.assertEquals(splitRunes("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸"), ["🇸🇪", "🇮🇸", " ", "🇸🇪", " ", "🇸", " ", "🇪", " ", "🇮🇸"]);
});

Deno.test("test perf", () => {
    const str = Array(100).fill(
        "Onece upona  time 😊🐶🐡🦿👨‍👨‍👧‍👧fsdfsa\u030Adfsdf👩‍👩‍👧👩🏾‍🤝‍👩🏾dsfsdfs\u030Afsdf👩🏾‍🤝‍👩🏻👩🏼‍🤝‍🧑🏽👩🏿‍🤝‍👩🏾ssdsdff👩🏽‍🤝‍🧑🏻👨🏻‍🤝‍👨🏻"
    ).join("");
    let total = 0;
    console.time("mine");
    for (let i = 0; i < 1000; i++) {
        total += countGraphemes(str);
    }
    console.timeEnd("mine");
    console.log("total:", total / 100000);

    total = 0;
    console.time("theirs")
    for (let i = 0; i < 1000; i++) {
        total += Array.from(str).length;
    }
    console.timeEnd("theirs");
    console.log("total:", total / 100000);

});

Deno.test("substring", () => {
    T.assertEquals(substring("apa", 1), "pa");
    T.assertEquals(substring("", 1), "");
    T.assertEquals(substring("apa hej", 2, 4), "a ");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1, 100), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 1), "👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿");
    T.assertEquals(substring("👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿apa👩🏾‍🤝‍👩🏻👩🏽‍🤝‍🧑🏿", 4, 6), "a👩🏾‍🤝‍👩🏻");
    T.assertEquals(substring("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸"), "🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸");
    T.assertEquals(substring("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸", 4, 2), " 🇸🇪");
    T.assertEquals(substring("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸", 4, 4), "");
    T.assertEquals(substring("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸", 4), " 🇸 🇪 🇮🇸");
    T.assertEquals(substring("🇸🇪🇮🇸 🇸🇪 🇸 🇪 🇮🇸", 3, 7), "🇸🇪 🇸 ");

});
