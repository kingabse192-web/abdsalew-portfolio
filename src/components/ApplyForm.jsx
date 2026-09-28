import { cloneElement, useId, useRef, useState } from 'react'
import { formSteps, relationshipOptions } from '../data/content.js'
import { Icon } from './Chrome.jsx'

const initial = {
  firstName: '',
  lastName: '',
  birthDate: '',
  currentSchool: '',
  grade: '',
  entryTerm: 'Fall 2027',
  relationship: relationshipOptions[0],
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  aidInterest: true,
  workInterest: false,
  notes: '',
  file: null,
  consent: false,
}

const grades = [
  { value: 'prek', label: 'Pre-K', note: 'Turning 3 or 4 by Sept 1' },
  { value: 'k', label: 'Kindergarten', note: 'Turning 5 by Sept 1' },
  { value: '1-5', label: 'Grades 1–5', note: 'Any grade in this range' },
  { value: '6-8', label: 'Grades 6–8', note: 'Middle school entry' },
  { value: '9-12', label: 'Grades 9–12', note: 'Upper school transfer' },
]

function validate(step, data) {
  const e = {}
  if (step === 0) {
    if (!data.firstName.trim()) e.firstName = 'Enter your child’s first name'
    if (!data.lastName.trim()) e.lastName = 'Enter your child’s last name'
    if (!data.birthDate) e.birthDate = 'Date of birth is required for placement'
    if (!data.grade) e.grade = 'Choose the grade your child is applying for'
    if (data.currentSchool.trim().length < 2) e.currentSchool = 'Enter the name of their school'
  }
  if (step === 1) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = 'Enter a valid email address'
    if (data.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number'
    if (data.address.trim().length < 4) e.address = 'Enter your street address'
    if (!data.city.trim()) e.city = 'Enter your city'
    if (data.zip.trim().length < 5) e.zip = 'Enter a 5-digit ZIP code'
  }
  if (step === 2) {
    if (!data.file) e.file = 'Attach at least one document to continue'
  }
  if (step === 3) {
    if (!data.consent) e.consent = 'You must confirm before submitting'
  }
  return e
}

export default function ApplyForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [over, setOver] = useState(false)
  const [ref, setRef] = useState(null)
  const headingRef = useRef(null)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setData((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const goStep = (next) => {
    setStep(next)
    setErrors({})
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const next = (e) => {
    e.preventDefault()
    const found = validate(step, data)
    if (Object.keys(found).length) {
      setErrors(found)
      const first = document.querySelector('[aria-invalid="true"]')
      first?.focus()
      return
    }
    if (step < formSteps.length - 1) {
      goStep(step + 1)
      return
    }
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setRef(`NFA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${new Date().getFullYear()}`)
    }, 1400)
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <section className="section section--brand on-dark apply" id="apply">
      <div className="shell">
        <div className="apply__grid">
          <div>
            <p className="eyebrow">Apply online</p>
            <h2 style={{ fontSize: 'var(--fs-h2)', margin: 'var(--s-4) 0 var(--s-3)' }}>
              Start your application
            </h2>
            <p style={{ color: 'var(--on-brand-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
              This is the real form. Nothing is transmitted anywhere in this demo build — validation,
              error states, and the review step all work.
            </p>

            <div className="progress" style={{ marginTop: 'var(--s-6)' }}>
              {formSteps.map((s, i) => {
                const state = status === 'sent' || i < step ? 'done' : i === step ? 'current' : 'todo'
                return (
                  <button
                    key={s.id}
                    className="progress__item"
                    data-state={state}
                    disabled={i > step || status === 'sent'}
                    onClick={() => i < step && status !== 'sent' && goStep(i)}
                  >
                    <span className="progress__dot">
                      {state === 'done' ? <Icon name="check" size={12} /> : i + 1}
                    </span>
                    <span className="progress__label">{s.label}</span>
                  </button>
                )
              })}
              <div className="progress__bar" role="presentation">
                <div
                  className="progress__barFill"
                  style={{ width: status === 'sent' ? '100%' : `${(step / (formSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="progress__meta">
                <span>
                  Step {Math.min(step + 1, formSteps.length)} of {formSteps.length}
                </span>
                <span>{status === 'sent' ? 'Submitted' : 'Saves automatically'}</span>
              </div>
            </div>
          </div>

          <div className="form">
            {status === 'sent' ? (
              <div className="done">
                <span className="done__badge">
                  <Icon name="check" size={26} />
                </span>
                <h3>Application received</h3>
                <p>
                  Thank you. A counselor will email you within two business days to schedule the
                  family interview, and your file is already open in the portal.
                </p>
                <p className="done__ref">
                  Reference <b>{ref}</b>
                </p>
                <ul className="done__next">
                  <li>
                    <span>1</span> Watch for an email from admissions@northfield.example
                  </li>
                  <li>
                    <span>2</span> Pick an interview slot from the link in that email
                  </li>
                  <li>
                    <span>3</span> Send remaining documents through the portal before January 9
                  </li>
                </ul>
                <button className="btn btn--secondary" onClick={() => {
                  setStatus('idle')
                  setStep(0)
                  setData(initial)
                }}>
                  Submit another application
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={next}>
                <div className="form__head">
                  <p className="form__step">Step {step + 1} — {formSteps[step].label}</p>
                  <h3 ref={headingRef} tabIndex={-1}>
                    {[
                      'About your child',
                      'How we reach you',
                      'Anything to attach',
                      'Check it over',
                    ][step]}
                  </h3>
                  <p>
                    {[
                      'The basics we need for placement. No essay, and no test scores.',
                      'One parent or guardian. We only use this to contact you about this application.',
                      'Optional now, required before January 9. You can upload more later.',
                      'Make sure everything looks right, then send it. You cannot edit afterward.',
                    ][step]}
                  </p>
                </div>

                {errorCount > 0 && (
                  <div className="form__alert" role="alert" id="form-errors">
                    <div>
                      <b>
                        {errorCount === 1
                          ? 'One field needs your attention'
                          : `${errorCount} fields need your attention`}
                      </b>
                      <ul>
                        {Object.keys(errors).map((k) => (
                          <li key={k}>
                            <button
                              type="button"
                              onClick={() => document.querySelector(`[name="${k}"]`)?.focus()}
                            >
                              {errors[k]}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {step === 0 && (
                  <div className="form__grid form__grid--2">
                    <Field label="First name" error={errors.firstName} required>
                      <input
                        className="input"
                        name="firstName"
                        value={data.firstName}
                        onChange={set('firstName')}
                        aria-invalid={!!errors.firstName}
                        placeholder="Noor"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Last name" error={errors.lastName} required>
                      <input
                        className="input"
                        name="lastName"
                        value={data.lastName}
                        onChange={set('lastName')}
                        aria-invalid={!!errors.lastName}
                        placeholder="Haddad"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Date of birth" error={errors.birthDate} required>
                      <input
                        className="input"
                        type="date"
                        name="birthDate"
                        value={data.birthDate}
                        onChange={set('birthDate')}
                        aria-invalid={!!errors.birthDate}
                      />
                    </Field>
                    <Field label="Current school" error={errors.currentSchool} required>
                      <input
                        className="input"
                        name="currentSchool"
                        value={data.currentSchool}
                        onChange={set('currentSchool')}
                        aria-invalid={!!errors.currentSchool}
                        placeholder="School or preschool"
                      />
                    </Field>

                    <div className="field span-2">
                      <span className="field__label" id="grade-label">
                        Grade applying for <span aria-hidden="true">*</span>
                      </span>
                      <div className="choices choices--row" role="radiogroup" aria-labelledby="grade-label" aria-describedby={errors.grade ? 'grade-error' : undefined}>
                        {grades.map((g) => (
                          <label className="choice" key={g.value}>
                            <input
                              type="radio"
                              name="grade"
                              value={g.value}
                              checked={data.grade === g.value}
                              onChange={set('grade')}
                              aria-invalid={!!errors.grade}
                            />
                            <span className="choice__mark" aria-hidden="true" />
                            <span className="choice__body">
                              <b>{g.label}</b>
                              <span>{g.note}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.grade && (
                        <p className="error-text" id="grade-error">
                          {errors.grade}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="form__grid form__grid--2">
                    <Field label="Your email" error={errors.email} required>
                      <input
                        className="input"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={set('email')}
                        aria-invalid={!!errors.email}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </Field>
                    <Field label="Your phone" error={errors.phone} required>
                      <input
                        className="input"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={set('phone')}
                        aria-invalid={!!errors.phone}
                        placeholder="(503) 555-0142"
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Street address" error={errors.address} required className="span-2">
                      <input
                        className="input"
                        name="address"
                        value={data.address}
                        onChange={set('address')}
                        aria-invalid={!!errors.address}
                        placeholder="1124 SE 33rd Avenue"
                        autoComplete="street-address"
                      />
                    </Field>
                    <Field label="City" error={errors.city} required>
                      <input
                        className="input"
                        name="city"
                        value={data.city}
                        onChange={set('city')}
                        aria-invalid={!!errors.city}
                        placeholder="Portland"
                        autoComplete="address-level2"
                      />
                    </Field>
                    <Field label="ZIP code" error={errors.zip} required>
                      <input
                        className="input"
                        name="zip"
                        value={data.zip}
                        onChange={set('zip')}
                        aria-invalid={!!errors.zip}
                        placeholder="97214"
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                    </Field>
                    <Field label="Your relationship to the applicant" className="span-2">
                      <select className="select" name="relationship" value={data.relationship} onChange={set('relationship')}>
                        {relationshipOptions.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </Field>

                    <div className="field span-2">
                      <span className="field__label">Financial interest</span>
                      <div className="choices">
                        <label className="choice choice--check">
                          <input type="checkbox" name="aidInterest" checked={data.aidInterest} onChange={set('aidInterest')} />
                          <span className="choice__mark">
                            <Icon name="check" size={11} />
                          </span>
                          <span className="choice__body">
                            <b>Apply for need-based financial aid</b>
                            <span>94% of families receive assistance. It never affects the admission decision.</span>
                          </span>
                        </label>
                        <label className="choice choice--check">
                          <input type="checkbox" name="workInterest" checked={data.workInterest} onChange={set('workInterest')} />
                          <span className="choice__mark">
                            <Icon name="check" size={11} />
                          </span>
                          <span className="choice__body">
                            <b>Consider work aid for the student</b>
                            <span>About $3,200 per year, paid across the school term.</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form__grid">
                    <div className="field">
                      <span className="field__label" id="file-label">
                        Most recent report card or transcript <span aria-hidden="true">*</span>
                      </span>
                      <span className="field__hint">
                        PDF, JPG, or PNG. Up to 10MB. A photo of a paper copy is fine.
                      </span>
                      {data.file && (
                        <div className="filechip">
                          <Icon name="doc" size={16} />
                          {data.file}
                          <button
                            type="button"
                            onClick={() => {
                              setData((d) => ({ ...d, file: null }))
                              setErrors((p) => ({ ...p, file: undefined }))
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <label
                        className={`dropzone ${over ? 'is-over' : ''}`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setOver(true)
                        }}
                        onDragLeave={() => setOver(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setOver(false)
                          setData((d) => ({ ...d, file: e.dataTransfer.files?.[0]?.name ?? 'transcript.pdf' }))
                          setErrors((p) => ({ ...p, file: undefined }))
                        }}
                        style={{ marginTop: 'var(--s-2)' }}
                      >
                        <input
                          type="file"
                          name="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          aria-labelledby="file-label"
                          aria-invalid={!!errors.file}
                          onChange={(e) => {
                            setData((d) => ({ ...d, file: e.target.files?.[0]?.name ?? null }))
                            setErrors((p) => ({ ...p, file: undefined }))
                          }}
                        />
                        <Icon name="doc" size={22} />
                        <b>Drop a file here, or choose one</b>
                        <span>Anything you have now is a good start — you can replace it later</span>
                      </label>
                      {errors.file && <p className="error-text">{errors.file}</p>}
                    </div>

                    <Field
                      label="Anything else the committee should know?"
                      hint="Sibling applications, learning differences, a note in a different language, or a transfer that is mid-year. A few sentences is plenty."
                    >
                      <textarea
                        className="textarea"
                        name="notes"
                        value={data.notes}
                        onChange={set('notes')}
                        placeholder="Noor is the younger of two; her sister applies to grade 9 in the same year."
                      />
                    </Field>
                  </div>
                )}

                {step === 3 && (
                  <div className="review">
                    <dl style={{ margin: 0 }}>
                      <ReviewRow label="Applicant" value={[data.firstName, data.lastName].filter(Boolean).join(' ')} empty="Not provided" onEdit={() => goStep(0)} />
                      <ReviewRow label="Date of birth" value={data.birthDate} empty="Not provided" onEdit={() => goStep(0)} />
                      <ReviewRow label="Current school" value={data.currentSchool} empty="Not provided" onEdit={() => goStep(0)} />
                      <ReviewRow
                        label="Applying for"
                        value={grades.find((g) => g.value === data.grade)?.label}
                        empty="Not chosen"
                        onEdit={() => goStep(0)}
                      />
                      <ReviewRow label="Email" value={data.email} empty="Not provided" onEdit={() => goStep(1)} />
                      <ReviewRow label="Phone" value={data.phone} empty="Not provided" onEdit={() => goStep(1)} />
                      <ReviewRow
                        label="Address"
                        value={[data.address, data.city, data.zip].filter(Boolean).join(', ')}
                        empty="Not provided"
                        onEdit={() => goStep(1)}
                      />
                      <ReviewRow
                        label="Financial aid"
                        value={
                          [data.aidInterest && 'Need-based aid requested', data.workInterest && 'Work aid requested']
                            .filter(Boolean)
                            .join(', ') || 'Not requested'
                        }
                        onEdit={() => goStep(1)}
                      />
                      <ReviewRow label="Document" value={data.file} empty="None attached" onEdit={() => goStep(2)} />
                      <ReviewRow label="Notes" value={data.notes} empty="No notes added" onEdit={() => goStep(2)} />
                    </dl>

                    <div className="field">
                      <label className="choice choice--check">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={data.consent}
                          onChange={set('consent')}
                          aria-invalid={!!errors.consent}
                        />
                        <span className="choice__mark">
                          <Icon name="check" size={11} />
                        </span>
                        <span className="choice__body">
                          <b>I confirm these details are accurate</b>
                          <span>
                            And that Northfield Academy may contact me about this application. Your
                            file is not shared outside the admissions committee.
                          </span>
                        </span>
                      </label>
                      {errors.consent && <p className="error-text">{errors.consent}</p>}
                    </div>
                  </div>
                )}

                <div className="form__foot">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => goStep(step - 1)}
                      disabled={status === 'sending'}
                    >
                      Back
                    </button>
                  ) : (
                    <small>Your progress is saved as you type. Nothing is sent yet.</small>
                  )}
                  {step < formSteps.length - 1 ? (
                    <button type="submit" className="btn btn--primary">
                      Continue to {formSteps[step + 1].label.toLowerCase()}
                      <Icon name="arrow" />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <>
                          <span className="spinner spinner--dark" aria-hidden="true" />
                          <span role="status">Submitting…</span>
                        </>
                      ) : (
                        'Submit application'
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, hint, required, className = '', children }) {
  const id = useId()
  const control = cloneElement(children, {
    id,
    name: children.props.name ?? id,
    'aria-describedby': error ? `${id}-error` : undefined,
  })
  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {hint && <span className="field__hint">{hint}</span>}
      {control}
      {error && (
        <p className="error-text" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function ReviewRow({ label, value, empty = '', onEdit }) {
  const isEmpty = !value
  return (
    <div className={`review__row ${isEmpty ? 'review__row--empty' : ''}`}>
      <dt>{label}</dt>
      <dd>{value || empty}</dd>
      <button type="button" className="btn--link" onClick={onEdit}>
        Edit
        <span className="visually-hidden"> {label}</span>
      </button>
    </div>
  )
}
