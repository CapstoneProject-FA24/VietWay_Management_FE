// Mock data for bookings
const mockBookings = [
  {
    bookingId: "BK20240320001",
    code: "TOUR001",
    customerId: "CUS001",
    numberOfParticipants: 2,
    contactFullName: "Nguyễn Văn An",
    contactEmail: "nguyenvanan@gmail.com",
    contactPhoneNumber: "0912345678",
    contactAddress: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    totalPrice: 4990000,
    status: 3,
    createdAt: new Date().toISOString(),
    note: "Cần hỗ trợ xe đưa đón tại sân bay",
    tour: {
      name: "Tour Đà Lạt - Thành phố ngàn hoa 3N2Đ",
      imageUrl: "https://images.unsplash.com/photo-1589995186011-a7b485edc4bf",
      startDate: "2024-04-01T07:00:00Z",
      endDate: "2024-04-03T20:00:00Z",
      price: 2495000,
    },
    bookingTourists: [
      {
        touristId: "T001",
        fullName: "Nguyễn Văn An",
        phoneNumber: "0912345678",
        gender: "MALE",
        dateOfBirth: "1990-05-15T00:00:00Z",
        price: 2495000,
      },
      {
        touristId: "T002",
        fullName: "Nguyễn Thị Bình",
        phoneNumber: "0923456789",
        gender: "FEMALE",
        dateOfBirth: "1992-08-20T00:00:00Z",
        price: 2495000,
      }
    ],
    bookingPayments: [
      {
        paymentId: "PAY20240320001",
        amount: 2495000,
        note: "Thanh toán đặt cọc 50%",
        createAt: new Date().toISOString(),
        bankCode: "VCB",
        bankTransactionNumber: "VCB20240320001",
        status: 3,
      }
    ]
  },
  {
    bookingId: "BK20240319001",
    code: "TOUR002",
    customerId: "CUS002",
    numberOfParticipants: 4,
    contactFullName: "Trần Thị Cúc",
    contactEmail: "tranthicuc@gmail.com",
    contactPhoneNumber: "0898765432",
    contactAddress: "45 Lê Lợi, Quận 1, TP.HCM",
    totalPrice: 15960000,
    status: 0,
    createdAt: "2024-03-19T10:00:00Z",
    note: "Yêu cầu phòng view biển",
    tour: {
      name: "Tour Phú Quốc - Thiên đường biển đảo 4N3Đ",
      imageUrl: "https://images.unsplash.com/photo-1589995186011-a7b485edc4bf",
      startDate: "2024-04-10T05:00:00Z",
      endDate: "2024-04-13T21:00:00Z",
      price: 3990000,
    },
    bookingTourists: [
      {
        touristId: "T003",
        fullName: "Trần Thị Cúc",
        phoneNumber: "0898765432",
        gender: "FEMALE",
        dateOfBirth: "1985-12-10T00:00:00Z",
        price: 3990000,
      },
      {
        touristId: "T004",
        fullName: "Trần Văn Dũng",
        phoneNumber: "0887654321",
        gender: "MALE",
        dateOfBirth: "1983-03-25T00:00:00Z",
        price: 3990000,
      },
      {
        touristId: "T005",
        fullName: "Trần Minh Em",
        phoneNumber: "0876543210",
        gender: "MALE",
        dateOfBirth: "2015-07-01T00:00:00Z",
        price: 3990000,
      },
      {
        touristId: "T006",
        fullName: "Trần Thu Hà",
        phoneNumber: "0865432109",
        gender: "FEMALE",
        dateOfBirth: "2018-11-15T00:00:00Z",
        price: 3990000,
      }
    ],
    bookingPayments: [
      {
        paymentId: "PAY20240319001",
        amount: 7980000,
        note: "Thanh toán đặt cọc 50%",
        createAt: "2024-03-19T10:30:00Z",
        bankCode: "TCB",
        bankTransactionNumber: "TCB20240319001",
        status: 4,
      }
    ]
  },
  {
    bookingId: "BK20240318001",
    code: "TOUR003",
    customerId: "CUS003",
    numberOfParticipants: 1,
    contactFullName: "Lê Hoàng Giang",
    contactEmail: "lehoangiang@gmail.com",
    contactPhoneNumber: "0934567890",
    contactAddress: "78 Võ Văn Tần, Quận 3, TP.HCM",
    totalPrice: 6490000,
    status: 1,
    createdAt: "2024-03-18T14:00:00Z",
    note: "Ăn chay, không hành tỏi",
    tour: {
      name: "Tour Nha Trang - Vinpearl Land 3N2Đ",
      imageUrl: "https://images.unsplash.com/photo-1589995186011-a7b485edc4bf",
      startDate: "2024-04-05T06:00:00Z",
      endDate: "2024-04-07T20:00:00Z",
      price: 6490000,
    },
    bookingTourists: [
      {
        touristId: "T007",
        fullName: "Lê Hoàng Giang",
        phoneNumber: "0934567890",
        gender: "MALE",
        dateOfBirth: "1995-09-20T00:00:00Z",
        price: 6490000,
      }
    ],
    bookingPayments: [
      {
        paymentId: "PAY20240318001",
        amount: 3245000,
        note: "Thanh toán đặt cọc 50%",
        createAt: "2024-03-18T14:30:00Z",
        bankCode: "VCB",
        bankTransactionNumber: "VCB20240318001",
        status: 2,
      },
      {
        paymentId: "PAY20240319002",
        amount: 3245000,
        note: "Thanh toán số tiền còn lại",
        createAt: "2024-03-19T15:00:00Z",
        bankCode: "VCB",
        bankTransactionNumber: "VCB20240319002",
        status: 3,
      }
    ]
  }
];

// Mock API functions
export const getBookings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBookings);
    }, 1000);
  });
};

export const getBookingById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booking = mockBookings.find(b => b.bookingId === id);
      if (booking) {
        resolve(booking);
      } else {
        reject(new Error('Không tìm thấy thông tin đặt tour'));
      }
    }, 1000);
  });
};

export const deleteBooking = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

export const updateBookingStatus = (id, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};