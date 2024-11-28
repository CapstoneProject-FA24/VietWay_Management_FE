export const mockCurrentBooking = {
    bookingId: "BK20240319001",
    createdAt: "2024-03-19T17:00:00",
    contactFullName: "Trần Thị Cúc",
    contactEmail: "tranthicuc@gmail.com",
    contactPhoneNumber: "0898765432",
    numberOfParticipants: 4,
    totalPrice: 15960000,
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
    tour: {
        name: "Tour Phú Quốc - Thiên đường biển đảo 4N3Đ",
        code: "TOUR002",
        startDate: "2024-04-10T12:00:00",
        departureLocation: "TP Hồ Chí Minh",
        duration: "4 ngày 3 đêm",
        transportation: "Máy bay",
        accommodation: "Khách sạn 4 sao"
    }
};

export const mockNewTour = {
    name: "Tour Phú Quốc - Thiên đường biển đảo 4N3Đ",
    code: "TOUR003",
    startDate: "2024-04-15T12:00:00",
    departureLocation: "TP Hồ Chí Minh",
    totalPrice: 16500000,
    duration: "4 ngày 3 đêm",
    transportation: "Máy bay",
    accommodation: "Khách sạn 4 sao",
    availableSlots: 10,
    priceDetails: {
        adult: {
            price: 4125000,
            quantity: 4
        }
    }
};

// More mock data for different scenarios
export const mockBookings = [
    {
        bookingId: "BK20240319002",
        createdAt: "2024-03-19T18:30:00",
        contactFullName: "Nguyễn Văn An",
        contactEmail: "nguyenvanan@gmail.com",
        contactPhoneNumber: "0987654321",
        numberOfParticipants: 2,
        totalPrice: 8900000,
        status: "Chờ xác nhận",
        paymentStatus: "Chưa thanh toán",
        tour: {
            name: "Tour Đà Lạt - Thành phố ngàn hoa 3N2Đ",
            code: "TOUR005",
            startDate: "2024-04-20T07:00:00",
            departureLocation: "TP Hồ Chí Minh"
        }
    },
    // Add more mock bookings as needed
];
