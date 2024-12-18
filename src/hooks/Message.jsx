export const messages = [
    // HTTP Status codes
    {
        code: '',
        httpStatus: 404,
        message: `Không tìm thấy kết quả phù hợp`
    },
    {
        code: '',
        httpStatus: 401,
        message: `Vui lòng đăng nhập để {object}.`
    },
    {
        code: '',
        httpStatus: 403,
        message: `Bạn không thể sử dụng chức năng này.`
    },
    {
        code: '',
        httpStatus: 429,
        message: `Bạn đã gửi yêu cầu quá nhiều lần. Xin hãy thử lại sau.`
    },
    {
        code: '',
        httpStatus: 500,
        message: `Đã có lỗi xảy ra. Vui lòng thử lại sau.`
    },

    // Success messages
    {
        code: '',
        httpStatus: 200,
        message: `Tạo {object} thành công`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Cập nhật {object} thành công.`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Xóa {object} thành công.`
    },

    {
        code: 'UNAUTHORIZED',
        httpStatus: 401,
        message: `Bạn không có quyền thực hiện thao tác này.`
    },
    {
        code: 'NOT_EXIST_REVIEW',
        httpStatus: 404,
        message: `Không tìm thấy đánh giá.`
    },
    {
        code: 'NOT_EXIST_ATTRACTION',
        httpStatus: 404,
        message: `Không tìm thấy điểm tham quan.`
    },
    {
        code: 'EXISTED_CATEGORY',
        httpStatus: 400,
        message: `Danh mục đã tồn tại.`
    },
    {
        code: 'NOT_EXIST_CATEGORY',
        httpStatus: 404,
        message: `Không tìm thấy danh mục.`
    },
    {
        code: 'NOT_EXIST_BOOKING_REFUND',
        httpStatus: 404,
        message: `Không tìm thấy yêu cầu hoàn tiền.`
    },
    {
        code: 'NOT_EXIST_BOOKING',
        httpStatus: 404,
        message: `Không tìm thấy đơn đặt tour.`
    },
    {
        code: 'INVALID_ACTION_BOOKING_CANCEL',
        httpStatus: 400,
        message: `Không thể hủy đơn đặt tour này.`
    },
    {
        code: 'INVALID_ACTION_BOOKING_CHANGE',
        httpStatus: 400,
        message: `Không thể thay đổi đơn đặt tour này.`
    },
    {
        code: 'NOT_EXIST_TOUR',
        httpStatus: 404,
        message: `Không tìm thấy tour.`
    },
    {
        code: 'INVALID_ACTION_BOOKED_TOUR',
        httpStatus: 400,
        message: `Không thể thực hiện thao tác này do tour này đã được đặt trước đó.`
    },
    {
        code: 'INVALID_ACTION_TOUR_FULL',
        httpStatus: 400,
        message: `Không thể thực hiện thao tác này do tour đã đủ số lượng người.`
    },
    {
        code: 'NOT_EXIST_CUSTOMER',
        httpStatus: 404,
        message: `Không tìm thấy khách hàng.`
    },
    {
        code: 'NOT_EXIST_MANAGER',
        httpStatus: 404,
        message: `Không tìm thấy quản lý.`
    },
    {
        code: 'INVALID_INFO_PASSWORD',
        httpStatus: 400,
        message: `Mật khẩu không chính xác.`
    },
    {
        code: 'INVALID_INFO_SAME_PASSWORD',
        httpStatus: 400,
        message: `Mật khẩu mới không được trùng với mật khẩu cũ.`
    },
    {
        code: 'NOT_EXISTED_POST',
        httpStatus: 404,
        message: `Không tìm thấy bài viết.`
    },
    {
        code: 'NOT_EXISTED_PROVINCE',
        httpStatus: 404,
        message: `Không tìm thấy tỉnh thành.`
    },
    {
        code: 'INVALID_ACTION_POST_NOT_PUBLISHED',
        httpStatus: 400,
        message: `Không thể thực hiện thao tác này do bài viết chưa được đăng.`
    },
    {
        code: 'POST_NOT_PUBLISHED',
        httpStatus: 400,
        message: `Bài viết chưa được đăng.`
    },
    {
        code: 'INVALID_ACTION_POST_NOT_APPROVED',
        httpStatus: 400,
        message: `Không thể thực hiện thao tác này do bài viết chưa được duyệt.`
    },
    {
        code: 'INVALID_ACTION_POST_PUBLISHED',
        httpStatus: 400,
        message: `Bài viết đã được đăng.`
    },
    {
        code: 'NOT_EXIST_STAFF',
        httpStatus: 404,
        message: `Không tìm thấy nhân viên.`
    },
    {
        code: 'NOT_EXIST_DURATION',
        httpStatus: 404,
        message: `Không tìm thấy thời lượng.`
    },
    {
        code: 'INVALID_ACTION_EDIT_TOUR_HAS_BOOKING',
        httpStatus: 400,
        message: `Không thể chỉnh sửa tour đã có người đặt.`
    },
    {
        code: 'INVALID_ACTION_EDIT_CLOSED_TOUR',
        httpStatus: 400,
        message: `Không thể chỉnh sửa tour đã đóng.`
    },
    {
        code: 'INVALID_ACTION_EDIT_COMPLETED_TOUR',
        httpStatus: 400,
        message: `Không thể chỉnh sửa tour đã hoàn thành.`
    },
    {
        code: 'INVALID_ACTION_EDIT_CANCELLED_TOUR',
        httpStatus: 400,
        message: `Không thể chỉnh sửa tour đã hủy.`
    },
    {
        code: 'INVALID_ACTION_TOUR_CANCEL',
        httpStatus: 400,
        message: `Không thể hủy tour này.`
    },
    {
        code: 'INVALID_INFO_EXISTED_TOUR_TEMPLATE_CODE',
        httpStatus: 400,
        message: `Mã tour mẫu đã tồn tại.`
    },
    {
        code: 'INVALID_INFO_PRICE',
        httpStatus: 400,
        message: `Giá không hợp lệ.`
    },
    {
        code: 'NOT_EXIST_TOUR_TEMPLATE',
        httpStatus: 404,
        message: `Không tìm thấy tour mẫu.`
    },
    {
        code: 'INVALID_ACTION_DELETE_PENDING_TOUR_TEMPLATE',
        httpStatus: 400,
        message: `Không thể xóa tour mẫu đang chờ duyệt.`
    },
    {
        code: 'INVALID_ACTION_DELETE_TOUR_TEMPLATE_HAS_TOUR',
        httpStatus: 400,
        message: `Không thể xóa tour mẫu đã có tour.`
    },
    {
        code: 'INVALID_ACTION_TOUR_TEMPLATE_ALREADY_APPROVED',
        httpStatus: 400,
        message: `Không thể thực hiện thao tác này do tour mẫu đã được duyệt.`
    }
];

export const getMessages = (object) => {
    return messages.map(msg => ({
        ...msg,
        message: msg.message.replace(/\{object}/g, object)
    }));
};
