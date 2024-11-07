import { BookingStatus, AttractionStatus, UserRole, TourStatus, PostStatus } from "@hooks/Statuses";

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
      return { text: "Bản nháp", color: "#2b2b2b", backgroundColor: "#cbcbcb" }; 
    case AttractionStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#24007c", backgroundColor: "#bfb0ff"  }; 
    case AttractionStatus.Approved:
      return { text: "Đã duyệt", color: "#006f83", backgroundColor: "#c2f6ff" }; 
    case AttractionStatus.Rejected:
      return { text: "Đã từ chối", color: "#9c5a00", backgroundColor: "#ffd9a6" }; 
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};

export const getTourStatusInfo = (statusCode) => {
  switch (statusCode) {
    case TourStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#4900ff", textColor: "#24007c", backgroundColor: "#bfb0ff" }; // Orange
    case TourStatus.Rejected:
      return { text: "Đã từ chối", color: "#ff9300", textColor: "#9c5a00", backgroundColor: "#ffd9a6" }; // Red
    case TourStatus.Scheduled:
      return { text: "Đã duyệt", color: "#00c5e8", textColor: "#006f83", backgroundColor: "#c2f6ff" }; // Blue
    case TourStatus.Closed:
      return { text: "Đã đóng", color: "#5f5f5f", textColor: "#2b2b2b", backgroundColor: "#cbcbcb" }; // Grey
    case TourStatus.OnGoing:
      return { text: "Đang diễn ra", color: "#0059ff", textColor: "#001f5a", backgroundColor: "#b1ccff" }; // Green
    case TourStatus.Completed:
      return { text: "Đã hoàn thành", color: "#19cd00", textColor: "#0f7c00", backgroundColor: "#d3ffa4" }; // Purple
    case TourStatus.Cancelled:
      return { text: "Đã hủy", color: "#ff0000", textColor: "#600000", backgroundColor: "#ffb8b8" }; // Red
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
    case PostStatus.Draft: return { color: 'warning', label: 'Bản nháp' };
    case PostStatus.Pending: return { color: 'info', label: 'Chờ duyệt' };
    case PostStatus.Approved: return { color: 'success', label: 'Đã duyệt' };
    case PostStatus.Rejected: return { color: 'error', label: 'Từ chối' };
    default: return { color: 'default', label: 'Không xác định' };
  }
};