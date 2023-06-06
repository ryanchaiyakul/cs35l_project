import logo from './logo.svg';
import './css/App.css';
import SearchBar from './components/searchBar.js'
import FileUpload from './components/fileUpload.js'
import HamburgerMenu from './components/hamburgerMenu'
import HomeScreen from './pages/MyHomescreen.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyStats from './pages/MyStats.js';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/mystats" element={<MyStats/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;