# unicode-styling

This is a library for styling text using unicode.

There are some places where styled text is not available. If unicode is supported, then special mathematical text variations can be used instead.

There are 13 different styles of text, and 5 different styles of numbers, see https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols for a list.

## Usage in Deno

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
- [ ] make a template literal, inspired by chalk
- [ ] cli
- [ ] more flexibility around which number style to pick
- [ ] improve readme
- [ ] jsdoc
- [ ] make cli more flexible in terms of --bold --italic
