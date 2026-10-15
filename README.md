# PLAIN DAYS

미니멀 의류 쇼핑몰 웹사이트입니다. 사이트 빌더 없이 HTML, CSS, JavaScript로 직접 만들었습니다.

## 파일 구성

- `index.html` 상품 목록 페이지 (카테고리, 정렬, 페이지 번호)
- `product.html` 상품 상세 페이지 (색상, 사이즈, 수량, 장바구니)
- `js/products.js` 상품 데이터. 상품을 추가하거나 고칠 때 이 파일만 바꾸면 됩니다.
- `js/app.js` 헤더, 푸터, 장바구니, 페이지 동작
- `css/style.css` 디자인
- `images/` 로고, 스탬프, 파비콘

## 실제 사진 넣기

`images/` 폴더에 사진을 올리고, `js/products.js`의 상품에 `images: ["images/coat-1.jpg", "images/coat-2.jpg"]`처럼 넣으면 그림 대신 사진이 나옵니다.

## 참고

장바구니는 방문자 브라우저에만 저장되고, 결제는 아직 연결되어 있지 않습니다.
