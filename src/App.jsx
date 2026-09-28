import ApplyForm from './components/ApplyForm.jsx'
import { Footer, Marquee, Nav, SkipLink, UtilityBar } from './components/Chrome.jsx'
import {
  Dates,
  Faq,
  FinalCta,
  Hero,
  People,
  Programs,
  Quote,
  Steps,
  Tuition,
} from './components/Sections.jsx'

export default function App() {
  return (
    <>
      <SkipLink />
      <UtilityBar />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Steps />
        <Programs />
        <Tuition />
        <Quote />
        <People />
        <Dates />
        <ApplyForm />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
