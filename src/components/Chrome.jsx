import { useEffect, useRef, useState } from 'react'
import { deadline, nav, school } from '../data/content.js'
import { useBodyLock, useCountdown, useEscape, useStuck } from '../hooks/index.js'

export function Icon({ name, size = 16, ...rest }) {
  const paths = {
    check: <polyline points="3.5 8 6.5 11 12.5 4.5" />,
    chevron: <polyline points="4 6.5 8 10.5 12 6.5" />,
    arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
    plus: <path d="M8 3.5v9M3.5 8h9" />,
    clock: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5V8l2.5 1.5" />
      </>
    ),
    doc: (
      <>
        <path d="M4 2h5l3 3v9H4z" />
        <path d="M9 2v3h3" />
      </>
    ),
    phone: <path d="M4 3h3l1.5 3.5-2 1a9 9 0 0 0 4 4l1-2L15 11v3z" />,
    mail: (
      <>
        <rect x="2" y="4" width="12" height="8" rx="1" />
        <path d="m2.5 4.5 5.5 4 5.5-4" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

export function Brand({ sub = 'Admissions', dark = false }) {
  return (
    <span className="brand">
      <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="5" fill={dark ? '#f2ede2' : '#12362a'} />
        <path d="M16 6.2 6.8 11.4 16 16.6l9.2-5.2L16 6.2Z" fill={dark ? '#12362a' : '#f2ede2'} />
        <path
          d="M10.4 14.1v5.1c0 2.3 2.5 4.1 5.6 4.1s5.6-1.8 5.6-4.1v-5.1L16 17.6l-5.6-3.5Z"
          fill="#b08520"
        />
        <path d="M25.4 12.6v6.1" stroke="#b08520" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>
        <span className="brand__name">{school.name}</span>
        <span className="brand__sub">{sub}</span>
      </span>
    </span>
  )
}

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to content
    </a>
  )
}

export function UtilityBar() {
  const t = useCountdown(deadline)
  return (
    <div className="utility">
      <div className="shell utility__inner">
        <p className="utility__countdown">
          <span aria-hidden="true">Applications due</span>
          <span className="utility__sep" aria-hidden="true">
            |
          </span>
          {t.past ? (
            <b>Closed</b>
          ) : (
            <b>
              <span className="visually-hidden">Time remaining until January 9, 2026: </span>
              {t.days}d {String(t.hours).padStart(2, '0')}h {String(t.minutes).padStart(2, '0')}m
            </b>
          )}
        </p>
        <div className="utility__links">
          <a href={school.phoneHref}>{school.phone}</a>
          <a href={`mailto:${school.email}`}>{school.email}</a>
          <a href="#apply">Family portal login</a>
        </div>
      </div>
    </div>
  )
}

export function Nav() {
  const stuck = useStuck()
  const [open, setOpen] = useState(false)
  useBodyLock(open)
  useEscape(() => setOpen(false), open)
  const closeRef = useRef(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  return (
    <>
      <header className={stuck ? 'nav is-stuck' : 'nav'}>
        <div className="shell nav__inner">
          <a href="#top" aria-label={`${school.name} home`}>
            <Brand />
          </a>
          <nav className="nav__links" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary nav__cta" href="#apply">
              Start application
            </a>
            <button
              className="nav__burger"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <span />
              <span />
              <span />
              <span className="visually-hidden">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__top">
            <Brand />
            <button className="drawer__close" ref={closeRef} onClick={() => setOpen(false)}>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">Close menu</span>
            </button>
          </div>
          <nav className="drawer__nav" aria-label="Mobile">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span>{item.num}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="drawer__foot">
            <a className="btn btn--primary btn--block" href="#apply" onClick={() => setOpen(false)}>
              Start application
            </a>
            <a href={school.phoneHref}>{school.phone}</a>
            <a href={`mailto:${school.email}`}>{school.email}</a>
          </div>
        </div>
      )}
    </>
  )
}

export function Marquee() {
  const items = [
    'Accredited by NAIS',
    'Independent since 1908',
    '1:8 counselor ratio',
    'IB World School authorized',
    '94% receive financial aid',
    '23 varsity sports',
    'NISCAA member since 1972',
  ]
  return (
    <div className="marquee on-dark" aria-label="School facts">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <span className="marquee__item" key={item}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div>
            <Brand sub={`${school.location}`} dark />
            <p className="footer__blurb">
              An independent K–12 school on a nine-acre campus in Southeast Portland, teaching
              roughly 640 students from kindergarten through twelfth grade since 1908.
            </p>
          </div>
          <div>
            <h4>Admissions</h4>
            <div className="footer__links">
              <a href="#enroll">How enrollment works</a>
              <a href="#programs">Programs and grades</a>
              <a href="#tuition">Tuition and aid</a>
              <a href="#dates">Key dates</a>
              <a href="#apply">Apply online</a>
            </div>
          </div>
          <div>
            <h4>Visit</h4>
            <div className="footer__links">
              <a href={school.phoneHref}>{school.phone}</a>
              <a href={`mailto:${school.email}`}>{school.email}</a>
              <span>4200 SE Ankeny Street</span>
              <span>Portland, OR 97215</span>
              <span>Tours Tue &amp; Thu, 9:00am</span>
            </div>
          </div>
          <div>
            <h4>School</h4>
            <div className="footer__links">
              <a href="#people">Faculty &amp; staff</a>
              <a href="#faq">Common questions</a>
              <a href="#top">Equal opportunity</a>
              <a href="#top">Safety &amp; privacy</a>
              <a href="#top">Board of trustees</a>
            </div>
          </div>
        </div>
        <div className="footer__sub">
          <p>© 2026 Northfield Academy. Accredited by NAIS and the State of Oregon.</p>
          <div className="footer__legal">
            <a href="#top">Privacy policy</a>
            <a href="#top">Terms</a>
            <a href="#top">Non-discrimination</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
