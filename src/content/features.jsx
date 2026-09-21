import baltazar900 from '../assets/features/baltazar-900.jpg'
import baltazar1500 from '../assets/features/baltazar-1500.jpg'

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
    src: baltazar1500,
    srcSet: `${baltazar900} 900w, ${baltazar1500} 1500w`,
    alt: 'Baltasar Ushca, hielero del Chimborazo, con sombrero de fieltro y bufanda turquesa sobre un poncho rojo, en la ladera del volcán; detrás, sus mulas entre la niebla.',
    breadcrumb: 'Libro Miradas — Flanco oriental del Chimborazo',
    title: 'El Hielero del Chimborazo',
    text: 'Baltasar Ushca, nieto del Chimborazo, sube a donde su abuelo para cosechar hielo de sus entrañas, siguiendo el mismo camino de frío y de sudor que siguieron su padre, sus abuelos, sus bisabuelos y todos los demás.',
    action: {
      label: 'Leer más',
      to: '/foto-ensayo',
      eventualTo: '/foto-ensayo/el-hielero-del-chimborazo',
    },
  },
]
