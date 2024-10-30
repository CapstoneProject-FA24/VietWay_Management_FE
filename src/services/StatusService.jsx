import { BookingStatus, AttractionStatus, UserRole } from "@hooks/Statuses";

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Đang chờ xử lý", color: "#FFA500" }; // Orange
    case BookingStatus.Confirmed:
      return { text: "Đã xác nhận", color: "#4CAF50" }; // Green
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" }; // Red
    case BookingStatus.Completed:
      return { text: "Đã hoàn thành", color: "#2196F3" }; // Blue
    default:
      return { text: "Không xác định", color: "#9E9E9E" }; // Grey
  }
};

export const getAttractionStatusInfo = (statusCode) => {
  switch (statusCode) {
    case AttractionStatus.Draft:
      return { text: "Bản nháp", color: "grey" }; 
    case AttractionStatus.Pending:
      return { text: "Đang chờ duyệt", color: "blue" }; 
    case AttractionStatus.Approved:
      return { text: "Đã duyệt", color: "green" }; 
    case AttractionStatus.Rejected:
      return { text: "Đã từ chối", color: "red" }; 
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};

export const getRole = (role) => {
  switch (role) {
    case UserRole.Manager:
      return "quan-ly";
    case UserRole.Staff:
      return "nhan-vien";
    case UserRole.Admin:
      return "admin";
    default:
      return "Không xác định";
  }
};

// Post + Event
export const getStatusColor = (status) => { 
  switch(status) {
    case '0': return { color: 'warning', label: 'Bản nháp' };
    case '1': return { color: 'info', label: 'Chờ duyệt' };
    case '2': return { color: 'success', label: 'Đã duyệt' };
    case '3': return { color: 'error', label: 'Từ chối' };
    default: return { color: 'default', label: 'Không xác định' };
  }
};