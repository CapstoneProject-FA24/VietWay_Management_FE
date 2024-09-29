import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerHomepage from '@pages/ManagerHomepage.jsx';
import ManageCompany from '@pages/admin/ManageCompany.jsx';
import ManageCustomer from '@pages/manager/ManageCustomer.jsx';
import ManageManager from '@pages/admin/ManageManager.jsx';
import Login from '@pages/authen/Login.jsx'
import ManageCompanyStaff from '@pages/manager/ManageCompanyStaff.jsx';
import ManageAttraction from '@pages/staff/attraction/ManageAttraction.jsx';
import ManageTourTemplate from '@pages/staff/tourTemplate/ManageTourTemplate.jsx';
import CreateAttraction from '@pages/staff/attraction/CreateAttraction.jsx';
import UpdateAttraction from '@pages/staff/attraction/UpdateAttraction.jsx';
import AttractionDetail from '@pages/staff/attraction/AttractionDetail.jsx';
import TourTemplateDetail from '@pages/staff/tourTemplate/TourTemplateDetail.jsx';
import CreateTourTemplate from '@pages/staff/tourTemplate/CreateTourTemplate.jsx';
import UpdateTourTemplate from '@pages/staff/tourTemplate/UpdateTourTemplate.jsx';

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
        <Route path="/nhan-vien/diem-tham-quan" element={<ManageAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/them" element={<CreateAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/sua/:id" element={<UpdateAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/chi-tiet/:id" element={<AttractionDetail/>} />
        <Route path="/nhan-vien/tour-mau" element={<ManageTourTemplate/>} />
        <Route path="/nhan-vien/tour-mau/chi-tiet/:id" element={<TourTemplateDetail/>} />
        <Route path="/nhan-vien/tour-mau/them" element={<CreateTourTemplate/>} />
        <Route path="/nhan-vien/tour-mau/sua/:id" element={<UpdateTourTemplate/>} />
      </Routes>
    </Router>
  );
};

export default App;
