import { CircleAlert } from 'lucide-react'

type Props = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error: string | null
  type?: 'text' | 'email'
  multiline?: boolean
  autoComplete?: string
}

const control =
  'w-full rounded-md border bg-bg-100 px-4 text-body text-ink placeholder:text-ink-faint ' +
  'transition-[box-shadow,border-color] duration-300 outline-none focus-visible:outline-none ' +
  'focus:border-amber-text focus:shadow-glow-amber'

export function ContactField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  multiline,
  autoComplete,
}: Props) {
  const errorId = `${id}-erreur`
  const shared = {
    id,
    name: id,
    value,
    placeholder,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `${control} ${error ? 'border-rose-text' : 'border-line-strong'} ${multiline ? 'min-h-28 resize-y py-3' : 'h-11'}`,
  }

  return (
    <div data-entrance="field">
      <label htmlFor={id} className="mb-1.5 block text-label text-ink-muted">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-2 text-body-sm text-rose-text">
          <CircleAlert size={18} strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
