import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerHomepage from '@pages/ManagerHomepage.jsx';
import ManageCompany from '@pages/admin/ManageCompany.jsx';
import ManageCustomer from '@pages/manager/ManageCustomer.jsx';
import ManageManager from '@pages/admin/ManageManager.jsx';
import Login from '@pages/authen/Login.jsx'
import ManageCompanyStaff from '@pages/manager/ManageCompanyStaff.jsx';
import ManageTour from '@pages/staff/tour/ManageTour.jsx';
import CreateTour from '@pages/staff/tour/CreateTour.jsx';
import ManageAttraction from '@pages/staff/attraction/ManageAttraction.jsx';
import ManageTourTemplate from '@pages/staff/tourTemplate/ManageTourTemplate.jsx';
import CreateAttraction from '@pages/staff/attraction/CreateAttraction.jsx';
import UpdateAttraction from '@pages/staff/attraction/UpdateAttraction.jsx';
import AttractionDetail from '@pages/staff/attraction/AttractionDetail.jsx';
import TourTemplateDetail from '@pages/staff/tourTemplate/TourTemplateDetail.jsx';
import CreateTourTemplate from '@pages/staff/tourTemplate/CreateTourTemplate.jsx';
import UpdateTourTemplate from '@pages/staff/tourTemplate/UpdateTourTemplate.jsx';
import ManagerManageTourTemplate from '@pages/manager/tourTemplate/ManagerManageTourTemplate.jsx';
import ManagerTourTemplateDetail from '@pages/manager/tourTemplate/ManagerTourTemplateDetail.jsx';
import ManagerManageAttraction from '@pages/manager/attraction/ManagerManageAttraction.jsx';
import ManagerAttractionDetail from '@pages/manager/attraction/ManagerAttractionDetail.jsx';

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
        <Route path="/nhan-vien/tour-du-lich" element={<ManageTour/>} />
        <Route path="/nhan-vien/tour-mau/tao-tour/:id" element={<CreateTour/>} />
        <Route path="/nhan-vien/diem-tham-quan" element={<ManageAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/them" element={<CreateAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/sua/:id" element={<UpdateAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/chi-tiet/:id" element={<AttractionDetail/>} />
        <Route path="/nhan-vien/tour-mau" element={<ManageTourTemplate/>} />
        <Route path="/nhan-vien/tour-mau/chi-tiet/:id" element={<TourTemplateDetail/>} />
        <Route path="/nhan-vien/tour-mau/them" element={<CreateTourTemplate/>} />
        <Route path="/nhan-vien/tour-mau/sua/:id" element={<UpdateTourTemplate/>} />
        <Route path="/quan-ly/tour-mau" element={<ManagerManageTourTemplate/>} />
        <Route path="/quan-ly/tour-mau/chi-tiet/:id" element={<ManagerTourTemplateDetail/>} />
        <Route path="/quan-ly/diem-tham-quan" element={<ManagerManageAttraction/>} />
        <Route path="/quan-ly/diem-tham-quan/chi-tiet/:id" element={<ManagerAttractionDetail/>} />
      </Routes>
    </Router>
  );
};

export default App;
