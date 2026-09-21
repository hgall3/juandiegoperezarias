import { books } from './collections.jsx'

import miradasCover from '../assets/books/miradas-600.jpg'
import losRestosCover from '../assets/books/los-restos-del-viaje-600.jpg'
import sobrevivirCover from '../assets/books/sobrevivir-600.jpg'
import saposCover from '../assets/books/sapos-mariposas-orquideas-600.jpg'

// The books shown in the homepage's Libros band: one featured above, three on
// the black below it.
//
// Titles and subtitles are not written here. Each entry names a book by slug
// and the words come from `books` in collections.jsx, the same list the navbar
// menu reads, so correcting a title in one place corrects it everywhere. Note
// that the fourth book genuinely has no subtitle — its whole name is one long
// line — so whatever renders these has to cope with that rather than assume one.

const bySlug = Object.fromEntries(books.map((book) => [book.slug, book]))

// The per-book pages do not exist yet, so every link lands on the section index
// rather than a 404, carrying the path it will eventually take. The same
// pairing the hero slides, the featured bands and the gallery cards use.
const entry = (slug, cover) => {
  const book = bySlug[slug]

  return {
    slug,
    title: book.title,
    subtitle: book.subtitle,
    cover,
    href: '/libros',
    eventualHref: `/libros/${slug}`,
  }
}

export const featuredBook = {
  ...entry('miradas', miradasCover),

  // The band's own presentation of the book rather than part of the book's
  // record — the shelf entries below carry no equivalent, and the navbar has no
  // use for it.
  byline: 'Juan Diego Perez Arias',
  blurb:
    'Un caminar por las geografías del paisaje y del alma de un Ecuador poco conocido y olvidado: encuentros con héroes y heroínas casi invisibles, tocados de humanidad e identidad, contados con luz, color, texturas y sombras.',
}

export const shelfBooks = [
  entry('los-restos-de-viaje', losRestosCover),
  entry('sobre-vivir', sobrevivirCover),
  entry('sapos-mariposas-y-orquideas', saposCover),
]
