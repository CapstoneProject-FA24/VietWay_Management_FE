export const mockTourTemplates = [
  {
    TourTemplateId: 1,
    tourTemplateName: "SG-3N2Đ",
    TourName: "Khám phá Sài Gòn 3 ngày 2 đêm",
    Description: "Tour tham quan các địa điểm nổi tiếng tại TP.HCM trong 3 ngày 2 đêm.",
    TourTemplateDuration: "3N2Đ",
    TourTemplateCategory: "Tour Thành phố",
    TourTemplateFacility: "Khách sạn 4 sao, xe du lịch, hướng dẫn viên",
    TourTemplatePolicy: "Hủy tour trước 3 ngày được hoàn 50% phí",
    TourTemplateNote: "Không bao gồm vé máy bay",
    TourTemplateStatus: "Đang hoạt động",
    TourTemplateCreatedDate: "2023-01-15",
    TourTemplateUpdatedDate: "2023-05-20",
    TourTemplateBeginTime: "07:00 AM",
    TourTemplateCreatedBy: "admin",
    TourTemplateUpdatedBy: "manager",
    TourTemplateProvince: "Hồ Chí Minh",
    TourTemplateDeparturePoint: "TP. Hồ Chí Minh",
    TourTemplateImages: [
      { url: "https://www.vietfuntravel.com.vn/image/data/sai-gon/tour-du-lich-sai-gon-khoi-hanh-hang-ngay-2.jpg" },
      { url: "https://example.com/saigon2.jpg" }
    ]
  },
  {
    TourTemplateId: 2,
    tourTemplateName: "ML-2N1Đ",
    TourName: "Tour Mekong Delta 2 ngày",
    Description: "Khám phá vẻ đẹp sông nước miền Tây trong 2 ngày. Khám phá vẻ đẹp sông nước miền Tây trong 2 ngày. Khám phá vẻ đẹp sông nước miền Tây trong miền Tây tr",
    TourTemplateDuration: "2N1Đ",
    TourTemplateCategory: "Tour Sinh thái",
    TourTemplateFacility: "Homestay, thuyền, hướng dẫn viên",
    TourTemplatePolicy: "Không hoàn tiền khi hủy tour",
    TourTemplateNote: "Mang theo thuốc chống côn trùng",
    TourTemplateStatus: "Đang hoạt động",
    TourTemplateCreatedDate: "2023-02-10",
    TourTemplateUpdatedDate: "2023-06-01",
    TourTemplateBeginTime: "04:00 AM",
    TourTemplateCreatedBy: "admin",
    TourTemplateUpdatedBy: "admin",
    TourTemplateProvince: "Tiền Giang",
    TourTemplateDeparturePoint: "TP. Hồ Chí Minh",
    TourTemplateImages: [
      { url: "https://www.saigonesetourist.com/uploads/source//alltour/mekong-delta-floating-market-2-days-1-night/discover-mekong-delta-tour-11.jpg" },
      { url: "https://example.com/mekong2.jpg" }
    ]
  },
  {
    TourTemplateId: 3,
    tourTemplateName: "MienTrung-5N4Đ",
    TourName: "Hành trình di sản miền Trung 5 ngày",
    Description: "Tour tham quan các di sản văn hóa tại miền Trung Việt Nam. Tour tham quan các di sản văn hóa tại miền Trung Việt Nam.",
    TourTemplateDuration: "5N4Đ",
    TourTemplateCategory: "Tour Văn hóa",
    TourTemplateFacility: "Khách sạn 3 sao, xe du lịch, hướng dẫn viên",
    TourTemplatePolicy: "Hủy tour trước 7 ngày được hoàn 70% phí",
    TourTemplateNote: "Chuẩn bị trang phục phù hợp khi vào các địa điểm tâm linh",
    TourTemplateStatus: "Tạm ngưng",
    TourTemplateCreatedDate: "2023-03-05",
    TourTemplateUpdatedDate: "2023-07-15",
    TourTemplateBeginTime: "03:00 AM",
    TourTemplateCreatedBy: "manager",
    TourTemplateUpdatedBy: "admin",
    TourTemplateProvince: "Thừa Thiên Huế",
    TourTemplateDeparturePoint: "Đà Nẵng",
    TourTemplateImages: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/12/352521770_6922050131-1024x768.jpg?tr=dpr-2,w-675" },
      { url: "https://example.com/hue2.jpg" }
    ]
  }
];

export const mockTourTemplateCategories = [
  {
    CategoryId: 1,
    CategoryName: 'Tour Thành phố'
  },
  {
    CategoryId: 2,
    CategoryName: 'Tour Sinh thái'
  },
  {
    CategoryId: 3,
    CategoryName: 'Tour Văn hóa'
  },
  {
    CategoryId: 4,
    CategoryName: 'Tour Mạo hiểm'
  },
]

export const getTourTemplateById = (id) => {
  return mockTourTemplates.find(template => template.TourTemplateId === parseInt(id));
};

export const getFilteredTourTemplates = (filters, sortBy) => {
  let filteredTourTemplates = [...mockTourTemplates];

  filteredTourTemplates = filteredTourTemplates.filter(template => {
    const categoryMatch = !filters.category || template.TourTemplateCategory === filters.category;
    const statusMatch = !filters.status || template.TourTemplateStatus === filters.status;
    const durationMatch = !filters.duration || template.TourTemplateDuration.includes(filters.duration);
    const provinceMatch = !filters.province || template.TourTemplateProvince === filters.province;
    const departureMatch = !filters.departurePoint || template.TourTemplateDeparturePoint === filters.departurePoint;

    return categoryMatch && statusMatch && durationMatch && provinceMatch && departureMatch;
  });

  if (sortBy === 'name') {
    filteredTourTemplates.sort((a, b) => a.TourName.localeCompare(b.TourName));
  } else if (sortBy === 'date') {
    filteredTourTemplates.sort((a, b) => new Date(b.TourTemplateUpdatedDate) - new Date(a.TourTemplateUpdatedDate));
  }

  return filteredTourTemplates;
};