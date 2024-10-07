import logo from './logo.svg';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import GPS from './GPS';
import FoodList from './components/FoodList';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/GPS" element={<GPS />} />
          <Route path="/FoodList" element={<FoodList />} />
        </Routes>
      </div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            HELLO CS 370 <code></code>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome to FindEmFood
          </a>
        </header>
      </div>
    </Router>
  );
}

export default App;
