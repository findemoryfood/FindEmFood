//import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsSidebar from './components/SettingsSidebar';
import AddEventPopUp from './components/AddEventPopUp';
import { SettingsProvider } from './SettingsContext';
import './styles/App.css';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import GPS from './GPS';
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';

function App() {
  return(
    <SettingsProvider>
      <Router>
        <div >
            <SettingsSidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
            <AddEventPopUp />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/GPS" element={<GPS />} />
              <Route path="/FoodList" element={<FoodList />} /> 
              <Route path="/OrgSignIn" element={<OrgSignIn />} />
            </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}
export default App;
