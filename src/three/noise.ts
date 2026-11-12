/** Bruit 1D lissé, déterministe, dans [-1, 1]. Sert à tout ce qui doit bouger sans jamais boucler à l'œil. */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function noise1(x: number, seed = 0) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  const a = hash(i + seed * 57.3)
  const b = hash(i + 1 + seed * 57.3)
  return (a + (b - a) * u) * 2 - 1
}

/** Deux octaves : un mouvement lent, plus un détail qui casse la régularité. */
export function fbm(x: number, seed = 0) {
  return noise1(x, seed) * 0.65 + noise1(x * 2.17, seed + 11) * 0.35
}

export function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Amortissement exponentiel indépendant du framerate. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
