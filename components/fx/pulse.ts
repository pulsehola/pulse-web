// Genera un trazo de electrocardiograma con las mismas proporciones que el isotipo PULSE.
// Isotipo (44 × 24): 0,12 · 12,12 · 16,3 · 21,21 · 26,8 · 29,12 · 44,12
const BEAT: [number, number][] = [
  [0, 0],
  [12 / 44, 0],
  [16 / 44, -9 / 12],
  [21 / 44, 9 / 12],
  [26 / 44, -4 / 12],
  [29 / 44, 0],
  [1, 0],
];

/** Devuelve el atributo `d` de un path con `beats` pulsos a lo ancho de `width`. */
export function pulsePath(width: number, y: number, amp: number, beats: number, flatStart = 0) {
  const w = (width - flatStart) / beats;
  let d = `M0 ${y} L${flatStart} ${y}`;
  for (let b = 0; b < beats; b++) {
    const x0 = flatStart + b * w;
    for (const [px, py] of BEAT.slice(1)) d += ` L${(x0 + px * w).toFixed(1)} ${(y + py * amp).toFixed(1)}`;
  }
  return d;
}
