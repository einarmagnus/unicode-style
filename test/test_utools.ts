import {countGraphemes, iterateGraphemes, splitGraphemes, substring} from "../unicode-tools/graphemes.ts";
import * as T from "https://deno.land/std/testing/asserts.ts";
import { FileWriter, inDirUrl } from "../unicode-tools/ucq.ts";


const hex = (n: number) => n.toString(16);
const u = (ch: string) => ch.charCodeAt(0).toString(16);
const U = (ch: string) => ch.codePointAt(0)?.toString(16);

function equal<T>(arr1:Array<T>, arr2: Array<T>) {
    if (!arr1.length || arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

Deno.test("graphemes", async () => {
    const testFile = inDirUrl("GraphemeBreakTest.txt", import.meta.url);
    const splitAt = "÷";
    const dontSplitAt = "×";
    const notEmpty = (str: string) => str?.length > 0;
    const lines = (await Deno.readTextFile(testFile))
        .match(/^[^#\t]+.*/gm)!;
    const tests = lines.map(l =>
        l.match(/^[^#\t]+/gm)![0]
    );

    const toString = (byteList:string) =>
        byteList
            .match(/[0-9A-F]+/g)
            ?.map(b =>
                String.fromCodePoint(parseInt(b, 16))
            ).join("");
    const input = tests.map(toString);


    const result = tests.map(t =>
         t.split(splitAt).filter(notEmpty).map(toString)
    );
    const runFrom = 390;
    for (let i = runFrom; i < tests.length; i++) {
        const gs = splitGraphemes(input[i]!);
        if (!equal(gs, result[i])) {
            console.log();
            console.log(`test ${i}: failed\n\n'${lines[i]}'`);
            console.log(`Should be`, result[i], result[i].map(s => [...s!].map(U)));
            console.log(`was`, gs, gs.map(s => [...s].map(U)));
            T.assert(false);
        }
    }
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
