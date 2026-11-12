import { Navbar } from './components/Navbar'
import { useTheme } from './hooks/useTheme'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Projects } from './sections/Projects'
import { Proofs } from './sections/Proofs'
import { Skills } from './sections/Skills'

function App() {
  const { theme, toggle } = useTheme()

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-skip) focus:rounded-pill focus:bg-bg-200 focus:px-4 focus:py-2"
      >
        Aller au contenu
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main id="contenu">
        <Hero theme={theme} />
        <About theme={theme} />
        <Projects />
        <Skills />
        <Journey />
        <Proofs />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
