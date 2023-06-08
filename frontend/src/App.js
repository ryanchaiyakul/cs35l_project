import './css/App.css';
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