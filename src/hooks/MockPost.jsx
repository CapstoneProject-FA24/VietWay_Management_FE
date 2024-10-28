const mockPosts = [
    {
        id: '7',
        title: 'Lễ hội Hoa Đà Lạt',
        content: '<p>Lễ hội Hoa Đà Lạt là một sự kiện văn hóa đặc sắc...</p>',
        description: 'Khám phá vẻ đẹp rực rỡ của Lễ hội Hoa Đà Lạt, sự kiện văn hóa đặc sắc thu hút hàng nghìn du khách mỗi năm.',
        createDate: '2023-12-01',
        category: 'Văn hóa',
        provinceId: '2',
        provinceName: 'Lâm Đồng',
        isEvent: true,
        startDate: '2023-12-20',
        endDate: '2023-12-24',
        imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/22/12/18/z3970311337005_2a6948ffa7793d3a968262371f264613.jpg',
        image: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/22/12/18/z3970311337005_2a6948ffa7793d3a968262371f264613.jpg'
    },
    {
        id: '8',
        title: 'Lễ hội Hoa Đà Lạt',
        content: '<p>Lễ hội Hoa Đà Lạt là một sự kiện văn hóa đặc sắc...</p>',
        description: 'Trải nghiệm không khí lễ hội tuyệt vời tại Đà Lạt với hàng triệu bông hoa đua nở trong Lễ hội Hoa thường niên.',
        createDate: '2023-12-01',
        category: 'Văn hóa',
        provinceId: '2',
        provinceName: 'Lâm Đồng',
        isEvent: true,
        startDate: '2023-12-20',
        endDate: '2023-12-24',
        image: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/22/12/18/z3970311337005_2a6948ffa7793d3a968262371f264613.jpg',
    },
    {
        id: '9',
        title: 'Ẩm thực đường phố Việt Nam',
        content: "",
        description: 'Khám phá hương vị đa dạng của ẩm thực đường phố Việt Nam, từ phở nóng hổi đến bánh mì giòn tan.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        provinceId: '2',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://www.vietnamvisa.org.vn/wp-content/uploads/2024/08/Hanoi-street-food-guide.jpg',
    },
    {
        id: '10',
        title: 'Ẩm thực đường phố Việt Nam',
        content: "",
        description: 'Khám phá hương vị đa dạng của ẩm thực đường phố Việt Nam, từ phở nóng hổi đến bánh mì giòn tan.',
        createDate: '2023-11-15',
        category: 'Ẩm thực',
        provinceId: '2',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://www.vietnamvisa.org.vn/wp-content/uploads/2024/08/Hanoi-street-food-guide.jpg',
    },
    {
        id: '11',
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
        provinceId: '2',
        provinceName: 'Hà Nội',
        isEvent: false,
        image: 'https://www.vietnamvisa.org.vn/wp-content/uploads/2024/08/Hanoi-street-food-guide.jpg',
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
