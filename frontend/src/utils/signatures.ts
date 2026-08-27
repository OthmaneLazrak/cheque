import './signature.css'

// Tracés de référence (les spécimens)
const SPECIMENS = [
  'M18,78 C26,30 40,18 48,44 C56,70 44,86 40,64 C36,42 58,22 74,52 C84,71 96,66 104,44 C114,16 134,24 130,58 M96,60 L268,48 M170,74 C182,32 200,26 210,52 C219,76 204,84 202,62 C200,40 224,30 240,56 C250,74 262,64 274,38',
  'M24,72 C30,26 52,20 58,50 C63,74 48,80 46,58 C44,34 72,26 88,54 C98,72 112,68 118,46 M60,56 L246,44 M150,70 C158,30 176,24 188,48 C198,68 186,80 180,62 C173,40 200,28 218,50 C232,67 246,58 258,34',
  'M20,74 C34,28 46,22 54,50 C60,72 48,82 44,62 C40,40 66,28 82,56 C92,74 108,66 116,42 M70,58 L254,50 M158,76 C170,36 188,30 198,56 C207,78 192,84 190,64 C188,44 214,34 230,60 C240,78 254,68 266,44',
];

// Variantes proches du spécimen (signature authentique)
const CONFORMES = [
  'M21,76 C29,33 42,21 49,46 C57,71 45,84 41,62 C37,41 60,25 75,54 C86,72 97,64 105,43 C116,19 135,27 131,60 M98,62 L270,46 M172,72 C184,35 201,29 211,54 C220,77 205,83 203,61 C201,40 226,33 241,58 C251,75 263,62 276,37',
  'M26,74 C33,30 54,23 60,52 C64,73 50,79 47,60 C45,38 74,30 90,56 C100,72 113,69 119,49 M62,58 L244,47 M152,72 C160,34 178,27 190,50 C199,69 187,79 181,63 C175,43 202,32 220,52 C233,68 247,60 259,38',
  'M22,72 C36,30 47,24 55,52 C61,73 49,80 45,60 C41,42 67,30 83,57 C93,72 109,64 117,44 M72,60 L252,52 M160,74 C172,38 189,32 199,57 C208,76 193,82 191,63 C189,46 215,36 231,61 C241,76 255,66 267,46',
];

// Tracés visiblement différents (signature suspecte)
const DIVERGENTS = [
  'M22,80 C34,46 44,36 52,58 C58,74 50,80 46,66 C42,51 62,39 78,60 C88,73 98,70 108,53 C120,32 138,39 134,66 M100,66 L262,58 M168,78 C178,51 196,45 206,64 C214,79 202,82 200,68 C198,53 220,47 236,66',
  'M28,78 C40,52 50,44 58,62 C64,76 54,80 50,68 C46,56 64,46 80,64 C90,74 102,72 110,60 C122,42 140,48 136,70 M98,70 L256,64 M162,80 C174,58 190,52 200,68 C208,80 196,82 194,72 C192,60 214,54 230,70',
];

// Transforme un texte en nombre stable
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function traceSpecimen(numeroCompte: string): string {
  return SPECIMENS[hash(numeroCompte) % SPECIMENS.length];
}

export function traceCheque(numeroCompte: string, id: number): string {
  const h = hash(`${numeroCompte}-${id}`);
  // Une valeur sur cinq porte une signature divergente
  if (h % 5 === 0) return DIVERGENTS[h % DIVERGENTS.length];
  return CONFORMES[hash(numeroCompte) % CONFORMES.length];
}