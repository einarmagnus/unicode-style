

function includeRow(name: string, decomposedByteValues: string): boolean {
    return /LATIN (CAPITAL|SMALL) LETTER . WITH/.test(name) && !!decomposedByteValues.length && !/</.test(decomposedByteValues);
}


async function main() {
    const unicodeFile = Deno.args[0];
    let fileData: string;
    try {
        fileData = await Deno.readTextFile(unicodeFile);
    } catch (e) {
        console.log(`Unable to read file '${unicodeFile}'`, e);
        Deno.exit(1);
    }
    const rows = fileData.split(/\r?\n/);
    // example rows
    //00C5;LATIN CAPITAL LETTER A WITH RING ABOVE;Lu;0;L;0041 030A;;;;N;LATIN CAPITAL LETTER A RING;;;00E5;
    //00E5;LATIN SMALL LETTER A WITH RING ABOVE;Ll;0;L;0061 030A;;;;N;LATIN SMALL LETTER A RING;;00C5;;00C5

    const openFile = await Deno.open("./compositions.ts", {write: true});
    const encoder = new TextEncoder();
    const write = (text: string) => openFile.write(encoder.encode(text));
    const writeLn = async (text: string) => { await write(text); return write("\n") };

    const compositions: {[composed: string]: string} = {};
    const parseCodePoint = (p: string) => String.fromCodePoint(parseInt(p, 16));

    await writeLn("export const decompositionMap: {[char: string]: string} = {");

    for (const row of rows) {
        const [composed, name, , , , decomposedByteValues,,,,,altName,,upperCase,lowerCase] = row.split(";");

        if (includeRow(name, decomposedByteValues)) {
            try {
                const decomposedStr = decomposedByteValues.split(" ").map(parseCodePoint).join("")
                await writeLn(`  "${parseCodePoint(composed)}": "${decomposedStr}",`)
            } catch (e) {
                console.error(row);
                console.error("Error", e);
                return;
            }
        }
    }
    await writeLn("};");

    await writeLn(`
export const decomposeChars = (text: string) =>
    text.replace(/./g, ch => decompositionMap[ch] || ch);`);

    await openFile.close();

}

main();