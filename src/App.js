import logo from './logo.svg';
import './styles/App.css';
import FoodList from './components/FoodList';
import { app } from './firebaseConfig';
//import helloworld from './helloworld.js';

function App() {
  return (
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
  );
}

export default App;
