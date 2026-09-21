import jefes900 from '../assets/hero/jefes-indigenas-900.jpg'
import jefes1500 from '../assets/hero/jefes-indigenas-1500.jpg'
import burro900 from '../assets/hero/burro-flores-900.jpg'
import burro1500 from '../assets/hero/burro-flores-1500.jpg'
import cotopaxi900 from '../assets/hero/volcan-cotopaxi-900.jpg'
import cotopaxi1500 from '../assets/hero/volcan-cotopaxi-1500.jpg'
import mariposa900 from '../assets/hero/mariposa-900.jpg'
import mariposa1500 from '../assets/hero/mariposa-1500.jpg'
import camino900 from '../assets/hero/camino-de-piedra-900.jpg'
import camino1500 from '../assets/hero/camino-de-piedra-1500.jpg'

// The homepage carousel. Reorder or add entries here and the hero follows —
// nothing about the slides is written into the markup.
//
// `to` is where the button goes today; `eventualTo` is where it should go once
// that page exists. They differ because none of the detail pages are built yet,
// and a call to action this size must not land on a 404. When the page ships,
// move the value across.
//
// `mobileFocus` shifts the crop on a phone, where a 3:2 photograph is squeezed
// into a tall frame and the subject can fall out of view. It is an
// `object-position` on the horizontal axis: below 50% the photo moves right,
// above it moves left. Desktop is always centred.
//
// The copy here is editorial and deliberately separate from src/content/collections.jsx,
// even where the words overlap: "Camino de Piedra" is a hero headline written for
// this image, while the entry in `stories` is a title in a list. They are free to
// diverge, so they aren't shared.

export const heroSlides = [
  {
    id: 'jefes-indigenas',
    src: jefes1500,
    srcSet: `${jefes900} 900w, ${jefes1500} 1500w`,
    alt: 'Retrato de un anciano siona con pintura facial roja y vincha blanca; detrás, un hombre más joven con corona de plumas verdes, junto al río.',
    breadcrumb: 'Libro Miradas',
    title: 'Los Sionas del Cuyabeno',
    subtitle:
      'El abuelo emplumado navegó por los bosques de la identidad y la tradición.',
    action: {
      label: 'Leer historia',
      to: '/foto-ensayo',
      eventualTo: '/foto-ensayo/sionas-del-cuyabeno',
    },
  },
  {
    id: 'burro-flores',
    src: burro1500,
    srcSet: `${burro900} 900w, ${burro1500} 1500w`,
    alt: 'Un burro cargado de ramas de flores amarillas camina por un sendero de tierra al atardecer, seguido de cerca por un perro claro.',
    breadcrumb: 'Libro Miradas',
    title: 'El Camino al Monte',
    subtitle: 'Alrededores de Cuatro Esquinas en la provincia del Chimborazo',
    mobileFocus: '35%',
    action: {
      label: 'Ir al libro',
      to: '/libros',
      eventualTo: '/libros/miradas',
    },
  },
  {
    id: 'volcan-cotopaxi',
    src: cotopaxi1500,
    srcSet: `${cotopaxi900} 900w, ${cotopaxi1500} 1500w`,
    alt: 'Vista aérea del cono nevado del Cotopaxi emergiendo sobre un mar de nubes, bajo un cielo azul intenso.',
    breadcrumb: 'Libro Miradas',
    title: 'Geografías del Alma',
    subtitle: 'Un Ecuador poco conocido y olvidado al compás del tiempo',
    mobileFocus: '35%',
    action: {
      label: 'Ir al libro',
      to: '/libros',
      eventualTo: '/libros/miradas',
    },
  },
  {
    id: 'mariposa',
    src: mariposa1500,
    srcSet: `${mariposa900} 900w, ${mariposa1500} 1500w`,
    alt: 'Primer plano de una mariposa de alas negras con franjas rojas y anaranjadas, posada sobre flores rosadas.',
    breadcrumb: 'Libro Sapos, mariposas y orquídeas en la línea equinoccial',
    title: 'Mariposas de colores',
    subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    action: {
      label: 'Ir al libro',
      to: '/libros',
      eventualTo: '/libros/sapos-mariposas-y-orquideas-en-la-linea-equinoccial',
    },
  },
  {
    id: 'camino-de-piedra',
    src: camino1500,
    srcSet: `${camino900} 900w, ${camino1500} 1500w`,
    alt: 'Camino empedrado que se interna entre agaves, cactus y un muro de piedra, con las montañas al fondo.',
    breadcrumb: 'Libro Amnesia',
    title: 'Camino de Piedra',
    mobileFocus: '65%',
    subtitle:
      'Collar de perlas de la tierra; ruta de antes y de siempre hilvanada con hilos de memoria por manos antiguas, endurecidas de viento, trabajo y campo.',
    action: {
      label: 'Leer historia',
      to: '/historias',
      eventualTo: '/historias/camino-de-piedra',
    },
  },
]
