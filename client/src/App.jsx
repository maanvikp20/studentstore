import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';

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