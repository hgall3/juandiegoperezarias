// Fonts are self-hosted via @fontsource rather than fetched from Google's CDN, so
// the site makes no third-party request on load. Each import pulls in one weight's
// @font-face rule and its woff2; Vite fingerprints and emits the files into dist/.
// Only the weights _typography.scss actually asks for are imported — adding a
// `font-weight: 500` somewhere without a matching import here gets you a browser
// -synthesised fake bold, not the real cut.
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/latin-600.css'
import '@fontsource/playfair-display/latin-700.css'
import '@fontsource/work-sans/latin-300.css'
import '@fontsource/work-sans/latin-400.css'
import '@fontsource/work-sans/latin-600.css'

// Must stay ahead of component styles: those are imported below and should load
// after the globals.
import './styles/main.scss'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
