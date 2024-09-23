import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerHomepage from '@pages/ManagerHomepage.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/trang-chu" element={<ManagerHomepage />} />
        <Route path="/" element={<Navigate to="/trang-chu" />} />
        <Route path="*" element={<Navigate to="/trang-chu" />} />
      </Routes>
    </Router>
  );
};

export default App;
