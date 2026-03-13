import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Archive from './pages/Archive'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="container">
          <Link to="/" className="logo-link">
        <img src="/assets/kjcf-Logo.png" alt="AIKJCF" className="logo" />
        <h1 className="org-name">All India Khasi Jaintia Christian Fellowship</h1>
          </Link>
          <Link to="/">Home</Link>
          <Link to="/archive">Archive</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes> 
      <footer>
        <Footer />
      </footer>
    </BrowserRouter>
  )
}

export default App