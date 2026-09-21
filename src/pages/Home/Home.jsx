import { usePageMeta } from '../../hooks/usePageMeta.jsx'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel.jsx'
import { heroSlides } from '../../content/heroSlides.jsx'
import './Home.scss'

function Home() {
  usePageMeta(
    'Juan Diego Perez Arias | Fotógrafo, documentalista y escritor',
    'Fotógrafo, documentalista y escritor ecuatoriano. Recorre el país fotografiando lugares remotos e historias olvidadas. Conoce sus libros y documentales.',
  )

  // The hero sits outside the .page wrapper deliberately: that wrapper caps its
  // contents at 1126px, and the hero is full-bleed. Anything after it goes back
  // inside the wrapper.
  return (
    <>
      <HeroCarousel slides={heroSlides} />

      <section className="page home">{/* Featured work */}</section>
    </>
  )
}

export default Home
