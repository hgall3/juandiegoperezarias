import { usePageMeta } from '../../hooks/usePageMeta.jsx'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel.jsx'
import Feature from '../../components/Feature/Feature.jsx'
import { heroSlides } from '../../content/heroSlides.jsx'
import { features } from '../../content/features.jsx'
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

      {/* The bands alternate by position: odd ones face the other way, so a
          second entry in the array lands its photograph on the left without
          anyone having to say so. */}
      <section className="page home">
        {features.map((item, index) => (
          <Feature key={item.id} item={item} reversed={index % 2 === 1} />
        ))}
      </section>
    </>
  )
}

export default Home
