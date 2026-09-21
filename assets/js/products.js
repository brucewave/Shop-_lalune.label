/* ==========================================================================
   Lalune.label — dữ liệu sản phẩm
   Thêm mẫu mới: sao chép một khối trong PRODUCTS rồi sửa. Trang "Sản phẩm"
   và trang chi tiết tự đọc từ đây, không cần sửa HTML.
   ========================================================================== */

window.LALUNE = (function () {
  "use strict";

  var IG_HANDLE = "_lalune.label";

  var PRODUCTS = [
    {
      id: "layla-dress",
      name: "Layla Dress",
      subtitle: "Váy ngắn dáng xoè, chiết eo, dây siết sau lưng",
      color: "Kem",
      tag: "Mới",
      /* price: null  → ẩn giá, hiển thị "Inbox để biết giá".
         Muốn hiện giá thì thay bằng số, ví dụ: price: 650000 */
      price: null,
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
      description: [
        "Layla là chiếc váy ngắn dáng xoè với phần thân trên chiết ngực và hai quai bản to nâng đỡ nhẹ nhàng.",
        "Sau lưng là dây siết đan chéo, cho phép tự điều chỉnh độ ôm eo theo từng dáng người. Thân váy kèm mút ngực nâng ngực nhẹ."
      ],
      details: [
        "Dáng váy ngắn, tùng xoè",
        "Thân trên chiết ngực, hai quai bản to",
        "Dây siết sau lưng điều chỉnh được độ chiết eo",
        "Kèm mút ngực nâng ngực nhẹ",
        "Màu kem"
      ],
      /* Số đo lấy nguyên từ bảng size của shop */
      sizeChart: {
        columns: ["Size", "Eo trên rốn", "Ngực", "Dài váy"],
        rows: [
          ["S", "63cm (± 3cm)", "84cm", "83cm"],
          ["M", "68cm (± 3cm)", "88cm", "83cm"]
        ],
        note: "Layla dress có dây siết sau lưng có thể điều chỉnh được độ chiết eo và kèm mút ngực nâng ngực nhẹ."
      }
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
    products: PRODUCTS,
    care: CARE,
    formatPrice: formatPrice,
    byId: byId
  };
})();
