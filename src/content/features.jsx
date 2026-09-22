import hielo900 from '../assets/features/hielo-900.jpg'
import hielo1355 from '../assets/features/hielo-1355.jpg'
import jdTrasCamara900 from '../assets/features/jd-tras-camara-900.jpg'
import jdTrasCamara1500 from '../assets/features/jd-tras-camara-1500.jpg'

// The featured work below the homepage hero. Each entry is one band: a
// photograph on one side, the words on the other.
//
// The page alternates the sides by position — the first entry puts its photo on
// the right, the second on the left, and so on down the list. Nothing here says
// which side it is on, so reordering the array reorders the page without
// leaving two photographs stranded on the same edge.
//
// `to` is where the button goes today and `eventualTo` where it belongs once
// that page exists, the same pair the hero slides use. The essay's own page is
// not built, so the link lands on the section index rather than a 404. When the
// page ships, move the value across.

export const features = [
  {
    id: 'el-hielero-del-chimborazo',
    src: hielo1355,
    srcSet: `${hielo900} 900w, ${hielo1355} 1355w`,
    // A portrait photograph in a 4:3 frame, and Baltasar is near the top of it:
    // the default centre crop takes his head off. This holds the crop to the
    // top instead. The file is not cropped to 4:3 the way the landscape ones
    // are, because the part that would be thrown away is where he is.
    focus: 'center top',
    alt: 'Baltasar Ushca, hielero del Chimborazo, arrodillado en la ladera del volcán, corta con un azadón un bloque de hielo del glaciar cubierto de tierra.',
    breadcrumb: 'Libro Miradas — Flanco oriental del Chimborazo',
    // \u00A0 is a no-break space. It ties "del" to "Chimborazo" so the title
    // can only break in one place, giving "El hielero" / "del Chimborazo"
    // rather than leaving "del" stranded at the end of the first line.
    title: 'El hielero del\u00A0Chimborazo',
    text: 'Baltasar Ushca, nieto del Chimborazo, sube a donde su abuelo para cosechar hielo de sus entrañas, siguiendo el mismo camino de frío y de sudor que siguieron su padre, sus abuelos, sus bisabuelos y todos los demás.',
    action: {
      label: 'Leer más',
      to: '/foto-ensayo',
      eventualTo: '/foto-ensayo/el-hielero-del-chimborazo',
    },
  },
]

// The band at the foot of the homepage, introducing the author. Its own export
// rather than another entry in `features`: it is not featured work, it sits
// below the Libros band instead of in the run above it, and being in that array
// would give it a turn in the alternation it has no part in.
//
// It is the same shape, though, because it is the same component — a photograph
// beside a piece of writing.
//
// The name carries its accent here — "Pérez" — which is the exception to the
// project's rule, not a slip. Everywhere else it stays "Perez": the repository,
// the domain, page titles, meta descriptions and body copy. In the biography it
// matters, so the heading below is the one place that spells it in full.
export const biographyBand = {
  id: 'biografia',
  src: jdTrasCamara1500,
  srcSet: `${jdTrasCamara900} 900w, ${jdTrasCamara1500} 1500w`,
  alt: 'Fotografía en blanco y negro: tres niños descalzos, de pie sobre un montículo de tierra, se inclinan imitando la postura de Juan Diego Pérez Arias, que filma encorvado tras una cámara de vídeo sobre trípode, con colinas al fondo.',
  breadcrumb: 'Biografía',
  title: 'Juan Diego Pérez Arias',
  text: 'Creció en el campo en Cunucbamba, cerca de Tumbaco. Entre bosques de algarrobo y eucalipto; rodeado de huiracchuros, quilicos, guabos, naranjos y pencos siempre respiró naturaleza, aire puro, estrellas y libros.',
  // No `eventualTo` here: unlike the essay above, this page is built.
  action: {
    label: 'Leer más',
    to: '/biografia',
  },
}
