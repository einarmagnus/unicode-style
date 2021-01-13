# unicode-styling

This is a library for styling text using Unicode. It is a work in progress, especially the documentation.

There are some places where styled text is not available. If Unicode is supported, then special mathematical text variations can be used instead.

There are 13 different styles of text, and 5 different styles of numbers, see https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols for a list.

I have build a UI around it at <https://einarmagnus.net/pages/ustyle>, try it out.

It comes with a command line interface that you can use with [Deno][] 🦕:

I have hooked it into [espanso][] to make it available anywhere (see my configuration at the bottom of this readme).

   [Deno]: https://deno.land/
   [espanso]: espanso.org/

```
$ deno install https://raw.githubusercontent.com/einarmagnus/unicode-style/master/ustyle.ts

$ ustyle --template "This is normal text, {bi this is bold and italic}, {c this is script}"
This is normal text, 𝒕𝒉𝒊𝒔 𝒊𝒔 𝒃𝒐𝒍𝒅 𝒂𝒏𝒅 𝒊𝒕𝒂𝒍𝒊𝒄, 𝓉𝒽𝒾𝓈 𝒾𝓈 𝓈𝒸𝓇𝒾𝓅𝓉

$ ustyle --bold "this is bold " --bold --italic "this is bold and italic " --fraktur "this is fraktur"
𝐭𝐡𝐢𝐬 𝐢𝐬 𝐛𝐨𝐥𝐝 𝒕𝒉𝒊𝒔 𝒊𝒔 𝒃𝒐𝒍𝒅 𝒂𝒏𝒅 𝒊𝒕𝒂𝒍𝒊𝒄 𝔱𝔥𝔦𝔰 𝔦𝔰 𝔣𝔯𝔞𝔨𝔱𝔲𝔯

$ ustyle --help
Usage: ustyle [opts] text

Options:
    -a, --ascii         Example 123 (this is just normal text)
    -b, --bold          𝐄𝐱𝐚𝐦𝐩𝐥𝐞 𝟏𝟐𝟑
    -i, --italic        𝐸𝑥𝑎𝑚𝑝𝑙𝑒 𝟣𝟤𝟥
    -s, --sans-serif    𝖤𝗑𝖺𝗆𝗉𝗅𝖾 𝟣𝟤𝟥
    -c, --script        ℰ𝓍𝒶𝓂𝓅𝓁ℯ 𝟣𝟤𝟥
    -f, --fraktur       𝔈𝔵𝔞𝔪𝔭𝔩𝔢 𝟙𝟚𝟛
    -m, --monospace     𝙴𝚡𝚊𝚖𝚙𝚕𝚎 𝟷𝟸𝟹
    -d, --double-struck 𝔼𝕩𝕒𝕞𝕡𝕝𝕖 𝟙𝟚𝟛
    --template          This will parse the argument as a template
                        (see more under Template)
    --list              Show a list with all styles, if you give it a
                        text argument, that will be used as the example.

    Some of them can be combined, these combinations are possible:
    -bi,  --bold --italic                𝑬𝒙𝒂𝒎𝒑𝒍𝒆 𝟏𝟐𝟑
    -bf,  --bold --fraktur               𝕰𝖝𝖆𝖒𝖕𝖑𝖊 𝟏𝟐𝟑
    -bc,  --bold --script                𝓔𝔁𝓪𝓶𝓹𝓵𝓮 𝟏𝟐𝟑
    -sb,  --sans-serif --bold            𝗘𝘅𝗮𝗺𝗽𝗹𝗲 𝟭𝟮𝟯
    -si,  --sans-serif --italic          𝘌𝘹𝘢𝘮𝘱𝘭𝘦 𝟣𝟤𝟥
    -sbi, --sans-serif --bold --italic   𝙀𝙭𝙖𝙢𝙥𝙡𝙚 𝟭𝟮𝟯

    The order of options is not important,
    "--bold --italic",
    "--italic --bold",
    "-bi" and
    "-ib" are all equivalent

Examples:
    $ ustyle --ascii "This is a sentence with an " --bold "important" --ascii " word in it"
    This is a sentence with an 𝐢𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭 word in it

    $ ustyle -s "This is a sentence with an " -bis "important" -s " word in it"
    𝖳𝗁𝗂𝗌 𝗂𝗌 𝖺 𝗌𝖾𝗇𝗍𝖾𝗇𝖼𝖾 𝗐𝗂𝗍𝗁 𝖺𝗇 𝙞𝙢𝙥𝙤𝙧𝙩𝙖𝙣𝙩 𝗐𝗈𝗋𝖽 𝗂𝗇 𝗂𝗍

    $ ustyle -a "Sir " -f "Galahad" -a " sat by the " -bi "round" -a " table"
    Sir 𝔊𝔞𝔩𝔞𝔥𝔞𝔡 sat by the 𝒓𝒐𝒖𝒏𝒅 table

Templates:
    A template is a string that has blocks delineated by curly braces.
    The first letters before a space will be used to pick the style of the rest
    of the text in there. Those style letters are interpreted the same way as
    the short options above.
    If the argument given to --template is -, then the template will be read from stdin
    Example:
        $ ustyle --template "Sir {f Galahad} sat by the {bi round} table"
        Sir 𝔊𝔞𝔩𝔞𝔥𝔞𝔡 sat by the 𝒓𝒐𝒖𝒏𝒅 table
        $ echo "Sir {f Galahad} sat by the {bi round} table" | ustyle --template -
        Sir 𝔊𝔞𝔩𝔞𝔥𝔞𝔡 sat by the 𝒓𝒐𝒖𝒏𝒅 table

```

## Usage as library

I will write some proper documentation soon.

```typescript
// test.ts
// using Deno style import
import {style, unstyle} from "./mod.ts";

const styled = style("unicode-styled double-struck text", "DOUBLE-STRUCK");

console.log(styled);

const quasiStyled = styled.split(" ");
quasiStyled[1] = unstyle(quasiStyled[1]);
// can only style unstyled text
quasiStyled[2] = style(unstyle(quasiStyled[2]), "BOLD");

console.log(quasiStyled.join(" "));
```

```bash
deno run .\test.ts
𝕦𝕟𝕚𝕔𝕠𝕕𝕖-𝕤𝕥𝕪𝕝𝕖𝕕 𝕕𝕠𝕦𝕓𝕝𝕖-𝕤𝕥𝕣𝕦𝕔𝕜 𝕥𝕖𝕩𝕥
𝕦𝕟𝕚𝕔𝕠𝕕𝕖-𝕤𝕥𝕪𝕝𝕖𝕕 double-struck 𝐭𝐞𝐱𝐭
```


TODO:
- [x] make a template literal, inspired by chalk
- [x] cli
- [ ] more flexibility around which number style to pick
- [x] improve readme
- [ ] jsdoc
- [x] make template resistant to illegal styles
- [x] make cli more flexible in terms of --bold --italic

## Espanso

This is my setup for espanso:

```yaml
matches:
  - trigger: ":ustyle:"
    replace: "{{result}}"
    vars:
      - name: form1
        type: form
        params:
          layout: |
            Template                                                                             🦕
            {{template}}
          fields:
            template:
              multiline: true
      - name: result
        type: shell
        params:
          shell: powershell
          cmd: $env:ESPANSO_FORM1_TEMPLATE | deno run "https://raw.githubusercontent.com/einarmagnus/unicode-style/master/ustyle.ts" --template -
```