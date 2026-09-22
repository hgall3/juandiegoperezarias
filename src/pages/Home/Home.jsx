import { usePageMeta } from '../../hooks/usePageMeta.jsx'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel.jsx'
import Feature from '../../components/Feature/Feature.jsx'
import GalleryCarousel from '../../components/GalleryCarousel/GalleryCarousel.jsx'
import BooksBand from '../../components/BooksBand/BooksBand.jsx'
import { heroSlides } from '../../content/heroSlides.jsx'
import { features, biographyBand } from '../../content/features.jsx'
import './Home.scss'

function Home() {
  usePageMeta(
    'Juan Diego Perez Arias | Fotógrafo, documentalista y escritor',
    'Fotógrafo, documentalista y escritor ecuatoriano. Recorre el país fotografiando lugares remotos e historias olvidadas. Conoce sus libros y documentales.',
  )

  // The hero sits outside the .page wrapper deliberately: that wrapper caps its
  // contents at 1126px, and the hero is full-bleed. The featured bands are out
  // of it for the same reason — each one runs its photograph off one edge of
  // the window, which the wrapper's centring would prevent.
  return (
    <>
      <HeroCarousel slides={heroSlides} />

      {/* The bands alternate by position: odd ones face the other way, so a
          second entry in the array lands its photograph on the left without
          anyone having to say so. */}
      <section className="home">
        {features.map((item, index) => (
          <Feature key={item.id} item={item} reversed={index % 2 === 1} />
        ))}

        {/* Inside .home so it inherits the spacing between bands, but its own
            row is full-bleed: the cards have to run off the right edge. */}
        <GalleryCarousel />
      </section>

      {/* Outside .home, which pads its contents: this band sets its own
          generous padding and has to run edge to edge so the black it ends in
          meets whatever follows with no paper-coloured strip between them. */}
      <BooksBand />

      {/* The author, at the foot of the page. Reversed, so its photograph sits
          on the opposite edge from the featured band far above — the two are
          the only bands on the page and facing the same way would read as a
          repeat rather than a pair. Outside .home for the same reason the band
          above it is: it sets its own spacing against the black it follows. */}
      <section className="biography-band">
        <Feature item={biographyBand} reversed />
      </section>
    </>
  )
}

export default Home
