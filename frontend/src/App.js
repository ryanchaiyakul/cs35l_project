import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar.js'
import FileUpload from './components/fileUpload.js'
import HamburgerMenu from './pages/homescreen.js'
import { BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <HamburgerMenu/>
  );
}

