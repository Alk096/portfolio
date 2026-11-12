import { CircleCheck, Send } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { useRef, useState, type FormEvent } from 'react'
import { ContactField } from '../components/ContactField'
import { contact } from '../content/contact'
import { identity } from '../content/site'
import { sectionEntrance } from '../motion'

type Values = { name: string; email: string; message: string }
type Errors = Record<keyof Values, string | null>

function validate(values: Values): Errors {
  return {
    name: values.name.trim() ? null : contact.fields.name.error,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? null : contact.fields.email.error,
    message: values.message.trim() ? null : contact.fields.message.error,
  }
}

export function Contact() {
  const root = useRef<HTMLElement>(null)

  // Le titre monte, puis les champs s'ouvrent l'un après l'autre, dans l'ordre où on les remplit.
  useGSAP(
    () =>
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.9 })
          .from('[data-entrance="form"]', { autoAlpha: 0, duration: 0.5 }, '-=0.5')
          .from('[data-entrance="field"]', { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.09 }, '-=0.3'),
      ),
    { scope: root },
  )

  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({ name: null, email: null, message: null })
  const [sent, setSent] = useState(false)

  const updateField = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
    setSent(false)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validate(values)
    setErrors(next)
    const firstInvalid = (Object.keys(next) as (keyof Values)[]).find((key) => next[key])
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus()
      return
    }
    // Pas de serveur : on ouvre l'application mail du visiteur avec le message prérempli.
    const subject = contact.subject.replace('{name}', values.name.trim())
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section ref={root} id="contact" className="bg-bg-000 py-16 md:py-24">
      <div className="page-container grid gap-y-8 md:grid-cols-12 md:gap-x-6">
        <div className="overflow-hidden pb-[0.1em] md:col-span-6">
          <h2 data-entrance="title" className="max-w-[20ch] text-h1 text-balance">
            {contact.title}
          </h2>
        </div>

        <form
          data-entrance="form"
          noValidate
          onSubmit={onSubmit}
          className="space-y-3 rounded-xl border border-line bg-bg-200 p-5 md:col-span-6 md:p-6"
        >
          <ContactField
            id="name"
            {...contact.fields.name}
            value={values.name}
            onChange={updateField('name')}
            error={errors.name}
            autoComplete="name"
          />
          <ContactField
            id="email"
            type="email"
            {...contact.fields.email}
            value={values.email}
            onChange={updateField('email')}
            error={errors.email}
            autoComplete="email"
          />
          <ContactField
            id="message"
            multiline
            {...contact.fields.message}
            value={values.message}
            onChange={updateField('message')}
            error={errors.message}
          />
          <div data-entrance="field" className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-amber px-5 text-body-sm font-medium whitespace-nowrap text-on-amber transition-[box-shadow,scale] duration-300 ease-out-soft hover:shadow-glow-amber focus-visible:shadow-glow-amber active:scale-[0.98]"
            >
              {contact.submit}
              <Send size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <p role="status" className="flex items-center gap-2 text-body-sm text-mint-text">
              {sent && (
                <>
                  <CircleCheck size={18} strokeWidth={1.75} aria-hidden="true" />
                  {contact.success}
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
