import { galleries } from './collections.jsx'

import galapagos480 from '../assets/gallery/galapagos-480.jpg'
import galapagos750 from '../assets/gallery/galapagos-750.jpg'
import atardecerMar480 from '../assets/gallery/atardecer-mar-480.jpg'
import atardecerMar750 from '../assets/gallery/atardecer-mar-750.jpg'
import parejaHamaca480 from '../assets/gallery/pareja-hamaca-480.jpg'
import parejaHamaca750 from '../assets/gallery/pareja-hamaca-750.jpg'
import mujerTrenzas480 from '../assets/gallery/mujer-trenzas-480.jpg'
import mujerTrenzas750 from '../assets/gallery/mujer-trenzas-750.jpg'
import dosSaposVerdes480 from '../assets/gallery/dos-sapos-verdes-480.jpg'
import dosSaposVerdes750 from '../assets/gallery/dos-sapos-verdes-750.jpg'
import orquidea3480 from '../assets/gallery/orquidea3-480.jpg'
import orquidea3750 from '../assets/gallery/orquidea3-750.jpg'
import diabloIglesia480 from '../assets/gallery/diablo-iglesia-480.jpg'
import diabloIglesia750 from '../assets/gallery/diablo-iglesia-750.jpg'
import iglesiaSanFrancisco480 from '../assets/gallery/iglesia-san-francisco-480.jpg'
import iglesiaSanFrancisco750 from '../assets/gallery/iglesia-san-francisco-750.jpg'

// The cards in the homepage gallery carousel: one photograph each, tagged with
// the category it belongs to.
//
// A card carries no title of its own. It names a category by slug and the label
// is looked up in `galleries`, so "Flora y fauna" is written in exactly one
// place — rename it there and the navbar menu and these cards change together.
// Written twice, the two would drift apart the first time one was corrected.
//
// Several photographs can share a category; the order below is the order they
// appear in the row, grouped by category in the order `galleries` lists them.

const byCategory = Object.fromEntries(
  galleries.map((category) => [category.slug, category]),
)

// The per-category pages do not exist yet, so every card lands on the gallery
// index rather than a 404 — the same pairing the hero slides and featured bands
// use. When a category page ships, `eventualHref` is the path it takes and this
// becomes a one-line change.
const hrefFor = (slug) => ({
  href: '/foto-galeria',
  eventualHref: `/foto-galeria/${slug}`,
})

// Two widths per photograph, both cropped to the card's 3:4 at build-prep time
// rather than by the browser: a landscape original covering a portrait frame
// would otherwise ship a lot of pixels that get cropped away unseen.
const photographs = [
  {
    slug: 'galapagos',
    category: 'paisaje',
    small: galapagos480,
    large: galapagos750,
    alt: 'Vista elevada de una costa: el mar turquesa rompe en una lengua de arena blanca junto a un promontorio cubierto de vegetación, con islotes rocosos mar adentro.',
  },
  {
    slug: 'atardecer-mar',
    category: 'paisaje',
    small: atardecerMar480,
    large: atardecerMar750,
    alt: 'El sol se pone sobre un mar en calma y tiñe el cielo de naranja; a contraluz, las siluetas de un barco pesquero, una lancha con dos pescadores y un ave en vuelo.',
  },
  {
    slug: 'pareja-hamaca',
    category: 'gente',
    small: parejaHamaca480,
    large: parejaHamaca750,
    alt: 'Una mujer mayor hila lana a mano dentro de una casa de paredes verdes; detrás, un hombre con sombrero de paja descansa en una hamaca roja junto a un altar doméstico.',
  },
  {
    slug: 'mujer-trenzas',
    category: 'gente',
    small: mujerTrenzas480,
    large: mujerTrenzas750,
    alt: 'Retrato de una mujer mayor de largas trenzas blancas y vestido azul de flores, sentada junto a un telar del que cuelga un tejido de franjas de colores.',
  },
  {
    slug: 'dos-sapos-verdes',
    category: 'flora-y-fauna',
    small: dosSaposVerdes480,
    large: dosSaposVerdes750,
    alt: 'Dos ranas verdes de ojos claros trepadas sobre una heliconia naranja cubierta de gotas de agua, recortadas contra un fondo oscuro.',
  },
  {
    slug: 'orquidea3',
    category: 'flora-y-fauna',
    small: orquidea3480,
    large: orquidea3750,
    alt: 'Una orquídea de dos pétalos anaranjados y rojos, colgada de un tallo fino y recortada contra una hoja oscura en penumbra.',
  },
  {
    slug: 'diablo-iglesia',
    category: 'quito',
    small: diabloIglesia480,
    large: diabloIglesia750,
    alt: 'Un danzante con máscara de diablo y capa roja bordada baila de noche frente a la fachada iluminada de una iglesia barroca, rodeado de gente.',
  },
  {
    slug: 'iglesia-san-francisco',
    category: 'quito',
    small: iglesiaSanFrancisco480,
    large: iglesiaSanFrancisco750,
    alt: 'La plaza de San Francisco bajo un cielo azul intenso; en primer plano y en penumbra, la silueta de un hombre con sombrero sentado bajo un portal.',
  },
]

export const galleryCards = photographs.map(
  ({ slug, category, small, large, alt }) => ({
    slug,
    title: byCategory[category].title,
    alt,
    src: large,
    srcSet: `${small} 480w, ${large} 750w`,
    ...hrefFor(category),
  }),
)
