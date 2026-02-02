import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/components/Navbar';
import css from './styles/css/Home.css'

export default function App() {
  return (
    <div className="app">
      
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </main>
    </div>
  )
}