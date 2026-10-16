// 상품 데이터. 실제 사진이 생기면 각 상품에 images: ["images/xxx-1.jpg", "images/xxx-2.jpg"] 를 넣으면 됩니다.
// 색상마다 사진이 다르면 images: { "블랙": [...], "네이비": [...] } 처럼 색상 이름별로 넣습니다.
// price: 판매가, listPrice: 소비자가(할인 전 가격, 없으면 할인 표시 안 함)

const CATEGORIES = [
  { id: "new", label: "New in" },
  { id: "season", label: "Seasonal" },
  { id: "all", label: "All" },
  { id: "outer", label: "Outer" },
  { id: "top", label: "Top" },
  { id: "shirt", label: "Shirt" },
  { id: "bottom", label: "Bottom" },
  { id: "knit", label: "Knitwear" },
  { id: "shoes", label: "Shoes" },
  { id: "bag", label: "Bag" },
  { id: "acc", label: "Acc" },
];

// 시즌. Seasonal 메뉴에는 오늘 날짜에 맞는 시즌 하나만 보입니다.
// 9월-2월은 가을·겨울(FW), 3월-8월은 봄·여름(SS)이고, 달이 바뀌면 자동으로 넘어갑니다.
// 상품에 season: "fw" 처럼 적으면 그 시즌에 들어갑니다. (시즌이 없는 상품은 안 적으면 됩니다)
const SEASONS = {
  fw: { name: "Autumn / Winter", ko: "가을 · 겨울", months: [9, 10, 11, 12, 1, 2], desc: "찬 바람이 불기 시작하는 계절을 위한 울 코트, 니트, 레이어드 아이템." },
  ss: { name: "Spring / Summer", ko: "봄 · 여름", months: [3, 4, 5, 6, 7, 8], desc: "가볍게 걸치기 좋은 코튼과 린넨, 매일 입는 티셔츠와 셔츠." },
};

// 색상 이름 → 화면에 표시할 색
const COLORS = {
  "블랙": "#262624",
  "차콜": "#4a4a47",
  "그레이": "#a3a39e",
  "아이보리": "#ece6d8",
  "화이트": "#f6f5f1",
  "베이지": "#d6c6a8",
  "브라운": "#7a5a43",
  "카멜": "#b4875a",
  "네이비": "#2e3a52",
  "블루": "#6f8db0",
  "카키": "#6f6f4e",
  "올리브": "#5d6447",
  "버건디": "#6e2f35",
  "스카이": "#b9cfe0",
};

const PRODUCTS = [
  { id: 1,  name: "울 블렌드 싱글 코트",     cat: "outer", season: "fw",  price: 189000, listPrice: 229000, colors: ["차콜", "카멜"],             isNew: true,  fabric: "울 60%, 폴리에스터 40%" },
  { id: 2,  name: "후드 덕다운 점퍼",        cat: "outer", season: "fw",  price: 159000,                    colors: ["블랙", "올리브"],           isNew: true,  fabric: "겉감 나일론 100%, 충전재 덕다운 80% / 깃털 20%" },
  { id: 3,  name: "코튼 워크 재킷",          cat: "outer", season: "ss",  price: 98000,                     colors: ["베이지", "네이비"],                       fabric: "코튼 100%" },
  { id: 4,  name: "스웨이드 트러커 재킷",     cat: "outer", season: "fw",  price: 139000, listPrice: 169000, colors: ["브라운"],                                fabric: "폴리에스터 100% (인조 스웨이드)" },
  { id: 5,  name: "헤비 코튼 반팔 티셔츠",    cat: "top", season: "ss",    price: 29000,                     colors: ["화이트", "블랙", "그레이"], isNew: true,  fabric: "코튼 100%, 260g" },
  { id: 6,  name: "루즈핏 맨투맨",           cat: "top", season: "fw",    price: 45000,                     colors: ["그레이", "네이비"],                       fabric: "코튼 80%, 폴리에스터 20% 기모" },
  { id: 7,  name: "피그먼트 롱슬리브",        cat: "top",    price: 36000,  listPrice: 42000,  colors: ["차콜", "카키"],                           fabric: "코튼 100%" },
  { id: 8,  name: "하프 집업 스웨트",         cat: "top", season: "fw",    price: 52000,                     colors: ["아이보리", "블랙"],                       fabric: "코튼 100% 루프백" },
  { id: 9,  name: "옥스포드 버튼다운 셔츠",    cat: "shirt", season: "ss",  price: 49000,                     colors: ["블루", "화이트"],           isNew: true,  fabric: "코튼 100% 옥스포드" },
  { id: 10, name: "오버핏 스트라이프 셔츠",    cat: "shirt", season: "ss",  price: 46000,  listPrice: 54000,  colors: ["스카이"],                                 fabric: "코튼 100%" },
  { id: 11, name: "린넨 오픈카라 셔츠",       cat: "shirt", season: "ss",  price: 52000,                     colors: ["베이지", "화이트"],                       fabric: "린넨 55%, 코튼 45%" },
  { id: 12, name: "코듀로이 셔츠 재킷",       cat: "shirt", season: "fw",  price: 68000,                     colors: ["브라운", "올리브"],                       fabric: "코튼 100% 8웨일 코듀로이" },
  { id: 13, name: "와이드 데님 팬츠",         cat: "bottom", season: "ss", price: 62000,                     colors: ["블루", "블랙"],             isNew: true,  fabric: "코튼 100% 13oz 데님" },
  { id: 14, name: "원턱 울 슬랙스",           cat: "bottom", season: "fw", price: 72000,  listPrice: 84000,  colors: ["차콜", "베이지"],                         fabric: "울 30%, 폴리에스터 70%" },
  { id: 15, name: "카고 벌룬 팬츠",           cat: "bottom", season: "ss", price: 58000,                     colors: ["카키", "블랙"],                           fabric: "코튼 100% 트윌" },
  { id: 16, name: "스웨트 조거 팬츠",         cat: "bottom", price: 42000,                     colors: ["그레이", "네이비"],                       fabric: "코튼 80%, 폴리에스터 20%" },
  { id: 17, name: "라운드 램스울 니트",        cat: "knit", season: "fw",   price: 64000,                     colors: ["아이보리", "버건디", "네이비"], isNew: true, fabric: "램스울 100%" },
  { id: 18, name: "케이블 브이넥 가디건",      cat: "knit", season: "fw",   price: 78000,  listPrice: 92000,  colors: ["베이지", "차콜"],                         fabric: "울 50%, 아크릴 50%" },
  { id: 19, name: "모헤어 블렌드 니트",        cat: "knit", season: "fw",   price: 72000,                     colors: ["그레이", "스카이"],                       fabric: "모헤어 30%, 나일론 40%, 울 30%" },
  { id: 20, name: "하이넥 립 니트",           cat: "knit", season: "fw",   price: 54000,                     colors: ["블랙", "브라운"],                         fabric: "울 30%, 아크릴 70%" },
  { id: 21, name: "레더 더비 슈즈",           cat: "shoes", season: "fw",  price: 128000,                    colors: ["블랙", "브라운"],                         fabric: "소가죽, 고무 아웃솔" },
  { id: 22, name: "캔버스 로우 스니커즈",      cat: "shoes", season: "ss",  price: 59000,  listPrice: 69000,  colors: ["아이보리", "블랙"],         isNew: true,  fabric: "코튼 캔버스, 고무 아웃솔" },
  { id: 23, name: "스웨이드 로퍼",            cat: "shoes", season: "fw",  price: 118000,                    colors: ["카멜"],                                   fabric: "소가죽 스웨이드" },
  { id: 24, name: "나일론 크로스백",          cat: "bag", season: "ss",    price: 48000,                     colors: ["블랙", "카키"],                           fabric: "나일론 100%" },
  { id: 25, name: "캔버스 토트백",            cat: "bag", season: "ss",    price: 39000,                     colors: ["아이보리", "네이비"],       isNew: true,  fabric: "코튼 캔버스 16oz" },
  { id: 26, name: "레더 미니 숄더백",          cat: "bag",    price: 98000,  listPrice: 118000, colors: ["브라운", "블랙"],                         fabric: "소가죽" },
  { id: 27, name: "울 비니",                 cat: "acc", season: "fw",    price: 24000,                     colors: ["차콜", "버건디", "아이보리"],             fabric: "울 100%" },
  { id: 28, name: "6패널 코튼 볼캡",          cat: "acc", season: "ss",    price: 29000,                     colors: ["네이비", "베이지"],         isNew: true,  fabric: "코튼 100%" },
  { id: 29, name: "울 머플러",               cat: "acc", season: "fw",    price: 39000,  listPrice: 46000,  colors: ["카멜", "그레이"],                         fabric: "울 100%" },
  { id: 30, name: "레더 벨트",               cat: "acc",    price: 35000,                     colors: ["블랙", "브라운"],                         fabric: "소가죽, 황동 버클" },
  { id: 31, name: "퀼팅 라이너 베스트",        cat: "outer", season: "fw",  price: 69000,                     colors: ["올리브", "블랙"],                         fabric: "나일론 100%, 충전재 폴리에스터" },
  { id: 32, name: "보트넥 스트라이프 티셔츠",   cat: "top", season: "ss",    price: 34000,                     colors: ["네이비", "아이보리"],                     fabric: "코튼 100%" },
  { id: 33, name: "플란넬 체크 셔츠",          cat: "shirt", season: "fw",  price: 43400,  listPrice: 62000,  colors: ["블랙", "네이비", "버건디"], isNew: true,  fabric: "코튼 100% 기모 플란넬",
    images: { "블랙": ["images/products/flannel-check-shirt-black-1.jpg", "images/products/flannel-check-shirt-black-2.jpg"], "네이비": ["images/products/flannel-check-shirt-navy-1.jpg", "images/products/flannel-check-shirt-navy-2.jpg"], "버건디": ["images/products/flannel-check-shirt-burgundy-1.jpg", "images/products/flannel-check-shirt-burgundy-2.jpg"] } },
  { id: 34, name: "핸드메이드 울 발마칸 코트",  cat: "outer", season: "fw",  price: 229000, listPrice: 269000, colors: ["베이지", "차콜"],           isNew: true,  fabric: "울 90%, 캐시미어 10%",
    images: { "베이지": ["images/products/wool-balmacaan-coat-beige-1.jpg", "images/products/wool-balmacaan-coat-beige-2.jpg"], "차콜": ["images/products/wool-balmacaan-coat-charcoal-1.jpg", "images/products/wool-balmacaan-coat-charcoal-2.jpg"] } },
  { id: 35, name: "울 셔츠 블루종",            cat: "outer", season: "fw",  price: 119000,                    colors: ["블랙", "브라운"],           isNew: true,  fabric: "울 70%, 폴리에스터 30%",
    images: { "블랙": ["images/products/wool-shirt-blouson-black-1.jpg", "images/products/wool-shirt-blouson-black-2.jpg"], "브라운": ["images/products/wool-shirt-blouson-brown-1.jpg", "images/products/wool-shirt-blouson-brown-2.jpg"] } },
];

const SIZES = {
  outer: ["S", "M", "L", "XL"],
  top: ["S", "M", "L", "XL"],
  shirt: ["S", "M", "L", "XL"],
  bottom: ["28", "30", "32", "34"],
  knit: ["S", "M", "L"],
  shoes: ["240", "250", "260", "270", "280"],
  bag: ["FREE"],
  acc: ["FREE"],
};
