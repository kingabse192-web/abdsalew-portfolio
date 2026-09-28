export const school = {
  name: 'Northfield Academy',
  tagline: 'Admissions',
  location: 'Portland, Oregon',
  phone: '(503) 555-0142',
  phoneHref: 'tel:+15035550142',
  email: 'admissions@northfield.example',
}

export const deadline = new Date('2027-01-08T17:00:00-08:00')

export const nav = [
  { label: 'How it works', href: '#enroll', num: '01' },
  { label: 'Programs', href: '#programs', num: '02' },
  { label: 'Tuition & aid', href: '#tuition', num: '03' },
  { label: 'Key dates', href: '#dates', num: '04' },
  { label: 'Questions', href: '#faq', num: '05' },
]

export const heroStats = [
  { value: '12 min', label: 'to submit a complete application' },
  { value: '1:8', label: 'counselor to student ratio' },
  { value: '94%', label: 'of families receive aid' },
]

export const checklist = [
  'Report card or transcript from the last two terms',
  'Teacher recommendation (one is enough to begin)',
  'Birth certificate or passport copy',
  'Any IEP, 504 plan, or learning evaluation',
]

export const steps = [
  {
    num: '01',
    title: 'Start your application',
    body: 'Create a family account and save your progress. Nothing is submitted until you review it.',
    meta: 'About 12 minutes',
  },
  {
    num: '02',
    title: 'Tell us about your child',
    body: 'Grade applying for, current school, prior context, and anything you want the committee to know.',
    meta: 'No essays required',
  },
  {
    num: '03',
    title: 'Meet the committee',
    body: 'A 30-minute conversation with two faculty members and a counselor. We schedule within ten days.',
    meta: 'In person or online',
  },
  {
    num: '04',
    title: 'Decision and enrollment',
    body: 'Decisions release on a single date for every applicant. Offer accepted, you confirm and register.',
    meta: 'Decisions by January 30',
  },
]

export const programGroups = [
  { id: 'all', label: 'All programs' },
  { id: 'early', label: 'Early childhood' },
  { id: 'lower', label: 'Lower school' },
  { id: 'upper', label: 'Upper school' },
  { id: 'arts', label: 'Arts & athletics' },
]

export const programs = [
  {
    id: 'pk',
    group: 'early',
    grades: 'Pre-K (3–4 yrs)',
    title: 'Pre-K and Kindergarten',
    body: 'Mixed-age classrooms of sixteen, play-based literacy, and a full-time studio teacher for art, music, and movement.',
    seats: 6,
    capacity: 32,
    facts: [
      ['Class size', '16 students'],
      ['Program length', '8:00am – 3:15pm'],
      ['Waitlist last year', '11 families'],
    ],
    tags: ['Full day', 'Play-based', 'Mixed age'],
  },
  {
    id: 'lower',
    group: 'lower',
    grades: 'Grades 1–5',
    title: 'Lower School',
    body: 'Literacy workshop, hands-on science twice weekly, and specialist instruction in art, music, and movement every day.',
    seats: 14,
    capacity: 96,
    facts: [
      ['Class size', '20 students'],
      ['Core subjects', '4 specialists'],
      ['Homework', 'Under 30 min/night'],
    ],
    tags: ['Literacy workshop', 'Science labs', 'Daily arts'],
  },
  {
    id: 'science',
    group: 'lower',
    grades: 'Grades 3–5',
    title: 'Science and Engineering Lab',
    body: 'A twice-weekly lab block for third through fifth grade. This spring: watershed monitoring, simple machines, and a working model bridge.',
    seats: 8,
    capacity: 24,
    facts: [
      ['Meets', '2× per week, 60 min'],
      ['Prerequisites', 'None'],
      ['Cost', 'Included in tuition'],
    ],
    tags: ['Lab block', 'Project-based', 'All grades 3–5'],
  },
  {
    id: 'upper',
    group: 'upper',
    grades: 'Grades 6–8',
    title: 'Middle School',
    body: 'Departmental teaching begins in sixth grade. Advisory meets daily, and every student takes a year-long independent study.',
    seats: 9,
    capacity: 88,
    facts: [
      ['Class size', '22 students'],
      ['Advisory', 'Daily, 20 min'],
      ['Electives', '2 per year'],
    ],
    tags: ['Advisory', 'Independent study', 'Departments'],
  },
  {
    id: 'college',
    group: 'upper',
    grades: 'Grades 9–12',
    title: 'Upper School',
    body: 'Twenty-two Advanced Placement courses, an engineering and computer science track, and a senior thesis with an outside mentor.',
    seats: 5,
    capacity: 112,
    facts: [
      ['AP courses', '22 offered'],
      ['College counseling', '4 counselors, 1:27'],
      ['Thesis', 'Required, mentored'],
    ],
    tags: ['AP', 'Senior thesis', '1:27 college ratio'],
  },
  {
    id: 'arts',
    group: 'arts',
    grades: 'All grades',
    title: 'Arts Conservatory',
    body: 'Glassblowing, printmaking, ceramics, chamber music, and digital media studios open until 6pm four days a week.',
    seats: 0,
    capacity: 60,
    facts: [
      ['Studios open', 'Until 6pm, 4×/week'],
      ['Instruction', '14 faculty'],
      ['Portfolio', 'Optional'],
    ],
    tags: ['Glassblowing', 'Chamber music', 'Digital media'],
  },
  {
    id: 'athletics',
    group: 'arts',
    grades: 'Grades 6–12',
    title: 'Athletics',
    body: 'Twenty-three sports, no cuts in grades 6–8, and a strength and conditioning program with a full-time athletic trainer.',
    seats: 11,
    capacity: 240,
    facts: [
      ['Teams', '23 varsity programs'],
      ['Cuts', 'None in grades 6–8'],
      ['Trainer', 'Full-time, on site'],
    ],
    tags: ['23 sports', 'No cuts', 'NISCAA member'],
  },
]

export const tuitionRows = {
  tuition: [
    ['Pre-K (full day)', 18900, 14180],
    ['Kindergarten', 21400, 16050],
    ['Grades 1–5', 22800, 17100],
    ['Grades 6–8', 24500, 18380],
    ['Grades 9–12', 26900, 20180],
  ],
  fees: [
    ['Enrollment fee (one-time)', 1200, 1200],
    ['Technology & materials', 640, 640],
  ],
  other: [
    ['Meals plan (optional, annual)', 1180, 1180],
    ['Bus transport (annual)', 760, 760],
  ],
}

export const aid = {
  assessed: 32,
  needMet: 88,
  stats: [
    ['Families applying for aid', '61'],
    ['Average grant awarded', '$14,900'],
    ['Work aid (jobs on campus)', '$3,200'],
  ],
}

export const dates = [
  {
    when: 'Oct 5',
    full: 'October 5, 2026',
    title: 'Open house for prospective families',
    note: 'Campus tour 10am, information sessions at 11am and 2pm',
    status: 'closed',
  },
  {
    when: 'Nov 2',
    full: 'November 2, 2026',
    title: 'Applications open',
    note: 'Rolling review begins; early decisions for complete files',
    status: 'open',
  },
  {
    when: 'Dec 11',
    full: 'December 11, 2026',
    title: 'Financial aid documents due',
    note: 'FAFSA or the Northfield aid form, plus prior-year tax return',
    status: 'soon',
  },
  {
    when: 'Jan 8',
    full: 'January 8, 2027',
    title: 'Applications and financial aid due',
    note: 'Everything must be submitted by 5:00pm Pacific',
    status: 'open',
  },
  {
    when: 'Jan 11',
    full: 'January 11–15, 2027',
    title: 'Family interviews',
    note: 'We contact you within 48 hours of your application to schedule',
    status: 'soon',
  },
  {
    when: 'Jan 29',
    full: 'January 29, 2027',
    title: 'Decisions released',
    note: 'A single release time for every applicant, by email and portal',
    status: 'soon',
  },
  {
    when: 'Mar 5',
    full: 'March 5, 2027',
    title: 'Enrollment contracts due',
    note: 'Deposit and signed contract confirm your place',
    status: 'soon',
  },
  {
    when: 'Aug 24',
    full: 'August 24, 2027',
    title: 'First day of the Fall 2027 year',
    note: 'Orientation for new families the week before',
    status: 'soon',
  },
]

export const faq = [
  {
    q: 'Do you require standardized test scores?',
    a: 'No. We do not use SSAT or ISEE scores for admission in any grade, and we ask for no testing at all. The committee reads the file, the transcript, and the teacher recommendation, then meets your child.',
  },
  {
    q: 'What is the deadline for applying?',
    a: 'Applications and financial aid documents are due January 8, 2027 at 5:00pm Pacific. Files completed before November 16 are eligible for an early decision, released the same day as regular decisions.',
  },
  {
    q: 'Do you offer financial aid?',
    a: 'We assess need for every family who applies — no separate form beyond the FAFSA. Ninety-four percent of our families receive some form of assistance, and 32 percent pay less than half of tuition.',
  },
  {
    q: 'What happens if we are waitlisted?',
    a: 'Waitlist decisions release alongside regular decisions. If a place opens, families receive a call within 48 hours and have ten days to decide. In the last three years we have filled waitlist places 71 percent of the time.',
  },
  {
    q: 'Can we visit before applying?',
    a: 'Yes, and we encourage it. Campus tours run Tuesday and Thursday mornings and the first Saturday of each month. You do not need to be applying to visit, and children are welcome to come along.',
  },
  {
    q: 'Is there transportation and before and after care?',
    a: 'Bus service covers 22 neighborhoods across Portland, Beaverton, and Lake Oswego. Care runs from 7:00am to 6:30pm and is billed hourly, and it is available to every enrolled family regardless of program.',
  },
  {
    q: 'What is your teaching credential policy?',
    a: 'Every Lower and Middle School teacher holds a state credential, and 68 percent hold a master’s degree. Upper School faculty are hired for the depth of their discipline as much as for classroom experience.',
  },
  {
    q: 'What if we already attend another school?',
    a: 'Families transfer at every grade. We record your child’s current credits and placements during the interview so the transition is accurate from day one, and we assign a faculty mentor for the first six weeks.',
  },
]

export const people = [
  {
    name: 'Amara Whitfield',
    role: 'Head of Admissions',
    initials: 'AW',
    years: 'since 2016',
  },
  {
    name: 'Daniel Reyes',
    role: 'Director of Financial Aid',
    initials: 'DR',
    years: 'since 2013',
  },
  {
    name: 'Priya Raghunathan',
    role: 'Lower School Division Head',
    initials: 'PR',
    years: 'since 2011',
  },
  {
    name: 'Marcus Oyelaran',
    role: 'Chair, Science Department',
    initials: 'MO',
    years: 'since 2019',
  },
  {
    name: 'Hana Kobayashi',
    role: 'Director of College Counseling',
    initials: 'HK',
    years: 'since 2018',
  },
  {
    name: 'Tomás Iglesias',
    role: 'Middle School Division Head',
    initials: 'TI',
    years: 'since 2020',
  },
]

export const formSteps = [
  { id: 'student', label: 'Student' },
  { id: 'household', label: 'Household' },
  { id: 'documents', label: 'Documents' },
  { id: 'review', label: 'Review' },
]

export const relationshipOptions = ['Parent or legal guardian', 'Stepparent', 'Legal guardian', 'Self']
