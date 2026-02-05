import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import CustomOrders from './pages/CustomOrders';
import Login from './pages/Login';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import css from './styles/css/index.css'

export default function App() {
  return (
    <div className="app">
      
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/custom-orders" element={<CustomOrders/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>

      <Footer />

    </div>
  )
}