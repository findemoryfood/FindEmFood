import logo from '../assets/logo.png';
import '../styles/App.css';

function Settings() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hello <code></code> World!
          </p>
          <a
            className="App-link"
          >
            Learn FindEmFood WebApp
          </a>
        </header>
      </div>
    );
  }

  export default Settings;