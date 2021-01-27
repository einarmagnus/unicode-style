
const cp = (s:string) => s.codePointAt(0)!;
const r = (a: number, b: number) => Array((b-a+1)).fill(0).map((_,i)=>i+a)
const strR = (rs: string) => {
  const range = [];
  const cps = [...rs];
  for (let i = 0; i < cps.length; i+=2) {
    range.push(r(cp(cps[i]), cp(cps[i+1])))
  }
  return range.flat();
}
const strToSet = (s: string, r: string) => {
  return [...s].map(c => cp(c))
  .concat(strR(r))
  .reduce((s, c) => s.add(c), new Set<number>());
}


export const graphemeBreakProp = {
  isPrepend: ((s: Set<number>) => (v: number) => s.has(v))(strToSet("۝܏࣢ൎ𑂽𑃍𑇂𑇃𑤿𑥁𑨺𑵆", "؀؅𑪄𑪉")),
  isCR: (v:number) => (v === 0xd),
  isLF: (v:number) => (v === 0xa),
  isControl: ((s: Set<number>) => (v: number) => s.has(v))(strToSet("­؜᠎​‎‏﻿￹￺￻󠀁", "\u{0}\u{9}\u{e}\u{1f}\u{2028}‮⁠⁤⁦⁯𓐰𓐸𛲠𛲣𝅳𝅺")),
  isExtend: ((s: Set<number>) => (v: number) => s.has(v))(strToSet("ׇֿׁׂٰܑׅ߽࡙࡚࡛ׄۧۨࠥࠦࠧऺ़्ॢॣঁ়া্ৗৢৣ৾ਁਂ਼ੁੂੇੈੋੌ੍ੑੰੱੵઁં઼ેૈ્ૢૣଁ଼ାି୍୕ୖୗୢୣஂாீ்ௗఀఄాిీెేైౕౖౢౣಁ಼ಿೂೆೌ್ೕೖೢೣഀഁ഻഼ാ്ൗൢൣඁ්ාිීුූෟัັ္်༹༘༙༵༷࿆྆྇ွှၘၙၞၟၠႂႅႆႍႝ፝፞፟ᜒᜓ᜔ᜲᜳ᜴ᝒᝓᝲᝳ឴឵ំ៝᠋᠌᠍ᢅᢆᢩᤠᤡᤢᤧᤨᤲ᤻ᨘ᤹᤺ᨗᨛᩖ᩠ᩢ᩿ᬼᭂᮀᮁᮨᮩ᮫ᮬᮭ᯦ᯨᯩᯭᯯᯰᯱᰶ᰷᳭᳐᳑᳒᳴᳸᳹‌゙゚⵿⳯⳰⳱ꚞꚟ꛰꛱ꠂ꠆ꠋꠥꠦ꠬꣄ꣅꣿꦀꦁꦂ꦳ꦼꦽꧥꨱꨲꨵꨶꩃꩌꩼꪴꪰꪲꪳꪷꪸꪾ꪿꫁ꫬꫭ꫶ꯥꯨ꯭ﬞﾞﾟ𐇽𐋠𐨁𐨂𐨃𐨅𐨆𐨹𐨿𐨺𐫦𐨸𐫥𐺫𐺬𑀁𑁿𑂀𑂁𑂺𑅳𑂹𑄀𑄁𑄂𑆀𑆁𑇏𑈯𑈰𑈱𑈴𑈶𑈷𑈾𑋟𑌀𑌁𑌻𑌼𑌾𑍀𑍗𑑂𑑃𑑄𑑆𑑞𑒰𑒺𑒽𑒿𑓀𑓃𑓂𑖯𑖼𑖽𑗀𑖿𑗜𑗝𑘽𑘿𑙀𑚫𑚭𑚷𑜝𑜞𑜟𑠺𑠹𑤰𑤻𑤼𑥃𑤾𑧚𑧛𑧠𑩇𑩙𑩚𑩛𑪘𑪙𑰿𑲲𑲳𑲵𑲶𑴺𑴼𑴽𑵇𑶐𑶑𑶕𑶗𑻳𑻴𖽏𖿤𛲝𛲞𝅧𝅨𝅩𝅥𝉂𝉃𝉄𝩵𝪄𞀣𞀤", "̀ͯ҃҉ֽًؚ֑ٟ۪ۭؐۖۜ۟ۤܰ݊ަް࣓ࣣ߫߳ࠖ࠙ࠛࠣࠩ࠭࣡ंुै॑ॗুৄુૅૺ૿ୁୄొ్ുൄิฺ็๎ິຼ່ໍཱཾ྄ྀྍྗྙྼိူဲ့ၱၴិួ៉៓ᩘᩞᩥᩬᩳᫀ᩼᪰ᬀᬃ᬴ᬺ᭫᭳ᮢᮥᰬᰳ᳔᳢᳨〪᷹᷿〯᳠᷀᷻⃐⃰ⷠⷿ꙯꙲ꙴ꙽꣠꣱ꤦ꤭ꥇꥑꦶꦹꨩꨮ︀️︠︯𐍶𐍺𐨌𐽆𐽐𐨏𐴤𐴧𑀸𑁆𑂳𑂶𑄧𑄫𑄭𑄴𑆶𑆾𑇉𑇌𑋣𑋪𑍦𑍬𑍰𑍴𑐸𑐿𑒳𑒸𑖲𑖵𑘳𑘺𑚰𑚵𑜢𑜥𑜧𑜫𑠯𑠷𑧔𑧗𑨁𑨊𑨳𑨸𑨻𑨾𑩑𑩖𑪊𑪖𑰰𑰶𑰸𑰽𑲒𑲧𑲪𑲰𑴱𑴶𑴿𖫰𖫴𑵅𖬰𖬶𖾏𖾒𝅮𝅲𝅻𝆂𝆋𝆅𝆪𝆭𝨀𝨶𝨻𝩬𝪛𝪟𝪡𝪯𞥊𞣐𞣖𞀀𞀆𞀈𞀘𞀛𞀡𞀦𞀪𞄰𞄶𞋬𞋯𞥄🏻🏿󠀠󠁿󠄀󠇯")),
  isRegionalIndicator: (v: number) => (v >= 0x1f1e6 && v <= 0x1f1ff),
  isSpacingMark: ((s: Set<number>) => (v: number) => s.has(v))(strToSet("ःऻािीॎॏংঃিীেৈোৌਃਾਿੀઃાિીૉોૌଂଃୀେୈୋୌிுூெேைொோௌఁంఃಂಃಾೀುೃೄೇೈೊೋംഃിീെേൈൊോൌංඃැෑෲෳำຳ༾༿ཿေျြၖၗႄាះៈᤩᤪᤫᤰᤱᨙᨚᩕᩗᬄᬻᭃ᭄ᮂᮡᮦᮧ᮪ᯧᯪᯫᯬᯮ᯲᯳ᰴᰵ᳡᳷ꠣꠤꠧꢀꢁꥒ꥓ꦃꦴꦵꦺꦻꦾꦿ꧀ꨯꨰꨳꨴꩍꫫꫮꫯꫵꯣꯤꯦꯧꯩꯪ꯬𑀀𑀂𑂂𑂰𑂱𑂲𑂷𑂸𑄬𑅅𑅆𑆂𑆳𑆴𑆵𑆿𑇀𑇎𑈬𑈭𑈮𑈲𑈳𑈵𑋠𑋡𑋢𑌂𑌃𑌿𑍇𑍈𑍋𑍌𑍍𑍢𑍣𑐵𑐶𑐷𑑀𑑁𑑅𑒱𑒲𑒹𑒻𑒼𑒾𑓁𑖰𑖱𑖾𑘰𑘱𑘲𑘻𑘼𑘾𑚬𑚮𑚯𑚶𑜠𑜡𑜦𑠬𑠭𑠮𑠸𑤷𑤸𑤽𑥀𑥂𑧑𑧒𑧓𑧤𑨹𑩗𑩘𑪗𑰯𑰾𑲩𑲱𑲴𑶓𑶔𑶖𑻵𑻶𖿰𖿱𝅦𝅭", "ॉौుౄෘෞើៅᤣᤦᤳᤸᩭᩲᬽᭁᰤᰫꢴꣃ𑍁𑍄𑖸𑖻𑤱𑤵𑧜𑧟𑶊𑶎𖽑𖾇")),
  isL: (v: number) => (v >= 0x1100 && v <= 0x115f) || (v >= 0xa960 && v <= 0xa97c),
  isV: (v: number) => (v >= 0x1160 && v <= 0x11a7) || (v >= 0xd7b0 && v <= 0xd7c6),
  isT: (v: number) => (v >= 0x11a8 && v <= 0x11ff) || (v >= 0xd7cb && v <= 0xd7fb),
  // shorter (and faster!) than the whole table (399 entries)
  isLV: (v: number) => (v >= 0xac00 && v <= 0xd7a3) && ((v-0xac00) % 28 === 0),
  // shorter (and faster!) than the whole table (10773 entries)
  isLVT: (v: number) => (v >= 0xac00 && v <= 0xd7a3) && ((v-0xac00) % 28 !== 0),
  isZWJ: (v:number) => (v === 0x200d),
  // from emoji-data.txt, needed for rule http://unicode.org/reports/tr29/#GB11
  isExtendedPictographic: ((s: Set<number>) => (v: number) => s.has(v))(strToSet("©®‼⁉™ℹ↩↪⌚⌛⌨⎈⏏⏸⏹⏺Ⓜ▪▫▶◀✔✖✝✡✨✳✴❄❇❌❎❓❔❕❗➕➖➗➡➰➿⤴⤵⬅⬆⬇⬛⬜⭐⭕〰〽㊗㊙🄍🄎🄏🄯🅾🅿🆎🈁🈂🈚🈯🉐🉑🩸🩹🩺🫀🫁🫂", "↔↙⏩⏳◻◾☀★☇☒☔⚅⚐✅✈✒❣❧🀀🃏🅬🅱🆑🆚🈲🈺🌀🏺🐀🔽🕆🙏🚀🛗🛠🛬🛰🛼🟠🟫🤌🤺🤼🥅🥇🥸🥺🧋🧍🧿🩰🩴🪀🪆🪐🪨🪰🪶🫐🫖")),
}
