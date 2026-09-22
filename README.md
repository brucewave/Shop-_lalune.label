# Lalune.label

Website giới thiệu và bán váy của **Lalune.label** — /la-lun leibl/ ♡
Instagram: [@_lalune.label](https://www.instagram.com/_lalune.label/)

Trang tĩnh thuần HTML / CSS / JavaScript. Không cần build, không cần cài gì,
deploy thẳng lên Vercel là chạy.

---

## Cấu trúc

```
index.html          Trang chủ  — hero, giới thiệu, sản phẩm, bảng size & bảo quản
shop.html           Danh sách sản phẩm
product.html        Chi tiết sản phẩm (đọc ?id=... , ví dụ ?id=layla-dress)
about.html          Về Lalune
contact.html        Liên hệ, đặt hàng và câu hỏi thường gặp
404.html            Trang không tìm thấy

assets/css/style.css    Toàn bộ giao diện
assets/js/products.js   ★ DỮ LIỆU SẢN PHẨM — chỗ cần sửa thường xuyên nhất
assets/js/app.js        Hành vi: menu, bộ ảnh, accordion, hiệu ứng cuộn
assets/img/             Logo, ảnh mẫu, ảnh note của shop

vercel.json         Cấu hình deploy, cache và rewrite /product/<id>
sitemap.xml         Sơ đồ trang cho Google
robots.txt
```

Thư mục `image_modal/` và `note/` là **ảnh gốc** chủ shop gửi. Ảnh đã dùng trên
web nằm trong `assets/img/`, đã được nén và đổi tên. Giữ lại bản gốc để sau này
cần cắt lại.

---

## Sửa nội dung hay dùng nhất

### Thêm một mẫu váy mới

Mở `assets/js/products.js`, sao chép nguyên khối `{ ... }` của Layla trong mảng
`PRODUCTS` rồi sửa. Trang chủ và trang **Sản phẩm** tự cập nhật, không cần đụng
vào HTML.

```js
{
  id: "mia-dress",                       // dùng cho đường dẫn ?id=mia-dress
  name: "Mia Dress",
  subtitle: "Váy hai dây cổ vuông",
  color: "Trắng",
  tag: "Mới",                            // để "" nếu không muốn nhãn góc ảnh
  price: null,                           // null = "Inbox để biết giá"
  sizes: ["S", "M"],
  images: [
    { src: "assets/img/products/mia-01.jpg",
      thumb: "assets/img/products/mia-01-sm.jpg",
      alt: "Mô tả ảnh cho người dùng trình đọc màn hình" }
  ],
  description: ["Đoạn mô tả 1.", "Đoạn mô tả 2."],
  details: ["Gạch đầu dòng 1", "Gạch đầu dòng 2"],
  sizeChart: {
    columns: ["Size", "Eo trên rốn", "Ngực", "Dài váy"],
    rows: [["S", "63cm (± 3cm)", "84cm", "83cm"]],
    note: "Ghi chú thêm về form váy."
  }
}
```

> Khi có **từ 2 mẫu trở lên**, trang chủ và trang Sản phẩm tự chuyển từ khối
> giới thiệu lớn sang lưới thẻ sản phẩm. Không phải chỉnh gì thêm.

### Đổi giá

Trong `products.js`, sửa `price`:

```js
price: 585000,     // hiển thị thành 585.000₫
price: null,       // ẩn giá, hiện "Inbox để biết giá"
```

### Đổi thanh thông báo, địa chỉ, số điện thoại

Cả ba nằm trong khối `SHOP` ở đầu `products.js`:

```js
var SHOP = {
  announcement: "Miễn phí vận chuyển nội địa cho tất cả các đơn hàng",
  address: "Hồ Chí Minh",
  phone: "0797998903",
  newsletterFormId: ""
};
```

Câu thông báo cũng được viết sẵn trong HTML của từng trang để chạy được khi
tắt JavaScript. Đổi trong `products.js` là đủ cho người dùng bình thường;
muốn sạch hoàn toàn thì tìm–thay chuỗi đó trong các file `.html`.

### Bật form đăng ký nhận tin

Khối "Subscribe to the newsletter" ở footer hiện đang là nút dẫn sang
Instagram, vì chưa có chỗ nhận email. Để biến nó thành form thật:

1. Tạo một form miễn phí ở [formspree.io](https://formspree.io) (50 email/tháng).
2. Chép mã form (dạng `xyzabcd` trong `https://formspree.io/f/xyzabcd`).
3. Dán vào `newsletterFormId` trong `products.js`.

Trang sẽ tự thay nút Instagram bằng ô nhập email. Chưa dán mã thì nút
Instagram giữ nguyên — không bao giờ hiện ra một form bấm vào không chạy.

### Đổi thời gian pre-order

Sửa `preorder` trong từng mẫu ở `products.js`. Để `preorder: ""` nếu mẫu đó
có sẵn, nhãn sẽ tự biến mất.

### Sửa hướng dẫn bảo quản

Cũng trong `products.js`, sửa biến `CARE`. Nội dung này dùng chung cho mọi mẫu
và hiện ở trang sản phẩm lẫn phần Hỏi & đáp.

### Đổi tài khoản Instagram

Sửa `IG_HANDLE` ở đầu `products.js`, rồi tìm–thay chuỗi `_lalune.label` trong
các file `.html` (nút và biểu tượng Instagram nằm trong header/footer từng trang).

### Thêm ảnh sản phẩm

1. Chép ảnh vào `assets/img/products/`.
2. Nên có hai bản: bản lớn (cạnh dài ~1600px) và bản `-sm` (~800px) cho thẻ sản phẩm.
3. Khai báo trong `images` của mẫu tương ứng, nhớ viết `alt` mô tả thật.

---

## Chạy thử ở máy

Chỉ cần một máy chủ tĩnh bất kỳ (mở thẳng file `index.html` cũng xem được,
nhưng `?id=` và một số đường dẫn sẽ chuẩn hơn khi chạy qua server):

```bash
python -m http.server 8787
# rồi mở http://127.0.0.1:8787
```

---

## Deploy lên Vercel

1. Vào [vercel.com/new](https://vercel.com/new), chọn **Import Git Repository**
   và trỏ tới repo này.
2. Framework Preset: **Other**.
3. Build Command: **để trống**. Output Directory: **để trống** (mặc định là thư mục gốc).
4. Bấm **Deploy**.

`vercel.json` đã cấu hình sẵn:

- cache ảnh 1 năm, cache CSS/JS 1 giờ
- rewrite `/product/layla-dress` → `product.html?id=layla-dress`
- vài header bảo mật cơ bản

### ⚠ Sau lần deploy đầu: đổi tên miền trong file

Các thẻ `canonical`, `og:image`, `sitemap.xml` và `robots.txt` đang để tạm
`https://lalune-label.vercel.app`. Sau khi biết tên miền thật, chạy:

```bash
node set-domain.mjs https://ten-mien-that.vercel.app
```

Script sẽ thay toàn bộ trong mọi file. Không đổi cũng không làm hỏng trang,
nhưng Google sẽ lập chỉ mục sai địa chỉ.

---

## Vài điều đã cố ý làm

- **Logo giữ nguyên ảnh gốc**, chỉ cắt và chuyển sang WebP, không vẽ lại thành
  vector. Nền be của tấm logo (`#e7e1d9`) được lấy làm đúng màu nền của các khu
  dùng logo, nhờ vậy phần dập nổi hoà vào nền thay vì lộ khung chữ nhật.
- **Bảng size có cả dạng bảng HTML thật**, không chỉ mỗi ảnh, để người dùng trình
  đọc màn hình và Google đọc được số đo.
- **Không có form liên hệ giả.** Shop nhận đơn qua Instagram nên trang chỉ dẫn
  thẳng sang đó, kèm nút chép sẵn nội dung tin nhắn có tên mẫu và size.
- **Không bịa thông tin.** Những gì chủ shop chưa xác nhận (cách thanh toán,
  điều kiện đổi trả) thì trang ghi rõ là sẽ báo trong tin nhắn, không tự viết ra.

---

## Bảng màu

Lấy trực tiếp từ ảnh logo và hai tấm note của shop:

| Token | Mã | Dùng cho |
|---|---|---|
| `--paper` | `#f4f1e9` | nền trang |
| `--paper-alt` | `#ebe7dd` | nền khu xen kẽ, giấy note |
| `--sheet` | `#e7e1d9` | nền khu có logo, footer |
| `--line-ctrl` | `#8c7d66` | viền nút chọn size, ô nhập |
| `--ink` | `#3a3124` | tiêu đề |
| `--body` | `#574b39` | nội dung |
| `--muted` | `#6c5f42` | chữ phụ |
| `--brand` | `#6b583f` | màu nhấn duy nhất, nút và liên kết |

Chữ: **Cormorant Garamond** (tiêu đề) và **Be Vietnam Pro** (nội dung), cả hai
đều có bộ ký tự tiếng Việt đầy đủ.
