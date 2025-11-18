import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Layout/Header';
import LightEffect from './components/Sections/Projects/LightEffect';
import Home from './pages/Home';
import CV from './pages/CV';
import './styles/globals.css';

function App() {
  return (
    <LanguageProvider>
      <Router basename="/eduardocarrera_portfolio">
        <div className="App">
          <LightEffect />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cv" element={<CV />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
