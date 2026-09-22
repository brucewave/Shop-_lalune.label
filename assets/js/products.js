/* ==========================================================================
   Lalune.label — dữ liệu sản phẩm và thông tin cửa hàng
   Thêm mẫu mới: sao chép một khối trong PRODUCTS rồi sửa. Trang "Sản phẩm"
   và trang chi tiết tự đọc từ đây, không cần sửa HTML.
   ========================================================================== */

window.LALUNE = (function () {
  "use strict";

  var IG_HANDLE = "_lalune.label";

  /* Thông tin chung của shop — sửa ở đây là đổi trên mọi trang */
  var SHOP = {
    announcement: "Miễn phí vận chuyển nội địa cho tất cả các đơn hàng",
    address: "Ho Chi Minh City",
    phone: "0797998903",
    /* Dán mã form Formspree vào đây để bật form đăng ký nhận tin.
       Để trống thì khối đó hiện nút theo dõi Instagram thay cho form. */
    newsletterFormId: ""
  };

  var PRODUCTS = [
    {
      id: "layla-dress",
      name: "Layla Dress",
      subtitle: "Váy ngắn dáng xoè, chiết eo, dây siết sau lưng",
      color: "Kem",
      tag: "Mới",
      /* price: null → ẩn giá, hiện "Inbox để biết giá". Đặt số để hiện giá. */
      price: 585000,
      preorder: "Pre-order 10–14 ngày",
      sizes: ["S", "M"],
      images: [
        { src: "assets/img/products/layla-01.jpg",
          thumb: "assets/img/products/layla-01-sm.jpg",
          alt: "Người mẫu mặc Layla Dress màu kem, chụp nghiêng bên hàng rào cây xanh" },
        { src: "assets/img/products/layla-02.jpg",
          thumb: "assets/img/products/layla-02-sm.jpg",
          alt: "Layla Dress nhìn từ chính diện, thấy rõ phần thân trên chiết ngực và hai quai bản to" },
        { src: "assets/img/products/layla-03.jpg",
          thumb: "assets/img/products/layla-03-sm.jpg",
          alt: "Mặt sau Layla Dress với dây siết đan chéo và tùng váy xoè" }
      ],
      /* Dòng ngắn dùng cho thẻ sản phẩm ngoài trang chủ và trang Sản phẩm */
      blurb: "Chất liệu Kate co giãn 2 lớp, mút ngực đi kèm, dây kéo phía sau lưng, phần lưng có dây siết điều chỉnh độ chiết eo và nâng ngực nhẹ.",
      description: [
        "Với chất liệu Kate co giãn 2 lớp, mút ngực đi kèm, dây kéo phía sau lưng, phần lưng có dây siết điều chỉnh độ chiết eo và nâng ngực nhẹ.",
        "Dáng váy ngắn, tùng xoè, thân trên chiết ngực với hai quai bản to nâng đỡ nhẹ nhàng."
      ],
      details: [
        "Chất liệu Kate co giãn 2 lớp",
        "Dáng váy ngắn, tùng xoè",
        "Thân trên chiết ngực, hai quai bản to",
        "Dây kéo phía sau lưng",
        "Dây siết sau lưng điều chỉnh được độ chiết eo",
        "Kèm mút ngực nâng ngực nhẹ",
        "Màu kem"
      ],
      colorNote: "Màu sắc sẽ có chênh lệch so với thực tế tuỳ vào điều kiện ánh sáng.",
      /* Số đo lấy nguyên từ bảng size của shop */
      sizeChart: {
        columns: ["Size", "Eo trên rốn", "Ngực", "Dài váy"],
        rows: [
          ["S", "63cm (± 3cm)", "84cm", "83cm"],
          ["M", "68cm (± 3cm)", "88cm", "83cm"]
        ],
        note: "Layla dress có dây siết sau lưng có thể điều chỉnh được độ chiết eo và kèm mút ngực nâng ngực nhẹ."
      },
      sizeAdvice: "Gửi chiều cao, cân nặng, số đo v1 và v2 trên rốn, shop sẽ giúp bạn tư vấn size."
    }
  ];

  /* Hướng dẫn bảo quản — dùng chung cho mọi mẫu, chép từ note của shop */
  var CARE = {
    steps: [
      "Giặt tay nhẹ với nhiệt độ nước dưới 30°C",
      "Không dùng thuốc tẩy",
      "Không ngâm lâu",
      "Phơi nơi thoáng mát, tránh ánh nắng trực tiếp",
      "Ủi ở nhiệt độ thấp"
    ],
    note: "Vải có thể co nhẹ và nhăn tự nhiên sau khi giặt. Đây là đặc tính tự nhiên của chất liệu."
  };

  function formatPrice(value) {
    if (value === null || value === undefined) return "Inbox để biết giá";
    return new Intl.NumberFormat("vi-VN").format(value) + "₫";
  }

  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  return {
    igHandle: IG_HANDLE,
    igProfile: "https://www.instagram.com/" + IG_HANDLE + "/",
    igMessage: "https://ig.me/m/" + IG_HANDLE,
    shop: SHOP,
    products: PRODUCTS,
    care: CARE,
    formatPrice: formatPrice,
    byId: byId
  };
})();
