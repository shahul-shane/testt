import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Frontpage from './pages/Frontpage';
import Upload from './pages/Upload';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
