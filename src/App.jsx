import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerHomepage from '@pages/ManagerHomepage.jsx';
import ManageCompany from '@pages/admin/ManageCompany.jsx';
import ManageCustomer from '@pages/manager/ManageCustomer.jsx';
import ManageManager from '@pages/admin/ManageManager.jsx';
import Login from '@pages/authen/Login.jsx'
import ManageCompanyStaff from '@pages/manager/ManageCompanyStaff.jsx';
import ManageAttraction from '@pages/manager/ManageAttraction.jsx';
import ManageTourTemplate from '@pages/manager/ManageTourTemplate.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/" element={<Navigate to="/dang-nhap" />} />
        <Route path="*" element={<Navigate to="/dang-nhap" />} />
        <Route path="/admin/cong-ty" element={<ManageCompany />} />
        <Route path="/quan-ly/nhan-vien" element={<ManageCompanyStaff />} />
        <Route path="/quan-ly/khach-hang" element={<ManageCustomer />} />
        <Route path="/admin/quan-ly" element={<ManageManager />} />
        <Route path="/dang-nhap" element={<Login/>} />
        <Route path="/quan-ly/diem-tham-quan" element={<ManageAttraction/>} />
        <Route path="/quan-ly/tour-mau" element={<ManageTourTemplate/>} />
      </Routes>
    </Router>
  );
};

export default App;
