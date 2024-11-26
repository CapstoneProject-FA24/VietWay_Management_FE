import { BookingStatus, AttractionStatus, UserRole, TourStatus, PostStatus, TourTemplateStatus, PaymentStatus } from "@hooks/Statuses";

export const getAttractionStatusInfo = (statusCode) => {
  switch (statusCode) {
    case AttractionStatus.Draft:
      return { text: "Bản nháp", color: "#2b2b2b", backgroundColor: "#cbcbcb" };
    case AttractionStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#003da1", backgroundColor: "#c8f1ff" };
    case AttractionStatus.Approved:
      return { text: "Đã duyệt", color: "#0f7c00", backgroundColor: "#d3ffa4" };
    case AttractionStatus.Rejected:
      return { text: "Đã từ chối", color: "#600000", backgroundColor: "#ffb8b8" };
    default:
      return { text: "Không xác định", color: "#9E9E9E", backgroundColor: "#9E9E9E" };
  }
};

export const getTourStatusInfo = (statusCode) => {
  switch (statusCode) {
    case TourStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#4900ff", textColor: "#24007c", backgroundColor: "#bfb0ff" }; // Orange
    case TourStatus.Rejected:
      return { text: "Đã từ chối", color: "#ff9300", textColor: "#9c5a00", backgroundColor: "#ffd9a6" }; // Red
    case TourStatus.Accepted:
      return { text: "Đã duyệt", color: "#00c5e8", textColor: "#006f83", backgroundColor: "#c2f6ff" }; // Blue
    case TourStatus.Opened:
      return { text: "Đã mở", color: "#00c5e8", textColor: "#006f83", backgroundColor: "#c2f6ff" }; // Blue
    case TourStatus.Closed:
      return { text: "Đã đóng", color: "#5f5f5f", textColor: "#2b2b2b", backgroundColor: "#cbcbcb" }; // Grey
    case TourStatus.OnGoing:
      return { text: "Đang diễn ra", color: "#0059ff", textColor: "#001f5a", backgroundColor: "#b1ccff" }; // Green
    case TourStatus.Completed:
      return { text: "Đã hoàn thành", color: "#19cd00", textColor: "#0f7c00", backgroundColor: "#d3ffa4" }; // Purple
    case TourStatus.Cancelled:
      return { text: "Đã hủy", color: "#ff0000", textColor: "#600000", backgroundColor: "#ffb8b8" }; // Red
    default:
      return { text: "Không xác định", color: "#9E9E9E", textColor: "#9E9E9E", backgroundColor: "#9E9E9E" };
  }
};

export const getRole = (role) => {
  switch (role) {
    case UserRole.Customer:
      return "khach-hang";
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

export const getRoleName = (role) => {
  switch (role) {
    case UserRole.Customer:
      return "Khách hàng";
    case UserRole.Manager:
      return "Quản lý";
    case UserRole.Staff:
      return "Nhân viên";
    case UserRole.Admin:
      return "Admin";
    default:
      return "Không xác định";
  }
};

export const getPostStatusInfo = (statusCode) => {
  switch (statusCode) {
    case PostStatus.Draft:
      return { text: "Bản nháp", color: "#2b2b2b", backgroundColor: "#cbcbcb" };
    case PostStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#003da1", backgroundColor: "#c8f1ff" };
    case PostStatus.Approved:
      return { text: "Đã duyệt", color: "#0f7c00", backgroundColor: "#d3ffa4" };
    case PostStatus.Rejected:
      return { text: "Đã từ chối", color: "#600000", backgroundColor: "#ffb8b8" };
    default:
      return { text: "Không xác định", color: "#9E9E9E", backgroundColor: "#9E9E9E" };
  }
};

export const getTourTemplateStatusInfo = (statusCode) => {
  switch (statusCode) {
    case TourTemplateStatus.Draft:
      return { text: "Bản nháp", color: "#2b2b2b", backgroundColor: "#cbcbcb" };
    case TourTemplateStatus.Pending:
      return { text: "Đang chờ duyệt", color: "#003da1", backgroundColor: "#c8f1ff" };
    case TourTemplateStatus.Approved:
      return { text: "Đã duyệt", color: "#0f7c00", backgroundColor: "#d3ffa4" };
    case TourTemplateStatus.Rejected:
      return { text: "Đã từ chối", color: "#600000", backgroundColor: "#ffb8b8" };
    default:
      return { text: "Không xác định", color: "#9E9E9E", backgroundColor: "#9E9E9E" };
  }
};

export const getBookingStatusInfo = (statusCode) => {
  switch (statusCode) {
    case BookingStatus.Pending:
      return { text: "Đang chờ thanh toán", color: "#fff746" };
    case BookingStatus.Confirmed:
      return { text: "Đã thanh toán", color: "#66e3ff" };
    case BookingStatus.Completed:
      return { text: "Hoàn tất", color: "#2ee035" };
    case BookingStatus.Expired:
      return { text: "Hết hạn thanh toán", color: "#b8b8b8" };
    case BookingStatus.Cancelled:
      return { text: "Đã hủy", color: "#ff675c" };
    case BookingStatus.PendingRefund:
      return { text: "Đang chờ hoàn tiền", color: "#ff9740" };
    case BookingStatus.Refunded:
      return { text: "Đã hoàn tiền", color: "#3f6eec" };
    default:
      return { text: "Không xác định", color: "#9E9E9E" };
  }
};

export const getPaymentStatusInfo = (statusCode) => {
  switch (statusCode) {
    case PaymentStatus.Pending:
      return { text: "Chờ thanh toán", color: "#fff746", textColor: "#8f8800", backgroundColor: "#fff9b8" };
    case PaymentStatus.Paid:
      return { text: "Đã thanh toán", color: "#19cd00", textColor: "#0f7c00", backgroundColor: "#d3ffa4" };
    case PaymentStatus.Failed:
      return { text: "Thất bại", color: "#ff0000", textColor: "#600000", backgroundColor: "#ffb8b8" };
    case PaymentStatus.Refunded:
      return { text: "Đã hoàn tiền", color: "#3f6eec", textColor: "#002687", backgroundColor: "#b8d4ff" };
    default:
      return { text: "Không xác định", color: "#9E9E9E", textColor: "#424242", backgroundColor: "#E0E0E0" };
  }
};