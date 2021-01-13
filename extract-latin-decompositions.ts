

function includeRow(row: string): boolean {
    return true;
}


async function main() {
    const unicodeFile = Deno.args[0];
    let fileData: string;
    try {
        fileData = await Deno.readTextFile(unicodeFile);
    } catch (e) {
        console.log(`Unable to read file '${unicodeFile}'`);
        Deno.exit(1);
    }
    const rows = fileData.split(/\r?\n/);
    // example rows
    //00C5;LATIN CAPITAL LETTER A WITH RING ABOVE;Lu;0;L;0041 030A;;;;N;LATIN CAPITAL LETTER A RING;;;00E5;
    //00E5;LATIN SMALL LETTER A WITH RING ABOVE;Ll;0;L;0061 030A;;;;N;LATIN SMALL LETTER A RING;;00C5;;00C5

    const compositions: {[composed: string]: string} = {};
    const parseCodePoint = (p: string) => String.fromCodePoint(parseInt(p, 16));
    for (const row of rows) {
        const [composed, name, , , , decomposed,,,,,altName,,upperCase,lowerCase] = row.split(";");

        if (/LATIN (CAPITAL|SMALL) LETTER . WITH/.test(name) && decomposed.length && !/</.test(decomposed)) {
            try {
                compositions[parseCodePoint(composed)] = decomposed.split(" ").map(parseCodePoint).join("")
                //console.log(composed, String.fromCodePoint(parseInt(composed, 16)), name, decomposed, altName, otherCase, String.fromCodePoint(parseInt(otherCase, 16)))
            } catch (e) {
                console.log(row);
                console.log("Error",e);
                return;
            }
        }
    }

    try {
        await Deno.writeTextFile("./compositions.ts",
            "export const decompositionMap: {[char: string]: string} = " + JSON.stringify(compositions)
        );
    } catch (e) {
        console.error("err", e);
    }

}

main();