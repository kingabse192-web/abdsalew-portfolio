import { useState } from 'react'
import { aid, checklist, dates, faq, heroStats, people, programs, programGroups, steps, tuitionRows } from '../data/content.js'
import { Icon } from './Chrome.jsx'
import { useReveal } from '../hooks/index.js'

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, lede, id, split = true }) {
  return (
    <Reveal className={`section-head ${split ? 'section-head--split' : ''}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} style={{ marginTop: 'var(--s-4)' }}>
          {title}
        </h2>
      </div>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  )
}

export function Hero() {
  const [checked, setChecked] = useState([])
  const R = 34
  const C = 2 * Math.PI * R
  const done = checked.length
  const progress = done / checklist.length

  return (
    <section className="hero" id="top">
      <div className="shell hero__grid">
        <div>
          <Reveal>
            <span className="hero__badge">
              <span className="hero__badgeDot" aria-hidden="true" />
              Applications open for Fall 2027
            </span>
            <h1>
              Sixteen hundred hours of school, and <em>eight hundred</em> of them are ours to shape.
            </h1>
            <p className="hero__lede">
              Northfield Academy is an independent K–12 school in Southeast Portland. Applying takes
              about twelve minutes, needs no test scores, and no essay. Just your child.
            </p>
            <div className="btn-row hero__actions">
              <a className="btn btn--primary btn--lg" href="#apply">
                Start your application
                <Icon name="arrow" />
              </a>
              <a className="btn btn--secondary btn--lg" href="#programs">
                Explore programs
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="hero__stats">
            {heroStats.map((s) => (
              <div className="hero__stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={180} as="aside" aria-labelledby="snapshot-title">
          <div className="snapshot">
            <div className="snapshot__head">
              <h2 id="snapshot-title">Your application</h2>
              <span className="pill pill--open">
                <span className="pill__dot" />
                In progress
              </span>
            </div>

            <div className="snapshot__body">
              <div className="ring">
                <div className="ring__dial">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle className="track" cx="36" cy="36" r={R} />
                    <circle
                      className="bar"
                      cx="36"
                      cy="36"
                      r={R}
                      strokeDasharray={C}
                      strokeDashoffset={C * (1 - progress)}
                    />
                  </svg>
                  <span className="ring__value">
                    {done}/{checklist.length}
                  </span>
                </div>
                <div className="ring__copy">
                  <b>Documents to gather</b>
                  <p>
                    {done === 0
                      ? 'Most families already have these at home. Tick them off as you go.'
                      : done === checklist.length
                        ? 'All four gathered. You are ready to apply.'
                        : `${checklist.length - done} left. Most families already have these at home.`}
                  </p>
                </div>
              </div>

              <div className="snapshot__divider" />

              <div className="checklist">
                <p className="checklist__title">Before you begin</p>
                {checklist.map((item, i) => (
                  <button
                    className="check"
                    key={item}
                    aria-pressed={checked.includes(i)}
                    onClick={() =>
                      setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))
                    }
                  >
                    <span className="check__box">
                      <Icon name="check" size={12} />
                    </span>
                    <span className="check__text">{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="snapshot__foot">
              <span>Grade 4 · seats remaining</span>
              <div style={{ width: '5.5rem' }}>
                <div className="meter">
                  <div className="meter__fill" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Steps() {
  return (
    <section className="section" id="enroll">
      <div className="shell">
        <SectionHead
          eyebrow="How enrollment works"
          title="Four steps between you and an answer."
          lede="No essays, no testing, no hidden fees. The committee reviews every complete file, and you will hear from a person — not a system."
        />
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal className="step" delay={i * 80} key={s.num}>
              <span className="step__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="step__meta">{s.meta}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Programs() {
  const [group, setGroup] = useState('all')
  const [open, setOpen] = useState(null)
  const visible = group === 'all' ? programs : programs.filter((p) => p.group === group)

  return (
    <section className="section section--sunk" id="programs">
      <div className="shell">
        <SectionHead
          eyebrow="Programs"
          title="Eight programs, one campus."
          lede="Every student takes art, music, and movement daily. Beyond that, choose the path that fits where your child is going."
        />

        <div className="tabs" role="tablist" aria-label="Filter programs by division">
          {programGroups.map((g) => (
            <button
              key={g.id}
              className="tab"
              role="tab"
              aria-selected={group === g.id}
              onClick={() => {
                setGroup(g.id)
                setOpen(null)
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div>
          {visible.map((p, i) => {
            const isOpen = open === p.id
            return (
              <article className="prog" key={p.id}>
                <h3 className="prog__h">
                  <button
                    className="prog__btn"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${p.id}`}
                    onClick={() => setOpen(isOpen ? null : p.id)}
                  >
                    <span className="prog__idx" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="prog__title">
                        <span>{p.title}</span>
                        <span className="tag">{p.grades}</span>
                      </span>
                      <span className="prog__desc" aria-hidden="true">
                        {p.body}
                      </span>
                    </span>
                    <span className="prog__right">
                      {p.seats > 0 && (
                        <span className="prog__seats" aria-hidden="true">
                          <b>{p.seats}</b> of {p.capacity} seats open
                        </span>
                      )}
                      {p.seats === 0 && <span className="tag">Waitlist only</span>}
                      <span className="prog__chev" aria-hidden="true">
                        <Icon name="chevron" size={14} />
                      </span>
                    </span>
                    <span className="visually-hidden">
                      {p.seats > 0
                        ? `${p.seats} of ${p.capacity} seats open. `
                        : 'Waitlist only. '}
                      {isOpen ? 'Hide details' : 'Show details'}
                    </span>
                  </button>
                </h3>
                <div className="prog__panel" id={`panel-${p.id}`} data-open={isOpen}>
                  <div className="prog__panelInner">
                    <div className="prog__panelBody">
                      <div>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                          Every family in this program meets with the same two faculty members and a
                          counselor before a decision is made. Placement is confirmed by transcript
                          review, so a moving family lands in the right room from day one.
                        </p>
                        <div className="prog__tags" style={{ marginTop: 'var(--s-4)' }}>
                          {p.tags.map((t) => (
                            <span className="tag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <dl className="prog__facts">
                        {p.facts.map(([k, v]) => (
                          <div key={k}>
                            <span>{k}</span>
                            <b>{v}</b>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
          {visible.length === 0 && <p className="prog-empty">No programs in this division yet.</p>}
        </div>
      </div>
    </section>
  )
}

export function Tuition() {
  const [residency, setResidency] = useState(0)
  const [plan, setPlan] = useState('annual')
  const key = residency === 0 ? 'tuition' : 'other'
  const money = (n) => '$' + n.toLocaleString('en-US')

  return (
    <section className="section" id="tuition">
      <div className="shell">
        <SectionHead
          eyebrow="Tuition & financial aid"
          title="Published numbers. No call required."
          lede="Every family pays the same for the same program. Aid is assessed on need, not on whether a family can pay first."
        />

        <div className="tuition">
          <div>
            <div className="controls">
              <div className="field">
                <span className="field__label" id="residency-label">
                  Tuition for
                </span>
                <div className="segmented" role="group" aria-labelledby="residency-label">
                  <button aria-pressed={residency === 0} onClick={() => setResidency(0)}>
                    Oregon resident
                  </button>
                  <button aria-pressed={residency === 1} onClick={() => setResidency(1)}>
                    Non-resident
                  </button>
                </div>
              </div>
              <div className="field">
                <span className="field__label">Show as</span>
                <div className="segmented" role="group">
                  <button aria-pressed={plan === 'annual'} onClick={() => setPlan('annual')}>
                    Annual
                  </button>
                  <button aria-pressed={plan === 'monthly'} onClick={() => setPlan('monthly')}>
                    Monthly
                  </button>
                </div>
              </div>
            </div>

            <table className="tuition__table">
              <caption>
                {residency === 0
                  ? '2025–26 rates for Oregon residents. Monthly figures are a ten-payment plan.'
                  : '2025–26 non-resident rates. Monthly figures are a ten-payment plan.'}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Grade</th>
                  <th scope="col">{plan === 'annual' ? 'Annual' : 'Per month'}</th>
                  <th scope="col">With aid, typical</th>
                </tr>
              </thead>
              <tbody>
                {tuitionRows[key].map(([name, full, aided]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{money(plan === 'annual' ? full : Math.round(full / 10))}</td>
                    <td>{money(plan === 'annual' ? aided : Math.round(aided / 10))}</td>
                  </tr>
                ))}
                {tuitionRows.fees.map(([name, full, aided]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{money(plan === 'annual' ? full : Math.round(full / 10))}</td>
                    <td>{money(plan === 'annual' ? aided : Math.round(aided / 10))}</td>
                  </tr>
                ))}
                {tuitionRows[key].map(([name, full, aided]) => (
                  <tr key={`total-${name}`}>
                    <td>Total, {name.replace('Grades ', 'gr. ').replace('Pre-K (full day)', 'pre-K')}</td>
                    <td>{money(plan === 'annual' ? full + 1840 : Math.round((full + 1840) / 10))}</td>
                    <td>{money(plan === 'annual' ? aided + 640 : Math.round((aided + 640) / 10))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="tuition__note">
              Figures assume the optional meals plan. Aid column reflects the median award among
              families who applied and were assessed. Sibling discounts of 10% apply to the second
              child and 20% to the third.
            </p>
          </div>

          <aside className="aid">
            <h3>Financial aid, in numbers</h3>
            <p>
              We assess every applicant for need. There is no separate scholarship application, and
              applying for aid never affects your admission decision.
            </p>
            <div className="aid__bar">
              <div className="meter">
                <div
                  className="meter__fill meter__fill--brand"
                  style={{ width: `${aid.assessed}%` }}
                />
              </div>
              <div className="aid__legend">
                <span>{aid.assessed}% of students receive a grant</span>
                <span>{aid.needMet}% of assessed need met</span>
              </div>
            </div>
            <div className="aid__rows">
              {aid.stats.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <a className="btn btn--secondary btn--block aid__cta" href="#faq">
              Questions about aid
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function Quote() {
  return (
    <section className="section section--sunk">
      <div className="shell">
        <div className="quote">
          <Reveal as="figure">
            <blockquote>
              <p>
                Noor applied from a public school that had four hundred students in her grade. Here
                she is a captain, a cellist, and the person the new girls ask to sit with.
              </p>
            </blockquote>
            <figcaption>
              <b>Leila Haddad</b>
              Parent, current Grade 7 family
            </figcaption>
          </Reveal>
          <Reveal delay={120} className="quote__aside">
            <div className="quote__stat">
              <b>640</b>
              <span>students from kindergarten to twelfth grade, on a nine-acre campus</span>
            </div>
            <div className="quote__stat">
              <b>17</b>
              <span>average years of experience per classroom teacher</span>
            </div>
            <div className="quote__stat">
              <b>2 weeks</b>
              <span>from complete application to a scheduled interview</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function People() {
  return (
    <section className="section" id="people">
      <div className="shell">
        <div className="people">
          <Reveal className="people__intro">
            <p className="eyebrow">Who reads your file</p>
            <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: 'var(--s-4)' }}>
              Nine people. Every applicant.
            </h2>
            <p>
              Your file is read in full by the same committee that visits your child. No algorithm
              scores you, and no file is read by someone you have not met. Two teachers, one
              counselor, one division head, and the head of admissions read every single application
              — roughly seventy files each.
            </p>
            <p>
              Financial need is assessed by a separate committee that never sees the parts of your
              application unrelated to money.
            </p>
          </Reveal>

          <Reveal delay={120} className="people__list">
            {people.map((person) => (
              <div className="person" key={person.name}>
                <span className="person__mono" aria-hidden="true">
                  {person.initials}
                </span>
                <span>
                  <span className="person__name">{person.name}</span>
                  <span className="person__role">{person.role}</span>
                </span>
                <span className="person__years">Northfield {person.years}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const statusLabel = { open: 'Open now', soon: 'Upcoming', closed: 'Closed' }
const statusClass = { open: 'pill--open', soon: 'pill--soon', closed: 'pill--closed' }

export function Dates() {
  return (
    <section className="section section--sunk" id="dates">
      <div className="shell">
        <SectionHead
          eyebrow="Key dates"
          title="Everything on one list."
          lede="One deadline, one release date, no rolling admissions after January 9. Save these to your calendar now."
        />
        <div className="dates">
          {dates.map((d, i) => (
            <Reveal className="date" delay={i * 60} key={d.title}>
              <span className="date__when">{d.when}</span>
              <span className="date__what">
                <b>{d.title}</b>
                <span>{d.note}</span>
              </span>
              <span className={`pill ${statusClass[d.status]}`}>
                <span className="pill__dot" />
                {statusLabel[d.status]}
              </span>
            </Reveal>
          ))}
          <p className="dates__foot">
            Late applications are considered only for a place that remains after the waitlist
            closes. Call the admissions office if your circumstances make the deadline impossible.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" id="faq">
      <div className="shell">
        <SectionHead
          eyebrow="Common questions"
          title="Asked and answered, plainly."
          lede="The eight questions the admissions office hears most. If yours is not here, we would rather you called than emailed."
        />
        <div className="faq">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <div className="faq__item" key={item.q}>
                <h3 className="faq__h">
                  <button
                    className="faq__btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq__panel" id={`faq-${i}`} data-open={isOpen} role="region">
                  <div className="faq__panelInner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="section section--brand on-dark final">
      <div className="shell">
        <Reveal className="final__inner">
          <p className="eyebrow">Ready when you are</p>
          <h2>Twelve minutes from now, you can be done applying.</h2>
          <p>
            Create a family account, save your work, and come back whenever you are ready. Nothing
            is submitted until you press the final button.
          </p>
          <div className="btn-row">
            <a className="btn btn--gold btn--lg" href="#apply">
              Start your application
              <Icon name="arrow" />
            </a>
            <a className="btn btn--ghost btn--lg" href="tel:+15035550142">
              Call admissions
            </a>
          </div>
          <div className="final__contact">
            <a href="tel:+15035550142">(503) 555-0142</a>
            <a href="mailto:admissions@northfield.example">admissions@northfield.example</a>
            <span>Office hours 8:30am – 4:30pm Pacific</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
