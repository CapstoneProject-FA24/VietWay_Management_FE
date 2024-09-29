import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerHomepage from '@pages/ManagerHomepage.jsx';
import ManageCompany from '@pages/admin/ManageCompany.jsx';
import ManageCustomer from '@pages/manager/ManageCustomer.jsx';
import ManageManager from '@pages/admin/ManageManager.jsx';
import Login from '@pages/authen/Login.jsx'
import ManageCompanyStaff from '@pages/manager/ManageCompanyStaff.jsx';
import ManageAttraction from '@pages/manager/attraction/ManageAttraction.jsx';
import ManageTourTemplate from '@pages/manager/ManageTourTemplate.jsx';
import AddAttraction from '@pages/manager/attraction/AddAttraction.jsx';
import UpdateAttraction from '@pages/manager/attraction/UpdateAttraction.jsx';
import AttractionDetail from '@pages/manager/attraction/AttractionDetail.jsx';
import ManageTour from '@pages/staff/tour/ManageTour.jsx';
import CreateTour from '@pages/staff/template/CreateTour.jsx';
import ListTourTemplate from '@pages/staff/template/ListTourTemplate.jsx';

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
        <Route path="/quan-ly/diem-tham-quan/them" element={<AddAttraction/>} />
        <Route path="/quan-ly/diem-tham-quan/sua/:id" element={<UpdateAttraction/>} />
        <Route path="/quan-ly/diem-tham-quan/chi-tiet/:id" element={<AttractionDetail/>} />
        <Route path="/quan-ly/tour-mau" element={<ManageTourTemplate/>} />
        <Route path="/nhan-vien/tour-du-lich" element={<ManageTour/>} />
        <Route path="/nhan-vien/tour-mau/tao-tour/:id" element={<CreateTour/>} />
        <Route path="/nhan-vien/tour-mau" element={<ListTourTemplate/>} />
      </Routes>
    </Router>
  );
};

export default App;
