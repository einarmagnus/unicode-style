import {dedent} from "https://raw.githubusercontent.com/tamino-martinius/node-ts-dedent/master/src/index.ts";

import {
  allTextStyles,
  parseTemplate,
  style,
  TextStyle,
  unstyle,
} from "./mod.ts";
import * as Colors from "https://deno.land/std@0.74.0/fmt/colors.ts";
import { flagsToStyle, styleElements } from "./flags-to-styles.ts";

export async function main() {
  const equals = (a: string) => (b: string) => a === b;
  const hasFlag = (arg: string) => Deno.args.some(equals(arg));
  const getFlagArg = (arg: string): string | undefined =>
    Deno.args[Deno.args.indexOf(arg) + 1];
  const getStyleFlags = (index: number) => {
    const styles = [];
    while (Deno.args[index].startsWith("-")) {
      styles.push(Deno.args[index]);
      index++;
    }
    return styles;
  };

  if (hasFlag("--help") || Deno.args.length === 0) {
    printUsage();
  } else if (hasFlag("--list")) {
    const example = getFlagArg("--list") ?? "Lorem Ipsum Dolor Sit Amet 1234";
    listStyles(example);
  } else if (hasFlag("--clean")) {
    let text = getFlagArg("--clean");
    if (text === "-") {
      text = new TextDecoder().decode(await Deno.readAll(Deno.stdin));
    } else if (!text) {
      console.log("Error: --clean requires an argument");
      return;
    }
    console.log(unstyle(text));
  } else if (hasFlag("--template")) {
    let template = getFlagArg("--template");
    if (template === "-") {
      template = new TextDecoder().decode(await Deno.readAll(Deno.stdin));
    } else if (!template) {
      console.log("Error: --template requires an argument");
      return;
    }
    console.log(parseTemplate(template));
  } else {
    let index = 0;
    const output: string[] = [];
    do {
      const styleFlags = getStyleFlags(index);
      const text = Deno.args[index + styleFlags.length];
      index += styleFlags.length + 1;
      let styleName: TextStyle;
      try {
        styleName = flagsToStyle(styleFlags);
        output.push(style(text, styleName));
      } catch (msg) {
        console.log("Error", msg);
        return;
      }
    } while (index < Deno.args.length);
    console.log(output.join(""));
  }
}

function printUsage() {

    console.log(dedent`
        {Usage:} ustyle [opts] text

        {Options:}
            -a, --ascii         ${style("Example 123", "ASCII")} (this is just normal text)
            -b, --bold          ${style("Example 123", "BOLD")}
            -i, --italic        ${style("Example 123", "ITALIC")}
            -s, --sans-serif    ${style("Example 123", "SANS-SERIF")}
            -c, --script        ${style("Example 123", "SCRIPT")}
            -f, --fraktur       ${style("Example 123", "FRAKTUR")}
            -m, --monospace     ${style("Example 123", "MONOSPACE")}
            -d, --double-struck ${style("Example 123", "DOUBLE-STRUCK")}
            --template          This will parse the argument as a template
                                (see more under {Template})
            --list              Show a list with all styles, if you give it a
                                text argument, that will be used as the example.

            Some of them can be combined, these combinations are possible:
            -bi,  --bold --italic                ${style("Example 123", "BOLD ITALIC")}
            -bf,  --bold --fraktur               ${style("Example 123", "BOLD FRAKTUR")}
            -bc,  --bold --script                ${style("Example 123", "BOLD SCRIPT")}
            -sb,  --sans-serif --bold            ${style("Example 123", "SANS-SERIF BOLD")}
            -si,  --sans-serif --italic          ${style("Example 123", "SANS-SERIF ITALIC")}
            -sbi, --sans-serif --bold --italic   ${style("Example 123", "SANS-SERIF BOLD ITALIC")}

            The order of options is not important,
            *"--bold --italic"*,
            *"--italic --bold"*,
            *"-bi"* and
            *"-ib"* are all equivalent

        {Examples:}
            $ ustyle --ascii "This is a sentence with an " --bold "important" --ascii " word in it"
            This is a sentence with an ${style("important", "BOLD")} word in it

            $ ustyle -s "This is a sentence with an " -bis "important" -s " word in it"
            ${parseTemplate("{s This is a sentence with an }{bis important }{s word in it}")}

            $ ustyle -a "Sir " -f "Galahad" -a " sat by the " -bi "round" -a " table"
            ${parseTemplate("Sir {f Galahad} sat by the {bi round} table")}

        {Templates:}
            A template is a string that has blocks delineated by curly braces.
            The first letters before a space will be used to pick the style of the rest
            of the text in there. Those style letters are interpreted the same way as
            the short options above.
            If the argument given to --template is -, then the template will be read from stdin
            {Example:}
                $ ustyle --template "Sir {f Galahad} sat by the {bi round} table"
                ${parseTemplate("Sir {f Galahad} sat by the {bi round} table")}
                $ echo "Sir {f Galahad} sat by the {bi round} table" | ustyle --template -
                ${parseTemplate("Sir {f Galahad} sat by the {bi round} table")}


    `.replace(/{([\w:]+)}/g, (_, text) => Colors.blue(text))
    .replace(/\*([^*]+)\*/g, (_, text) => Colors.yellow(text))
    );
}
function listStyles(example: string) {
  console.log();
  console.log(Colors.blue("Available styles are:"));
  console.log();
  const styleFlags = allTextStyles.map(styleName => "--" + styleName.toLowerCase().split(" ").join(" --"));
  const colWidth = Math.max(...styleFlags.map((str) => str.length));
  styleFlags.forEach((flags, i) => {
    console.log(
      `  ${flags.padEnd(colWidth + 2, " ")} ${
        style(example, allTextStyles[i])
      }`,
    );
  });
}

if (import.meta.main) {
  main();
}
