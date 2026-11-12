/**
 * Lueur diffuse au repos : une derrière l'avatar, une derrière le bureau, nulle part ailleurs.
 * Un dégradé radial plutôt qu'un `filter: blur`, trop coûteux sur un GPU intégré.
 */
export function GlowOrb({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ background: 'radial-gradient(closest-side, var(--halo-violet), transparent)' }}
    />
  )
}
