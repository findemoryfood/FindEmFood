//import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsSidebar from './components/SettingsSidebar';
import AddEventPopUp from './components/AddEventPopUp';
import { SettingsProvider } from './SettingsContext';
import './styles/App.css';

function App() {
  return(
    <SettingsProvider>
      <Router>
        <div >
            <SettingsSidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
            <AddEventPopUp />
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
