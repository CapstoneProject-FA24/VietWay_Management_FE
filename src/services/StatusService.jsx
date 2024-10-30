import { BookingStatus, AttractionStatus, UserRole, TourStatus } from "@hooks/Statuses";

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

export const getTourStatusInfo = (statusCode) => {
  switch (statusCode) {
    case TourStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#FFA500" }; // Orange
    case TourStatus.Rejected:
      return { text: "Đã từ chối", color: "#F44336" }; // Red
    case TourStatus.Scheduled:
      return { text: "Đã duyệt", color: "#2196F3" }; // Blue
    case TourStatus.Closed:
      return { text: "Đã đóng", color: "#9E9E9E" }; // Grey
    case TourStatus.OnGoing:
      return { text: "Đang diễn ra", color: "#4CAF50" }; // Green
    case TourStatus.Completed:
      return { text: "Đã hoàn thành", color: "#673AB7" }; // Purple
    case TourStatus.Cancelled:
      return { text: "Đã hủy", color: "#F44336" }; // Red
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