// The site's content, kept apart from anything that displays it.
//
// The navbar builds its menus from these lists, and the section pages will read
// the same arrays, so a title is written once and can't drift between the menu
// and the page it points at.
//
// Entries carry the shape the content actually has rather than the shape a menu
// wants — a book has a title and a subtitle whether or not the navbar shows one.
// Deciding what to display is the job of whatever renders it.
//
// When entries grow fields of their own — a slug, a cover, a date, a body — this
// is the natural place to split, one module per collection.

export const photoEssays = [
  { title: 'El hielero del Chimborazo' },
  { title: 'Sionas del Cuyabeno' },
  { title: 'Fuego cruzado' },
  { title: 'Ojo con el tigre' },
]

// The slug is the unaccented, hyphenated form the URL will use once each
// category has its own page, and it is what galleryCards.jsx tags a photograph
// with — so a card takes its label from the title here rather than repeating
// it, and renaming a category renames it in the navbar and on the cards at once.
export const galleries = [
  { slug: 'paisaje', title: 'Paisaje' },
  { slug: 'gente', title: 'Gente' },
  { slug: 'flora-y-fauna', title: 'Flora y fauna' },
  { slug: 'quito', title: 'Quito' },
]

export const videos = [
  { title: 'Ecuador rostros del agua' },
  { title: 'Yasuní' },
  { title: 'Ecuador la vida en estado puro' },
  { title: 'Quito, la ciudad imaginaria' },
  { title: 'Relatos de un caminar' },
]

export const exhibitions = [{ title: 'Miradas' }]

export const stories = [
  { title: 'La niña del vestido amarillo' },
  { title: 'Caminos de identidad' },
  { title: 'De ángeles y otras criaturas emplumadas' },
  { title: 'El tigre del Yasuní' },
  { title: 'Camino de piedra' },
  { title: 'Los nombres y las estrellas en Warchipas' },
]

// Subtitles are the half after the first dash in the titles Juan Diego supplied.
// Only the first dash separates: "1934-1980" belongs to a subtitle rather than
// being another split point.
// Slugs, like the gallery categories, are the unaccented hyphenated form each
// book's own page will use, and what homeBooks.jsx pairs a cover with — so a
// title is written here and nowhere else.
export const books = [
  {
    slug: 'miradas',
    title: 'Miradas',
    subtitle: 'Por los caminos de un país oculto',
  },
  {
    slug: 'los-restos-de-viaje',
    title: 'Los restos de viaje',
    subtitle: 'Días de cámara',
  },
  {
    slug: 'sobre-vivir',
    title: 'Sobre vivir',
    subtitle: 'Huella nefasta de Texaco en Ecuador',
  },
  {
    slug: 'sapos-mariposas-y-orquideas',
    title: 'Sapos mariposas y orquídeas en la línea equinoccial',
  },
  {
    slug: 'amnesia',
    title: 'Amnesia',
    subtitle:
      'Tras las huellas de unos fotógrafos olvidados… En busca de un país perdido',
  },
  {
    slug: 'la-mirada-silenciosa',
    title: 'La mirada silenciosa',
    subtitle: 'Gottfried Hirtz fotografías 1934-1980',
  },
  {
    slug: 'el-rio-de-las-palabras',
    title: 'El río de las palabras',
    subtitle: 'Días de cámara',
  },
]
