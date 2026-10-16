// 공통 기능: 헤더/푸터, 상품 이미지(임시 그림), 장바구니, 목록 페이지, 상세 페이지

const BRAND = "PLAIN DAYS";
const PER_PAGE = 12;

const won = (n) => n.toLocaleString("ko-KR") + "원";
const $ = (sel, root = document) => root.querySelector(sel);

/* ---------- 임시 상품 이미지 ----------
   실제 사진이 없을 때 카테고리별 실루엣을 그려서 보여줍니다.
   products.js 에 images 배열을 넣으면 그 사진이 대신 쓰입니다. */
const SHAPES = {
  outer:  "M112 70 L150 92 L188 70 L236 92 L262 250 L232 256 L222 170 L222 318 L78 318 L78 170 L68 256 L38 250 L64 92 Z M150 92 L150 318",
  top:    "M110 82 Q150 104 190 82 L246 108 L230 160 L204 148 L204 300 L96 300 L96 148 L70 160 L54 108 Z",
  shirt:  "M114 76 L150 98 L186 76 L240 100 L256 258 L228 262 L210 160 L210 308 L90 308 L90 160 L72 262 L44 258 L60 100 Z M150 98 L150 308 M132 84 L150 112 L168 84",
  bottom: "M100 64 L200 64 L214 318 L166 318 L150 140 L134 318 L86 318 Z M100 84 L200 84",
  knit:   "M114 80 Q150 108 186 80 L242 104 L262 270 L230 274 L206 162 L208 304 L92 304 L94 162 L70 274 L38 270 L58 104 Z M92 290 L208 290",
  shoes:  "M56 240 L60 196 Q92 196 112 176 L152 182 Q190 206 236 214 Q262 220 262 244 L262 254 L56 254 Z M60 238 L262 238",
  bag:    "M80 140 L220 140 L232 304 L68 304 Z M116 140 Q116 84 150 84 Q184 84 184 140",
  acc:    "M86 214 Q86 128 150 124 Q214 128 214 214 Z M86 214 L250 222 L246 236 L86 228 Z",
};

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function placeholder(p, colorName, alt = false) {
  const fill = COLORS[colorName] || "#999";
  const light = parseInt(fill.slice(1), 16) > 0xb0b0b0;
  const bg = alt ? "#e9e7e2" : "#f1f0ec";
  const stroke = light ? shade(fill, -60) : shade(fill, 40);
  const t = alt ? "translate(150 190) scale(1.25) translate(-150 -190)" : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 375">
    <rect width="300" height="375" fill="${bg}"/>
    <g transform="${t}"><path d="${SHAPES[p.cat]}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/></g>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function productImages(p, colorName) {
  if (Array.isArray(p.images) && p.images.length) return p.images;
  if (p.images) return p.images[colorName] || p.images[p.colors[0]];
  return [placeholder(p, colorName), placeholder(p, colorName, true)];
}

/* ---------- 장바구니 (이 브라우저에만 저장) ---------- */
const Cart = {
  key: "plaindays-cart",
  read() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return this._mem || []; }
  },
  write(items) {
    this._mem = items;
    try { localStorage.setItem(this.key, JSON.stringify(items)); } catch {}
    renderCartCount();
    renderCartDrawer();
  },
  add(item) {
    const items = this.read();
    const same = items.find((i) => i.id === item.id && i.color === item.color && i.size === item.size);
    if (same) same.qty += item.qty; else items.push(item);
    this.write(items);
  },
  remove(index) {
    const items = this.read();
    items.splice(index, 1);
    this.write(items);
  },
  count() { return this.read().reduce((s, i) => s + i.qty, 0); },
};

/* ---------- 헤더 / 푸터 ---------- */
function renderChrome(activeCat) {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="util-bar">
      <nav class="util-left" aria-label="브랜드 메뉴">
        <a href="#">ABOUT</a><a href="#">STOCKIST</a><a href="#">CONTACT</a>
      </nav>
      <a class="logo" href="index.html" aria-label="${BRAND} 홈">
        <svg viewBox="0 0 520 110" aria-hidden="true">
          <text x="260" y="62" text-anchor="middle" class="logo-name">plain days</text>
          <text x="263" y="94" text-anchor="middle" class="logo-tag">EVERYDAY CLOTHING · SEOUL</text>
        </svg>
      </a>
      <nav class="util-right" aria-label="회원 메뉴">
        <a href="#">LOGIN</a><a href="#">MY PAGE</a>
        <button type="button" class="cart-btn" id="cart-open">CART (<span id="cart-count">0</span>)</button>
      </nav>
    </div>
    <nav class="cat-nav" aria-label="카테고리">
      ${CATEGORIES.map((c) => `<a href="index.html#${c.id}" data-cat="${c.id}" ${c.id === activeCat ? 'aria-current="page"' : ""}>${c.label}</a>`).join("")}
      <span class="cat-sep" aria-hidden="true"></span>
      <a href="#">Review</a><a href="#">Q&amp;A</a>
    </nav>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <p class="f-title">CUSTOMER CARE</p>
        <p class="f-big">1600-0000</p>
        <p>평일 11:00 - 17:00 · 점심 12:30 - 13:30</p>
        <p>주말 및 공휴일 휴무</p>
      </div>
      <div>
        <p class="f-title">BANK INFO</p>
        <p>국민은행 000000-00-000000</p>
        <p>예금주 플레인데이즈</p>
      </div>
      <div>
        <p class="f-title">COMPANY</p>
        <p>상호 플레인데이즈 · 대표 홍길동</p>
        <p>사업자등록번호 000-00-00000</p>
        <p>통신판매업신고 제0000-서울마포-0000호</p>
        <p>서울특별시 마포구 예시로 00, 2층</p>
      </div>
      <div class="f-links">
        <a href="#">이용약관</a><a href="#">개인정보처리방침</a><a href="#">이용안내</a><a href="#">Instagram</a>
      </div>
    </div>
    <div class="footer-bottom">
      <svg class="stamp" viewBox="0 0 200 120" role="img" aria-label="${BRAND}">
        <ellipse cx="100" cy="60" rx="96" ry="56" fill="none" stroke="currentColor" stroke-width="1.4"/>
        <ellipse cx="100" cy="60" rx="89" ry="49" fill="none" stroke="currentColor" stroke-width=".7"/>
        <text x="100" y="62" text-anchor="middle" class="logo-name" style="font-size:34px">plain days</text>
        <text x="102" y="84" text-anchor="middle" class="logo-tag" style="font-size:7.5px;letter-spacing:3.5px;opacity:1">EST. 2026</text>
      </svg>
      <p class="copy">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
    </div>`;
  document.body.append(footer);

  const drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.id = "cart-drawer";
  drawer.hidden = true;
  drawer.setAttribute("aria-label", "장바구니");
  document.body.append(drawer);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.id = "toast";
  toast.setAttribute("role", "status");
  document.body.append(toast);

  $("#cart-open").addEventListener("click", () => openCart(true));
  renderCartCount();
  renderCartDrawer();
}

function renderCartCount() {
  const el = $("#cart-count");
  if (el) el.textContent = Cart.count();
}

function openCart(open) {
  const d = $("#cart-drawer");
  if (!d) return;
  d.hidden = !open;
  document.body.classList.toggle("drawer-open", open);
}

function renderCartDrawer() {
  const d = $("#cart-drawer");
  if (!d) return;
  const items = Cart.read();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total === 0 || total >= 70000 ? 0 : 3000;
  d.innerHTML = `
    <div class="drawer-panel">
      <div class="drawer-head">
        <p>CART (${Cart.count()})</p>
        <button type="button" class="link-btn" id="cart-close">닫기</button>
      </div>
      ${items.length === 0 ? `<p class="drawer-empty">장바구니가 비어 있어요.</p>` : `
      <ul class="drawer-list">
        ${items.map((i, idx) => {
          const p = PRODUCTS.find((x) => x.id === i.id);
          return `<li>
            <img src="${productImages(p, i.color)[0]}" alt="">
            <div>
              <a href="product.html#p${p.id}">${p.name}</a>
              <p class="muted">${i.color} / ${i.size} · ${i.qty}개</p>
              <p>${won(i.price * i.qty)}</p>
            </div>
            <button type="button" class="link-btn" data-remove="${idx}">삭제</button>
          </li>`;
        }).join("")}
      </ul>
      <dl class="drawer-sum">
        <div><dt>상품금액</dt><dd>${won(total)}</dd></div>
        <div><dt>배송비</dt><dd>${shipping ? won(shipping) : "무료"}</dd></div>
        <div class="sum-total"><dt>합계</dt><dd>${won(total + shipping)}</dd></div>
      </dl>
      <p class="muted small">70,000원 이상 구매 시 무료배송</p>
      <button type="button" class="btn btn-dark" id="checkout">주문하기</button>`}
    </div>`;
  $("#cart-close", d).addEventListener("click", () => openCart(false));
  d.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => Cart.remove(+b.dataset.remove)));
  const co = $("#checkout", d);
  if (co) co.addEventListener("click", () => showToast("결제 기능은 아직 연결되지 않았어요."));
  d.onclick = (e) => { if (e.target === d) openCart(false); };
}

function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("keydown", (e) => { if (e.key === "Escape") openCart(false); });

/* ---------- 상품 카드 ---------- */
function productCard(p) {
  const [img1, img2] = productImages(p, p.colors[0]);
  const sale = p.listPrice && p.listPrice > p.price;
  const off = sale ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
  return `
    <li class="card">
      <a href="product.html#p${p.id}" class="card-link">
        <div class="card-img">
          <img src="${img1}" alt="${p.name}" loading="lazy">
          <img src="${img2}" alt="" class="hover-img" loading="lazy">
          ${p.isNew ? `<span class="badge">NEW</span>` : ""}
        </div>
        <p class="card-name">${p.name} <span class="muted">(${p.colors.join(", ")})</span></p>
        <p class="card-price">
          ${sale ? `<s class="muted">${won(p.listPrice)}</s> <span class="off">${off}%</span>` : ""}
          <span>${won(p.price)}</span>
        </p>
        <span class="chips">${p.colors.map((c) => `<i style="background:${COLORS[c]}" title="${c}"></i>`).join("")}</span>
      </a>
    </li>`;
}

/* ---------- 현재 시즌 ----------
   오늘 날짜로 지금 시즌을 고릅니다. 1-2월은 전년도 FW에 속합니다. (예: 2027년 1월 → 26 FW) */
function currentSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  const id = SEASONS.fw.months.includes(month) ? "fw" : "ss";
  const year = id === "fw" && month <= 2 ? date.getFullYear() - 1 : date.getFullYear();
  const s = SEASONS[id];
  return { ...s, id, label: `${String(year).slice(2)} ${id.toUpperCase()}`, title: `${s.name} ${year}` };
}

/* ---------- 시즌 소개 영역 ---------- */
function renderSeasonIntro(season) {
  const box = $("#season-intro");
  if (!box) return;
  box.hidden = !season;
  if (!season) return;
  box.innerHTML = `
    <p class="season-eyebrow">SEASONAL COLLECTION</p>
    <h2 class="season-title">${season.title}</h2>
    <p class="season-desc"><span>${season.ko}</span> ${season.desc}</p>`;
}

/* ---------- 목록 페이지 ---------- */
function initListPage() {
  const state = { cat: "all", page: 1, sort: "new" };

  function readHash() {
    // 주소 예: index.html#outer-p2  (카테고리 outer, 2페이지)
    const m = location.hash.slice(1).match(/^([a-z]+)(?:-p(\d+))?$/);
    state.cat = m && CATEGORIES.some((c) => c.id === m[1]) ? m[1] : "all";
    state.page = m && m[2] ? +m[2] : 1;
  }

  function setHash() {
    const h = state.cat + (state.page > 1 ? "-p" + state.page : "");
    if (location.hash.slice(1) !== h) location.hash = h;
    else render();
  }

  function render() {
    let list = PRODUCTS.slice();
    const season = state.cat === "season" ? currentSeason() : null;
    if (state.cat === "new") list = list.filter((p) => p.isNew);
    else if (season) list = list.filter((p) => p.season === season.id);
    else if (state.cat !== "all") list = list.filter((p) => p.cat === state.cat);

    if (state.sort === "new") list.sort((a, b) => b.id - a.id);
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ko"));

    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), pages);
    const shown = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    const catLabel = season ? season.label : CATEGORIES.find((c) => c.id === state.cat).label;

    $("#list-title").textContent = catLabel;
    renderSeasonIntro(season);
    $("#list-count").textContent = `${list.length}개의 상품`;
    $("#grid").innerHTML = shown.map(productCard).join("");

    const pg = $("#pagination");
    if (pages <= 1) { pg.innerHTML = ""; }
    else {
      let html = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="이전 페이지">&lsaquo;</button>`;
      for (let i = 1; i <= pages; i++)
        html += `<button type="button" data-page="${i}" ${i === state.page ? 'aria-current="page"' : ""}>${i}</button>`;
      html += `<button type="button" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""} aria-label="다음 페이지">&rsaquo;</button>`;
      pg.innerHTML = html;
    }

    document.querySelectorAll(".cat-nav [data-cat]").forEach((a) => {
      if (a.dataset.cat === state.cat) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = `${catLabel} | ${BRAND}`;
  }

  $("#pagination").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-page]");
    if (!b || b.disabled) return;
    state.page = +b.dataset.page;
    setHash();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    setHash();
  });

  window.addEventListener("hashchange", () => { readHash(); render(); });
  readHash();
  renderChrome(state.cat);
  render();
}

/* ---------- 상세 페이지 ---------- */
function initDetailPage() {
  const m = location.hash.match(/^#p(\d+)$/);
  const p = PRODUCTS.find((x) => m && x.id === +m[1]) || PRODUCTS[0];
  renderChrome(p.cat);

  const sizes = SIZES[p.cat];
  const state = { color: p.colors[0], size: sizes.length === 1 ? sizes[0] : null, qty: 1, img: 0 };
  const sale = p.listPrice && p.listPrice > p.price;
  const catLabel = CATEGORIES.find((c) => c.id === p.cat).label;
  document.title = `${p.name} | ${BRAND}`;

  const root = $("#detail");
  root.innerHTML = `
    <nav class="crumbs" aria-label="현재 위치">
      <a href="index.html#all">Home</a> / <a href="index.html#${p.cat}">${catLabel}</a>
    </nav>
    <div class="detail-grid">
      <div class="gallery">
        <div class="gallery-main"><img id="main-img" alt="${p.name}"></div>
        <div class="thumbs" id="thumbs"></div>
      </div>
      <div class="info">
        <div class="tags">
          ${p.isNew ? `<span class="badge static">NEW</span>` : ""}
          ${p.season === currentSeason().id ? `<a class="badge static season-tag" href="index.html#season">${currentSeason().label}</a>` : ""}
        </div>
        <h1>${p.name}</h1>
        <p class="detail-price">
          ${sale ? `<s class="muted">${won(p.listPrice)}</s> <span class="off">${Math.round((1 - p.price / p.listPrice) * 100)}%</span>` : ""}
          <strong>${won(p.price)}</strong>
        </p>
        <dl class="meta">
          <div><dt>배송비</dt><dd>3,000원 (70,000원 이상 무료)</dd></div>
          <div><dt>적립금</dt><dd>${won(Math.round(p.price * 0.01))} (1%)</dd></div>
        </dl>

        <fieldset class="opt">
          <legend>COLOR <span class="muted" id="color-name"></span></legend>
          <div class="swatches" id="swatches">
            ${p.colors.map((c) => `<button type="button" data-color="${c}" aria-label="${c}"><i style="background:${COLORS[c]}"></i></button>`).join("")}
          </div>
        </fieldset>

        <fieldset class="opt">
          <legend>SIZE</legend>
          <div class="sizes" id="sizes">
            ${sizes.map((s) => `<button type="button" data-size="${s}">${s}</button>`).join("")}
          </div>
        </fieldset>

        <div class="qty-row">
          <div class="qty">
            <button type="button" id="qty-minus" aria-label="수량 줄이기">−</button>
            <input id="qty" type="number" min="1" max="20" value="1" aria-label="수량">
            <button type="button" id="qty-plus" aria-label="수량 늘리기">+</button>
          </div>
          <p class="total">합계 <strong id="total"></strong></p>
        </div>

        <div class="buy-row">
          <button type="button" class="btn btn-dark" id="buy">BUY NOW</button>
          <button type="button" class="btn" id="add">ADD TO CART</button>
        </div>

        <div class="acc">
          <details open>
            <summary>상품 정보</summary>
            <p>매일 손이 가는 기본 아이템입니다. 군더더기 없는 실루엣에 단단한 소재를 사용해 오래 입을 수 있도록 만들었습니다.</p>
            <p>소재: ${p.fabric}</p>
            <p>제조국: 대한민국</p>
          </details>
          <details>
            <summary>사이즈 (cm)</summary>
            ${sizeTable(p.cat)}
            <p class="muted small">측정 방법에 따라 1-2cm 오차가 있을 수 있습니다.</p>
          </details>
          <details>
            <summary>세탁 방법</summary>
            <p>찬물 단독 손세탁 또는 드라이클리닝을 권장합니다. 표백제 사용과 건조기 사용을 피해 주세요.</p>
          </details>
          <details>
            <summary>배송 / 교환 / 반품</summary>
            <p>평일 오후 2시 이전 결제 건은 당일 출고됩니다. 수령 후 7일 이내 교환 및 반품이 가능하며, 단순 변심의 경우 왕복 배송비 6,000원이 부과됩니다.</p>
          </details>
        </div>
      </div>
    </div>
    <section class="related">
      <h2>YOU MAY ALSO LIKE</h2>
      <ul class="grid">${PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(productCard).join("")}</ul>
    </section>`;

  function draw() {
    const imgs = productImages(p, state.color);
    $("#main-img").src = imgs[state.img] || imgs[0];
    $("#thumbs").innerHTML = imgs.map((src, i) =>
      `<button type="button" data-img="${i}" ${i === state.img ? 'aria-current="true"' : ""} aria-label="이미지 ${i + 1}"><img src="${src}" alt=""></button>`).join("");
    $("#color-name").textContent = state.color;
    root.querySelectorAll("[data-color]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.color === state.color));
    root.querySelectorAll("[data-size]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.size === state.size));
    $("#qty").value = state.qty;
    $("#total").textContent = won(p.price * state.qty);
  }

  root.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.color) { state.color = t.dataset.color; state.img = 0; }
    if (t.dataset.size) state.size = t.dataset.size;
    if (t.dataset.img) state.img = +t.dataset.img;
    if (t.id === "qty-minus") state.qty = Math.max(1, state.qty - 1);
    if (t.id === "qty-plus") state.qty = Math.min(20, state.qty + 1);
    if (t.id === "add" || t.id === "buy") {
      if (!state.size) { showToast("사이즈를 선택해 주세요."); return; }
      Cart.add({ id: p.id, color: state.color, size: state.size, qty: state.qty, price: p.price });
      if (t.id === "buy") openCart(true);
      else showToast("장바구니에 담았어요.");
    }
    draw();
  });
  $("#qty").addEventListener("change", (e) => {
    state.qty = Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1));
    draw();
  });
  window.addEventListener("hashchange", () => location.reload());
  draw();
}

function sizeTable(cat) {
  const tables = {
    outer:  [["", "어깨", "가슴", "소매", "총장"], ["S", 46, 58, 60, 98], ["M", 48, 61, 61, 101], ["L", 50, 64, 62, 104], ["XL", 52, 67, 63, 107]],
    top:    [["", "어깨", "가슴", "소매", "총장"], ["S", 52, 56, 21, 69], ["M", 54, 59, 22, 71], ["L", 56, 62, 23, 73], ["XL", 58, 65, 24, 75]],
    shirt:  [["", "어깨", "가슴", "소매", "총장"], ["S", 48, 58, 59, 74], ["M", 50, 61, 60, 76], ["L", 52, 64, 61, 78], ["XL", 54, 67, 62, 80]],
    knit:   [["", "어깨", "가슴", "소매", "총장"], ["S", 50, 56, 58, 66], ["M", 52, 59, 59, 68], ["L", 54, 62, 60, 70]],
    bottom: [["", "허리", "엉덩이", "허벅지", "총장"], ["28", 37, 51, 33, 102], ["30", 39, 53, 34, 103], ["32", 41, 55, 35, 104], ["34", 43, 57, 36, 105]],
    shoes:  [["", "발길이(mm)", "굽높이"], ["240", 240, 2.5], ["250", 250, 2.5], ["260", 260, 2.5], ["270", 270, 2.5], ["280", 280, 2.5]],
    bag:    [["", "가로", "세로", "폭", "끈길이"], ["FREE", 34, 38, 10, 60]],
    acc:    [["", "둘레", "높이"], ["FREE", 56, 22]],
  };
  const rows = tables[cat];
  return `<div class="table-wrap"><table>
    <thead><tr>${rows[0].map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.slice(1).map((r) => `<tr>${r.map((v, i) => i === 0 ? `<th>${v}</th>` : `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}
