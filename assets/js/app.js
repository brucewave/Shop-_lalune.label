/* ==========================================================================
   Lalune.label — hành vi giao diện
   Không dùng thư viện ngoài. Không nghe sự kiện scroll để tính toán layout:
   phần header dính và phần reveal đều dùng IntersectionObserver.
   ========================================================================== */
(function () {
  "use strict";

  var L = window.LALUNE;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* --- Ngăn kéo điều hướng --------------------------------------------- */
  function initDrawer() {
    var drawer = $("#nav-drawer");
    var openBtn = $(".header__burger");
    if (!drawer || !openBtn) return;
    var closeBtn = $(".drawer__close", drawer);
    var lastFocus = null;

    function setOpen(open) {
      drawer.classList.toggle("is-open", open);
      openBtn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
      if (open) {
        lastFocus = document.activeElement;
        (closeBtn || drawer).focus();
      } else if (lastFocus) {
        lastFocus.focus();
      }
    }

    openBtn.addEventListener("click", function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
    $$(".drawer__link", drawer).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !drawer.classList.contains("is-open")) return;
      setOpen(false);
    });

    /* Giữ tiêu điểm bên trong ngăn kéo khi đang mở */
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
      var items = $$("a[href], button:not([disabled])", drawer);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* --- Reveal khi cuộn vào khung nhìn ---------------------------------- */
  function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = Number(entry.target.dataset.revealDelay || 0);
        setTimeout(function () { entry.target.classList.add("is-in"); }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --- Accordion -------------------------------------------------------- */
  function setAccordion(btn, open) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.setAttribute("aria-expanded", String(open));
    panel.dataset.open = String(open);
  }

  function initAccordions() {
    $$(".accordion__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setAccordion(btn, btn.getAttribute("aria-expanded") !== "true");
      });
    });

    /* Đường dẫn dạng #size hay #care phải mở sẵn đúng mục, không chỉ cuộn tới. */
    function openFromHash() {
      var id = location.hash.slice(1);
      if (!id) return;
      var item = document.getElementById(id);
      if (!item || !item.classList.contains("accordion__item")) return;
      var btn = $(".accordion__btn", item);
      if (!btn) return;
      setAccordion(btn, true);
      item.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  }

  /* --- Bộ ảnh trang chi tiết ------------------------------------------- */
  function initGallery() {
    var gallery = $("[data-gallery]");
    if (!gallery) return;
    var stage = $(".gallery__stage img", gallery);
    var thumbs = $$(".gallery__thumb", gallery);
    if (!stage || !thumbs.length) return;

    function select(index) {
      var btn = thumbs[index];
      if (!btn) return;
      thumbs.forEach(function (t, i) { t.setAttribute("aria-selected", String(i === index)); });
      stage.classList.add("is-swapping");
      var next = new Image();
      next.onload = function () {
        stage.src = btn.dataset.full;
        stage.alt = btn.dataset.alt || "";
        stage.classList.remove("is-swapping");
      };
      next.onerror = function () { stage.classList.remove("is-swapping"); };
      next.src = btn.dataset.full;
    }

    thumbs.forEach(function (btn, i) {
      btn.addEventListener("click", function () { select(i); });
      btn.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
                : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = (i + dir + thumbs.length) % thumbs.length;
        thumbs[next].focus();
        select(next);
      });
    });
  }

  /* --- Lưới sản phẩm ---------------------------------------------------- */
  function cardMarkup(p) {
    var second = p.images[1];
    return '<li class="card" data-reveal>' +
      '<a class="card__media" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(p.images[0].thumb) + '" alt="" width="519" height="800" loading="lazy" decoding="async">' +
        (second ? '<img src="' + esc(second.thumb) + '" alt="" width="498" height="800" loading="lazy" decoding="async">' : "") +
        (p.tag ? '<span class="card__tag">' + esc(p.tag) + "</span>" : "") +
      "</a>" +
      '<div class="card__body">' +
        '<h3 class="card__name"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + "</a></h3>" +
        '<p class="card__meta">' + esc(p.subtitle) + "</p>" +
        '<p class="card__price">' + esc(L.formatPrice(p.price)) + "</p>" +
        (p.preorder ? '<p class="card__meta">' + esc(p.preorder) + "</p>" : "") +
      "</div></li>";
  }

  /* Chiều dài váy lấy từ cột cuối của bảng size, không viết cứng trong giao diện */
  function skirtLength(p) {
    var chart = p.sizeChart;
    if (!chart || !chart.rows || !chart.rows.length) return "";
    var last = chart.rows[0][chart.rows[0].length - 1];
    for (var i = 1; i < chart.rows.length; i++) {
      if (chart.rows[i][chart.rows[i].length - 1] !== last) return "";
    }
    return last;
  }

  function featureMarkup(p) {
    var href = "product.html?id=" + encodeURIComponent(p.id);
    var second = p.images[1];
    return '<li class="feature" data-reveal>' +
      '<a class="feature__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(p.images[0].src) + '" alt="" width="830" height="1280" loading="lazy" decoding="async">' +
        (second ? '<img src="' + esc(second.src) + '" alt="" width="798" height="1282" loading="lazy" decoding="async">' : "") +
      "</a>" +
      "<div>" +
        (p.tag ? '<p class="eyebrow">' + esc(p.tag) + "</p>" : "") +
        '<h3 class="feature__name"><a href="' + href + '">' + esc(p.name) + "</a></h3>" +
        '<p class="feature__meta">' + esc(p.blurb || p.subtitle) + "</p>" +
        '<p class="feature__price">' + esc(L.formatPrice(p.price)) + "</p>" +
        '<ul class="feature__specs">' +
          "<li><span>Size</span><span>" + esc(p.sizes.join(" · ")) + "</span></li>" +
          "<li><span>Màu</span><span>" + esc(p.color) +
            (p.colorNote ? '<span class="spec-note">' + esc(p.colorNote) + "</span>" : "") +
          "</span></li>" +
          (skirtLength(p) ? "<li><span>Dài váy</span><span>" + esc(skirtLength(p)) + "</span></li>" : "") +
        "</ul>" +
        (p.preorder ? '<p style="margin:0 0 22px"><span class="preorder">' + esc(p.preorder) + "</span></p>" : "") +
        '<div class="feature__actions">' +
          '<a class="btn" href="' + href + '">Xem chi tiết</a>' +
          '<a class="btn btn--ghost" href="' + L.igMessage + '" target="_blank" rel="noopener noreferrer">Đặt qua Instagram</a>' +
        "</div>" +
      "</div></li>";
  }

  function initGrids() {
    $$("[data-product-grid]").forEach(function (grid) {
      var limit = Number(grid.dataset.limit || 0);
      var list = limit ? L.products.slice(0, limit) : L.products;

      if (!list.length) {
        grid.outerHTML = '<p class="lede">Bộ sưu tập đang được chuẩn bị. Theo dõi Instagram để nhận tin sớm nhất.</p>';
        return;
      }
      /* Một mẫu thì dựng khối lớn, nhiều mẫu thì quay về lưới. */
      if (list.length === 1) {
        grid.className = "feature-wrap";
        grid.innerHTML = featureMarkup(list[0]);
      } else {
        grid.className = "product-grid";
        grid.innerHTML = list.map(cardMarkup).join("");
      }
    });

    var count = $("[data-product-count]");
    if (count) count.textContent = L.products.length + " sản phẩm";
  }

  /* --- Trang chi tiết --------------------------------------------------- */
  function initProductPage() {
    var root = $("[data-product-page]");
    if (!root) return;

    var id = new URLSearchParams(location.search).get("id") || (L.products[0] && L.products[0].id);
    var p = L.byId(id);

    if (!p) {
      root.innerHTML = '<div class="wrap"><p class="eyebrow">Không tìm thấy</p>' +
        '<h1 class="page-head__title">Sản phẩm không tồn tại</h1>' +
        '<p class="lede">Mẫu bạn tìm có thể đã được đổi tên hoặc gỡ khỏi trang.</p>' +
        '<p style="margin-top:28px"><a class="btn" href="shop.html">Xem tất cả sản phẩm</a></p></div>';
      return;
    }

    document.title = p.name + " — Lalune.label";
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", p.name + " — " + p.subtitle + ". " + p.description[0]);

    $$("[data-field]").forEach(function (el) {
      var key = el.dataset.field;
      if (key === "name") el.textContent = p.name;
      if (key === "subtitle") el.textContent = p.subtitle;
      if (key === "price") el.textContent = L.formatPrice(p.price);
      if (key === "crumb") el.textContent = p.name;
    });

    /* Ảnh */
    var stage = $(".gallery__stage img", root);
    if (stage) {
      stage.src = p.images[0].src;
      stage.alt = p.images[0].alt;
    }
    var thumbList = $(".gallery__thumbs", root);
    if (thumbList) {
      thumbList.innerHTML = p.images.map(function (img, i) {
        return '<li role="presentation"><button type="button" class="gallery__thumb" role="tab"' +
          ' aria-selected="' + (i === 0) + '" data-full="' + esc(img.src) + '" data-alt="' + esc(img.alt) + '">' +
          '<img src="' + esc(img.thumb) + '" alt="Ảnh ' + (i + 1) + " của " + esc(p.name) + '" width="519" height="800" loading="lazy" decoding="async">' +
          "</button></li>";
      }).join("");
    }

    /* Mô tả và đặc điểm */
    var descBox = $("[data-desc]", root);
    if (descBox) descBox.innerHTML = p.description.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");

    var details = $("[data-details]", root);
    if (details) {
      details.innerHTML = p.details.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      if (p.colorNote) {
        details.insertAdjacentHTML("afterend",
          '<p style="margin-top:14px;color:var(--muted)">' + esc(p.colorNote) + "</p>");
      }
    }

    /* Size */
    var picker = $("[data-sizes]", root);
    if (picker) {
      picker.innerHTML = p.sizes.map(function (s, i) {
        var idAttr = "size-" + s.toLowerCase();
        return '<input type="radio" name="size" id="' + idAttr + '" value="' + esc(s) + '"' + (i === 0 ? " checked" : "") + ">" +
          '<label for="' + idAttr + '">' + esc(s) + "</label>";
      }).join("");
    }

    var chart = $("[data-size-chart]", root);
    if (chart && p.sizeChart) {
      chart.innerHTML =
        "<thead><tr>" + p.sizeChart.columns.map(function (c, i) {
          return '<th scope="col"' + (i === 0 ? ' style="width:22%"' : "") + ">" + esc(c) + "</th>";
        }).join("") + "</tr></thead><tbody>" +
        p.sizeChart.rows.map(function (r) {
          return "<tr>" + r.map(function (cell, i) {
            return i === 0 ? '<th scope="row">' + esc(cell) + "</th>" : "<td>" + esc(cell) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody>";
    }
    var pre = $("[data-preorder]", root);
    if (pre) {
      if (p.preorder) { pre.textContent = p.preorder; pre.hidden = false; }
      else { pre.hidden = true; }
    }

    var advice = $("[data-size-advice]", root);
    if (advice && p.sizeAdvice) advice.textContent = p.sizeAdvice;

    var chartNote = $("[data-size-note]", root);
    if (chartNote && p.sizeChart) chartNote.textContent = p.sizeChart.note;

    /* Bảo quản */
    var care = $("[data-care]", root);
    if (care) care.innerHTML = L.care.steps.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    var careNote = $("[data-care-note]", root);
    if (careNote) careNote.textContent = L.care.note;

    /* Đặt hàng qua Instagram + nút chép sẵn nội dung nhắn */
    var copyBtn = $("[data-copy-order]", root);
    var status = $("[data-order-status]", root);
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var checked = $('input[name="size"]:checked', root);
        var size = checked ? checked.value : p.sizes[0];
        var text = "Chào Lalune, mình muốn đặt " + p.name + " – size " + size +
          ". Cho mình hỏi cách thanh toán và thời gian giao nhé!";
        var done = function (ok) {
          if (!status) return;
          status.textContent = ok
            ? "Đã sao chép nội dung. Dán vào khung chat Instagram là gửi được."
            : "Không sao chép được. Nội dung: " + text;
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
    }

    initGallery();
    injectProductSchema(p);
  }

  /* --- Dữ liệu có cấu trúc cho công cụ tìm kiếm ------------------------- */
  function injectProductSchema(p) {
    var origin = location.origin === "null" ? "" : location.origin;
    var data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description.join(" "),
      image: p.images.map(function (i) { return origin + "/" + i.src; }),
      color: p.color,
      brand: { "@type": "Brand", name: "Lalune.label" },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "VND",
        url: location.href
      }
    };
    if (p.price) data.offers.price = String(p.price);
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(data);
    document.head.appendChild(tag);
  }

  /* --- Đánh dấu mục điều hướng đang mở ---------------------------------- */
  function initCurrentNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav-link, .drawer__link").forEach(function (a) {
      var target = a.getAttribute("href");
      if (!target || target.indexOf("#") === 0) return;
      if (target.split("?")[0] === here) a.setAttribute("aria-current", "page");
    });
  }

  /* --- Năm ở footer ------------------------------------------------------ */
  function initYear() {
    $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* --- Thanh thông báo -------------------------------------------------- */
  function initTopbar() {
    var bar = $(".topbar");
    if (!bar) return;
    var list = (L.shop && L.shop.announcements) || [];
    if (!list.length) return;

    var msg = $(".topbar__msg", bar) || bar;
    msg.textContent = list[0];
    if (list.length < 2) return;

    /* Không đặt aria-live: câu quảng cáo tự đổi mà đọc lên thì phiền người dùng
       trình đọc màn hình. Họ vẫn đọc được câu đang hiện khi duyệt tới đây. */
    var i = 0;
    var timer = null;

    function step() {
      i = (i + 1) % list.length;
      if (reduceMotion) { msg.textContent = list[i]; return; }
      msg.classList.add("is-out");
      setTimeout(function () {
        msg.textContent = list[i];
        msg.classList.remove("is-out");
      }, 300);
    }

    function play() { if (!timer) timer = setInterval(step, 4500); }
    function pause() { clearInterval(timer); timer = null; }

    play();
    /* Dừng khi người dùng đang trỏ vào hoặc khi tab bị ẩn */
    bar.addEventListener("mouseenter", pause);
    bar.addEventListener("mouseleave", play);
    bar.addEventListener("focusin", pause);
    bar.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause(); else play();
    });
  }

  function boot() {
    initTopbar();
    initDrawer();
    initCurrentNav();
    initGrids();
    initProductPage();
    initAccordions();
    initGallery();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
