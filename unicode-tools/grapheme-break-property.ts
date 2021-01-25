
  type CodePointPred = (v: number) => boolean;
  type F<In, Out> = (arg: In) => Out
  export const between = (a: number, b: number) => (v: number) => v >= a && v <= b;
  export const equalTo = (a: number) => (v: number) => a === v;
  export const inSet = (s: Set<number>) => (v: number) => s.has(v);
  export const or = (...ps: CodePointPred[]) => (v: number) => ps.some(p => p(v));
  export const and = (...ps: CodePointPred[]) => (v: number) => ps.every(p => p(v));
  export const not = (p: CodePointPred) => (v: number) => !p(v);
  export const offset = (o: number) => (v: number) => v - o;
  export const divisibleBy = (d: number) => (v: number) => v % d === 0;
  export const chain = <In, Middle, Out>(a: F<In, Middle>, b: F<Middle, Out>) => (v: In) => b(a(v));
  
export const graphemeBreakProp = {
  isPrepend: inSet(new Set([0x600, 0x601, 0x602, 0x603, 0x604, 0x605, 0x6dd, 0x70f, 0x8e2, 0xd4e, 0x110bd, 0x110cd, 0x111c2, 0x111c3, 0x1193f, 0x11941, 0x11a3a, 0x11a84, 0x11a85, 0x11a86, 0x11a87, 0x11a88, 0x11a89, 0x11d46])),
  isCR: equalTo(0xd),
  isLF: equalTo(0xa),
  isControl: or(between(0x7f, 0x9f), inSet(new Set([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xb, 0xc, 0xe, 0xf, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0xad, 0x61c, 0x180e, 0x200b, 0x200e, 0x200f, 0x2028, 0x2029, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2060, 0x2061, 0x2062, 0x2063, 0x2064, 0x2066, 0x2067, 0x2068, 0x2069, 0x206a, 0x206b, 0x206c, 0x206d, 0x206e, 0x206f, 0xfeff, 0xfff9, 0xfffa, 0xfffb, 0x13430, 0x13431, 0x13432, 0x13433, 0x13434, 0x13435, 0x13436, 0x13437, 0x13438, 0x1bca0, 0x1bca1, 0x1bca2, 0x1bca3, 0x1d173, 0x1d174, 0x1d175, 0x1d176, 0x1d177, 0x1d178, 0x1d179, 0x1d17a, 0xe0001]))),
  isExtend: or(between(0x300, 0x36f), between(0xe0100, 0xe01ef), inSet(new Set([0x483, 0x484, 0x485, 0x486, 0x487, 0x488, 0x489, 0x591, 0x592, 0x593, 0x594, 0x595, 0x596, 0x597, 0x598, 0x599, 0x59a, 0x59b, 0x59c, 0x59d, 0x59e, 0x59f, 0x5a0, 0x5a1, 0x5a2, 0x5a3, 0x5a4, 0x5a5, 0x5a6, 0x5a7, 0x5a8, 0x5a9, 0x5aa, 0x5ab, 0x5ac, 0x5ad, 0x5ae, 0x5af, 0x5b0, 0x5b1, 0x5b2, 0x5b3, 0x5b4, 0x5b5, 0x5b6, 0x5b7, 0x5b8, 0x5b9, 0x5ba, 0x5bb, 0x5bc, 0x5bd, 0x5bf, 0x5c1, 0x5c2, 0x5c4, 0x5c5, 0x5c7, 0x610, 0x611, 0x612, 0x613, 0x614, 0x615, 0x616, 0x617, 0x618, 0x619, 0x61a, 0x64b, 0x64c, 0x64d, 0x64e, 0x64f, 0x650, 0x651, 0x652, 0x653, 0x654, 0x655, 0x656, 0x657, 0x658, 0x659, 0x65a, 0x65b, 0x65c, 0x65d, 0x65e, 0x65f, 0x670, 0x6d6, 0x6d7, 0x6d8, 0x6d9, 0x6da, 0x6db, 0x6dc, 0x6df, 0x6e0, 0x6e1, 0x6e2, 0x6e3, 0x6e4, 0x6e7, 0x6e8, 0x6ea, 0x6eb, 0x6ec, 0x6ed, 0x711, 0x730, 0x731, 0x732, 0x733, 0x734, 0x735, 0x736, 0x737, 0x738, 0x739, 0x73a, 0x73b, 0x73c, 0x73d, 0x73e, 0x73f, 0x740, 0x741, 0x742, 0x743, 0x744, 0x745, 0x746, 0x747, 0x748, 0x749, 0x74a, 0x7a6, 0x7a7, 0x7a8, 0x7a9, 0x7aa, 0x7ab, 0x7ac, 0x7ad, 0x7ae, 0x7af, 0x7b0, 0x7eb, 0x7ec, 0x7ed, 0x7ee, 0x7ef, 0x7f0, 0x7f1, 0x7f2, 0x7f3, 0x7fd, 0x816, 0x817, 0x818, 0x819, 0x81b, 0x81c, 0x81d, 0x81e, 0x81f, 0x820, 0x821, 0x822, 0x823, 0x825, 0x826, 0x827, 0x829, 0x82a, 0x82b, 0x82c, 0x82d, 0x859, 0x85a, 0x85b, 0x8d3, 0x8d4, 0x8d5, 0x8d6, 0x8d7, 0x8d8, 0x8d9, 0x8da, 0x8db, 0x8dc, 0x8dd, 0x8de, 0x8df, 0x8e0, 0x8e1, 0x8e3, 0x8e4, 0x8e5, 0x8e6, 0x8e7, 0x8e8, 0x8e9, 0x8ea, 0x8eb, 0x8ec, 0x8ed, 0x8ee, 0x8ef, 0x8f0, 0x8f1, 0x8f2, 0x8f3, 0x8f4, 0x8f5, 0x8f6, 0x8f7, 0x8f8, 0x8f9, 0x8fa, 0x8fb, 0x8fc, 0x8fd, 0x8fe, 0x8ff, 0x900, 0x901, 0x902, 0x93a, 0x93c, 0x941, 0x942, 0x943, 0x944, 0x945, 0x946, 0x947, 0x948, 0x94d, 0x951, 0x952, 0x953, 0x954, 0x955, 0x956, 0x957, 0x962, 0x963, 0x981, 0x9bc, 0x9be, 0x9c1, 0x9c2, 0x9c3, 0x9c4, 0x9cd, 0x9d7, 0x9e2, 0x9e3, 0x9fe, 0xa01, 0xa02, 0xa3c, 0xa41, 0xa42, 0xa47, 0xa48, 0xa4b, 0xa4c, 0xa4d, 0xa51, 0xa70, 0xa71, 0xa75, 0xa81, 0xa82, 0xabc, 0xac1, 0xac2, 0xac3, 0xac4, 0xac5, 0xac7, 0xac8, 0xacd, 0xae2, 0xae3, 0xafa, 0xafb, 0xafc, 0xafd, 0xafe, 0xaff, 0xb01, 0xb3c, 0xb3e, 0xb3f, 0xb41, 0xb42, 0xb43, 0xb44, 0xb4d, 0xb55, 0xb56, 0xb57, 0xb62, 0xb63, 0xb82, 0xbbe, 0xbc0, 0xbcd, 0xbd7, 0xc00, 0xc04, 0xc3e, 0xc3f, 0xc40, 0xc46, 0xc47, 0xc48, 0xc4a, 0xc4b, 0xc4c, 0xc4d, 0xc55, 0xc56, 0xc62, 0xc63, 0xc81, 0xcbc, 0xcbf, 0xcc2, 0xcc6, 0xccc, 0xccd, 0xcd5, 0xcd6, 0xce2, 0xce3, 0xd00, 0xd01, 0xd3b, 0xd3c, 0xd3e, 0xd41, 0xd42, 0xd43, 0xd44, 0xd4d, 0xd57, 0xd62, 0xd63, 0xd81, 0xdca, 0xdcf, 0xdd2, 0xdd3, 0xdd4, 0xdd6, 0xddf, 0xe31, 0xe34, 0xe35, 0xe36, 0xe37, 0xe38, 0xe39, 0xe3a, 0xe47, 0xe48, 0xe49, 0xe4a, 0xe4b, 0xe4c, 0xe4d, 0xe4e, 0xeb1, 0xeb4, 0xeb5, 0xeb6, 0xeb7, 0xeb8, 0xeb9, 0xeba, 0xebb, 0xebc, 0xec8, 0xec9, 0xeca, 0xecb, 0xecc, 0xecd, 0xf18, 0xf19, 0xf35, 0xf37, 0xf39, 0xf71, 0xf72, 0xf73, 0xf74, 0xf75, 0xf76, 0xf77, 0xf78, 0xf79, 0xf7a, 0xf7b, 0xf7c, 0xf7d, 0xf7e, 0xf80, 0xf81, 0xf82, 0xf83, 0xf84, 0xf86, 0xf87, 0xf8d, 0xf8e, 0xf8f, 0xf90, 0xf91, 0xf92, 0xf93, 0xf94, 0xf95, 0xf96, 0xf97, 0xf99, 0xf9a, 0xf9b, 0xf9c, 0xf9d, 0xf9e, 0xf9f, 0xfa0, 0xfa1, 0xfa2, 0xfa3, 0xfa4, 0xfa5, 0xfa6, 0xfa7, 0xfa8, 0xfa9, 0xfaa, 0xfab, 0xfac, 0xfad, 0xfae, 0xfaf, 0xfb0, 0xfb1, 0xfb2, 0xfb3, 0xfb4, 0xfb5, 0xfb6, 0xfb7, 0xfb8, 0xfb9, 0xfba, 0xfbb, 0xfbc, 0xfc6, 0x102d, 0x102e, 0x102f, 0x1030, 0x1032, 0x1033, 0x1034, 0x1035, 0x1036, 0x1037, 0x1039, 0x103a, 0x103d, 0x103e, 0x1058, 0x1059, 0x105e, 0x105f, 0x1060, 0x1071, 0x1072, 0x1073, 0x1074, 0x1082, 0x1085, 0x1086, 0x108d, 0x109d, 0x135d, 0x135e, 0x135f, 0x1712, 0x1713, 0x1714, 0x1732, 0x1733, 0x1734, 0x1752, 0x1753, 0x1772, 0x1773, 0x17b4, 0x17b5, 0x17b7, 0x17b8, 0x17b9, 0x17ba, 0x17bb, 0x17bc, 0x17bd, 0x17c6, 0x17c9, 0x17ca, 0x17cb, 0x17cc, 0x17cd, 0x17ce, 0x17cf, 0x17d0, 0x17d1, 0x17d2, 0x17d3, 0x17dd, 0x180b, 0x180c, 0x180d, 0x1885, 0x1886, 0x18a9, 0x1920, 0x1921, 0x1922, 0x1927, 0x1928, 0x1932, 0x1939, 0x193a, 0x193b, 0x1a17, 0x1a18, 0x1a1b, 0x1a56, 0x1a58, 0x1a59, 0x1a5a, 0x1a5b, 0x1a5c, 0x1a5d, 0x1a5e, 0x1a60, 0x1a62, 0x1a65, 0x1a66, 0x1a67, 0x1a68, 0x1a69, 0x1a6a, 0x1a6b, 0x1a6c, 0x1a73, 0x1a74, 0x1a75, 0x1a76, 0x1a77, 0x1a78, 0x1a79, 0x1a7a, 0x1a7b, 0x1a7c, 0x1a7f, 0x1ab0, 0x1ab1, 0x1ab2, 0x1ab3, 0x1ab4, 0x1ab5, 0x1ab6, 0x1ab7, 0x1ab8, 0x1ab9, 0x1aba, 0x1abb, 0x1abc, 0x1abd, 0x1abe, 0x1abf, 0x1ac0, 0x1b00, 0x1b01, 0x1b02, 0x1b03, 0x1b34, 0x1b35, 0x1b36, 0x1b37, 0x1b38, 0x1b39, 0x1b3a, 0x1b3c, 0x1b42, 0x1b6b, 0x1b6c, 0x1b6d, 0x1b6e, 0x1b6f, 0x1b70, 0x1b71, 0x1b72, 0x1b73, 0x1b80, 0x1b81, 0x1ba2, 0x1ba3, 0x1ba4, 0x1ba5, 0x1ba8, 0x1ba9, 0x1bab, 0x1bac, 0x1bad, 0x1be6, 0x1be8, 0x1be9, 0x1bed, 0x1bef, 0x1bf0, 0x1bf1, 0x1c2c, 0x1c2d, 0x1c2e, 0x1c2f, 0x1c30, 0x1c31, 0x1c32, 0x1c33, 0x1c36, 0x1c37, 0x1cd0, 0x1cd1, 0x1cd2, 0x1cd4, 0x1cd5, 0x1cd6, 0x1cd7, 0x1cd8, 0x1cd9, 0x1cda, 0x1cdb, 0x1cdc, 0x1cdd, 0x1cde, 0x1cdf, 0x1ce0, 0x1ce2, 0x1ce3, 0x1ce4, 0x1ce5, 0x1ce6, 0x1ce7, 0x1ce8, 0x1ced, 0x1cf4, 0x1cf8, 0x1cf9, 0x1dc0, 0x1dc1, 0x1dc2, 0x1dc3, 0x1dc4, 0x1dc5, 0x1dc6, 0x1dc7, 0x1dc8, 0x1dc9, 0x1dca, 0x1dcb, 0x1dcc, 0x1dcd, 0x1dce, 0x1dcf, 0x1dd0, 0x1dd1, 0x1dd2, 0x1dd3, 0x1dd4, 0x1dd5, 0x1dd6, 0x1dd7, 0x1dd8, 0x1dd9, 0x1dda, 0x1ddb, 0x1ddc, 0x1ddd, 0x1dde, 0x1ddf, 0x1de0, 0x1de1, 0x1de2, 0x1de3, 0x1de4, 0x1de5, 0x1de6, 0x1de7, 0x1de8, 0x1de9, 0x1dea, 0x1deb, 0x1dec, 0x1ded, 0x1dee, 0x1def, 0x1df0, 0x1df1, 0x1df2, 0x1df3, 0x1df4, 0x1df5, 0x1df6, 0x1df7, 0x1df8, 0x1df9, 0x1dfb, 0x1dfc, 0x1dfd, 0x1dfe, 0x1dff, 0x200c, 0x20d0, 0x20d1, 0x20d2, 0x20d3, 0x20d4, 0x20d5, 0x20d6, 0x20d7, 0x20d8, 0x20d9, 0x20da, 0x20db, 0x20dc, 0x20dd, 0x20de, 0x20df, 0x20e0, 0x20e1, 0x20e2, 0x20e3, 0x20e4, 0x20e5, 0x20e6, 0x20e7, 0x20e8, 0x20e9, 0x20ea, 0x20eb, 0x20ec, 0x20ed, 0x20ee, 0x20ef, 0x20f0, 0x2cef, 0x2cf0, 0x2cf1, 0x2d7f, 0x2de0, 0x2de1, 0x2de2, 0x2de3, 0x2de4, 0x2de5, 0x2de6, 0x2de7, 0x2de8, 0x2de9, 0x2dea, 0x2deb, 0x2dec, 0x2ded, 0x2dee, 0x2def, 0x2df0, 0x2df1, 0x2df2, 0x2df3, 0x2df4, 0x2df5, 0x2df6, 0x2df7, 0x2df8, 0x2df9, 0x2dfa, 0x2dfb, 0x2dfc, 0x2dfd, 0x2dfe, 0x2dff, 0x302a, 0x302b, 0x302c, 0x302d, 0x302e, 0x302f, 0x3099, 0x309a, 0xa66f, 0xa670, 0xa671, 0xa672, 0xa674, 0xa675, 0xa676, 0xa677, 0xa678, 0xa679, 0xa67a, 0xa67b, 0xa67c, 0xa67d, 0xa69e, 0xa69f, 0xa6f0, 0xa6f1, 0xa802, 0xa806, 0xa80b, 0xa825, 0xa826, 0xa82c, 0xa8c4, 0xa8c5, 0xa8e0, 0xa8e1, 0xa8e2, 0xa8e3, 0xa8e4, 0xa8e5, 0xa8e6, 0xa8e7, 0xa8e8, 0xa8e9, 0xa8ea, 0xa8eb, 0xa8ec, 0xa8ed, 0xa8ee, 0xa8ef, 0xa8f0, 0xa8f1, 0xa8ff, 0xa926, 0xa927, 0xa928, 0xa929, 0xa92a, 0xa92b, 0xa92c, 0xa92d, 0xa947, 0xa948, 0xa949, 0xa94a, 0xa94b, 0xa94c, 0xa94d, 0xa94e, 0xa94f, 0xa950, 0xa951, 0xa980, 0xa981, 0xa982, 0xa9b3, 0xa9b6, 0xa9b7, 0xa9b8, 0xa9b9, 0xa9bc, 0xa9bd, 0xa9e5, 0xaa29, 0xaa2a, 0xaa2b, 0xaa2c, 0xaa2d, 0xaa2e, 0xaa31, 0xaa32, 0xaa35, 0xaa36, 0xaa43, 0xaa4c, 0xaa7c, 0xaab0, 0xaab2, 0xaab3, 0xaab4, 0xaab7, 0xaab8, 0xaabe, 0xaabf, 0xaac1, 0xaaec, 0xaaed, 0xaaf6, 0xabe5, 0xabe8, 0xabed, 0xfb1e, 0xfe00, 0xfe01, 0xfe02, 0xfe03, 0xfe04, 0xfe05, 0xfe06, 0xfe07, 0xfe08, 0xfe09, 0xfe0a, 0xfe0b, 0xfe0c, 0xfe0d, 0xfe0e, 0xfe0f, 0xfe20, 0xfe21, 0xfe22, 0xfe23, 0xfe24, 0xfe25, 0xfe26, 0xfe27, 0xfe28, 0xfe29, 0xfe2a, 0xfe2b, 0xfe2c, 0xfe2d, 0xfe2e, 0xfe2f, 0xff9e, 0xff9f, 0x101fd, 0x102e0, 0x10376, 0x10377, 0x10378, 0x10379, 0x1037a, 0x10a01, 0x10a02, 0x10a03, 0x10a05, 0x10a06, 0x10a0c, 0x10a0d, 0x10a0e, 0x10a0f, 0x10a38, 0x10a39, 0x10a3a, 0x10a3f, 0x10ae5, 0x10ae6, 0x10d24, 0x10d25, 0x10d26, 0x10d27, 0x10eab, 0x10eac, 0x10f46, 0x10f47, 0x10f48, 0x10f49, 0x10f4a, 0x10f4b, 0x10f4c, 0x10f4d, 0x10f4e, 0x10f4f, 0x10f50, 0x11001, 0x11038, 0x11039, 0x1103a, 0x1103b, 0x1103c, 0x1103d, 0x1103e, 0x1103f, 0x11040, 0x11041, 0x11042, 0x11043, 0x11044, 0x11045, 0x11046, 0x1107f, 0x11080, 0x11081, 0x110b3, 0x110b4, 0x110b5, 0x110b6, 0x110b9, 0x110ba, 0x11100, 0x11101, 0x11102, 0x11127, 0x11128, 0x11129, 0x1112a, 0x1112b, 0x1112d, 0x1112e, 0x1112f, 0x11130, 0x11131, 0x11132, 0x11133, 0x11134, 0x11173, 0x11180, 0x11181, 0x111b6, 0x111b7, 0x111b8, 0x111b9, 0x111ba, 0x111bb, 0x111bc, 0x111bd, 0x111be, 0x111c9, 0x111ca, 0x111cb, 0x111cc, 0x111cf, 0x1122f, 0x11230, 0x11231, 0x11234, 0x11236, 0x11237, 0x1123e, 0x112df, 0x112e3, 0x112e4, 0x112e5, 0x112e6, 0x112e7, 0x112e8, 0x112e9, 0x112ea, 0x11300, 0x11301, 0x1133b, 0x1133c, 0x1133e, 0x11340, 0x11357, 0x11366, 0x11367, 0x11368, 0x11369, 0x1136a, 0x1136b, 0x1136c, 0x11370, 0x11371, 0x11372, 0x11373, 0x11374, 0x11438, 0x11439, 0x1143a, 0x1143b, 0x1143c, 0x1143d, 0x1143e, 0x1143f, 0x11442, 0x11443, 0x11444, 0x11446, 0x1145e, 0x114b0, 0x114b3, 0x114b4, 0x114b5, 0x114b6, 0x114b7, 0x114b8, 0x114ba, 0x114bd, 0x114bf, 0x114c0, 0x114c2, 0x114c3, 0x115af, 0x115b2, 0x115b3, 0x115b4, 0x115b5, 0x115bc, 0x115bd, 0x115bf, 0x115c0, 0x115dc, 0x115dd, 0x11633, 0x11634, 0x11635, 0x11636, 0x11637, 0x11638, 0x11639, 0x1163a, 0x1163d, 0x1163f, 0x11640, 0x116ab, 0x116ad, 0x116b0, 0x116b1, 0x116b2, 0x116b3, 0x116b4, 0x116b5, 0x116b7, 0x1171d, 0x1171e, 0x1171f, 0x11722, 0x11723, 0x11724, 0x11725, 0x11727, 0x11728, 0x11729, 0x1172a, 0x1172b, 0x1182f, 0x11830, 0x11831, 0x11832, 0x11833, 0x11834, 0x11835, 0x11836, 0x11837, 0x11839, 0x1183a, 0x11930, 0x1193b, 0x1193c, 0x1193e, 0x11943, 0x119d4, 0x119d5, 0x119d6, 0x119d7, 0x119da, 0x119db, 0x119e0, 0x11a01, 0x11a02, 0x11a03, 0x11a04, 0x11a05, 0x11a06, 0x11a07, 0x11a08, 0x11a09, 0x11a0a, 0x11a33, 0x11a34, 0x11a35, 0x11a36, 0x11a37, 0x11a38, 0x11a3b, 0x11a3c, 0x11a3d, 0x11a3e, 0x11a47, 0x11a51, 0x11a52, 0x11a53, 0x11a54, 0x11a55, 0x11a56, 0x11a59, 0x11a5a, 0x11a5b, 0x11a8a, 0x11a8b, 0x11a8c, 0x11a8d, 0x11a8e, 0x11a8f, 0x11a90, 0x11a91, 0x11a92, 0x11a93, 0x11a94, 0x11a95, 0x11a96, 0x11a98, 0x11a99, 0x11c30, 0x11c31, 0x11c32, 0x11c33, 0x11c34, 0x11c35, 0x11c36, 0x11c38, 0x11c39, 0x11c3a, 0x11c3b, 0x11c3c, 0x11c3d, 0x11c3f, 0x11c92, 0x11c93, 0x11c94, 0x11c95, 0x11c96, 0x11c97, 0x11c98, 0x11c99, 0x11c9a, 0x11c9b, 0x11c9c, 0x11c9d, 0x11c9e, 0x11c9f, 0x11ca0, 0x11ca1, 0x11ca2, 0x11ca3, 0x11ca4, 0x11ca5, 0x11ca6, 0x11ca7, 0x11caa, 0x11cab, 0x11cac, 0x11cad, 0x11cae, 0x11caf, 0x11cb0, 0x11cb2, 0x11cb3, 0x11cb5, 0x11cb6, 0x11d31, 0x11d32, 0x11d33, 0x11d34, 0x11d35, 0x11d36, 0x11d3a, 0x11d3c, 0x11d3d, 0x11d3f, 0x11d40, 0x11d41, 0x11d42, 0x11d43, 0x11d44, 0x11d45, 0x11d47, 0x11d90, 0x11d91, 0x11d95, 0x11d97, 0x11ef3, 0x11ef4, 0x16af0, 0x16af1, 0x16af2, 0x16af3, 0x16af4, 0x16b30, 0x16b31, 0x16b32, 0x16b33, 0x16b34, 0x16b35, 0x16b36, 0x16f4f, 0x16f8f, 0x16f90, 0x16f91, 0x16f92, 0x16fe4, 0x1bc9d, 0x1bc9e, 0x1d165, 0x1d167, 0x1d168, 0x1d169, 0x1d16e, 0x1d16f, 0x1d170, 0x1d171, 0x1d172, 0x1d17b, 0x1d17c, 0x1d17d, 0x1d17e, 0x1d17f, 0x1d180, 0x1d181, 0x1d182, 0x1d185, 0x1d186, 0x1d187, 0x1d188, 0x1d189, 0x1d18a, 0x1d18b, 0x1d1aa, 0x1d1ab, 0x1d1ac, 0x1d1ad, 0x1d242, 0x1d243, 0x1d244, 0x1da00, 0x1da01, 0x1da02, 0x1da03, 0x1da04, 0x1da05, 0x1da06, 0x1da07, 0x1da08, 0x1da09, 0x1da0a, 0x1da0b, 0x1da0c, 0x1da0d, 0x1da0e, 0x1da0f, 0x1da10, 0x1da11, 0x1da12, 0x1da13, 0x1da14, 0x1da15, 0x1da16, 0x1da17, 0x1da18, 0x1da19, 0x1da1a, 0x1da1b, 0x1da1c, 0x1da1d, 0x1da1e, 0x1da1f, 0x1da20, 0x1da21, 0x1da22, 0x1da23, 0x1da24, 0x1da25, 0x1da26, 0x1da27, 0x1da28, 0x1da29, 0x1da2a, 0x1da2b, 0x1da2c, 0x1da2d, 0x1da2e, 0x1da2f, 0x1da30, 0x1da31, 0x1da32, 0x1da33, 0x1da34, 0x1da35, 0x1da36, 0x1da3b, 0x1da3c, 0x1da3d, 0x1da3e, 0x1da3f, 0x1da40, 0x1da41, 0x1da42, 0x1da43, 0x1da44, 0x1da45, 0x1da46, 0x1da47, 0x1da48, 0x1da49, 0x1da4a, 0x1da4b, 0x1da4c, 0x1da4d, 0x1da4e, 0x1da4f, 0x1da50, 0x1da51, 0x1da52, 0x1da53, 0x1da54, 0x1da55, 0x1da56, 0x1da57, 0x1da58, 0x1da59, 0x1da5a, 0x1da5b, 0x1da5c, 0x1da5d, 0x1da5e, 0x1da5f, 0x1da60, 0x1da61, 0x1da62, 0x1da63, 0x1da64, 0x1da65, 0x1da66, 0x1da67, 0x1da68, 0x1da69, 0x1da6a, 0x1da6b, 0x1da6c, 0x1da75, 0x1da84, 0x1da9b, 0x1da9c, 0x1da9d, 0x1da9e, 0x1da9f, 0x1daa1, 0x1daa2, 0x1daa3, 0x1daa4, 0x1daa5, 0x1daa6, 0x1daa7, 0x1daa8, 0x1daa9, 0x1daaa, 0x1daab, 0x1daac, 0x1daad, 0x1daae, 0x1daaf, 0x1e000, 0x1e001, 0x1e002, 0x1e003, 0x1e004, 0x1e005, 0x1e006, 0x1e008, 0x1e009, 0x1e00a, 0x1e00b, 0x1e00c, 0x1e00d, 0x1e00e, 0x1e00f, 0x1e010, 0x1e011, 0x1e012, 0x1e013, 0x1e014, 0x1e015, 0x1e016, 0x1e017, 0x1e018, 0x1e01b, 0x1e01c, 0x1e01d, 0x1e01e, 0x1e01f, 0x1e020, 0x1e021, 0x1e023, 0x1e024, 0x1e026, 0x1e027, 0x1e028, 0x1e029, 0x1e02a, 0x1e130, 0x1e131, 0x1e132, 0x1e133, 0x1e134, 0x1e135, 0x1e136, 0x1e2ec, 0x1e2ed, 0x1e2ee, 0x1e2ef, 0x1e8d0, 0x1e8d1, 0x1e8d2, 0x1e8d3, 0x1e8d4, 0x1e8d5, 0x1e8d6, 0x1e944, 0x1e945, 0x1e946, 0x1e947, 0x1e948, 0x1e949, 0x1e94a, 0x1f3fb, 0x1f3fc, 0x1f3fd, 0x1f3fe, 0x1f3ff, 0xe0020, 0xe0021, 0xe0022, 0xe0023, 0xe0024, 0xe0025, 0xe0026, 0xe0027, 0xe0028, 0xe0029, 0xe002a, 0xe002b, 0xe002c, 0xe002d, 0xe002e, 0xe002f, 0xe0030, 0xe0031, 0xe0032, 0xe0033, 0xe0034, 0xe0035, 0xe0036, 0xe0037, 0xe0038, 0xe0039, 0xe003a, 0xe003b, 0xe003c, 0xe003d, 0xe003e, 0xe003f, 0xe0040, 0xe0041, 0xe0042, 0xe0043, 0xe0044, 0xe0045, 0xe0046, 0xe0047, 0xe0048, 0xe0049, 0xe004a, 0xe004b, 0xe004c, 0xe004d, 0xe004e, 0xe004f, 0xe0050, 0xe0051, 0xe0052, 0xe0053, 0xe0054, 0xe0055, 0xe0056, 0xe0057, 0xe0058, 0xe0059, 0xe005a, 0xe005b, 0xe005c, 0xe005d, 0xe005e, 0xe005f, 0xe0060, 0xe0061, 0xe0062, 0xe0063, 0xe0064, 0xe0065, 0xe0066, 0xe0067, 0xe0068, 0xe0069, 0xe006a, 0xe006b, 0xe006c, 0xe006d, 0xe006e, 0xe006f, 0xe0070, 0xe0071, 0xe0072, 0xe0073, 0xe0074, 0xe0075, 0xe0076, 0xe0077, 0xe0078, 0xe0079, 0xe007a, 0xe007b, 0xe007c, 0xe007d, 0xe007e, 0xe007f]))),
  isRegionalIndicator: between(0x1f1e6, 0x1f1ff),
  isSpacingMark: or(between(0x16f51, 0x16f87), inSet(new Set([0x903, 0x93b, 0x93e, 0x93f, 0x940, 0x949, 0x94a, 0x94b, 0x94c, 0x94e, 0x94f, 0x982, 0x983, 0x9bf, 0x9c0, 0x9c7, 0x9c8, 0x9cb, 0x9cc, 0xa03, 0xa3e, 0xa3f, 0xa40, 0xa83, 0xabe, 0xabf, 0xac0, 0xac9, 0xacb, 0xacc, 0xb02, 0xb03, 0xb40, 0xb47, 0xb48, 0xb4b, 0xb4c, 0xbbf, 0xbc1, 0xbc2, 0xbc6, 0xbc7, 0xbc8, 0xbca, 0xbcb, 0xbcc, 0xc01, 0xc02, 0xc03, 0xc41, 0xc42, 0xc43, 0xc44, 0xc82, 0xc83, 0xcbe, 0xcc0, 0xcc1, 0xcc3, 0xcc4, 0xcc7, 0xcc8, 0xcca, 0xccb, 0xd02, 0xd03, 0xd3f, 0xd40, 0xd46, 0xd47, 0xd48, 0xd4a, 0xd4b, 0xd4c, 0xd82, 0xd83, 0xdd0, 0xdd1, 0xdd8, 0xdd9, 0xdda, 0xddb, 0xddc, 0xddd, 0xdde, 0xdf2, 0xdf3, 0xe33, 0xeb3, 0xf3e, 0xf3f, 0xf7f, 0x1031, 0x103b, 0x103c, 0x1056, 0x1057, 0x1084, 0x17b6, 0x17be, 0x17bf, 0x17c0, 0x17c1, 0x17c2, 0x17c3, 0x17c4, 0x17c5, 0x17c7, 0x17c8, 0x1923, 0x1924, 0x1925, 0x1926, 0x1929, 0x192a, 0x192b, 0x1930, 0x1931, 0x1933, 0x1934, 0x1935, 0x1936, 0x1937, 0x1938, 0x1a19, 0x1a1a, 0x1a55, 0x1a57, 0x1a6d, 0x1a6e, 0x1a6f, 0x1a70, 0x1a71, 0x1a72, 0x1b04, 0x1b3b, 0x1b3d, 0x1b3e, 0x1b3f, 0x1b40, 0x1b41, 0x1b43, 0x1b44, 0x1b82, 0x1ba1, 0x1ba6, 0x1ba7, 0x1baa, 0x1be7, 0x1bea, 0x1beb, 0x1bec, 0x1bee, 0x1bf2, 0x1bf3, 0x1c24, 0x1c25, 0x1c26, 0x1c27, 0x1c28, 0x1c29, 0x1c2a, 0x1c2b, 0x1c34, 0x1c35, 0x1ce1, 0x1cf7, 0xa823, 0xa824, 0xa827, 0xa880, 0xa881, 0xa8b4, 0xa8b5, 0xa8b6, 0xa8b7, 0xa8b8, 0xa8b9, 0xa8ba, 0xa8bb, 0xa8bc, 0xa8bd, 0xa8be, 0xa8bf, 0xa8c0, 0xa8c1, 0xa8c2, 0xa8c3, 0xa952, 0xa953, 0xa983, 0xa9b4, 0xa9b5, 0xa9ba, 0xa9bb, 0xa9be, 0xa9bf, 0xa9c0, 0xaa2f, 0xaa30, 0xaa33, 0xaa34, 0xaa4d, 0xaaeb, 0xaaee, 0xaaef, 0xaaf5, 0xabe3, 0xabe4, 0xabe6, 0xabe7, 0xabe9, 0xabea, 0xabec, 0x11000, 0x11002, 0x11082, 0x110b0, 0x110b1, 0x110b2, 0x110b7, 0x110b8, 0x1112c, 0x11145, 0x11146, 0x11182, 0x111b3, 0x111b4, 0x111b5, 0x111bf, 0x111c0, 0x111ce, 0x1122c, 0x1122d, 0x1122e, 0x11232, 0x11233, 0x11235, 0x112e0, 0x112e1, 0x112e2, 0x11302, 0x11303, 0x1133f, 0x11341, 0x11342, 0x11343, 0x11344, 0x11347, 0x11348, 0x1134b, 0x1134c, 0x1134d, 0x11362, 0x11363, 0x11435, 0x11436, 0x11437, 0x11440, 0x11441, 0x11445, 0x114b1, 0x114b2, 0x114b9, 0x114bb, 0x114bc, 0x114be, 0x114c1, 0x115b0, 0x115b1, 0x115b8, 0x115b9, 0x115ba, 0x115bb, 0x115be, 0x11630, 0x11631, 0x11632, 0x1163b, 0x1163c, 0x1163e, 0x116ac, 0x116ae, 0x116af, 0x116b6, 0x11720, 0x11721, 0x11726, 0x1182c, 0x1182d, 0x1182e, 0x11838, 0x11931, 0x11932, 0x11933, 0x11934, 0x11935, 0x11937, 0x11938, 0x1193d, 0x11940, 0x11942, 0x119d1, 0x119d2, 0x119d3, 0x119dc, 0x119dd, 0x119de, 0x119df, 0x119e4, 0x11a39, 0x11a57, 0x11a58, 0x11a97, 0x11c2f, 0x11c3e, 0x11ca9, 0x11cb1, 0x11cb4, 0x11d8a, 0x11d8b, 0x11d8c, 0x11d8d, 0x11d8e, 0x11d93, 0x11d94, 0x11d96, 0x11ef5, 0x11ef6, 0x16ff0, 0x16ff1, 0x1d166, 0x1d16d]))),
  isL: or(between(0x1100, 0x115f), between(0xa960, 0xa97c)),
  isV: or(between(0x1160, 0x11a7), between(0xd7b0, 0xd7c6)),
  isT: or(between(0x11a8, 0x11ff), between(0xd7cb, 0xd7fb)),
  // shorter (and faster?) than the whole table (399 entries)
  isLV: and(between(0xac00, 0xd7a3), chain(offset(0xac00), divisibleBy(28))),
  // shorter (and faster?) than the whole table (10773 entries)
  isLVT: and(between(0xac00, 0xd7a3), not(chain(offset(0xac00), divisibleBy(28)))),
  isZWJ: equalTo(0x200d),
  // from emoji-data.txt, needed for rule http://unicode.org/reports/tr29/#GB11
  isExtendedPictographic: or(between(0x2614, 0x2685), between(0x2690, 0x2705), between(0x1f000, 0x1f0cf), between(0x1f300, 0x1f3fa), between(0x1f400, 0x1f53d), between(0x1f546, 0x1f64f), inSet(new Set([0xa9, 0xae, 0x203c, 0x2049, 0x2122, 0x2139, 0x2194, 0x2195, 0x2196, 0x2197, 0x2198, 0x2199, 0x21a9, 0x21aa, 0x231a, 0x231b, 0x2328, 0x2388, 0x23cf, 0x23e9, 0x23ea, 0x23eb, 0x23ec, 0x23ed, 0x23ee, 0x23ef, 0x23f0, 0x23f1, 0x23f2, 0x23f3, 0x23f8, 0x23f9, 0x23fa, 0x24c2, 0x25aa, 0x25ab, 0x25b6, 0x25c0, 0x25fb, 0x25fc, 0x25fd, 0x25fe, 0x2600, 0x2601, 0x2602, 0x2603, 0x2604, 0x2605, 0x2607, 0x2608, 0x2609, 0x260a, 0x260b, 0x260c, 0x260d, 0x260e, 0x260f, 0x2610, 0x2611, 0x2612, 0x2708, 0x2709, 0x270a, 0x270b, 0x270c, 0x270d, 0x270e, 0x270f, 0x2710, 0x2711, 0x2712, 0x2714, 0x2716, 0x271d, 0x2721, 0x2728, 0x2733, 0x2734, 0x2744, 0x2747, 0x274c, 0x274e, 0x2753, 0x2754, 0x2755, 0x2757, 0x2763, 0x2764, 0x2765, 0x2766, 0x2767, 0x2795, 0x2796, 0x2797, 0x27a1, 0x27b0, 0x27bf, 0x2934, 0x2935, 0x2b05, 0x2b06, 0x2b07, 0x2b1b, 0x2b1c, 0x2b50, 0x2b55, 0x3030, 0x303d, 0x3297, 0x3299, 0x1f10d, 0x1f10e, 0x1f10f, 0x1f12f, 0x1f16c, 0x1f16d, 0x1f16e, 0x1f16f, 0x1f170, 0x1f171, 0x1f17e, 0x1f17f, 0x1f18e, 0x1f191, 0x1f192, 0x1f193, 0x1f194, 0x1f195, 0x1f196, 0x1f197, 0x1f198, 0x1f199, 0x1f19a, 0x1f201, 0x1f202, 0x1f21a, 0x1f22f, 0x1f232, 0x1f233, 0x1f234, 0x1f235, 0x1f236, 0x1f237, 0x1f238, 0x1f239, 0x1f23a, 0x1f250, 0x1f251, 0x1f680, 0x1f681, 0x1f682, 0x1f683, 0x1f684, 0x1f685, 0x1f686, 0x1f687, 0x1f688, 0x1f689, 0x1f68a, 0x1f68b, 0x1f68c, 0x1f68d, 0x1f68e, 0x1f68f, 0x1f690, 0x1f691, 0x1f692, 0x1f693, 0x1f694, 0x1f695, 0x1f696, 0x1f697, 0x1f698, 0x1f699, 0x1f69a, 0x1f69b, 0x1f69c, 0x1f69d, 0x1f69e, 0x1f69f, 0x1f6a0, 0x1f6a1, 0x1f6a2, 0x1f6a3, 0x1f6a4, 0x1f6a5, 0x1f6a6, 0x1f6a7, 0x1f6a8, 0x1f6a9, 0x1f6aa, 0x1f6ab, 0x1f6ac, 0x1f6ad, 0x1f6ae, 0x1f6af, 0x1f6b0, 0x1f6b1, 0x1f6b2, 0x1f6b3, 0x1f6b4, 0x1f6b5, 0x1f6b6, 0x1f6b7, 0x1f6b8, 0x1f6b9, 0x1f6ba, 0x1f6bb, 0x1f6bc, 0x1f6bd, 0x1f6be, 0x1f6bf, 0x1f6c0, 0x1f6c1, 0x1f6c2, 0x1f6c3, 0x1f6c4, 0x1f6c5, 0x1f6c6, 0x1f6c7, 0x1f6c8, 0x1f6c9, 0x1f6ca, 0x1f6cb, 0x1f6cc, 0x1f6cd, 0x1f6ce, 0x1f6cf, 0x1f6d0, 0x1f6d1, 0x1f6d2, 0x1f6d3, 0x1f6d4, 0x1f6d5, 0x1f6d6, 0x1f6d7, 0x1f6e0, 0x1f6e1, 0x1f6e2, 0x1f6e3, 0x1f6e4, 0x1f6e5, 0x1f6e6, 0x1f6e7, 0x1f6e8, 0x1f6e9, 0x1f6ea, 0x1f6eb, 0x1f6ec, 0x1f6f0, 0x1f6f1, 0x1f6f2, 0x1f6f3, 0x1f6f4, 0x1f6f5, 0x1f6f6, 0x1f6f7, 0x1f6f8, 0x1f6f9, 0x1f6fa, 0x1f6fb, 0x1f6fc, 0x1f7e0, 0x1f7e1, 0x1f7e2, 0x1f7e3, 0x1f7e4, 0x1f7e5, 0x1f7e6, 0x1f7e7, 0x1f7e8, 0x1f7e9, 0x1f7ea, 0x1f7eb, 0x1f90c, 0x1f90d, 0x1f90e, 0x1f90f, 0x1f910, 0x1f911, 0x1f912, 0x1f913, 0x1f914, 0x1f915, 0x1f916, 0x1f917, 0x1f918, 0x1f919, 0x1f91a, 0x1f91b, 0x1f91c, 0x1f91d, 0x1f91e, 0x1f91f, 0x1f920, 0x1f921, 0x1f922, 0x1f923, 0x1f924, 0x1f925, 0x1f926, 0x1f927, 0x1f928, 0x1f929, 0x1f92a, 0x1f92b, 0x1f92c, 0x1f92d, 0x1f92e, 0x1f92f, 0x1f930, 0x1f931, 0x1f932, 0x1f933, 0x1f934, 0x1f935, 0x1f936, 0x1f937, 0x1f938, 0x1f939, 0x1f93a, 0x1f93c, 0x1f93d, 0x1f93e, 0x1f93f, 0x1f940, 0x1f941, 0x1f942, 0x1f943, 0x1f944, 0x1f945, 0x1f947, 0x1f948, 0x1f949, 0x1f94a, 0x1f94b, 0x1f94c, 0x1f94d, 0x1f94e, 0x1f94f, 0x1f950, 0x1f951, 0x1f952, 0x1f953, 0x1f954, 0x1f955, 0x1f956, 0x1f957, 0x1f958, 0x1f959, 0x1f95a, 0x1f95b, 0x1f95c, 0x1f95d, 0x1f95e, 0x1f95f, 0x1f960, 0x1f961, 0x1f962, 0x1f963, 0x1f964, 0x1f965, 0x1f966, 0x1f967, 0x1f968, 0x1f969, 0x1f96a, 0x1f96b, 0x1f96c, 0x1f96d, 0x1f96e, 0x1f96f, 0x1f970, 0x1f971, 0x1f972, 0x1f973, 0x1f974, 0x1f975, 0x1f976, 0x1f977, 0x1f978, 0x1f97a, 0x1f97b, 0x1f97c, 0x1f97d, 0x1f97e, 0x1f97f, 0x1f980, 0x1f981, 0x1f982, 0x1f983, 0x1f984, 0x1f985, 0x1f986, 0x1f987, 0x1f988, 0x1f989, 0x1f98a, 0x1f98b, 0x1f98c, 0x1f98d, 0x1f98e, 0x1f98f, 0x1f990, 0x1f991, 0x1f992, 0x1f993, 0x1f994, 0x1f995, 0x1f996, 0x1f997, 0x1f998, 0x1f999, 0x1f99a, 0x1f99b, 0x1f99c, 0x1f99d, 0x1f99e, 0x1f99f, 0x1f9a0, 0x1f9a1, 0x1f9a2, 0x1f9a3, 0x1f9a4, 0x1f9a5, 0x1f9a6, 0x1f9a7, 0x1f9a8, 0x1f9a9, 0x1f9aa, 0x1f9ab, 0x1f9ac, 0x1f9ad, 0x1f9ae, 0x1f9af, 0x1f9b0, 0x1f9b1, 0x1f9b2, 0x1f9b3, 0x1f9b4, 0x1f9b5, 0x1f9b6, 0x1f9b7, 0x1f9b8, 0x1f9b9, 0x1f9ba, 0x1f9bb, 0x1f9bc, 0x1f9bd, 0x1f9be, 0x1f9bf, 0x1f9c0, 0x1f9c1, 0x1f9c2, 0x1f9c3, 0x1f9c4, 0x1f9c5, 0x1f9c6, 0x1f9c7, 0x1f9c8, 0x1f9c9, 0x1f9ca, 0x1f9cb, 0x1f9cd, 0x1f9ce, 0x1f9cf, 0x1f9d0, 0x1f9d1, 0x1f9d2, 0x1f9d3, 0x1f9d4, 0x1f9d5, 0x1f9d6, 0x1f9d7, 0x1f9d8, 0x1f9d9, 0x1f9da, 0x1f9db, 0x1f9dc, 0x1f9dd, 0x1f9de, 0x1f9df, 0x1f9e0, 0x1f9e1, 0x1f9e2, 0x1f9e3, 0x1f9e4, 0x1f9e5, 0x1f9e6, 0x1f9e7, 0x1f9e8, 0x1f9e9, 0x1f9ea, 0x1f9eb, 0x1f9ec, 0x1f9ed, 0x1f9ee, 0x1f9ef, 0x1f9f0, 0x1f9f1, 0x1f9f2, 0x1f9f3, 0x1f9f4, 0x1f9f5, 0x1f9f6, 0x1f9f7, 0x1f9f8, 0x1f9f9, 0x1f9fa, 0x1f9fb, 0x1f9fc, 0x1f9fd, 0x1f9fe, 0x1f9ff, 0x1fa70, 0x1fa71, 0x1fa72, 0x1fa73, 0x1fa74, 0x1fa78, 0x1fa79, 0x1fa7a, 0x1fa80, 0x1fa81, 0x1fa82, 0x1fa83, 0x1fa84, 0x1fa85, 0x1fa86, 0x1fa90, 0x1fa91, 0x1fa92, 0x1fa93, 0x1fa94, 0x1fa95, 0x1fa96, 0x1fa97, 0x1fa98, 0x1fa99, 0x1fa9a, 0x1fa9b, 0x1fa9c, 0x1fa9d, 0x1fa9e, 0x1fa9f, 0x1faa0, 0x1faa1, 0x1faa2, 0x1faa3, 0x1faa4, 0x1faa5, 0x1faa6, 0x1faa7, 0x1faa8, 0x1fab0, 0x1fab1, 0x1fab2, 0x1fab3, 0x1fab4, 0x1fab5, 0x1fab6, 0x1fac0, 0x1fac1, 0x1fac2, 0x1fad0, 0x1fad1, 0x1fad2, 0x1fad3, 0x1fad4, 0x1fad5, 0x1fad6]))),
}
