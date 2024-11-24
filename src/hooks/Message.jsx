export const messages = [
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
        code: '01',
        httpStatus: 401,
        message: `Email/Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.`
    },
    {
        code: '02',
        httpStatus: 500,
        message: `Email hoặc Số điện thoại đã được sử dụng. Vui lòng kiểm tra lại.`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Tạo {object} thành công`
    },
    {
        code: '',
        httpStatus: 500,
        message: `Đã có lỗi xảy ra. Vui lòng thử lại sau.`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Đăng ký thành công`
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
        code: '',
        httpStatus: 200,
        message: `Đặt tour thành công.`
    },
    {
        code: '08',
        httpStatus: 400,
        message: `Bạn đã đặt tour này. Vui lòng chọn ngày hoặc tour khác.`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Hủy tour thành công.`
    },
    {
        code: '09',
        httpStatus: 400,
        message: `Bạn không thể hủy booking này.`
    },
    {
        code: '10',
        httpStatus: 200,
        message: `Gửi đánh giá thành công. Cảm ơn bạn đã chia sẻ ý kiến của mình!`
    },
    {
        code: '11',
        httpStatus: 400,
        message: `Bạn không thể gửi đánh giá vì tour chưa kết thúc. Vui lòng thử lại sau khi tour kết thúc.`
    },
    {
        code: '',
        httpStatus: 200,
        message: `Đăng bài lên {object} thành công.`
    },
    {
        code: '12',
        httpStatus: 500,
        message: `Không thể lấy thông tin tương tác do bài viết này chưa được đăng lên {object}.`
    },
    {
        code: '13',
        httpStatus: 500,
        message: `Không thể đăng bài viết do bài viết này chưa được duyệt.`
    },
    {
        code: '14',
        httpStatus: 500,
        message: `Bài viết này đã được đăng lên {object} trước đó.`
    },
    {
        code: '15',
        httpStatus: 500,
        message: `Bạn không thể thực hiện thao tác này.`
    },
    {
        code: '16',
        httpStatus: 500,
        message: `Không thể tạo tour dựa trên tour mẫu này do tour mẫu này chưa được duyệt.`
    },
];

export const getMessages = (object) => {
    return messages.map(msg => ({
        ...msg,
        message: msg.message.replace(/\{object}/g, object)
    }));
};
