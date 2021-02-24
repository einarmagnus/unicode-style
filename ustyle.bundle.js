const allTextStyles1 = [
    "ASCII",
    "BOLD",
    "ITALIC",
    "BOLD ITALIC",
    "SANS-SERIF",
    "SANS-SERIF BOLD",
    "SANS-SERIF ITALIC",
    "SANS-SERIF BOLD ITALIC",
    "MONOSPACE",
    "SCRIPT",
    "BOLD SCRIPT",
    "FRAKTUR",
    "BOLD FRAKTUR",
    "DOUBLE-STRUCK",
];
const alphabets = {
    "ASCII": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "BOLD": "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    "ITALIC": "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
    "BOLD ITALIC": "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    "SANS-SERIF": "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
    "SANS-SERIF BOLD": "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
    "SANS-SERIF ITALIC": "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
    "SANS-SERIF BOLD ITALIC": "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
    "MONOSPACE": "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
    "SCRIPT": "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
    "BOLD SCRIPT": "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    "FRAKTUR": "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
    "BOLD FRAKTUR": "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    "DOUBLE-STRUCK": "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"
};
const decompositionMap = {
    "À": "À",
    "Á": "Á",
    "Â": "Â",
    "Ã": "Ã",
    "Ä": "Ä",
    "Å": "Å",
    "Ç": "Ç",
    "È": "È",
    "É": "É",
    "Ê": "Ê",
    "Ë": "Ë",
    "Ì": "Ì",
    "Í": "Í",
    "Î": "Î",
    "Ï": "Ï",
    "Ñ": "Ñ",
    "Ò": "Ò",
    "Ó": "Ó",
    "Ô": "Ô",
    "Õ": "Õ",
    "Ö": "Ö",
    "Ù": "Ù",
    "Ú": "Ú",
    "Û": "Û",
    "Ü": "Ü",
    "Ý": "Ý",
    "à": "à",
    "á": "á",
    "â": "â",
    "ã": "ã",
    "ä": "ä",
    "å": "å",
    "ç": "ç",
    "è": "è",
    "é": "é",
    "ê": "ê",
    "ë": "ë",
    "ì": "ì",
    "í": "í",
    "î": "î",
    "ï": "ï",
    "ñ": "ñ",
    "ò": "ò",
    "ó": "ó",
    "ô": "ô",
    "õ": "õ",
    "ö": "ö",
    "ù": "ù",
    "ú": "ú",
    "û": "û",
    "ü": "ü",
    "ý": "ý",
    "ÿ": "ÿ",
    "Ā": "Ā",
    "ā": "ā",
    "Ă": "Ă",
    "ă": "ă",
    "Ą": "Ą",
    "ą": "ą",
    "Ć": "Ć",
    "ć": "ć",
    "Ĉ": "Ĉ",
    "ĉ": "ĉ",
    "Ċ": "Ċ",
    "ċ": "ċ",
    "Č": "Č",
    "č": "č",
    "Ď": "Ď",
    "ď": "ď",
    "Ē": "Ē",
    "ē": "ē",
    "Ĕ": "Ĕ",
    "ĕ": "ĕ",
    "Ė": "Ė",
    "ė": "ė",
    "Ę": "Ę",
    "ę": "ę",
    "Ě": "Ě",
    "ě": "ě",
    "Ĝ": "Ĝ",
    "ĝ": "ĝ",
    "Ğ": "Ğ",
    "ğ": "ğ",
    "Ġ": "Ġ",
    "ġ": "ġ",
    "Ģ": "Ģ",
    "ģ": "ģ",
    "Ĥ": "Ĥ",
    "ĥ": "ĥ",
    "Ĩ": "Ĩ",
    "ĩ": "ĩ",
    "Ī": "Ī",
    "ī": "ī",
    "Ĭ": "Ĭ",
    "ĭ": "ĭ",
    "Į": "Į",
    "į": "į",
    "İ": "İ",
    "Ĵ": "Ĵ",
    "ĵ": "ĵ",
    "Ķ": "Ķ",
    "ķ": "ķ",
    "Ĺ": "Ĺ",
    "ĺ": "ĺ",
    "Ļ": "Ļ",
    "ļ": "ļ",
    "Ľ": "Ľ",
    "ľ": "ľ",
    "Ń": "Ń",
    "ń": "ń",
    "Ņ": "Ņ",
    "ņ": "ņ",
    "Ň": "Ň",
    "ň": "ň",
    "Ō": "Ō",
    "ō": "ō",
    "Ŏ": "Ŏ",
    "ŏ": "ŏ",
    "Ő": "Ő",
    "ő": "ő",
    "Ŕ": "Ŕ",
    "ŕ": "ŕ",
    "Ŗ": "Ŗ",
    "ŗ": "ŗ",
    "Ř": "Ř",
    "ř": "ř",
    "Ś": "Ś",
    "ś": "ś",
    "Ŝ": "Ŝ",
    "ŝ": "ŝ",
    "Ş": "Ş",
    "ş": "ş",
    "Š": "Š",
    "š": "š",
    "Ţ": "Ţ",
    "ţ": "ţ",
    "Ť": "Ť",
    "ť": "ť",
    "Ũ": "Ũ",
    "ũ": "ũ",
    "Ū": "Ū",
    "ū": "ū",
    "Ŭ": "Ŭ",
    "ŭ": "ŭ",
    "Ů": "Ů",
    "ů": "ů",
    "Ű": "Ű",
    "ű": "ű",
    "Ų": "Ų",
    "ų": "ų",
    "Ŵ": "Ŵ",
    "ŵ": "ŵ",
    "Ŷ": "Ŷ",
    "ŷ": "ŷ",
    "Ÿ": "Ÿ",
    "Ź": "Ź",
    "ź": "ź",
    "Ż": "Ż",
    "ż": "ż",
    "Ž": "Ž",
    "ž": "ž",
    "Ơ": "Ơ",
    "ơ": "ơ",
    "Ư": "Ư",
    "ư": "ư",
    "Ǎ": "Ǎ",
    "ǎ": "ǎ",
    "Ǐ": "Ǐ",
    "ǐ": "ǐ",
    "Ǒ": "Ǒ",
    "ǒ": "ǒ",
    "Ǔ": "Ǔ",
    "ǔ": "ǔ",
    "Ǖ": "Ǖ",
    "ǖ": "ǖ",
    "Ǘ": "Ǘ",
    "ǘ": "ǘ",
    "Ǚ": "Ǚ",
    "ǚ": "ǚ",
    "Ǜ": "Ǜ",
    "ǜ": "ǜ",
    "Ǟ": "Ǟ",
    "ǟ": "ǟ",
    "Ǡ": "Ǡ",
    "ǡ": "ǡ",
    "Ǧ": "Ǧ",
    "ǧ": "ǧ",
    "Ǩ": "Ǩ",
    "ǩ": "ǩ",
    "Ǫ": "Ǫ",
    "ǫ": "ǫ",
    "Ǭ": "Ǭ",
    "ǭ": "ǭ",
    "ǰ": "ǰ",
    "Ǵ": "Ǵ",
    "ǵ": "ǵ",
    "Ǹ": "Ǹ",
    "ǹ": "ǹ",
    "Ǻ": "Ǻ",
    "ǻ": "ǻ",
    "Ǿ": "Ǿ",
    "ǿ": "ǿ",
    "Ȁ": "Ȁ",
    "ȁ": "ȁ",
    "Ȃ": "Ȃ",
    "ȃ": "ȃ",
    "Ȅ": "Ȅ",
    "ȅ": "ȅ",
    "Ȇ": "Ȇ",
    "ȇ": "ȇ",
    "Ȉ": "Ȉ",
    "ȉ": "ȉ",
    "Ȋ": "Ȋ",
    "ȋ": "ȋ",
    "Ȍ": "Ȍ",
    "ȍ": "ȍ",
    "Ȏ": "Ȏ",
    "ȏ": "ȏ",
    "Ȑ": "Ȑ",
    "ȑ": "ȑ",
    "Ȓ": "Ȓ",
    "ȓ": "ȓ",
    "Ȕ": "Ȕ",
    "ȕ": "ȕ",
    "Ȗ": "Ȗ",
    "ȗ": "ȗ",
    "Ș": "Ș",
    "ș": "ș",
    "Ț": "Ț",
    "ț": "ț",
    "Ȟ": "Ȟ",
    "ȟ": "ȟ",
    "Ȧ": "Ȧ",
    "ȧ": "ȧ",
    "Ȩ": "Ȩ",
    "ȩ": "ȩ",
    "Ȫ": "Ȫ",
    "ȫ": "ȫ",
    "Ȭ": "Ȭ",
    "ȭ": "ȭ",
    "Ȯ": "Ȯ",
    "ȯ": "ȯ",
    "Ȱ": "Ȱ",
    "ȱ": "ȱ",
    "Ȳ": "Ȳ",
    "ȳ": "ȳ",
    "Ḁ": "Ḁ",
    "ḁ": "ḁ",
    "Ḃ": "Ḃ",
    "ḃ": "ḃ",
    "Ḅ": "Ḅ",
    "ḅ": "ḅ",
    "Ḇ": "Ḇ",
    "ḇ": "ḇ",
    "Ḉ": "Ḉ",
    "ḉ": "ḉ",
    "Ḋ": "Ḋ",
    "ḋ": "ḋ",
    "Ḍ": "Ḍ",
    "ḍ": "ḍ",
    "Ḏ": "Ḏ",
    "ḏ": "ḏ",
    "Ḑ": "Ḑ",
    "ḑ": "ḑ",
    "Ḓ": "Ḓ",
    "ḓ": "ḓ",
    "Ḕ": "Ḕ",
    "ḕ": "ḕ",
    "Ḗ": "Ḗ",
    "ḗ": "ḗ",
    "Ḙ": "Ḙ",
    "ḙ": "ḙ",
    "Ḛ": "Ḛ",
    "ḛ": "ḛ",
    "Ḝ": "Ḝ",
    "ḝ": "ḝ",
    "Ḟ": "Ḟ",
    "ḟ": "ḟ",
    "Ḡ": "Ḡ",
    "ḡ": "ḡ",
    "Ḣ": "Ḣ",
    "ḣ": "ḣ",
    "Ḥ": "Ḥ",
    "ḥ": "ḥ",
    "Ḧ": "Ḧ",
    "ḧ": "ḧ",
    "Ḩ": "Ḩ",
    "ḩ": "ḩ",
    "Ḫ": "Ḫ",
    "ḫ": "ḫ",
    "Ḭ": "Ḭ",
    "ḭ": "ḭ",
    "Ḯ": "Ḯ",
    "ḯ": "ḯ",
    "Ḱ": "Ḱ",
    "ḱ": "ḱ",
    "Ḳ": "Ḳ",
    "ḳ": "ḳ",
    "Ḵ": "Ḵ",
    "ḵ": "ḵ",
    "Ḷ": "Ḷ",
    "ḷ": "ḷ",
    "Ḹ": "Ḹ",
    "ḹ": "ḹ",
    "Ḻ": "Ḻ",
    "ḻ": "ḻ",
    "Ḽ": "Ḽ",
    "ḽ": "ḽ",
    "Ḿ": "Ḿ",
    "ḿ": "ḿ",
    "Ṁ": "Ṁ",
    "ṁ": "ṁ",
    "Ṃ": "Ṃ",
    "ṃ": "ṃ",
    "Ṅ": "Ṅ",
    "ṅ": "ṅ",
    "Ṇ": "Ṇ",
    "ṇ": "ṇ",
    "Ṉ": "Ṉ",
    "ṉ": "ṉ",
    "Ṋ": "Ṋ",
    "ṋ": "ṋ",
    "Ṍ": "Ṍ",
    "ṍ": "ṍ",
    "Ṏ": "Ṏ",
    "ṏ": "ṏ",
    "Ṑ": "Ṑ",
    "ṑ": "ṑ",
    "Ṓ": "Ṓ",
    "ṓ": "ṓ",
    "Ṕ": "Ṕ",
    "ṕ": "ṕ",
    "Ṗ": "Ṗ",
    "ṗ": "ṗ",
    "Ṙ": "Ṙ",
    "ṙ": "ṙ",
    "Ṛ": "Ṛ",
    "ṛ": "ṛ",
    "Ṝ": "Ṝ",
    "ṝ": "ṝ",
    "Ṟ": "Ṟ",
    "ṟ": "ṟ",
    "Ṡ": "Ṡ",
    "ṡ": "ṡ",
    "Ṣ": "Ṣ",
    "ṣ": "ṣ",
    "Ṥ": "Ṥ",
    "ṥ": "ṥ",
    "Ṧ": "Ṧ",
    "ṧ": "ṧ",
    "Ṩ": "Ṩ",
    "ṩ": "ṩ",
    "Ṫ": "Ṫ",
    "ṫ": "ṫ",
    "Ṭ": "Ṭ",
    "ṭ": "ṭ",
    "Ṯ": "Ṯ",
    "ṯ": "ṯ",
    "Ṱ": "Ṱ",
    "ṱ": "ṱ",
    "Ṳ": "Ṳ",
    "ṳ": "ṳ",
    "Ṵ": "Ṵ",
    "ṵ": "ṵ",
    "Ṷ": "Ṷ",
    "ṷ": "ṷ",
    "Ṹ": "Ṹ",
    "ṹ": "ṹ",
    "Ṻ": "Ṻ",
    "ṻ": "ṻ",
    "Ṽ": "Ṽ",
    "ṽ": "ṽ",
    "Ṿ": "Ṿ",
    "ṿ": "ṿ",
    "Ẁ": "Ẁ",
    "ẁ": "ẁ",
    "Ẃ": "Ẃ",
    "ẃ": "ẃ",
    "Ẅ": "Ẅ",
    "ẅ": "ẅ",
    "Ẇ": "Ẇ",
    "ẇ": "ẇ",
    "Ẉ": "Ẉ",
    "ẉ": "ẉ",
    "Ẋ": "Ẋ",
    "ẋ": "ẋ",
    "Ẍ": "Ẍ",
    "ẍ": "ẍ",
    "Ẏ": "Ẏ",
    "ẏ": "ẏ",
    "Ẑ": "Ẑ",
    "ẑ": "ẑ",
    "Ẓ": "Ẓ",
    "ẓ": "ẓ",
    "Ẕ": "Ẕ",
    "ẕ": "ẕ",
    "ẖ": "ẖ",
    "ẗ": "ẗ",
    "ẘ": "ẘ",
    "ẙ": "ẙ",
    "Ạ": "Ạ",
    "ạ": "ạ",
    "Ả": "Ả",
    "ả": "ả",
    "Ấ": "Ấ",
    "ấ": "ấ",
    "Ầ": "Ầ",
    "ầ": "ầ",
    "Ẩ": "Ẩ",
    "ẩ": "ẩ",
    "Ẫ": "Ẫ",
    "ẫ": "ẫ",
    "Ậ": "Ậ",
    "ậ": "ậ",
    "Ắ": "Ắ",
    "ắ": "ắ",
    "Ằ": "Ằ",
    "ằ": "ằ",
    "Ẳ": "Ẳ",
    "ẳ": "ẳ",
    "Ẵ": "Ẵ",
    "ẵ": "ẵ",
    "Ặ": "Ặ",
    "ặ": "ặ",
    "Ẹ": "Ẹ",
    "ẹ": "ẹ",
    "Ẻ": "Ẻ",
    "ẻ": "ẻ",
    "Ẽ": "Ẽ",
    "ẽ": "ẽ",
    "Ế": "Ế",
    "ế": "ế",
    "Ề": "Ề",
    "ề": "ề",
    "Ể": "Ể",
    "ể": "ể",
    "Ễ": "Ễ",
    "ễ": "ễ",
    "Ệ": "Ệ",
    "ệ": "ệ",
    "Ỉ": "Ỉ",
    "ỉ": "ỉ",
    "Ị": "Ị",
    "ị": "ị",
    "Ọ": "Ọ",
    "ọ": "ọ",
    "Ỏ": "Ỏ",
    "ỏ": "ỏ",
    "Ố": "Ố",
    "ố": "ố",
    "Ồ": "Ồ",
    "ồ": "ồ",
    "Ổ": "Ổ",
    "ổ": "ổ",
    "Ỗ": "Ỗ",
    "ỗ": "ỗ",
    "Ộ": "Ộ",
    "ộ": "ộ",
    "Ớ": "Ớ",
    "ớ": "ớ",
    "Ờ": "Ờ",
    "ờ": "ờ",
    "Ở": "Ở",
    "ở": "ở",
    "Ỡ": "Ỡ",
    "ỡ": "ỡ",
    "Ợ": "Ợ",
    "ợ": "ợ",
    "Ụ": "Ụ",
    "ụ": "ụ",
    "Ủ": "Ủ",
    "ủ": "ủ",
    "Ứ": "Ứ",
    "ứ": "ứ",
    "Ừ": "Ừ",
    "ừ": "ừ",
    "Ử": "Ử",
    "ử": "ử",
    "Ữ": "Ữ",
    "ữ": "ữ",
    "Ự": "Ự",
    "ự": "ự",
    "Ỳ": "Ỳ",
    "ỳ": "ỳ",
    "Ỵ": "Ỵ",
    "ỵ": "ỵ",
    "Ỷ": "Ỷ",
    "ỷ": "ỷ",
    "Ỹ": "Ỹ",
    "ỹ": "ỹ"
};
const decomposeChars = (text)=>text.replace(/./g, (ch)=>decompositionMap[ch] || ch
    )
;
const decomposeChars1 = decomposeChars;
let min = Infinity, max = 0;
function makeCompositionMap() {
    const recMap = {
    };
    for (const [c, d] of Object.entries(decompositionMap)){
        const [d1, d2] = d;
        recMap[d2] ??= {
        };
        recMap[d2][d1] = c;
        const cNum = c.charCodeAt(0);
        if (cNum < min) {
            min = cNum;
        }
        if (cNum > max) {
            max = cNum;
        }
    }
    return recMap;
}
function monkeyPatchNormalize() {
    if ("ä".normalize("NFD").length === 2) {
        return;
    }
    const compositionMap = makeCompositionMap();
    const origNormalize = String.prototype.normalize;
    String.prototype.normalize = function(form) {
        if (form === "NFC") {
            return composeChars(this, compositionMap);
        } else if (form === "NFD") {
            return decomposeChars1(this);
        } else {
            return origNormalize.apply(this, [
                form
            ]);
        }
    };
}
function composeChars(text, compositionMap) {
    const result = [];
    let lastIndex = 0;
    const combiningChars = Object.keys(compositionMap);
    for(let i = 1; i < text.length; i++){
        const ch = text.charCodeAt(i);
        if (ch < min || ch > max) continue;
        for (const comChar of combiningChars){
            if (comChar === text[i]) {
                const composed = compositionMap[comChar][text[i - 1]];
                if (composed) {
                    result.push(text.substring(lastIndex, i - 1), composed);
                    lastIndex = i + 1;
                }
            }
        }
    }
    result.push(text.substring(lastIndex));
    return result.join("");
}
const styleElements = [
    "ascii",
    "sans-serif",
    "bold",
    "italic",
    "fraktur",
    "monospace",
    "script",
    "double-struck",
];
const styleShortOptions = {
    "a": "ascii",
    "b": "bold",
    "i": "italic",
    "c": "script",
    "f": "fraktur",
    "d": "double-struck",
    "s": "sans-serif",
    "m": "monospace"
};
function validateLongFlag(opt) {
    if (styleElements.includes(opt)) {
        return opt;
    } else {
        throw `'--${opt}' is not a valid style`;
    }
}
function translateShortFlags1(opts) {
    const styles = [];
    for (const opt of opts){
        if (styleShortOptions[opt]) {
            styles.push(styleShortOptions[opt]);
        } else {
            throw `${opt} is not a valid option (found in ${opts})`;
        }
    }
    return styles;
}
function composeStyles1(styles) {
    styles.sort((el1, el2)=>styleElements.indexOf(el1) - styleElements.indexOf(el2)
    );
    const styleName = styles.join(" ").toUpperCase();
    if (allTextStyles1.includes(styleName)) {
        return styleName;
    } else {
        throw `There is no ${styleName} available in unicode`;
    }
}
export { allTextStyles1 as allTextStyles, composeStyles1 as composeStyles, translateShortFlags1 as translateShortFlags };
monkeyPatchNormalize();
const erasor = {
};
function makeCharMap(alphabets1) {
    const styles = new Map();
    const ascii = alphabets1["ASCII"];
    for (const styleName of allTextStyles1){
        const alphabet = alphabets1[styleName];
        styles.set(styleName, Array.from(alphabet).reduce((map, __char, i)=>{
            map[ascii[i]] = __char;
            erasor[__char] = ascii[i];
            return map;
        }, {
        }));
    }
    return styles;
}
const styleCharMap1 = makeCharMap(alphabets);
export { styleCharMap1 as styleCharMap };
function unstyle1(text) {
    const result = [];
    for (const __char of text){
        result.push(erasor[__char] ?? __char);
    }
    return result.join("").normalize();
}
export { unstyle1 as unstyle };
function style1(text, style1) {
    text = text.normalize("NFD");
    const alphabet = styleCharMap1.get(style1);
    if (!alphabet) {
        throw new Error(`No style '${style1}' found`);
    }
    const result = [];
    for(let i = 0; i < text.length; i++){
        const __char = text.charAt(i);
        result.push(alphabet[__char] || __char);
    }
    const r = result.join("");
    return r.normalize("NFC");
}
export { style1 as style };
const literalRegex = /{([bicsfdm]+) ([^}]*)}/g;
const flagsToStyle = (flags)=>composeStyles1(translateShortFlags1(flags))
;
function parseTemplate1(template) {
    return template.replace(literalRegex, (all, flags, text)=>{
        try {
            return style1(text, flagsToStyle(flags));
        } catch (e) {
            return all;
        }
    });
}
export { parseTemplate1 as parseTemplate };
