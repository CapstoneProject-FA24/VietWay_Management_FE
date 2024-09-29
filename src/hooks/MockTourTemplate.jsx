export const mockTourTemplates = [
  {
    TourTemplateId: 1,
    TourCode: "TP01",
    TourName: "Khám phá vẻ đẹp Sapa 4 ngày 3 đêm",
    Description: "Chuyến du lịch đến Sapa, nơi du khách có thể trải nghiệm khung cảnh thiên nhiên hùng vĩ của núi rừng Tây Bắc và tìm hiểu văn hóa dân tộc thiểu số.",
    Duration: "4 ngày 3 đêm",
    TourCategory: "Tour Thiên nhiên",
    Policy: "Hủy trước 10 ngày được hoàn 80%, hủy sau 10 ngày không hoàn tiền",
    Note: "Mang theo áo ấm, giày đi bộ thoải mái.",
    Status: "Đã duyệt",
    CreatedDate: "2024-02-01",
    CreatedBy: "Trần Thị C",
    TourTemplateProvinces: [
      {
        ProvinceId: 4,
        ProvinceName: "Lào Cai"
      }
    ],
    DeparturePoint: "Hà Nội",
    TourTemplateImages: [
      { Path: "https://pttravel.vn/wp-content/uploads/2023/10/Kham-pha-ruong-bac-thang-Mu-Cang-Chai.jpg", ImageId: 1 },
      { Path: "https://pttravel.vn/wp-content/uploads/2023/10/du-lich-sapa.jpg", ImageId: 2 },
      { Path: "https://pttravel.vn/wp-content/uploads/2023/10/sapa-nhiep-anh.jpg", ImageId: 3 },
      { Path: "https://pttravel.vn/wp-content/uploads/2023/10/cat-cat-village.jpg", ImageId: 4 }
    ],
    TourTemplateSchedule: [
      {
        Day: 1,
        Title: "Bản làng H'Mông",
        Description: "Tham quan bản làng của người H'Mông, tìm hiểu văn hóa và phong tục tập quán.",
        AttractionSchedules: [
          {
            AttractionId: 4,
            AttractionName: "Bản Cát Cát"
          }
        ]
      },
      {
        Day: 2,
        Title: "Núi Hàm Rồng",
        Description: "Chinh phục đỉnh Hàm Rồng, ngắm nhìn toàn cảnh Sapa từ trên cao.",
        AttractionSchedules: [
          {
            AttractionId: 5,
            AttractionName: "Núi Hàm Rồng"
          }
        ]
      },
      {
        Day: 3,
        Title: "Đỉnh Fansipan",
        Description: "Chinh phục đỉnh Fansipan, nóc nhà Đông Dương.",
        AttractionSchedules: [
          {
            AttractionId: 6,
            AttractionName: "Đỉnh Fansipan"
          }
        ]
      }
    ]
  },
  {
    TourTemplateId: 2,
    TourCode: "MT01",
    TourName: "Khám phá miền Tây sông nước 3 ngày 2 đêm",
    Description: "Trải nghiệm cuộc sống dân dã miền Tây, tham quan các khu chợ nổi, thưởng thức đặc sản địa phương và khám phá văn hóa sông nước.",
    Duration: "3 ngày 2 đêm",
    TourCategory: "Tour Văn hóa",
    Policy: "Hủy trước 5 ngày được hoàn 60%, hủy sau 5 ngày không hoàn tiền",
    Note: "Chuẩn bị nón lá, giày dép thoải mái cho chuyến đi sông nước.",
    Status: "Bản nháp",
    CreatedDate: "2024-03-15",
    CreatedBy: "Lê Văn D",
    TourTemplateProvinces: [
      {
        ProvinceId: 7,
        ProvinceName: "Cần Thơ"
      },
      {
        ProvinceId: 8,
        ProvinceName: "Tiền Giang"
      }
    ],
    DeparturePoint: "Cần Thơ",
    TourTemplateImages: [
      { Path: "https://quynhongrouptour.com.vn/wp-content/uploads/2020/04/mientay-3.jpg", ImageId: 1 },
      { Path: "https://quynhongrouptour.com.vn/wp-content/uploads/2020/04/mientay-4.jpg", ImageId: 2 },
      { Path: "https://quynhongrouptour.com.vn/wp-content/uploads/2020/04/mientay-5.jpg", ImageId: 3 },
      { Path: "https://quynhongrouptour.com.vn/wp-content/uploads/2020/04/mientay-6.jpg", ImageId: 4 }
    ],
    TourTemplateSchedule: [
      {
        Day: 1,
        Title: "Chợ nổi Cái Răng",
        Description: "Tham quan chợ nổi Cái Răng, một trong những chợ nổi lớn nhất miền Tây.",
        AttractionSchedules: [
          {
            AttractionId: 7,
            AttractionName: "Chợ nổi Cái Răng"
          }
        ]
      },
      {
        Day: 2,
        Title: "Cù lao Thới Sơn",
        Description: "Khám phá cù lao Thới Sơn, tham quan các vườn cây ăn trái và thưởng thức nhạc đờn ca tài tử.",
        AttractionSchedules: [
          {
            AttractionId: 8,
            AttractionName: "Cù lao Thới Sơn"
          }
        ]
      }
    ]
  },
  {
    TourTemplateId: 3,
    TourCode: "MTR01",
    TourName: "Hành trình di sản miền Trung 5 ngày",
    Description: "Khám phá những di sản văn hóa và cảnh quan đẹp nhất của miền Trung Việt Nam, bao gồm Huế, Hội An và Mỹ Sơn. Du khách sẽ có cơ hội tìm hiểu về lịch sử, văn hóa và kiến trúc truyền thống của khu vực.",
    Duration: "5 ngày 4 đêm",
    TourCategory: "Tour Văn hóa",
    Policy: "Hủy trước 7 ngày được hoàn 70%, hủy trong vòng 7 ngày không hoàn tiền",
    Note: "Mang theo quần áo trang nhã khi tham quan các địa điểm tôn giáo.",
    Status: "Chờ duyệt",
    CreatedDate: "2024-01-10",
    CreatedBy: "Nguyễn Văn B",
    TourTemplateProvinces: [
      {
        ProvinceId: 1,
        ProvinceName: "Thừa Thiên Huế"
      },
      {
        ProvinceId: 2,
        ProvinceName: "Quảng Nam"
      },
      {
        ProvinceId: 3,
        ProvinceName: "Đà Nẵng"
      }
    ],
    DeparturePoint: "Đà Nẵng",
    TourTemplateImages: [
      { Path: "https://cits.asia/wp-content/uploads/2020/08/hoi-an.jpg", ImageId: 1 },
      { Path: "https://vitracotour.com/wp-content/uploads/2024/01/codohue.jpg", ImageId: 2 },
      { Path: "https://example.com/image3.jpg", ImageId: 3 },
      { Path: "https://example.com/image4.jpg", ImageId: 4 }
    ],
    TourTemplateSchedule: [
      {
        Day: 1,
        Title: "Đại Nội Huế",
        Description: "Tham quan quần thể cung điện hoàng gia, nơi từng là trung tâm chính trị của triều Nguyễn.",
        AttractionSchedules: [
          {
            AttractionId: 1,
            AttractionName: "Đại Nội Huế"
          }
        ]
      },
      {
        Day: 2,
        Title: "Phố cổ Hội An",
        Description: "Khám phá phố cổ Hội An, nơi lưu giữ nét kiến trúc cổ xưa và văn hóa giao thoa độc đáo.",
        AttractionSchedules: [
          {
            AttractionId: 2,
            AttractionName: "Phố cổ Hội An"
          }
        ]
      },
      {
        Day: 3,
        Title: "Thánh địa Mỹ Sơn",
        Description: "Tham quan di sản văn hóa thế giới Mỹ Sơn, quần thể đền tháp của người Chăm Pa.",
        AttractionSchedules: [
          {
            AttractionId: 3,
            AttractionName: "Thánh địa Mỹ Sơn"
          }
        ]
      }
    ]
  },
  {
    TourTemplateId: 4,
    TourCode: "MTR02",
    TourName: "Hành trình di sản miền Trung 5 ngày",
    Description: "Khám phá những di sản văn hóa và cảnh quan đẹp nhất của miền Trung Việt Nam, bao gồm Huế, Hội An và Mỹ Sơn. Du khách sẽ có cơ hội tìm hiểu về lịch sử, văn hóa và kiến trúc truyền thống của khu vực.",
    Duration: "5 ngày 4 đêm",
    TourCategory: "Tour Văn hóa",
    Policy: "Hủy trước 7 ngày được hoàn 70%, hủy trong vòng 7 ngày không hoàn tiền",
    Note: "Mang theo quần áo trang nhã khi tham quan các địa điểm tôn giáo.",
    Status: "Đã bị từ chối",
    CreatedDate: "2024-01-10",
    CreatedBy: "Nguyễn Văn B",
    TourTemplateProvinces: [
      {
        ProvinceId: 1,
        ProvinceName: "Thừa Thiên Huế"
      },
      {
        ProvinceId: 2,
        ProvinceName: "Quảng Nam"
      },
      {
        ProvinceId: 3,
        ProvinceName: "Đà Nẵng"
      }
    ],
    DeparturePoint: "Đà Nẵng",
    TourTemplateImages: [
      { Path: "https://cits.asia/wp-content/uploads/2020/08/hoi-an.jpg", ImageId: 1 },
      { Path: "https://vitracotour.com/wp-content/uploads/2024/01/codohue.jpg", ImageId: 2 },
      { Path: "https://example.com/image3.jpg", ImageId: 3 },
      { Path: "https://example.com/image4.jpg", ImageId: 4 }
    ],
    TourTemplateSchedule: [
      {
        Day: 1,
        Title: "Đại Nội Huế",
        Description: "Tham quan quần thể cung điện hoàng gia, nơi từng là trung tâm chính trị của triều Nguyễn.",
        AttractionSchedules: [
          {
            AttractionId: 1,
            AttractionName: "Đại Nội Huế"
          },
          {
            AttractionId: 1,
            AttractionName: "Đại Nội Huế"
          }
        ]
      },
      {
        Day: 2,
        Title: "Phố cổ Hội An",
        Description: "Khám phá phố cổ Hội An, nơi lưu giữ nét kiến trúc cổ xưa và văn hóa giao thoa độc đáo.",
        AttractionSchedules: [
          {
            AttractionId: 2,
            AttractionName: "Phố cổ Hội An"
          }
        ]
      },
      {
        Day: 3,
        Title: "Thánh địa Mỹ Sơn",
        Description: "Tham quan di sản văn hóa thế giới Mỹ Sơn, quần thể đền tháp của người Chăm Pa.",
        AttractionSchedules: [
          {
            AttractionId: 3,
            AttractionName: "Thánh địa Mỹ Sơn"
          }
        ]
      }
    ]
  }
];


export const mockTourStatus = [
  'Đã duyệt', 'Chờ duyệt', 'Bản nháp', 'Đã bị từ chối'
]

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

export const mockProvinces = [
  {
    ProvinceId: 1,
    ProvinceName: 'Thừa Thiên Huế'
  },
  {
    ProvinceId: 2,
    ProvinceName: 'Quảng Nam'
  },
  {
    ProvinceId: 3,
    ProvinceName: 'Đà Nẵng'
  },
  {
    ProvinceId: 4,
    ProvinceName: 'Lào Cai'
  },
  {
    ProvinceId: 5,
    ProvinceName: 'Hà Nội'
  },
  {
    ProvinceId: 6,
    ProvinceName: 'Tiền Giang'
  },
  {
    ProvinceId: 7,
    ProvinceName: 'Cần Thơ'
  },
  {
    ProvinceId: 8,
    ProvinceName: 'Kiên Giang'
  }
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