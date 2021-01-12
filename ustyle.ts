import { Command } from "https://deno.land/x/cliffy@v0.16.0/command/mod.ts";
import { allTextStyles, style, TextStyle, unstyle } from "./mod.ts";
import * as Colors from "https://deno.land/std@0.74.0/fmt/colors.ts";
import { flagsToStyle } from "./flags-to-styles.ts";

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
  } else if (hasFlag("--template")) {
    let template = getFlagArg("--template");
    if (template === "-") {
      template = new TextDecoder().decode(await Deno.readAll(Deno.stdin));
    }
    console.log("template is not implemented yet :/");
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
        Deno.exit();
      }
    } while (index < Deno.args.length);
    console.log(output.join(""));
  }
}

/**
 * Make the option name of a style name, e.g. "BOLD ITALIC" becomes "--bold-italic"
 * @param name the name of the style
 */
function opt(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ".").replace(/-/, "_");
}

function printUsage() {
}
function listStyles(example: string) {
  console.log();
  console.log(Colors.blue("Available styles are:"));
  console.log();
  const colWidth = Math.max(...allTextStyles.map((str) => str.length));
  allTextStyles.forEach((styleName, i) => {
    console.log(
      `  --${opt(styleName).padEnd(colWidth + 2, " ")} ${
        style(example, styleName)
      }`,
    );
  });
}

if (import.meta.main) {
  main();
}
