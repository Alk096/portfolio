import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'neon' | 'ghost'

const base =
  'inline-flex h-12 items-center justify-center gap-2 rounded-pill px-5 text-body-sm font-medium whitespace-nowrap ' +
  'transition-[box-shadow,background-color,border-color,color,transform] duration-300 ease-out-soft ' +
  'active:scale-[0.98] motion-reduce:transition-none'

const variants: Record<Variant, string> = {
  primary: 'bg-amber text-on-amber hover:shadow-glow-amber focus-visible:shadow-glow-amber',
  neon:
    'border border-violet-text text-violet-text hover:shadow-glow-violet focus-visible:shadow-glow-violet',
  ghost: 'border border-line-strong text-ink hover:bg-bg-300',
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
