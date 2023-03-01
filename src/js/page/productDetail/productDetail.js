/*-----------------------------------*\
  제품 상세 페이지  #productDetail js
\*-----------------------------------*/

import { router } from '../../main.js';
import { $ } from '../../utils/dom.js';
import { addHeart, emptyHeart, cartSVG } from '../../importIMGFiles.js';
import { getDetailProduct } from '../../api.js';
import { wishListStore } from '../../store/wishListStore.js';
import { shoppingCartStore } from '../../store/shoppingCartStore.js';
import { recentViewStore } from '../../store/recentViewStore.js';
import { renderInitHeaderLogin } from '../login.js';
import { formatPrice } from '../../utils/format.js';

/** 찜하기 상품 유/무에 따라 다른 초기화면 렌더링 */
export const checkWhetherAddWishList = (id) => {
  let wishListArr = wishListStore.getLocalStorage();
  // console.log('wishListArr', wishListArr);
  const existingItem = wishListArr.find((item) => item.id === id);
  // console.log('existingItem', existingItem);
  return existingItem ? addHeart : emptyHeart;
};

/** 찜하기 목록에 저장 */
export const storeWishList = (id, count, thumbnail, title, pricePerOne) => {
  let wishListArr = wishListStore.getLocalStorage();
  const existingItem = wishListStore
    .getLocalStorage()
    .find((item) => item.id === id);
  if (!existingItem) {
    wishListArr.unshift({ id, count, thumbnail, title, pricePerOne });
    wishListStore.setLocalStorage(wishListArr);
    console.log('wishListArr', wishListArr);
  } else if (existingItem) {
    wishListArr = wishListArr.filter((item) => item.id !== id);
    console.log('wishListArr 이미 찜', wishListArr);
    wishListStore.setLocalStorage(wishListArr);
  }
  console.log('wishListArr2', wishListArr);
};

///////////////////////////

/** [제품 상세페이지] skeleton ui 초기 렌더링 */
export const renderSkeletonUIinDetailProductPage = () => {
  const skeletonUITemplate = `
    <div class="productDetail__skeleton--container">
      <div class="productDetail__skeleton--img"></div>
      <div class="productDetail__skeleton--aside">
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
      </div>
    </div>
`;

  const skeletonUI12 = Array(1)
    .fill(skeletonUITemplate)
    .map((v, i) => {
      return v;
    })
    .join('');

  $('.app').innerHTML = skeletonUI12;
};
/** 장바구니에 저장 */
export const storeCart = (id, price, count, thumbnail, title, pricePerOne) => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  // id 값을 찾고
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  // 새로운 아이템이면 추가
  if (!existingItem) {
    shoppingCartArr.push({ id, price, count, thumbnail, title, pricePerOne });
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    console.log('shoppingCartArr.push', shoppingCartStore.getLocalStorage());
    console.log('shoppingCartArr.push', shoppingCartArr);
    return;
  } else if (existingItem) {
    // 이미 아이템이면 기존 수량, 가격에 누적 추가
    existingItem.count += count;
    existingItem.price += price;
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    return;
  }
  console.log(shoppingCartArr);
};

/** 구매 수량 */
let productDetailProductQty = 1;
/** 총 상품 금액 */
let productDetailTotalPrice;
let productDetailTitle;
let productDetailThumbnail;
let productDetailPricePerOne;

/** [제품 상세페이지] 렌더링 함수 */
export const renderDetailProduct = async (productId) => {
  renderInitHeaderLogin();
  const productDetail = await getDetailProduct(productId);
  const { description, id, isSoldOut, photo, price, tags, title, thumbnail } =
    productDetail;
  console.log('productDetail', productDetail);
  storeRecentViewed(id, title, thumbnail);

  // 총 금액 계산, 제품title, thumbnail, 상품 개당 가격
  productDetailTotalPrice = price * productDetailProductQty;
  productDetailTitle = title;
  productDetailThumbnail = thumbnail;
  productDetailPricePerOne = price;

  const productTags = tags
    .map((tag) => {
      return `<li class="aside__productDetail--info-tagLists-tag">${tag}</li>`;
    })
    .join('');

  /** 상세 제품 레이아웃 html */
  const detailProductTemplate = /* html */ `
  <div class="section__container" data-product-id="${id}">
    <section class="section__productDetail">
      <img
        src="${thumbnail}"
        alt="${title}"
      />
    </section>
    <aside class="aside__productDetail-menu">
      <div class="aside__productDetail--info">
        <h2 class="aside__productDetail--info-title" id="productDetail-title">
          ${title}
        </h2>
        <div class="aside__productDetail--info-sec">
          <div class="aside__productDetail--info-sec-price">
            ${price.toLocaleString()} 원
          </div>
          <div class="aside__productDetail--info-sec-wishlist">
            <button class="aside__productDetail--info-wishlistBtn">
              <img class="aside__productDetail--info-wishlistImg" 
                src="${checkWhetherAddWishList(id)}" alt="찜하기 버튼" />
            </button>
          </div>
        </div>
        <p class="aside__productDetail--info-desc">
          ${description}
        </p>
        <ul class="aside__productDetail--info-tagLists">
          ${productTags}
        </ul>
      </div>

      <div class="aside__productDetail--count">
        <p class="aside__productDetail--count-buy">구매 수량</p>
        <div class="aside__productDetail--count-btns">
          <button class="aside__productDetail--count-btn minusQtyBtn">-</button>
          <span class="aside__productDetail--count-qty Qty" id="productDetailProductQty">${productDetailProductQty}</span>
          <button class="aside__productDetail--count-btn addQtyBtn">+</button>
        </div>
      </div>
      <div class="aside__productDetail--totalPrice">
        <p>총 상품 금액</p>
        <p id="productDetail-totalPrice">${productDetailTotalPrice.toLocaleString()}</p>
      </div>
      <div class="aside__productDetail--btns">
        ${
          !isSoldOut
            ? `<button class="aside__productDetail--btns-cart addCartBtn">장바구니에 담기</button>
        <button class="aside__productDetail--btns-buy buyBtn">구매하기</button>`
            : ` <button class="aside__productDetail--btns-soldOut">해당 상품은 품절입니다.</button>`
        }
      </div>
    </aside>
  </div>
  `;

  $('.app').innerHTML = detailProductTemplate;
};

/** [제품 상세 페이지] 장바구니 담기 핸들 함수 */
export const pushInCart = (e) => {
  if (
    e.target.classList.contains('addCartBtn') ||
    e.target.classList.contains('buyBtn')
  ) {
    const id = e.target.closest('.section__container').dataset.productId;
    console.log(id);
    const price = productDetailTotalPrice;
    const count = productDetailProductQty;
    const title = productDetailTitle;
    const thumbnail = productDetailThumbnail;
    const pricePerOne = productDetailPricePerOne;

    storeCart(id, price, count, thumbnail, title, pricePerOne);
    // shoppingCartStore.setLocalStorage(shoppingCartStore.getLocalStorage());
    console.log('shoppingCartArr.push', shoppingCartStore.getLocalStorage());
  }
};

/** 구매수량 핸들링 함수 */
export const updateInfo = async (e, productId) => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  // 구매 수량 -
  if (e.target.classList.contains('minusQtyBtn')) {
    productDetailProductQty -= 1;
    // 구매 수량 렌더링
    $(
      '.aside__productDetail--count-qty',
    ).innerHTML = `${productDetailProductQty}`;
    // 구매 가격 렌더링
    $('#productDetail-totalPrice').innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;
    if (productDetailProductQty === 0) {
      productDetailProductQty = 1;
    }
    $(
      '.aside__productDetail--count-qty',
    ).innerHTML = `${productDetailProductQty}`;
    $('#productDetail-totalPrice').innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;
    // renderDetailProduct(productId);
    // renderCartPage();
    return;
  }
  // 구매 수량 +
  if (e.target.classList.contains('addQtyBtn')) {
    console.log('저장+');
    productDetailProductQty += 1;
    // 구매 수량 렌더링
    $(
      '.aside__productDetail--count-qty',
    ).innerHTML = `${productDetailProductQty}`;
    // 구매 가격 렌더링
    $('#productDetail-totalPrice').innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;
    // productDetailProductQty += 1;

    // renderDetailProduct(productId);
    // renderCartPage();
    return;
  }

  shoppingCartStore.setLocalStorage(shoppingCartArr);
};

/** 모달 핸들 함수 */
export const handleModal = (e) => {
  // '장바구니에 담기' 버튼 클릭 시, 모달 오픈
  if (
    e.target.classList.contains('addCartBtn') ||
    e.target.classList.contains('wishList-AddToCartBtn')
  ) {
    $('.modal__addCart').style.display = 'block';
    return;
  }

  // '모달 창 밖에 클릭 시 닫기'
  if (e.target !== $('.modal__addCart')) {
    $('.modal__addCart').style.display = 'none';
    return;
  }

  // 모달 '장바구니로 바로가기' or '계속 쇼핑하기' 클릭 시 모달 닫기
  if (e.target === $('.goToCart') || e.target === $('.modal-keepShopping')) {
    $('.modal__addCart').style.display = 'none';
    return;
  }
};

/** 모달 핸들 이벤트 */
document.body.addEventListener('click', (e) => {
  handleModal(e);
});

/** 제품 상세 페이지 찜하기 버튼 핸들링 이벤트  */
$('.app').addEventListener('click', (e) => {
  if (e.target.classList.contains('aside__productDetail--info-wishlistImg')) {
    const id = e.target.closest('.section__container')?.dataset.productId;
    console.log('id', id);
    const count = 1;
    const title = productDetailTitle;
    const thumbnail = productDetailThumbnail;
    const pricePerOne = productDetailPricePerOne;

    storeWishList(id, count, thumbnail, title, pricePerOne);
    wishListStore.setLocalStorage(wishListStore.getLocalStorage());

    // 찜하기 버튼
    const wishListIMG = `<img class="aside__productDetail--info-wishlistImg" 
    src="${checkWhetherAddWishList(id)}" alt="찜하기 버튼" />`;
    $('.aside__productDetail--info-wishlistBtn').innerHTML = wishListIMG;
  }

  // [제품 상세 페이지]에서 '장바구니로 바로가기' 버튼 클릭 클릭 -> [장바구니 페이지]로 이동
  if (e.target.classList.contains('goToCart')) {
    console.log(e.target);
    router.navigate('/cart');
    return;
  }

  // [제품 상세 페이지]에서 '구매하기' 버튼 클릭 클릭 -> [결제 페이지]로 이동
  if (e.target.classList.contains('buyBtn')) {
    console.log(e.target);
    if (window.localStorage.getItem('token')) {
      router.navigate('/payment');
    } else {
      alert('로그인이 필요한 페이지 입니다. 로그인 페이지로 이동합니다.');
      // 로그인 페이지로 이동
      router.navigate('/login');
    }
    return;
  }
});

/** '최근 본 상품' localStorage에 저장 */
const storeRecentViewed = (id, title, thumbnail) => {
  let recentViewedArr = recentViewStore.getLocalStorage();
  console.log(recentViewedArr);

  const existingItem = recentViewedArr.find((item) => item.id === id);
  // const newRecentViewedArr = recentViewedArr.filter((item) => item.id === id);

  // console.log(newRecentViewedArr);
  console.log(existingItem);
  if (existingItem) {
    const existingIndex = recentViewedArr.findIndex(
      (item) => item.id === existingItem.id,
    );
    console.log(existingIndex);
    recentViewedArr = recentViewedArr.slice(existingIndex, 0);
    recentViewedArr.unshift({ id, title, thumbnail });
    return;
  } else if (!existingItem) {
    // let recentViewedArr = recentViewStore.getLocalStorage();
    recentViewedArr.unshift({ id, title, thumbnail });
    recentViewStore.setLocalStorage(recentViewedArr);
    return;
  }
  // let recentViewedArr = recentViewStore.getLocalStorage();
  // recentViewedArr.unshift({ id, title, thumbnail });
  // recentViewStore.setLocalStorage(recentViewedArr);
};

/** /product/:id 핸들링 함수 */
export const handleDetailProductPage = async (params) => {
  renderSkeletonUIinDetailProductPage();
  await renderDetailProduct(params);
};
