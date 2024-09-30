import logo from './logo.svg';
import './App.css';

function helloworld() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hello <code></code> World!
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn FindEmFood WebApp
          </a>
        </header>
      </div>
    );
  }
  
  export default helloworld;
  
