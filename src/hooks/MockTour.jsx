export const mockTours = [
  {
    tourId: "NDSGN564-047-070824XE-H",
    tourName: "Khám phá Hạ Long 3 ngày 2 đêm",
    tourTemplateName: "HL-3N2Đ",
    startDate: "2023-07-01",
    endDate: "2023-07-03",
    beginTime: "07:00 AM",
    price: {
      adult: 3500000,
      children: 2800000,
      infant: 350000
    },
    provinceName: "Quảng Ninh",
    tourType: ['Du lịch sinh thái', 'Tìm hiểu làng nghề'],
    duration: '3N2Đ',
    days: 3,
    maxParticipant: 20,
    status: 'Đang nhận khách',
    description: "Tour du lịch Hạ Long 3 ngày 2 đêm, khám phá vịnh Hạ Long xinh đẹp và các hang động kỳ thú. Ngoài ra, tour còn đi sâu vào cuộc sống của người dân địa phương để khám phá văn hóa và ẩm thực đặc trưng. Du khách sẽ được tham gia các hoạt động trải nghiệm như chèo thuyền kayak, thăm làng chài cổ Cửa Vạn và thưởng thức hải sản tươi ngon ngay tại nguồn. Đây là cơ hội tuyệt vời để hòa mình vào thiên nhiên hùng vĩ và tìm hiểu nét đẹp văn hóa của người dân vùng biển.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2022/10/kinh-nghiem-du-lich-vinh-ha-long-5.jpg?tr=dpr-2,w-675", alt: "Vịnh Hạ Long" },
      { url: "https://lejourneyhalongcruise.com/wp-content/uploads/2022/07/co-gi-ben-trong-hang-sung-sot-khien-ai-cung-phai-kinh-ngac-08-1641706550.jpeg", alt: "Hang Sửng Sốt" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/%C4%90%E1%BA%A3o_Ti_T%E1%BB%91p.jpg/1200px-%C4%90%E1%BA%A3o_Ti_T%E1%BB%91p.jpg", alt: "Đảo Ti Tốp" },
      { url: "https://www.wyndhamhalong.com/uploads/THAO_IMAGE/lang-chai-cua-van-ha-long-quang-ninh.jpg", alt: "Làng chài Cửa Vạn" },
    ],
    itinerary: [
      {
        "day": 1,
        "title": "Ngày 1: Hà Nội - Hải Dương - Hạ Long",
        "description": 
        [
          {
            order: 1,
            content: "07:00: Xe và hướng dẫn viên đón quý khách tại điểm hẹn ở Hà Nội."
          },
          {
            order: 2,
            content: "09:30: Dừng chân tại Hải Dương, thưởng thức đặc sản bánh đậu xanh."
          },
          {
            order: 3,
            content: "12:00: Đến Hạ Long, lên tàu du lịch bắt đầu hành trình khám phá vịnh Hạ Long."
          },
          {
            order: 4,
            content: "12:30: Thưởng thức bữa trưa trên tàu với các món hải sản tươi ngon."
          },
          {
            order: 5,
            content: "Chiều: Tham quan Hòn Gà Chọi, Hòn Chó Đá, Hòn Đỉnh Hương."
          },
          {
            order: 6,
            content: "16:00: Tham gia hoạt động chèo thuyền kayak tại khu vực Hang Luồn."
          },
          {
            order: 7,
            content: "17:30: Nhận phòng khách sạn, tự do nghỉ ngơi hoặc khám phá chợ đêm Hạ Long."
          }
        ]
      },
      {
        "day": 2,
        "title": "Ngày 2: Hạ Long - Hang Sửng Sốt - Đảo Ti Tốp",
        "description": [
          {
            order: 1,
            content: "07:00: Thưởng thức bữa sáng tại khách sạn."
          },
          {
            order: 2,
            content: "08:30: Khởi hành tham quan Hang Sửng Sốt - một trong những hang động lớn và đẹp nhất tại vịnh Hạ Long."
          },
          {
            order: 3,
            content: "10:30: Tiếp tục hành trình đến Đảo Ti Tốp, nơi quý khách có thể tắm biển hoặc leo lên đỉnh núi để ngắm toàn cảnh vịnh."
          },
          {
            order: 4,
            content: "12:30: Dùng bữa trưa tại nhà hàng nổi với các món ăn hải sản đặc trưng."
          },
          {
            order: 5,
            content: "14:30: Tham quan Làng Ngọc Trai, tìm hiểu quy trình nuôi cấy ngọc trai."
          },
          {
            order: 6,
            content: "16:30: Trở về khách sạn, tự do nghỉ ngơi."
          },
          {
            order: 7,
            content: "19:00: Thưởng thức bữa tối tại nhà hàng địa phương, tham gia chương trình văn nghệ truyền thống."
          }
        ]
      },
      {
        "day": 3,
        "title": "Ngày 3: Hạ Long - Làng chài Cửa Vạn - Trung tâm Văn hóa Cộng đồng",
        "description": [
          {
            order: 1,
            content: "06:30: Dùng bữa sáng tại khách sạn."
          },
          {
            order: 2,
            content: "08:00: Tham quan Làng chài Cửa Vạn, trải nghiệm cuộc sống ngư dân, tham gia hoạt động câu cá cùng người dân."
          },
          {
            order: 3,
            content: "10:30: Ghé thăm Trung tâm Văn hóa Cộng đồng để tìm hiểu về văn hóa và lịch sử vùng biển."
          },
          {
            order: 4,
            content: "12:30: Dùng bữa trưa tại nhà hàng với đặc sản biển."
          },
          {
            order: 5,
            content: "14:00: Khởi hành về Hà Nội, trên đường dừng chân mua sắm đặc sản tại Hải Dương."
          },
          {
            order: 6,
            content: "17:30: Về đến Hà Nội, kết thúc chương trình và hẹn gặp lại quý khách."
          }
        ]
      }
    ],
    included: ["Vé tham quan", "Khách sạn 3 sao", "Bữa ăn theo chương trình"],
    notIncluded: ["Chi phí cá nhân", "Đồ uống"],
    pickupPoints: ["Hà Nội", "Hải Phòng"],
    attractions: [6, 1, 5], // Vịnh Hạ Long, Dinh Độc Lập, Bưu điện Trung tâm Sài Gòn
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-080824XE-D",
    tourName: "Du lịch Đà Lạt 4 ngày 3 đêm",
    tourTemplateName: "DL-4N3Đ",
    startDate: "2023-08-15",
    endDate: "2023-08-18",
    beginTime: "06:30 AM",
    price: {
      adult: 4500000,
      children: 3600000,
      infant: 450000
    },
    provinceName: "Lâm Đồng",
    tourType: ['Du lịch văn hóa', 'Tìm hiểu làng nghề'],
    duration: '4N3Đ',
    days: 4,
    maxParticipant: 25,
    status: 'Đang nhận khách',
    description: "Tour du lịch Đà Lạt 4 ngày 3 đêm, khám phá thành phố ngàn hoa và những địa điểm nổi tiếng.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/01/ho-xuan-huong-da-lat-1.jpg?tr=dpr-2,w-675", alt: "Hồ Xuân Hương" },
      { url: "https://r2.nucuoimekong.com/wp-content/uploads/doi-che-cau-dat-da-lat.jpg", alt: "Đồi chè Cầu Đất" },
      { url: "https://songchaugroup.com/wp-content/uploads/2024/04/datanla-waterfall-da-lat-1024x512.jpg", alt: "Thác Datanla" },
      { url: "https://www.dalatopentours.com/images/attraction/Dalat-Cathedral/dalat-cathedral-1.jpg", alt: "Nhà thờ Con Gà" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Đà Lạt",
        description: [
          { order: 1, content: "06:30: Khởi hành từ TP.HCM đi Đà Lạt." },
          { order: 2, content: "13:00: Đến Đà Lạt, nhận phòng khách sạn." },
          { order: 3, content: "15:00: Tham quan hồ Xuân Hương, thưởng thức cà phê view hồ." },
          { order: 4, content: "18:00: Dùng bữa tối, tự do khám phá chợ đêm Đà Lạt." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Làng hoa Vạn Thành - Thác Datanla",
        description: [
          { order: 1, content: "07:00: Ăn sáng tại khách sạn." },
          { order: 2, content: "08:30: Thăm làng hoa Vạn Thành, ngắm nhìn các loại hoa đặc trưng Đà Lạt." },
          { order: 3, content: "11:00: Tham quan và trải nghiệm máng trượt tại thác Datanla." },
          { order: 4, content: "14:00: Dùng bữa trưa tại nhà hàng địa phương." },
          { order: 5, content: "16:00: Ghé thăm nhà thờ Con Gà, biểu tượng của Đà Lạt." },
          { order: 6, content: "19:00: Ăn tối và tự do khám phá thành phố về đêm." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Đồi chè Cầu Đất - Vườn dâu",
        description: [
          { order: 1, content: "06:00: Dùng bữa sáng, sau đó khởi hành đi đồi chè Cầu Đất." },
          { order: 2, content: "08:30: Tham quan đồi chè, chụp ảnh và thưởng thức trà tại đây." },
          { order: 3, content: "11:30: Ghé thăm vườn dâu, tự tay hái và thưởng thức dâu tây tươi." },
          { order: 4, content: "14:00: Ăn trưa tại nhà hàng." },
          { order: 5, content: "16:00: Tham quan và mua sắm tại chợ Đà Lạt." },
          { order: 6, content: "19:00: Dùng bữa tối, sau đó tự do khám phá thành phố." }
        ]
      },
      {
        day: 4,
        title: "Ngày 4: Đà Lạt - TP.HCM",
        description: [
          { order: 1, content: "07:00: Ăn sáng và làm thủ tục trả phòng." },
          { order: 2, content: "08:30: Tham quan chợ Đà Lạt, mua đặc sản làm quà." },
          { order: 3, content: "11:00: Dùng bữa trưa, sau đó khởi hành về TP.HCM." },
          { order: 4, content: "18:00: Về đến TP.HCM, kết thúc chương trình tour." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 4 sao", "Xe đưa đón"],
    notIncluded: ["Chi phí cá nhân", "Các bữa ăn ngoài chương trình"],
    pickupPoints: ["TP.HCM", "Biên Hòa"],
    attractions: [7, 2, 4], // Hồ Xuân Hương, Nhà thờ Đức Bà, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-090924XE-P",
    tourName: "Khám phá Phú Quốc 5 ngày 4 đêm",
    tourTemplateName: "PQ-5N4Đ",
    startDate: "2023-09-10",
    endDate: "2023-09-14",
    beginTime: "08:00 AM",
    price: {
      adult: 6000000,
      children: 4800000,
      infant: 600000
    },
    provinceName: "Kiên Giang",
    tourType: ['Du lịch sinh thái'],
    duration: '5N4Đ',
    days: 5,
    maxParticipant: 30,
    status: 'Đã đầy chỗ',
    description: "Tour du lịch Phú Quốc 5 ngày 4 đêm, trải nghiệm thiên đường biển đảo và khám phá văn hóa địa phương.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2022/07/dHj0gcod-bai-sao-8.jpg?tr=c-at_max", alt: "Bãi Sao" },
      { url: "https://pqr.vn/wp-content/uploads/2020/04/vinpearl_safari_phu_quoc_gonatour.jpg", alt: "Vinpearl Safari" },
      { url: "https://phuquoctrip.com/files/images/bai-viet/CAP%20TREO%20HON%20THOM/cap-treo-phu-quoc-1.jpg", alt: "Cáp treo Hòn Thơm" },
      { url: "https://nld.mediacdn.vn/291774122806476800/2024/2/15/rat-nhieu-san-pham-dac-trung-tai-40-gian-hang-cua-cho-dem-vui-fest-phu-quoc-1708000464595637849414.jpg", alt: "Chợ đêm Phú Quốc" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Phú Quốc",
        description: [
          { order: 1, content: "Khởi hành từ TP.HCM, đến Phú Quốc, nhận phòng và nghỉ ngơi." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Phú Quốc",
        description: [
          { order: 1, content: "Tham quan Nam đảo, trải nghiệm cáp treo Hòn Thơm." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Phú Quốc",
        description: [
          { order: 1, content: "Khám phá Vinpearl Safari, tắm biển Bãi Sao." }
        ]
      },
      {
        day: 4,
        title: "Ngày 4: Phú Quốc",
        description: [
          { order: 1, content: "Tour câu cá và lặn ngắm san hô." }
        ]
      },
      {
        day: 5,
        title: "Ngày 5: Phú Quốc - TP.HCM",
        description: [
          { order: 1, content: "Mua sắm đặc sản, trở về TP.HCM." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Resort 5 sao", "Vé tham quan"],
    notIncluded: ["Chi phí cá nhân", "Dịch vụ spa"],
    pickupPoints: ["TP.HCM", "Cần Thơ"],
    attractions: [8, 1, 5], // Bãi Sao, Dinh Độc Lập, Bưu điện Trung tâm Sài Gòn
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-100524XE-S",
    tourName: "Khám phá Sapa 4 ngày 3 đêm",
    tourTemplateName: "DL-4N3Đ",
    startDate: "2023-10-05",
    endDate: "2023-10-08",
    beginTime: "06:00 AM",
    price: {
      adult: 5500000,
      children: 4400000,
      infant: 550000
    },
    provinceName: "Lào Cai",
    tourType: ['Du lịch văn hóa'],
    duration: '4N3Đ',
    days: 4,
    maxParticipant: 20,
    status: 'Đã đầy chỗ',
    description: "Tour du lịch Sapa 4 ngày 3 đêm, khám phá vẻ đẹp núi rừng Tây Bắc và văn hóa dân tộc vùng cao.",
    images: [
      { url: "https://r2.nucuoimekong.com/wp-content/uploads/ban-cat-sapa-a.jpg", alt: "Bản Cát Cát" },
      { url: "https://sapa-tourism.com/wp-content/uploads/2021/07/1-231.jpg", alt: "Fansipan" },
      { url: "https://images2.thanhnien.vn/528068263637045248/2023/8/4/ban-sao-cua-z4563042482459234f2f600b7e9d7126ece8076464faeb-1691132584412540392212.jpg", alt: "Ruộng bậc thang Sapa" },
      { url: "https://globaltravel.com.vn/wp-content/uploads/2019/08/cho-bac-ha-lao-cai-sapa6.jpg", alt: "Chợ Bắc Hà" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: Hà Nội - Sapa",
        description: [
          { order: 1, content: "Khởi hành từ Hà Nội, đến Sapa, tham quan thị trấn." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Sapa",
        description: [
          { order: 1, content: "Khám phá bản Cát Cát, trải nghiệm văn hóa H'Mông." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Sapa - Fansipan",
        description: [
          { order: 1, content: "Chinh phục đỉnh Fansipan, ngắm cảnh từ 'Nóc nhà Đông Dương'." }
        ]
      },
      {
        day: 4,
        title: "Ngày 4: Sapa - Hà Nội",
        description: [
          { order: 1, content: "Thăm chợ Bắc Hà, trở về Hà Nội." }
        ]
      },
    ],
    included: ["Vé tàu hỏa khứ hồi", "Khách sạn 4 sao", "HDV tiếng Việt"],
    notIncluded: ["Chi phí cá nhân", "Vé cáp treo Fansipan"],
    pickupPoints: ["Hà Nội", "Lào Cai"],
    attractions: [9, 2, 4], // Bản Cát Cát, Nhà thờ Đức Bà, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-111124XE-H",
    tourName: "Khám phá Hội An - Đà Nẵng 5 ngày 4 đêm",
    tourTemplateName: "HA-5N4Đ",
    startDate: "2023-11-11",
    endDate: "2023-11-15",
    beginTime: "07:30 AM",
    price: {
      adult: 7000000,
      children: 5600000,
      infant: 700000
    },
    provinceName: "Quảng Nam",
    tourType: ['Du lịch văn hóa'],
    duration: '5N4Đ',
    days: 5,
    maxParticipant: 25,
    status: 'Hoàn thành',
    description: "Tour du lịch Hội An - Đà Nẵng 5 ngày 4 đêm, khám phá vẻ đẹp của phố cổ và bãi biển miền Trung.",
    images: [
      { url: "https://toquoc.mediacdn.vn/280518851207290880/2023/9/13/318486b4-c187-40b5-9220-1afe6e4ccf5eb99d0408-1694595766050422505578.jpg", alt: "Phố cổ Hội An" },
      { url: "https://statics.vinpearl.com/cau-rong-da-nang-banner_1657939501.jpg", alt: "Cầu Rồng Đà Nẵng" },
      { url: "https://ik.imagekit.io/tvlk/blog/2022/12/ba-na-hills-3.jpg?tr=dpr-2,w-675", alt: "Bà Nà Hills" },
      { url: "https://ik.imagekit.io/tvlk/blog/2022/10/bien-my-khe-2.jpg?tr=dpr-2,w-675", alt: "Biển Mỹ Khê" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Đà Nẵng",
        description: [
          { order: 1, content: "Khởi hành từ TP.HCM, đến Đà Nẵng, tham quan Cầu Rồng." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Đà Nẵng",
        description: [
          { order: 1, content: "Khám phá Bà Nà Hills, trải nghiệm Cầu Vàng." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Đà Nẵng - Hội An",
        description: [
          { order: 1, content: "Tham quan phố cổ Hội An, trải nghiệm đèn lồng." }
        ]
      },
      {
        day: 4,
        title: "Ngày 4: Đà Nẵng",
        description: [
          { order: 1, content: "Tắm biển Mỹ Khê, thăm Ngũ Hành Sơn." }
        ]
      },
      {
        day: 5,
        title: "Ngày 5: Đà Nẵng - TP.HCM",
        description: [
          { order: 1, content: "Mua sắm tại chợ Cồn, trở về TP.HCM." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 4 sao", "Vé tham quan"],
    notIncluded: ["Chi phí cá nhân", "Các bữa ăn ngoài chương trình"],
    pickupPoints: ["TP.HCM", "Đà Nẵng"],
    attractions: [10, 1, 2, 4], // Phố cổ Hội An, Dinh Độc Lập, Nhà thờ Đức Bà, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Viet Tours"
  },
  {
    tourId: "NDSGN564-047-120724XE-N",
    tourName: "Khám phá Nha Trang 3 ngày 2 đêm",
    tourTemplateName: "NT-3N2Đ",
    startDate: "2023-12-07",
    endDate: "2023-12-09",
    beginTime: "08:30 AM",
    price: {
      adult: 4000000,
      children: 3200000,
      infant: 400000
    },
    provinceName: "Khánh Hòa",
    tourType: ['Du lịch văn hóa'],
    duration: '3N2Đ',
    days: 3,
    maxParticipant: 30,
    status: 'Hoàn thành',
    description: "Tour du lịch Nha Trang 3 ngày 2 đêm, trải nghiệm biển xanh, cát trắng và ẩm thực đặc sắc.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=dpr-2,w-675", alt: "Biển Nha Trang" },
      { url: "https://cdn1.nhatrangtoday.vn/images/photos/Vinh-Nha-Trang-15.jpg", alt: "Vịnh Nha Trang" },
      { url: "https://cdn-i.vtcnews.vn/resize/th/upload/2023/03/31/khu-vui-choi-vinpearl-da-nang-dep-ling-linh-21313740.jpg", alt: "Vinpearl Land" },
      { url: "https://bizweb.dktcdn.net/100/416/263/articles/vnmnha11.jpg?v=1698744311713", alt: "Hòn Mun" },
    ],
    itinerary: [
      { day: 1, description: "Khởi hành từ TP.HCM, đến Nha Trang, tham quan thành phố." },
      { day: 2, description: "Tour 4 đảo, lặn ngắm san hô tại Hòn Mun." },
      { day: 3, description: "Tham quan Vinpearl Land, trở về TP.HCM." },
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 3 sao", "Tour 4 đảo"],
    notIncluded: ["Chi phí cá nhân", "Vé Vinpearl Land"],
    pickupPoints: ["TP.HCM", "Nha Trang"],
    attractions: [3, 5], // Bưu điện Trung tâm Sài Gòn, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-130124XE-B",
    tourName: "Khám phá Bến Tre 2 ngày 1 đêm",
    tourTemplateName: "BT-2N1Đ",
    startDate: "2023-12-07",
    endDate: "2023-12-09",
    beginTime: "08:30 AM",
    price: {
      adult: 4000000,
      children: 3200000,
      infant: 400000
    },
    provinceName: "Khánh Hòa",
    tourType: ['Du lịch nghỉ dưỡng'],
    duration: '2N1Đ',
    days: 2,
    maxParticipant: 30,
    status: 'Bị Hủy',
    description: "Tour du lịch Nha Trang 3 ngày 2 đêm, trải nghiệm biển xanh, cát trắng và ẩm thực đặc sắc.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=dpr-2,w-675", alt: "Biển Nha Trang" },
      { url: "https://cdn1.nhatrangtoday.vn/images/photos/Vinh-Nha-Trang-15.jpg", alt: "Vịnh Nha Trang" },
      { url: "https://cdn-i.vtcnews.vn/resize/th/upload/2023/03/31/khu-vui-choi-vinpearl-da-nang-dep-ling-linh-21313740.jpg", alt: "Vinpearl Land" },
      { url: "https://bizweb.dktcdn.net/100/416/263/articles/vnmnha11.jpg?v=1698744311713", alt: "Hòn Mun" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Nha Trang",
        description: [
          { order: 1, content: "Khởi hành từ TP.HCM, đến Nha Trang, tham quan thành phố." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Nha Trang",
        description: [
          { order: 1, content: "Tour 4 đảo, lặn ngắm san hô tại Hòn Mun." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Nha Trang - TP.HCM",
        description: [
          { order: 1, content: "Tham quan Vinpearl Land, trở về TP.HCM." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 3 sao", "Tour 4 đảo"],
    notIncluded: ["Chi phí cá nhân", "Vé Vinpearl Land"],
    pickupPoints: ["TP.HCM", "Nha Trang"],
    attractions: [1, 4], // Dinh Độc Lập, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Amazing Tours"
  },
  {
    tourId: "NDSGN564-047-140224XE-H",
    tourName: "Khám phá Huế 3 ngày 2 đêm",
    tourTemplateName: "Hue-3N2Đ",
    startDate: "2023-12-07",
    endDate: "2023-12-09",
    beginTime: "08:30 AM",
    price: {
      adult: 4000000,
      children: 3200000,
      infant: 400000
    },
    provinceName: "Khánh Hòa",
    tourType: ['Du lịch nghỉ dưỡng'],
    duration: '3N2Đ',
    days: 3,
    maxParticipant: 30,
    status: 'Hoàn thành',
    description: "Tour du lịch Nha Trang 3 ngày 2 đêm, trải nghiệm biển xanh, cát trắng và ẩm thực đặc sắc.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=dpr-2,w-675", alt: "Biển Nha Trang" },
      { url: "https://cdn1.nhatrangtoday.vn/images/photos/Vinh-Nha-Trang-15.jpg", alt: "Vịnh Nha Trang" },
      { url: "https://cdn-i.vtcnews.vn/resize/th/upload/2023/03/31/khu-vui-choi-vinpearl-da-nang-dep-ling-linh-21313740.jpg", alt: "Vinpearl Land" },
      { url: "https://bizweb.dktcdn.net/100/416/263/articles/vnmnha11.jpg?v=1698744311713", alt: "Hòn Mun" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Nha Trang",
        description: [
          { order: 1, content: "Khởi hành từ TP.HCM, đến Nha Trang, tham quan thành phố." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Nha Trang",
        description: [
          { order: 1, content: "Tour 4 đảo, lặn ngắm san hô tại Hòn Mun." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Nha Trang - TP.HCM",
        description: [
          { order: 1, content: "Tham quan Vinpearl Land, trở về TP.HCM." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 3 sao", "Tour 4 đảo"],
    notIncluded: ["Chi phí cá nhân", "Vé Vinpearl Land"],
    pickupPoints: ["TP.HCM", "Nha Trang"],
    attractions: [2, 3, 5], // Nhà thờ Đức Bà, Bưu điện Trung tâm Sài Gòn, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Viet Tours"
  },
  {
    tourId: "NDSGN564-047-150324XE-M",
    tourName: "Khám phá Mũi Né 3 ngày 2 đêm",
    tourTemplateName: "MN-3N2Đ",
    startDate: "2023-12-07",
    endDate: "2023-12-09",
    beginTime: "08:30 AM",
    price: {
      adult: 4000000,
      children: 3200000,
      infant: 400000
    },
    provinceName: "Khánh Hòa",
    tourType: ['Du lịch nghỉ dưỡng'],
    duration: '3N2Đ',
    days: 3,
    maxParticipant: 30,
    status: 'Đang diễn ra',
    description: "Tour du lịch Nha Trang 3 ngày 2 đêm, trải nghiệm biển xanh, cát trắng và ẩm thực đặc sắc.",
    images: [
      { url: "https://ik.imagekit.io/tvlk/blog/2023/07/bai-bien-nha-trang-8-1024x576.jpg?tr=dpr-2,w-675", alt: "Biển Nha Trang" },
      { url: "https://cdn1.nhatrangtoday.vn/images/photos/Vinh-Nha-Trang-15.jpg", alt: "Vịnh Nha Trang" },
      { url: "https://cdn-i.vtcnews.vn/resize/th/upload/2023/03/31/khu-vui-choi-vinpearl-da-nang-dep-ling-linh-21313740.jpg", alt: "Vinpearl Land" },
      { url: "https://bizweb.dktcdn.net/100/416/263/articles/vnmnha11.jpg?v=1698744311713", alt: "Hòn Mun" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ngày 1: TP.HCM - Nha Trang",
        description: [
          { order: 1, content: "Khởi hành từ TP.HCM, đến Nha Trang, tham quan thành phố." }
        ]
      },
      {
        day: 2,
        title: "Ngày 2: Nha Trang",
        description: [
          { order: 1, content: "Tour 4 đảo, lặn ngắm san hô tại Hòn Mun." }
        ]
      },
      {
        day: 3,
        title: "Ngày 3: Nha Trang - TP.HCM",
        description: [
          { order: 1, content: "Tham quan Vinpearl Land, trở về TP.HCM." }
        ]
      }
    ],
    included: ["Vé máy bay khứ hồi", "Khách sạn 3 sao", "Tour 4 đảo"],
    notIncluded: ["Chi phí cá nhân", "Vé Vinpearl Land"],
    pickupPoints: ["TP.HCM", "Nha Trang"],
    attractions: [1, 2, 4], // Dinh Độc Lập, Nhà thờ Đức Bà, Bảo tàng Chứng tích Chiến tranh
    travelCompany: "Viet Tours"
  },
];

export const getTourById = (tourId) => {
  return mockTours.find(tour => tour.tourId === tourId);
};

export const getFilteredTours = (filters, sortBy) => {
  let filteredTours = [...mockTours];

  if (filters.provinceName) {
    filteredTours = filteredTours.filter(tour => tour.provinceName === filters.provinceName);
  }
  if (filters.minPrice) {
    filteredTours = filteredTours.filter(tour => tour.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredTours = filteredTours.filter(tour => tour.price <= filters.maxPrice);
  }
  if (filters.totalDays) {
    filteredTours = filteredTours.filter(tour => tour.days === parseInt(filters.totalDays));
  }
  if (filters.startDate) {
    filteredTours = filteredTours.filter(tour => new Date(tour.startDate) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    filteredTours = filteredTours.filter(tour => new Date(tour.endDate) <= new Date(filters.endDate));
  }

  switch (sortBy) {
    case 'price':
      filteredTours.sort((a, b) => a.price - b.price);
      break;
    case 'duration':
      filteredTours.sort((a, b) => a.days - b.days);
      break;
    case 'startDate':
      filteredTours.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      break;
    default:
      break;
  }
  return filteredTours;
};

export const getRandomTours = (count) => {
  const shuffled = [...mockTours].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};