export const mockTours = [
    {
        tourId: 1,
        tourName: "Du lịch Đà Lạt - Thành phố ngàn hoa",
        tourCategory: "Tour nghỉ dưỡng",
        duration: "3 ngày 2 đêm",
        code: "DL0123",
        provinces: ["TP.HCM", "Lâm Đồng"],
        description: "Khám phá thành phố Đà Lạt mộng mơ với những điểm đến hấp dẫn như: Đồi chè Cầu Đất, Thác Datanla, Ga Đà Lạt...",
        imageUrl: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6",
        availableDates: [
            { 
                id: 1, 
                startDate: "20/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 2500000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 1250000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 250000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { 
                id: 2, 
                startDate: "25/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 2700000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 1350000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 270000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { 
                id: 3, 
                startDate: "30/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 2600000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 1300000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 260000,
                        description: "Dưới 5 tuổi"
                    }
                }
            }
        ],
        highlights: [
            "Thưởng ngoạn cảnh đẹp thành phố Đà Lạt",
            "Khám phá Đồi chè Cầu Đất",
            "Tham quan Ga Đà Lạt cổ kính"
        ],
        schedule: [
            {
                title: "Ngày 1: TP.HCM - Đà Lạt",
                description: "Khởi hành từ TP.HCM, đến Đà Lạt, nhận phòng và tham quan Chợ Đêm"
            },
            {
                title: "Ngày 2: Khám phá Đà Lạt",
                description: "Tham quan Đồi chè Cầu Đất, Thác Datanla, và Ga Đà Lạt"
            },
            {
                title: "Ngày 3: Đà Lạt - TP.HCM",
                description: "Tự do tham quan, mua sắm và trở về TP.HCM"
            }
        ],
        policies: [
            {
                title: "Giá tour bao gồm",
                content: "Vé máy bay khứ hồi, khách sạn 3 sao, các bữa ăn theo chương trình, xe đưa đón"
            },
            {
                title: "Chính sách hủy tour",
                content: "Hủy trước 7 ngày: hoàn 80%, trước 3 ngày: hoàn 50%, trong 48h: không hoàn tiền"
            }
        ],
        notes: [
            "Mang theo giấy tờ tùy thân",
            "Chuẩn bị trang phục phù hợp thời tiết Đà Lạt",
            "Đúng giờ tập trung theo lịch hẹn"
        ],
        booking: {
            bookingCode: "BK001",
            adultQuantity: 2,
            childQuantity: 1,
            infantQuantity: 1,
            status: "pending"
        }
    },
    {
        tourId: 2,
        tourName: "Du lịch Phú Quốc - Thiên đường biển đảo",
        tourCategory: "Tour biển",
        duration: "4 ngày 3 đêm",
        code: "PQ0456",
        provinces: ["TP.HCM", "Kiên Giang"],
        description: "Trải nghiệm kỳ nghỉ tuyệt vời tại đảo ngọc Phú Quốc với các hoạt động: Tắm biển, câu cá, lặn ngắm san hô...",
        imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9",
        availableDates: [
            { 
                id: 4, 
                startDate: "22/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 3500000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em", 
                        price: 1750000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 350000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { 
                id: 5, 
                startDate: "27/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 3700000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 1850000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 370000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { id: 6, startDate: "01/04/2024", price: 3600000 }
        ],
        booking: {
            bookingCode: "BK002",
            adultQuantity: 3,
            childQuantity: 2,
            infantQuantity: 0,
            status: "pending"
        }
    },
    {
        tourId: 3,
        tourName: "Du lịch Hạ Long - Di sản thiên nhiên thế giới",
        tourCategory: "Tour văn hóa",
        duration: "3 ngày 2 đêm",
        code: "HL0789",
        provinces: ["Hà Nội", "Quảng Ninh"],
        description: "Khám phá vịnh Hạ Long với hàng nghìn hòn đảo đá vôi, hang động kỳ thú và các làng chài truyền thống...",
        imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592",
        availableDates: [
            {
                id: 7,
                startDate: "21/03/2024", 
                prices: {
                    adult: {
                        name: "Người lớn",
                        price: 4500000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 2250000,
                        description: "Từ 5-11 tuổi" 
                    },
                    infant: {
                        name: "Em bé",
                        price: 450000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { 
                id: 8, 
                startDate: "26/03/2024",
                prices: {
                    adult: { 
                        name: "Người lớn",
                        price: 4700000,
                        description: "Từ 12 tuổi trở lên"
                    },
                    child: {
                        name: "Trẻ em",
                        price: 2350000,
                        description: "Từ 5-11 tuổi"
                    },
                    infant: {
                        name: "Em bé",
                        price: 470000,
                        description: "Dưới 5 tuổi"
                    }
                }
            },
            { id: 9, startDate: "31/03/2024", price: 4600000 }
        ],
        booking: {
            bookingCode: "BK003",
            adultQuantity: 4,
            childQuantity: 2,
            infantQuantity: 1,
            status: "pending"
        }
    }
];
