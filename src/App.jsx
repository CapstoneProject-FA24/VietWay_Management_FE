import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManagerDashboard from '@pages/manager/ManagerDashboard.jsx';
import ManageCustomer from '@pages/manager/ManageCustomer.jsx';
import ManageManager from '@pages/admin/ManageManager.jsx';
import Login from '@pages/authen/Login.jsx'
import ManageStaff from '@pages/manager/ManageStaff.jsx';
import ManageTour from '@pages/staff/tour/ManageTour.jsx';
import CreateTour from '@pages/staff/tour/CreateTour.jsx';
import ManageAttraction from '@pages/staff/attraction/ManageAttraction.jsx';
import ManageTourTemplate from '@pages/staff/tourTemplate/ManageTourTemplate.jsx';
import CreateAttraction from '@pages/staff/attraction/CreateAttraction.jsx';
import AttractionDetail from '@pages/staff/attraction/AttractionDetail.jsx';
import TourTemplateDetail from '@pages/staff/tourTemplate/TourTemplateDetail.jsx';
import CreateTourTemplate from '@pages/staff/tourTemplate/CreateTourTemplate.jsx';
import ManagerManageTourTemplate from '@pages/manager/tourTemplate/ManagerManageTourTemplate.jsx';
import ManagerTourTemplateDetail from '@pages/manager/tourTemplate/ManagerTourTemplateDetail.jsx';
import ManagerManageAttraction from '@pages/manager/attraction/ManagerManageAttraction.jsx';
import ManagerAttractionDetail from '@pages/manager/attraction/ManagerAttractionDetail.jsx';
import ManagerManageProvince from '@pages/manager/province/ManagerManageProvince.jsx';
import ListApprovedTourTemplate from "@pages/staff/tour/ListApprovedTourTemplate.jsx";
import ManagerProfile from '@pages/manager/ManagerProfile.jsx';
import StaffProfile from '@pages/staff/StaffProfile.jsx';
import CreatePost from '@pages/staff/post/CreatePost.jsx';
import PostDetail from '@pages/staff/post/PostDetail.jsx';
import ManagePost from '@pages/staff/post/ManagePost.jsx';
import ManagerManageTour from '@pages/manager/tour/ManagerManageTour.jsx';
import ManagerTourDetail from '@pages/manager/tour/ManagerTourDetail.jsx';
import TourDetail from '@pages/staff/tour/TourDetail.jsx';
import ManageCategory from '@pages/manager/category/ManageCategory.jsx';
import ManagerManagePost from '@pages/manager/post/ManagerManagePost.jsx';
import ManagerPostDetail from '@pages/manager/post/ManagerPostDetail.jsx';
import ManageBooking from '@pages/manager/booking/ManageBooking.jsx';
import ManageBookingDetail from '@pages/manager/booking/ManageBookingDetail.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/" element={<Navigate to="/dang-nhap" />} />
        <Route path="*" element={<Navigate to="/dang-nhap" />} />
        <Route path="/admin/quan-ly" element={<ManageManager />} />

        <Route path="/quan-ly/nhan-vien" element={<ManageStaff />} />
        <Route path="/quan-ly/khach-hang" element={<ManageCustomer />} />
        <Route path="/quan-ly/tour-mau" element={<ManagerManageTourTemplate/>} />
        <Route path="/quan-ly/tour-mau/chi-tiet/:id" element={<ManagerTourTemplateDetail/>} />
        <Route path="/quan-ly/diem-tham-quan" element={<ManagerManageAttraction/>} />
        <Route path="/quan-ly/diem-tham-quan/chi-tiet/:id" element={<ManagerAttractionDetail/>} />
        <Route path="/quan-ly/tinh-thanh" element={<ManagerManageProvince/>} />
        <Route path="/quan-ly/thong-tin-tai-khoan" element={<ManagerProfile />} />
        <Route path="/quan-ly/tour-du-lich" element={<ManagerManageTour />} />
        <Route path="/quan-ly/tour-du-lich/chi-tiet/:id" element={<ManagerTourDetail />} />
        <Route path="/quan-ly/danh-muc" element={<ManageCategory />} />
        <Route path="/quan-ly/bai-viet" element={<ManagerManagePost />} />
        <Route path="/quan-ly/bai-viet/chi-tiet/:id" element={<ManagerPostDetail />} />
        <Route path="/quan-ly/dashboard" element={<ManagerDashboard />} />
        <Route path="/quan-ly/booking" element={<ManageBooking />} />
        <Route path="/quan-ly/booking/chi-tiet/:id" element={<ManageBookingDetail />} />

        <Route path="/nhan-vien/diem-tham-quan" element={<ManageAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/them" element={<CreateAttraction/>} />
        <Route path="/nhan-vien/diem-tham-quan/chi-tiet/:id" element={<AttractionDetail/>} />
        <Route path="/nhan-vien/tour-mau" element={<ManageTourTemplate/>} />
        <Route path="/nhan-vien/tour-mau/chi-tiet/:id" element={<TourTemplateDetail/>} />
        <Route path="/nhan-vien/tour-mau/them" element={<CreateTourTemplate/>} />
        <Route path="/nhan-vien/tour-du-lich" element={<ManageTour />} />
        <Route path="/nhan-vien/tour-du-lich/chi-tiet/:id" element={<TourDetail />} />
        <Route path="/nhan-vien/tour-du-lich/tour-mau-duoc-duyet" element={<ListApprovedTourTemplate />} />
        <Route path="/nhan-vien/tour-du-lich/tour-mau-duoc-duyet/tao-tour/:id" element={<CreateTour />} />
        <Route path="/nhan-vien/bai-viet" element={<ManagePost />} />
        <Route path="/nhan-vien/bai-viet/chi-tiet/:id" element={<PostDetail />} />
        <Route path="/nhan-vien/thong-tin-tai-khoan" element={<StaffProfile />} />
        <Route path="/nhan-vien/bai-viet/them" element={<CreatePost />} />
      </Routes>
    </Router>
  );
};

export default App;
