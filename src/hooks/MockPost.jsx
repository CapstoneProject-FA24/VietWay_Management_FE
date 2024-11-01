const mockPosts = [
    {
        id: '1',
        title: 'Lễ hội Hoa Đà Lạt',
        content: '<p>Lễ hội Hoa Đà Lạt là một sự kiện văn hóa đặc sắc...</p>',
        description: 'Khám phá vẻ đẹp rực rỡ của Lễ hội Hoa Đà Lạt, sự kiện văn hóa đặc sắc thu hút hàng nghìn du khách mỗi năm.',
        createDate: '2023-12-01',
        category: 'Văn hóa',
        status: '0', // Bản nháp
        provinceId: '2',
        provinceName: 'Lâm Đồng',
        isEvent: true,
        startDate: '2023-12-20',
        endDate: '2023-12-24',
        image: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/22/12/18/z3970311337005_2a6948ffa7793d3a968262371f264613.jpg',
    },
    {
        id: '2',
        title: 'Top 10 Quán Phở Ngon Hà Nội',
        description: 'Khám phá những quán phở ngon trứ danh tại Hà Nội, từ phở Bát Đàn đến phở Thìn.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        status: '1', // Chờ duyệt
        provinceId: '1',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250230038502.jpg',
    },
    {
        id: '3',
        title: 'Kinh nghiệm du lịch Sapa tự túc',
        description: 'Chia sẻ kinh nghiệm du lịch Sapa chi tiết từ A-Z, từ chỗ ở đến địa điểm tham quan.',
        createDate: '2023-12-10',
        category: 'Kinh nghiệm du lịch',
        status: '2', // Đã duyệt
        provinceId: '3',
        provinceName: 'Lào Cai',
        isEvent: false,
        image: 'https://i.ytimg.com/vi/XdpjldY8Be8/maxresdefault.jpg',
    },
    {
        id: '4',
        title: 'Review Homestay Mộc Châu',
        description: 'Đánh giá chi tiết các homestay đẹp và độc đáo tại Mộc Châu.',
        createDate: '2023-12-05',
        category: 'Nơi lưu trú',
        status: '0', // Bản nháp
        provinceId: '4',
        provinceName: 'Sơn La',
        isEvent: false,
        image: 'https://phuotvivu.com/blog/wp-content/uploads/2019/02/mamas-house-moc-chau.jpg',
    },
    {
        id: '5',
        title: 'Chợ đêm Phú Quốc',
        description: 'Khám phá thiên đường ẩm thực và mua sắm tại chợ đêm Phú Quốc.',
        createDate: '2023-12-15',
        category: 'Mua sắm và giải trí',
        status: '3', // Từ chối
        provinceId: '5',
        provinceName: 'Kiên Giang',
        isEvent: false,
        image: 'https://longbeachgroup.vn/system/galleries/images/000/000/049/original/phu-quo-night-market-fine9-hostel.jpg',
    },
    {
        id: '6',
        title: 'Tin hot: Mở đường bay mới đến Côn Đảo',
        description: 'Thông tin về tuyến đường bay mới kết nối TP.HCM với Côn Đảo.',
        createDate: '2023-12-20',
        category: 'Tin tức du lịch',
        status: '1', // Chờ duyệt
        provinceId: '6',
        provinceName: 'Bà Rịa - Vũng Tàu',
        isEvent: false,
        image: 'https://www.chudu24.com/wp-content/uploads/2022/04/278018705_1943594012515375_7358612782529322531_n.jpg',
    },
    {
        id: '7',
        title: 'Lễ hội Hoa Đà Lạt',
        content: '<p>Lễ hội Hoa Đà Lạt là một sự kiện văn hóa đặc sắc...</p>',
        description: 'Trải nghiệm không khí lễ hội tuyệt vời tại Đà Lạt với hàng triệu bông hoa đua nở trong Lễ hội Hoa thường niên.',
        createDate: '2023-12-01',
        category: 'Văn hóa',
        status: '2', // Đã duyệt
        provinceId: '2',
        provinceName: 'Lâm Đồng',
        isEvent: true,
        startDate: '2023-12-20',
        endDate: '2023-12-24',
        image: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/22/12/18/z3970311337005_2a6948ffa7793d3a968262371f264613.jpg',
    },
    {
        id: '8',
        title: 'Ẩm thực đường phố Việt Nam',
        content: "",
        description: 'Khám phá hương vị đa dạng của ẩm thực đường phố Việt Nam, từ phở nóng hổi đến bánh mì giòn tan.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        status: '2', // Đã duyệt
        provinceId: '2',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://www.vietnamvisa.org.vn/wp-content/uploads/2024/08/Hanoi-street-food-guide.jpg',
    },
    {
        id: '9',
        title: 'Quảng Ninh mở cửa đón khách du lịch trở lại vịnh Hạ Long',
        content: `<h1 style='text-align: center; font-size: 35px;'>Quảng Ninh Mở Cửa Đón Khách Du Lịch Trở Lại Vịnh Hạ Long</h1>
<p style='text-align: justify;'>
    Sau thời gian dài đóng cửa do đại dịch COVID-19, Quảng Ninh đã chính thức mở cửa đón khách du lịch trở lại vịnh Hạ Long, 
    một trong những điểm đến nổi tiếng nhất Việt Nam và thế giới.
</p>
<img 
    src='https://baoquocte.vn/stores/news_dataimages/dieulinh/042022/29/15/croped/1.jpg' 
    alt='Vịnh Hạ Long' 
    style='display: block; margin: 20px auto; width: 100%; height: auto;'
>
<h2>Các Biện Pháp An Toàn Được Áp Dụng</h2>
<p style='text-align: justify;'>
    Chính quyền tỉnh Quảng Ninh đã triển khai nhiều biện pháp nhằm đảm bảo an toàn cho du khách:
</p>
<ul>
    <li>Yêu cầu tất cả nhân viên trong ngành du lịch phải tiêm đủ liều vaccine</li>
    <li>Áp dụng quy trình kiểm tra y tế chặt chẽ tại các điểm du lịch</li>
    <li>Giới hạn số lượng khách trên mỗi tàu du lịch</li>
    <li>Tăng cường vệ sinh, khử trùng tại các khu vực công cộng</li>
</ul>
<h2>Các Hoạt Động Du Lịch Mới</h2>
<p style='text-align: justify;'>
    Để thu hút du khách, Quảng Ninh đã giới thiệu nhiều hoạt động du lịch mới:
</p>
<ul>
    <li>Tour khám phá hang động mới được phát hiện</li>
    <li>Trải nghiệm văn hóa cộng đồng tại các làng chài truyền thống</li>
    <li>Các hoạt động thể thao dưới nước như chèo thuyền kayak, lặn biển</li>
    <li>Tour ẩm thực khám phá đặc sản địa phương</li>
</ul>
<img 
    src='https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/vinh-ha-long-quang-ninh-1.jpg' 
    alt='Hoạt động du lịch tại Hạ Long' 
    style='display: block; margin: 20px auto; max-width: 100%; height: auto;'
>
<h2>Kỳ Vọng Phục Hồi Ngành Du Lịch</h2>
<p style='text-align: justify;'>
    Việc mở cửa trở lại vịnh Hạ Long được kỳ vọng sẽ thúc đẩy sự phục hồi của ngành du lịch Quảng Ninh nói riêng 
    và Việt Nam nói chung. Các chuyên gia dự đoán sẽ có sự gia tăng đáng kể về lượng khách du lịch trong những tháng tới.
</p>
<p style='text-align: justify;'>
    Đây là một tin vui không chỉ cho ngành du lịch mà còn cho nền kinh tế địa phương, 
    khi du lịch là một trong những ngành kinh tế mũi nhọn của tỉnh Quảng Ninh.
</p>
<h2>Lời Kết</h2>
<p style='text-align: justify;'>
    Với việc mở cửa trở lại vịnh Hạ Long, Quảng Ninh đã sẵn sàng chào đón du khách trong và ngoài nước. 
    Đây là cơ hội tuyệt vời để du khách khám phá lại vẻ đẹp của một trong những kỳ quan thiên nhiên thế giới, 
    đồng thời góp phần vào sự phục hồi của ngành du lịch Việt Nam sau đại dịch.
</p>`,
        description: 'Quảng Ninh chính thức mở cửa đón khách du lịch trở lại vịnh Hạ Long với nhiều biện pháp an toàn và hoạt động du lịch mới hấp dẫn.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        status: '2', // Đã duyệt
        provinceId: '2',
        provinceName: 'Quảng Ninh',
        isEvent: false,
        image: 'https://images.baodantoc.vn/uploads/2024/Thang-9/Ngay-13/Anh/000.jpg',
    },
    {
        id: '10',
        title: 'Ẩm thực đường phố Hà Nội',
        content: `
<h1 style="text-align: center; font-size: 35px;">Khám Phá Ẩm Thực Đường Phố Hà Nội</h2>
<p style="text-align: justify;">
    Hà Nội nổi tiếng với nền ẩm thực đường phố đa dạng, thu hút không chỉ người dân địa phương mà còn du khách quốc tế. 
    Những món ăn đơn giản nhưng đậm đà hương vị, từ phở, bún chả đến bánh cuốn, đều mang đậm nét văn hóa và con người thủ đô.
</p>
<img 
    src="https://file1.dangcongsan.vn/data/0/images/2022/02/10/havtcd/000000.jpg" 
    alt="Ẩm thực đường phố Hà Nội" 
    style="display: block; margin: 20px auto; width: 100%; height: auto;"
>
<br/>
<h2>Phở - Món Ăn Quốc Hồn Quốc Túy</h2>
<p style="text-align: justify;">
    Một trong những món ăn nổi bật là <strong>phở</strong>, món ăn truyền thống không thể bỏ qua khi đến Hà Nội. 
    Phở không chỉ có nước dùng đậm đà, mà còn có sợi phở mềm mịn và thịt bò thơm ngon.
</p>
<img 
    src="https://mia.vn/media/uploads/blog-du-lich/top-19-quan-pho-ha-noi-ngon-nuc-tieng-an-la-ghien-phan-1--1639124992.jpg" 
    alt="Phở Hà Nội" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<br/>
<h2>Bún Chả - Món Nướng Đặc Trưng Hà Nội</h2>
<p style="text-align: justify;">
    Ngoài ra, du khách có thể thưởng thức <em>bún chả</em>, một món ăn nổi tiếng của Hà Nội với sự kết hợp hoàn hảo 
    giữa thịt nướng thơm phức và nước chấm đậm đà. Bún chả thường được ăn kèm với rau sống và nem rán, tạo nên một bữa ăn đầy đủ và hấp dẫn.
</p>
<img 
    src="https://i-giadinh.vnecdn.net/2023/04/16/Buoc-11-Thanh-pham-11-7068-1681636164.jpg" 
    alt="Bún chả Hà Nội" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<br/>
<h2>Bánh Cuốn - Món Ăn Sáng Thanh Đạm</h2>
<p style="text-align: justify;">
    Đặc biệt, <strong>bánh cuốn</strong> cũng là một món ăn mà bất kỳ du khách nào đến Hà Nội đều không thể bỏ qua. 
    Với lớp vỏ bánh mềm mịn, bên trong là nhân thịt băm cùng mộc nhĩ, bánh cuốn thường được ăn kèm với chả quế và nước mắm pha loãng.
</p>
<img 
    src="https://emoi.vn/wp-content/uploads/2019/04/53.Top-13-quan-banh-cuon-ngon-ha-noi-khien-thuc-khach-an-mot-lan-nho-mai-10-e1607498241241.jpg" 
    alt="Bánh cuốn Hà Nội" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<br/>
<h2>Bánh Tôm - Món Ăn Chơi Giòn Tan</h2>
<p style="text-align: justify;">
    <strong>Bánh tôm</strong> Hồ Tây là món ăn chơi nổi tiếng với lớp bột chiên giòn tan bao quanh những con tôm tươi ngon. 
    Thường được ăn kèm với rau sống và nước chấm chua ngọt, bánh tôm Hồ Tây là một trong những món ăn không thể bỏ qua khi dạo quanh phố cổ Hà Nội.
</p>
<img 
    src="https://bepxua.vn/wp-content/uploads/2022/07/cach-lam-banh-tom.jpg" 
    alt="Bánh tôm Hồ Tây" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<br/>
<h2>Chả Cá Lã Vọng - Tinh Hoa Ẩm Thực Hà Nội</h2>

<p style="text-align: justify;">
    <strong>Chả cá Lã Vọng</strong> là món đặc sản nổi tiếng của Hà Nội, thường được phục vụ tại bàn với chả cá chiên nóng hổi, 
    ăn kèm với bún, rau thơm và mắm tôm. Hương vị đặc biệt của món ăn này đã thu hút hàng triệu du khách đến Hà Nội mỗi năm.
</p>
<img 
    src="https://cdn.tgdd.vn/2022/05/CookRecipe/Avatar/cha-ca-la-vong-thumbnail.jpg" 
    alt="Chả cá Lã Vọng" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<br/>
<h2>Bánh Giò - Món Ăn Bình Dân Nhưng Ngon Miệng</h2>
<p style="text-align: justify;">
    <strong>Bánh giò</strong> là món ăn dân dã của Hà Nội, được làm từ bột gạo và nhân thịt, mộc nhĩ, gói trong lá chuối và hấp chín. 
    Món này thường được ăn vào buổi sáng hoặc buổi chiều, tạo cảm giác no lâu nhưng không ngấy.
</p>
<img 
    src="https://sakos.vn/wp-content/uploads/2023/11/gio-1-1.jpg" 
    alt="Bánh giò Hà Nội" 
    style="display: block; margin: 20px auto; max-width: 100%; height: auto;"
>
<p style="text-align: justify;">
    Nếu bạn muốn trải nghiệm ẩm thực đường phố, Hà Nội chắc chắn sẽ làm bạn hài lòng với vô vàn lựa chọn hấp dẫn và giá cả phải chăng. 
    Không chỉ có các món ăn nổi tiếng, ẩm thực đường phố Hà Nội còn mang đến cho du khách những trải nghiệm ẩm thực độc đáo và khó quên.
</p>
`,
        description: 'Hòa mình vào không khí nhộn nhịp của Hà Nội và thưởng thức những món ăn đường phố ngon tuyệt như phở, bún chả và bánh cuốn.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        status: '0', // Bản nháp
        provinceId: '2',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://www.gotadi.com/tour/wp-content/uploads/2022/01/Ho%CC%A3%CC%82i-Du-Li%CC%A3ch-Vie%CC%A3%CC%82t-Nam-Anh-Thu%CC%9B-289.jpeg',
    },
];

export const fetchPosts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockPosts);
        }, 500);
    });
};

export const fetchPostById = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const post = mockPosts.find(p => p.id === id);
            resolve(post);
        }, 500);
    });
};

export const fetchRelatedPosts = async (provinceId, currentPostId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const related = mockPosts.filter(p => p.provinceId === provinceId && p.id !== currentPostId);
            resolve(related);
        }, 500);
    });
};

// Add this new function
export const fetchEvents = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const events = mockPosts.filter(post => post.isEvent);
            resolve(events);
        }, 500);
    });
};
