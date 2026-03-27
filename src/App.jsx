  import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
  import Home from './pages/Home'
  import Admin from './pages/Admin'
  import Login from './pages/Login'
  import Footer from './components/Footer'
  import Dropdown from './components/Dropdown'
  import About from './pages/About'
  import History from './pages/History'
  import NaThiar from './pages/NaThiar'
  import Devotions from './pages/Devotions'
  import Testimony from './pages/Testimony'
  import Gallery from './pages/Gallery'
  import Announcement from './pages/Announcement'
  import Archive from './pages/Archive'


  function App() {
    return (
      <BrowserRouter>
        <nav>
          <div className="container">
            <Link to="/" className="logo-link">
          <img src="/assets/kjcf-Logo.png" alt="AIKJCF" className="logo" />
          <h1 className="org-name">All India Khasi Jaiñtia Christian Fellowship</h1>
            </Link>
            <Link to="/">Home</Link>
            <Link to="/Archive">Archive</Link>
                  <div className="nav-links">
                      <Dropdown
                        items={[
                          { text: 'About Us', link: '/about' },
                          { text: 'History', link: '/history' },
                          { text: 'Na Thiar', link: '/nathiar' },
                          { text: 'Devotions', link: '/devotions' },
                          { text: 'Testimony', link: '/testimony' },  
                          { text: 'Gallery', link: '/gallery' },
                          { text: 'Admin', link: '/admin'},
                          { text: 'Announcement', link: '/announcement' },
                        ]}
                      />
                </div>
          </div>
        </nav>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/Archive" element={<Archive />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/About" element={<About />} />
          <Route path="/" element={<About />} />
          <Route path="/About" element={<About />} />
          <Route path="/History" element={<History />} />
          <Route path="/NaThiar" element={<NaThiar />} />
          <Route path="/Devotions" element={<Devotions />} />
          <Route path="/Testimony" element={<Testimony />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Announcement" element={<Announcement />} />
        </Routes> 
        <footer>
          <Footer />
        </footer>
      </BrowserRouter>
    )
  }

  export default App