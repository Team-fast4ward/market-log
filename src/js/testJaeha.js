import Navigo from 'navigo';
const router = new Navigo('/');
const $ = (selector) => document.querySelector(selector);
import { air60, air75, halo65, halo75, halo96 } from './importIMGFiles.js';

/** 렌더 함수 for navigo */
const renderPage = (html) => {
  $('.app').innerHTML = html;
};

const BASE_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api';
const headers = {
  'content-type': 'application/json',
  apikey: 'FcKdtJs202301',
  username: 'KDT4_Team3',
};

const getAllProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      headers: {
        ...headers,
        masterKey: true,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

/*-----------------------------------*\
  #메인 페이지
\*-----------------------------------*/

const renderMainPageTemplate = `
<div class="mainPage">
  <div class="mainPage__container">
    <div class="mainPage__content">
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <img
            class="mainPage__hero--img"
            src="${halo96}"
            alt=""
          />
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 96</h2>
            <div class="mainPage__hero--desc">Shortcut your 9 to 6</div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>
      <!-- Halo 75 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <img
            class="mainPage__hero--img"
            src="${halo75}"
            alt=""
          />
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 75</h2>
            <div class="mainPage__hero--desc">
              New heights, new lights, and new highlights
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Halo 65 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${halo65}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 65</h2>
            <div class="mainPage__hero--desc">
              New heights, new lights, and new highlights
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Air 60 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${air60}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Air 60</h2>
            <div class="mainPage__hero--desc">
              Revolutionizing the laptop experience
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Air 75 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${air75}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Air 75</h2>
            <div class="mainPage__hero--desc">
              The world's thinnest mechanical keyboard
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
`;
// renderPage(renderMainPageTemplate);

/*-----------------------------------*\
  #카테고리 페이지 # category js
\*-----------------------------------*/

/** 카테고리 페이지 초기 템플릿 */
const renderInitCategoryPage = `
  <div class="categoryPage">
    <div class="categoryPage__container">
      <!-- aside -->
      <aside class="categoryPage__aside--sort">
        <div class="categoryPage__aside--sortByPrice">price</div>
        <div class="categoryPage__aside--sortByAvailable">Availability</div>
      </aside>
      <!-- category main -->
      <div class="categoryPage__main">
        <div class="categoryPage__main--container">
          <div class="categoryPage__main--filter">
            <div class="categoryPage__main--filter-totalQty"></div>
            <div class="categoryPage__main--filter-sort">
              <select class="categoryPage__main--filter-select" id="categoryPage-filterByPrice">
                <option selected>정렬</option>
                <option value="LowToHigh">낮은 가격 순</option>
                <option value="HighToLow">높은 가격 순</option>
              </select>
            </div>
          </div>
        </div>
        <ul class="categoryPage__product--lists"></ul>
      </div>
    </div>
  </div>
`;

/** 카테고리 페이지 제품 db에서 불러오기 */
const renderCategoryProductList = (items) => {
  const categoryProductListTemplate = items
    .map((item) => {
      const { id, price, thumbnail, title } = item;

      return `
    <li class="categoryPage__product--list" data-product-id="${id}">
      <a href="/product/${id}">
        <div class="categoryPage__product--img">
          <img src="${thumbnail}" alt="${title}" />
        </div>
        <div class="categoryPage__product--info">
          <h3 class="categoryPage__product--info-title">
            ${title}
          </h3>
          <span class="categoryPage__product--info-price">
            ${price.toLocaleString()} 원
          </span>
        </div>
      </a>
    </li>
    `;
    })
    .join('');

  $('.categoryPage__product--lists').innerHTML = categoryProductListTemplate;
};

/** 카테고리 태그 필터링 함수 */
const getProductTags = async () => {
  const allProductArray = await getAllProducts();
  // const allTags = allProductArray.map((items) => {
  //   return items.tags;
  // });
  const filterKeyboardTag = allProductArray.filter((item) => {
    return item.tags[0] === '키보드';
  });

  const filterKeycapTag = allProductArray.filter((item) => {
    return item.tags[0] === '키캡';
  });
  const filterSwitchTag = allProductArray.filter((item) => {
    return item.tags[0] === '스위치';
  });
  const filterAccessoryTag = allProductArray.filter((item) => {
    return item.tags[0] === '액세서리';
  });
  return [
    filterKeyboardTag,
    filterKeycapTag,
    filterSwitchTag,
    filterAccessoryTag,
  ];
};

/** 가격낮은순 정렬 후 렌더링 함수 */
const getSortedLowToHighPriceProduct = async () => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[0];
  const LowToHighPrice = keyboardCategoryProduct.sort((a, b) => {
    return a.price - b.price;
  });
  console.log('LowToHighPrice', LowToHighPrice);
  // $('.categoryPage__product--lists').innerHTML = LowToHighPrice;
  // return keyboardCategoryProduct;
  renderCategoryProductList(await LowToHighPrice);
  return;
};

/** 가격높은순 정렬 후 렌더링 함수 */
const getSortedHighToLowPriceProduct = async () => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[0];
  const HighToLowPrice = keyboardCategoryProduct.sort((a, b) => {
    return b.price - a.price;
  });
  console.log('HighToLowPrice', HighToLowPrice);
  renderCategoryProductList(await HighToLowPrice);
  return;
};

// $('#categoryPage-filterByPrice').options[
//   $('#categoryPage-filterByPrice').selectIndex
// ].text;

const renderCategoryProductBySelect = async (condition) => {
  if (condition === 'LowToHigh') {
    return await getSortedLowToHighPriceProduct();
  } else if (condition === 'HighToLow') {
    return await getSortedHighToLowPriceProduct();
  }
};

$('.app')
  .querySelector('#categoryPage-filterByPrice')
  ?.addEventListener('change', async (e) => {
    console.log(e.target);
    const renderCategory = renderCategoryProductBySelect(
      $('#categoryPage-filterByPrice').options[
        $('#categoryPage-filterByPrice').selectIndex
      ].text,
    );
    $('.categoryPage__product--lists').innerHTML(renderCategory);
  });

/** 카테고리별 상품 개수 렌더링 */
const renderCategoryProductQty = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const categoryTotalQty = await getKeyBoardCategory[i];
  $(
    '.categoryPage__main--filter-totalQty',
  ).innerHTML = `${categoryTotalQty.length}개 상품`;
};

/*-----------------------------------*\
  제품 상세 페이지  #productDetail js
\*-----------------------------------*/

// productDetail 제품 상세페이지
// 라우터 라이브러리
import heart from '../../public/heart.svg';
import cartSVG from '../../public/cart.svg';

/** 장바구니 localStorage */
export const shoppingCartStore = {
  setLocalStorage(product) {
    localStorage.setItem('shoppingCart', JSON.stringify(product));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('shoppingCart')) || [];
  },
  removeLocalStorage() {
    return localStorage.removeItem('shoppingCart');
  },
  clearLocalStorage() {
    localStorage.clear();
  },
};
let shoppingCartArr = [];
shoppingCartArr = shoppingCartStore.getLocalStorage();
console.log(shoppingCartArr);

/** 장바구니에 저장 */
const storeCart = (id, price, count, thumbnail, title, pricePerOne) => {
  // id 값을 찾고
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  // 새로운 아이템이면 추가
  if (!existingItem) {
    shoppingCartArr.push({ id, price, count, thumbnail, title, pricePerOne });
    console.log('shoppingCartArr.push', shoppingCartArr);
    return;
  } else if (existingItem) {
    // 이미 아이템이면 기존 수량, 가격에 누적 추가
    existingItem.count += count;
    existingItem.price += price;
    return;
  }
  // shoppingCartStore.setLocalStorage(shoppingCartArr);
  console.log(shoppingCartArr);
};

/** 상세 제품 db에서 불러오기 */
const getDetailProduct = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    console.log('err: ', '해당 제품을 불러오기 실패');
  }
};

/** 계좌 목록 및 잔액 조회 db에서 불러오기 */

const getAccountDetail = async () => {
  try {
    const res = await fetch(`${BASE_URL}/account`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    const { accounts, totalBalance } = data;

    return accounts;
  } catch (err) {
    console.log(err);
    console.log('err: ', '계좌목록 조회 실패');
  }
};

/** 구매 수량 */
let productDetailProductQty = 1;
/** 총 상품 금액 */
let productDetailTotalPrice;
let productDetailTitle;
let productDetailThumbnail;
let productDetailPricePerOne;

const renderDetailProduct = async (productId) => {
  const productDetail = await getDetailProduct(productId);
  const { description, id, isSoldOut, photo, price, tags, title, thumbnail } =
    productDetail;
  console.log('productDetail', productDetail);

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
            <button>
              <img src="${heart}" alt="찜하기 버튼" />
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

const init = () => {
  if (shoppingCartStore.getLocalStorage().length > 0) {
    shoppingCartArr = shoppingCartStore.getLocalStorage();
  }

  renderDetailProduct('4mZdaj6ioV9b0yXqLPKK');
  // renderDetailProduct('UcGtdmglg7bzIFDosY9D');
  // shoppingCartStore.setLocalStorage(shoppingCartArr);
};
// init();

/** 렌더 함수 for navigo */

// const renderPage = (html) => {
//   $('.app').innerHTML = html;
// };

/** 구매수량 추가 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  const detailProductId = e.target.closest('.section__container')?.dataset
    .productId;
  updateInfo(e, detailProductId);
});

/** 구매수량 핸들링 함수 */
const updateInfo = async (e, productId) => {
  // 구매 수량 -
  if (e.target.classList.contains('minusQtyBtn')) {
    productDetailProductQty -= 1;
    if (productDetailProductQty === 0) {
      productDetailProductQty = 1;
    }
    renderDetailProduct(productId);
    // renderCartPage();
    return;
  }
  // 구매 수량 +
  if (e.target.classList.contains('addQtyBtn')) {
    productDetailProductQty += 1;

    renderDetailProduct(productId);
    // renderCartPage();
    return;
  }
  shoppingCartStore.setLocalStorage(shoppingCartArr);
};

/** 장바구니 담기 핸들 이벤트 */
$('.app').addEventListener('click', (e) => {
  pushInCart(e);
});

/** 장바구니 담기 핸들 함수 */
const pushInCart = (e) => {
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
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    console.log('shoppingCartArr.push', shoppingCartArr);
  }
};

/** 모달 핸들 이벤트 */
document.body.addEventListener('click', (e) => {
  handleModal(e);
});

/** 모달 핸들 함수 */
const handleModal = (e) => {
  // '장바구니에 담기' 버튼 클릭 시, 모달 오픈
  if (e.target.classList.contains('addCartBtn')) {
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

/*-----------------------------------*\
  # 장바구니 페이지 cart js
\*-----------------------------------*/

let cartProductTotalPrice;

let cartTotalPaymentPrice; // [장바구니] 총 결제 금액
let cartTotalOrderPrice; // [장바구니] 총 주문 금액
let cartDiscountPrice = 0; // [장바구니] 할인 금액
let cartDeliveryPrice = 0; // [장바구니] 배송비

/** 장바구니 총 가격 렌더링 */
const renderCartTotalPrice = () => {
  const cartTotalPrice = shoppingCartArr.map((items) => items.price);
  const cartTotalPriceReduce = cartTotalPrice.reduce((acc, val) => {
    return acc + val;
  }, 0);

  cartTotalOrderPrice = cartTotalPriceReduce;
  return cartTotalOrderPrice;
};

// 장바구니 페이지 초기 렌더링
const renderInitCartPage = `
<section class="cart">
  <div class="cart__header"><h2>장바구니</h2></div>
  <div class="cart__container">
    <ul class="cart__list">
      <div class="cart__empty">
        <img src="${cartSVG}" alt="빈 장바구니" />
        <h3>장바구니가 비었습니다.</h3>
        <button class="cartEmpty-goToShoppingBtn">쇼핑하러 가기</button>
      </div>
    </ul>
    
    <!-- 총 주문 금액 -->
    <aside class="cart__price">
      <div class="cart__price--border">
        <div class="cart__price--calc">
          <div class="cart__price--calc-orderPrice">
            <span class="cartOrderPrice">총 주문 금액</span>
            <p class="cartOrderPrice">0 원</p>
          </div>
          <div class="cart__price--calc-discountPrice">
            <span>할인 금액</span>
            <p class="cartDiscountPrice">0 원</p>
          </div>
          <div class="cart__price--calc-deliveryPrice">
            <span>배송비</span>
            <p class="cartDeliveryPrice">0 원</p>
          </div>
        </div>
        <div class="cart__price--total">
          <span>총 결제 금액</span>
          <p class="cartTotalPaymentPrice">0 원</p>
        </div>
      </div>
      <a href="/payment" data-navigo
        ><button class="cart__price--paymentBtn cartPaymentBtn">
          결제하기
        </button></a
      >
    </aside>
  </div>
</section>
`;

/** 장바구니 결제금액 렌더링 */
const renderCartOrderPrice = () => {
  // [장바구니] 총 결제 금액
  cartTotalPaymentPrice =
    cartTotalOrderPrice + cartDiscountPrice + cartDeliveryPrice;
  const cartOrderPriceTemplate = `
  <div class="cart__price--border">
    <div class="cart__price--calc">
      <div class="cart__price--calc-orderPrice">
        <span class="cartOrderPrice">총 주문 금액</span>
        <p class="cartOrderPrice">${cartTotalOrderPrice.toLocaleString()} 원</p>
      </div>
      <div class="cart__price--calc-discountPrice">
        <span>할인 금액</span>
        <p class="cartDiscountPrice">0 원</p>
      </div>
      <div class="cart__price--calc-deliveryPrice">
        <span>배송비</span>
        <p class="cartDeliveryPrice">0 원</p>
      </div>
    </div>
    <div class="cart__price--total">
      <span>총 결제 금액</span>
      <p class="cartTotalPaymentPrice">${cartTotalPaymentPrice.toLocaleString()} 원</p>
    </div>
  </div>
  <button class="cart__price--paymentBtn cartPaymentBtn">
    결제하기
  </button>
`;

  $('.app').querySelector('.cart__price').innerHTML = cartOrderPriceTemplate;
};

const renderCartList = (storage) => {
  const cartListTemplate = storage
    .map((item) => {
      const { id, price, count, thumbnail, title } = item;
      cartProductTotalPrice = price;
      return `
    <li class="cart__item" data-product-id="${id}">
      <div class="cart__item-info">
        <div class="cart__item-info--checkbox">
          <input type="checkbox" checked />
        </div>
        <a href="#" data-navigo
          ><div class="cart__item-info--img">
            <img
              src="${thumbnail}"
              alt="${title}"
            /></div
        ></a>
        <a href="/product/${id}" data-navigo
          ><span class="cart__item-info--title">
            ${title}
          </span></a
        >
      </div>
      <div class="cart__item--calc">
        <div class="cart__item--calc-count">
          <button class="cart-minusQtyBtn">-</button>
          <p class="cartProductQty">${count} 개</p>
          <button class="cart-addQtyBtn">+</button>
        </div>
        <span class="cart__item--price cartProductTotalPrice">${price.toLocaleString()} 원</span>
        <button class="cart__item--deleteBtn cartProductDeleteBtn">X</button>
      </div>
    </li>
    `;
    })
    .join('');

  renderCartTotalPrice();
  renderCartOrderPrice();
  $('.app').querySelector('.cart__list').innerHTML = cartListTemplate;
};

const storeLocalStorage = (id) => {
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  console.log('existingItem', existingItem);

  if (existingItem) {
    existingItem.price += existingItem.pricePerOne;
    existingItem.qty += 1;
    existingItem.count += 1;
    return;
  }
  // shoppingCartArr
  shoppingCartStore.setLocalStorage(shoppingCartArr);
  console.log('장바구니', shoppingCartArr);
};

/** 장바구니 페이지에서 수량 핸들링 */
$('.app').addEventListener('click', (e) => {
  const id = e.target.closest('li')?.dataset.productId;

  // 구매 수량 +
  if (e.target.classList.contains('cart-addQtyBtn')) {
    storeLocalStorage(id);
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    // 카트 페이지 렌더
    renderCartPage();
    return;
  }

  // 구매 수량 -
  if (e.target.classList.contains('cart-minusQtyBtn')) {
    const existingItem = shoppingCartArr.find((item) => item.id === id);
    console.log('existingItem', existingItem);

    if (existingItem) {
      if (existingItem.price > existingItem.pricePerOne) {
        existingItem.price -= existingItem.pricePerOne;
        // return;
      }
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;
        // return;
      }
      if (existingItem.count > 1) {
        existingItem.count -= 1;
        // return;
      }

      shoppingCartStore.setLocalStorage(shoppingCartArr);
      // 카트 페이지 렌더
      renderCartPage();
      // return;
    }
    return;
  }

  // 장바구니에서 삭제
  if (e.target.classList.contains('cartProductDeleteBtn')) {
    shoppingCartArr = shoppingCartArr.filter((item) => item.id !== id);
    console.log(shoppingCartArr);
    storeLocalStorage(id);
    renderCartPage();
    return;
  }
});

/** 빈 장바구니일 때 화면에 표시 */
const renderInitEmptyCartPage = `
    <div class="cart__empty">
      <img src="${cartSVG}" alt="빈 장바구니" />
      <h3>장바구니가 비었습니다.</h3>
      <a><button class="cartEmpty-goToShoppingBtn">쇼핑하러 가기</button></a>
    </div>
  `;

/** 빈 장바구니일 때, 상품이 있는 장바구니일 때 */
const renderCartPage = () => {
  if (shoppingCartArr.length === 0) {
    renderCartList(shoppingCartArr);
    renderPage(renderInitCartPage);
    return;
  } else if (shoppingCartArr.length >= 1) {
    // 장바구니에 넣은 상품 렌더링
    renderCartList(shoppingCartArr);
    // 결제금액 렌더링
    renderCartTotalPrice();
    return;
  }
};

/*-----------------------------------*\
  # 결제 페이지 # pay js
\*-----------------------------------*/
import {
  hanaBank,
  kakaoBank,
  kbBank,
  nhBank,
  shinhanBank,
  wooriBank,
} from '../js/page/pay/payIMG.js';
import Swiper, { Navigation, Pagination } from 'swiper';
import { render } from 'sass';
Swiper.use([Navigation, Pagination]);

const buyItemAPI = async (productId, accountId) => {
  try {
    const res = await fetch(`${BASE_URL}/products/buy`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productId,
        accountId,
      }),
    });
    const data = await res.json();
    console.log('제품 결제', data);
    return data;
  } catch (err) {
    console.log(err);
    console.log('결제 실패');
  }
};

let availableBankAccount;

/** 제품 총 개수 렌더링 함수 */
const renderProductTotalQty = () => {
  const paymentItemCount = shoppingCartArr.map((items) => items.count);
  const renderProductTotalQty = paymentItemCount.reduce((acc, val) => {
    return acc + val;
  }, 0);

  return renderProductTotalQty;
};

/** 결제 페이지 처음 렌더링 */
const renderInitPaymentPage = `
<section class="pay">
  <div class="pay__container">
    <div class="pay__header"><h2>결제하기</h2></div>
    <div class="pay__info">
      <form class="paymentPage__submitForm">
        <div class="pay__info--header"><h3>주문정보</h3></div>
        <div class="pay__info--orderItem pay__info--order-item">
          <h4>주문상품 <span class="paymentProductQty"></span>개</h4>
          <ul class="pay__info--orderItem-lists"></ul>
        </div>
        <div class="pay__info--orderItem pay__info--address-info">
          <h4>배송지</h4>
          <div class="pay__info--address-container">
            <div class="pay__info--address-form">
              <div class="pay__info-zipcode">
                <h6>우편번호</h6>
                <div class="pay__info-zipcode--data">
                  <input
                    class="pay__info-zipcode--data-input"
                    placeholder="우편번호 찾기를 버튼을 클릭하세요"
                    id="sample5_address"
                    readonly
                    required
                  />
                  <button class="pay__info-zipcode--data-searchBtn">
                    우편번호 찾기
                  </button>
                </div>
              </div>

              <div class="pay__info--order">
                <h6>주소지</h6>
                <div class="pay__info--order-data">
                  <input
                    placeholder="상세 주소"
                    class="pay__info--order-data-address"
                    required
                  />
                </div>
              </div>

              <div class="pay__info--delivery">
                <h6>배송메모</h6>
                <div>
                  <select>
                    <option value="default">
                      배송 메세지를 선택해주세요.
                    </option>
                    <option value="purchase-item">
                      배송 전에 미리 연락 바랍니다.
                    </option>
                    <option value="purchase-item">
                      부재시 경비실에 맡겨 주세요.
                    </option>
                    <option value="purchase-item">
                      부재시 전화 주시거나 문자 남겨 주세요.
                    </option>
                  </select>
                </div>
              </div>
              <div id="map" style="width:300px;height:300px;margin-top:10px;display:none"></div>
            </div>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--payer-info">
          <h4>주문자 정보</h4>
          <div class="pay__info--payer--container">
            <form class="pay__info--payer--form">
              <div class="pay__info--payer--name">
                <h6>주문자</h6>
                <input
                  class="pay__info--payer--name-input"
                  placeholder="이름을 입력해주세요"
                  required
                />
              </div>
              <div class="pay__info--payer--email">
                <h6>이메일</h6>
                <input
                  class="pay__info--payer--email-input"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div class="pay__info--payer--phoneNum">
                <h6>휴대폰</h6>
                <input
                  class="pay__info--payer--phoneNum-input"
                  type="tel"
                  placeholder="휴대폰 번호를 입력해주세요"
                />
              </div>
            </form>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--price-sum">
          <div class="pay__info--width400px">
            <h4>결제 금액</h4>
            <div class="pay__info--payment--container">
              <div class="pay__info--container-totalOrderPrice">
                <h6>총 주문 금액</h6>
                <span class="payTotalOrderPrice">${renderCartTotalPrice().toLocaleString()} 원</span>
              </div>
              <div class="pay__info--container-discountPrice">
                <h6>할인 금액</h6>
                <span class="payDiscountPrice">${cartDiscountPrice.toLocaleString()} 원</span>
              </div>
              <div class="pay__info--container-deliveryPrice">
                <h6>배송비</h6>
                <span class="payDeliveryPrice">${cartDiscountPrice.toLocaleString()} 원</span>
              </div>
              <div class="pay__info--container-totalPaymentPrice">
                <h6>총 결제 금액</h6>
                <span class="payTotalAccountBalance"></span>
                <span class="payTotalPaymentPrice">${renderCartTotalPrice().toLocaleString()} 원</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--payment-method">
          <div class="payment-method">
            <h4>결제수단</h4>
            선택된 계좌: <span class="payment-method__account-selected"></span>
          </div>
          <div class="payment-method__select-card">
            <div class="swiper payment-method__swiper-wrapper">
              <ul class="swiper-wrapper payment-method__card-lists"></ul>
              <div class="swiper-pagination"></div>
              
            </div>
          </div>
          <div class="payment-method__final">
            <ul class="payment-method__final-alert">
              <li>
                - 최소 결제 가능 금액은 총 결제 금액에서 배송비를 제외한
                금액입니다.
              </li>
              <li>
                - 소액 결제의 경우 정책에 따라 결제 금액 제한이 있을 수
                있습니다.
              </li>
            </ul>
            <div class="payment-method__final-confirm--container">
              <button class="payment-method__final-confirm--btn">
                총 ${renderCartTotalPrice().toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>
`;

/** 결제페이지 구매할 제품 리스트 렌더링 */
const renderPaymentProductList = (storage) => {
  const paymentProductListTemplate = storage
    .map((item) => {
      const { id, price, count, thumbnail, title } = item;

      return `
    <li class="pay__info--orderItem-list" data-product-id="${id}">
      <img
        src="${thumbnail}"
        alt="${title}"
      />
      <div class="pay__info--orderItem-desc">
        <h5 class="pay__info--orderItem-title">${title}</h5>
        <div class="pay__info--orderItem-qty">${count} 개</div>
        <div class="pay__info--orderItem-totalprice">${price.toLocaleString()}원</div>
      </div>
    </li>
    `;
    })
    .join('');

  $('.app').querySelector('.pay__info--orderItem-lists').innerHTML =
    paymentProductListTemplate;
};

/** 계좌목록 및 잔액 조회 */
const renderPaymentAccount = async (items) => {
  console.log(items);

  const paymentAccountListTemplate = items
    .map((item) => {
      console.log(item);
      // const { totalBalance, accounts } = item;
      const { id, bankName, bankCode, accountNumber, balance } = item;

      return `
    <li class="swiper-slide payment-method__card-list" data-account-id="${id}">
      <img
        src="${
          bankCode === '081'
            ? hanaBank
            : bankCode === '089'
            ? kbBank
            : bankCode === '090'
            ? kakaoBank
            : bankCode === '011'
            ? nhBank
            : bankCode === '088'
            ? shinhanBank
            : bankCode === '020'
            ? wooriBank
            : bankCode === '004'
            ? kbBank
            : ''
        }"
        width="210"
        height="140"
        alt="${bankName}"
      />
      <p class="payment-method__card-name">${bankName}</p>
      
      <p>${bankCode}</p>
      <p>${accountNumber}</p>
      <p>${balance.toLocaleString()} 원</p>
    </li>
    `;
    })
    .join('');
  $('.app').querySelector('.payment-method__card-lists').innerHTML =
    paymentAccountListTemplate;
};

/** 카카오 맵 렌더링 */
const renderKakaoMap = () => {
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
      center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
      level: 5, // 지도의 확대 레벨
    };

  //지도를 미리 생성
  var map = new daum.maps.Map(mapContainer, mapOption);
  //주소-좌표 변환 객체를 생성
  var geocoder = new daum.maps.services.Geocoder();
  //마커를 미리 생성
  var marker = new daum.maps.Marker({
    position: new daum.maps.LatLng(37.537187, 127.005476),
    map: map,
  });
  function sample5_execDaumPostcode() {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = data.address; // 최종 주소 변수

        // 주소 정보를 해당 필드에 넣는다.
        document.getElementById('sample5_address').value = addr;
        // 주소로 상세 정보를 검색
        geocoder.addressSearch(data.address, function (results, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === daum.maps.services.Status.OK) {
            var result = results[0]; //첫번째 결과의 값을 활용

            // 해당 주소에 대한 좌표를 받아서
            var coords = new daum.maps.LatLng(result.y, result.x);
            // 지도를 보여준다.
            mapContainer.style.display = 'block';
            map.relayout();
            // 지도 중심을 변경한다.
            map.setCenter(coords);
            // 마커를 결과값으로 받은 위치로 옮긴다.
            marker.setPosition(coords);
          }
        });
      },
    }).open();
  }
  $('.app')
    .querySelector('.pay__info-zipcode--data-searchBtn')
    .addEventListener('click', (e) => {
      e.preventDefault();
      sample5_execDaumPostcode();
    });
};

/** 결제하기 버튼 활성화/비활성화 */
const activePaymentBtn = () => {
  const finalPaymentBtn = $('.app').querySelector(
    '.payment-method__final-confirm--btn',
  );
  const selectedPaymentAccount = $('.app').querySelector(
    '.payment-method__account-selected',
  );
  console.log(selectedPaymentAccount.textContent);

  if (selectedPaymentAccount.textContent) {
    finalPaymentBtn.style.backgroundColor = 'var(--logo-color)';
    finalPaymentBtn.style.cursor = 'pointer';
  } else if (!selectedPaymentAccount.textContent) {
    finalPaymentBtn.style.backgroundColor = 'gray';
    // finalPaymentBtn.style.pointerEvents = 'auto';
  }
};

/** swiper 결제 페이지 선택된 계좌 이름 렌더링 */
const renderSelectedPayment = (e) => {
  availableBankAccount = $('.app')
    .querySelectorAll('.payment-method__card-list')
    [e.realIndex].querySelector('.payment-method__card-name').textContent;
  console.log(availableBankAccount);

  $('.app').querySelector('.payment-method__account-selected').innerHTML =
    availableBankAccount;
};

/** 결제페이지에서 작동하는 함수들 */
const paymentPageFunction = async (e) => {
  // 결제가격 재렌더링
  renderCartTotalPrice();
  // 1. 결제수단 불러오기
  await renderPaymentAccount(await getAccountDetail());
  // 2. 결제할 제품들 렌더링
  renderPaymentProductList(shoppingCartArr);
  // 3. 제품 개수
  $('.app').querySelector('.paymentProductQty').innerHTML =
    renderProductTotalQty();
  // 4. 주소찾기 카카오api
  renderKakaoMap();

  // 5. swiper
  var paymentCardSwiper = new Swiper('.payment-method__swiper-wrapper', {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    grabCursor: true,
    on: {
      afterInit: (e) => {
        console.log('결제수단 realIndex', e.realIndex);
        renderSelectedPayment(e);
        activePaymentBtn();
      },
      // <div class="swiper-button-prev payment-method__swiper-button-prev"></div>
      // <div class="swiper-button-next payment-method__swiper-button-next"></div>
    },
  });
};

/** 결제 페이지 최종 결제 버튼의 결제 가격 재렌더링 함수 */
const renderFinalPaymentPrice = () => {
  $(
    '.payment-method__final-confirm--btn',
  ).innerHTML = `총 ${renderCartTotalPrice().toLocaleString()}원 결제하기`;
  $(
    '.payTotalOrderPrice',
  ).innerHTML = `${renderCartTotalPrice().toLocaleString()}원`;
  $(
    '.payTotalPaymentPrice',
  ).innerHTML = `${renderCartTotalPrice().toLocaleString()}원`;
};

/*-----------------------------------*\
  # navigo router
\*-----------------------------------*/

router
  .on({
    '/': async () => {
      $('.modal__addCart').style.display = 'none';
      console.log('/ route is working');
      renderPage(renderMainPageTemplate);
    },
    '/product/:id': async (params) => {
      console.log('product/:id route is working');
      await renderDetailProduct(params.data.id);

      $('.app')
        .querySelector('.buyBtn')
        ?.addEventListener('click', (e) => {
          console.log(e.target);
          router.navigate('/payment');
        });
    },
    '/cart': () => {
      $('.modal__addCart').style.display = 'none';
      // 초기 템플릿, ul태그 삽입
      renderPage(renderInitCartPage);
      console.log('/cart');
      console.log('shoppingCartArr', shoppingCartArr);

      // 카트 페이지 렌더
      renderCartPage();
    },
    '/payment': async () => {
      $('.modal__addCart').style.display = 'none';
      // 초기 결제 페이지 렌더
      renderPage(renderInitPaymentPage);
      renderFinalPaymentPrice();
      // 결제 페이지 렌더 후 실행할 함수들
      await paymentPageFunction();

      /** 결제 버튼 클릭시 결제 진행 (리팩토링 예정)*/
      $('.app')
        .querySelector('.payment-method__final-confirm--btn')
        .addEventListener('click', async (e) => {
          e.preventDefault();
          if ($('.pay__info-zipcode--data-input').value === '') {
            $('.pay__info-zipcode--data-input').focus();
            alert('우편번호를 입력해주세요');
            return;
          }
          if ($('.pay__info--payer--name-input').value === '') {
            $('.pay__info--payer--name-input').focus();
            alert('주문자 이름을 입력해주세요.');
            return;
          }
          // 결제가 성공하면 구매내역 페이지로 라우팅 (지금은 홈으로 이동)
          await handlePaymentBtnLogic(e);
        });
    },
    '/category/keyboards': async () => {
      $('.modal__addCart').style.display = 'none';
      console.log('/category/keyboards');
      renderPage(renderInitCategoryPage);
      const getKeyBoardCategory = await getProductTags();
      renderCategoryProductList(await getKeyBoardCategory[0]);
      await renderCategoryProductQty(0);
      console.log(await getKeyBoardCategory[0]);
      console.log(
        $('#categoryPage-filterByPrice').options[
          $('#categoryPage-filterByPrice').selectedIndex
        ].value,
      );

      $('.app')
        .querySelector('#categoryPage-filterByPrice')
        ?.addEventListener('change', async (e) => {
          console.log(e.target);
          return renderCategoryProductBySelect(
            await $('#categoryPage-filterByPrice').options[
              $('#categoryPage-filterByPrice').selectedIndex
            ].value,
          );
        });
    },
    '/category/keycaps': async () => {
      $('.modal__addCart').style.display = 'none';
      console.log('/category/keycaps');
      const getKeyBoardCategory = await getProductTags();
      renderPage(renderInitCategoryPage);
      renderCategoryProductList(await getKeyBoardCategory[1]);
      await renderCategoryProductQty(1);
    },
    '/category/switches': async () => {
      $('.modal__addCart').style.display = 'none';
      console.log('/category/switches');
      const getKeyBoardCategory = await getProductTags();
      renderPage(renderInitCategoryPage);
      renderCategoryProductList(await getKeyBoardCategory[2]);
      await renderCategoryProductQty(2);
    },
    '/category/accessories': async () => {
      $('.modal__addCart').style.display = 'none';
      console.log('/category/accessories');
      const getKeyBoardCategory = await getProductTags();
      renderPage(renderInitCategoryPage);
      renderCategoryProductList(await getKeyBoardCategory[3]);
      await renderCategoryProductQty(3);
    },
  })
  .resolve();

/** 버튼 요소 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  // [장바구니 페이지]에서 장바구니에 상품이 없을 때, '계속 쇼핑하기' 버튼 클릭 -> [메인페이지]로 이동
  if (e.target.classList.contains('cartEmpty-goToShoppingBtn')) {
    console.log(e.target);
    router.navigate('/');
    return;
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
    router.navigate('/payment');
    return;
  }

  // [장바구니]에서 '구매하기' 버튼 클릭 클릭 -> [결제 페이지]로 이동
  if (e.target.classList.contains('cartPaymentBtn')) {
    console.log(e.target);
    router.navigate('/payment');
    return;
  }
});

/** 현재 선택한 은행계좌의 잔액 확인해주는 함수 */
const checkBalanceOfselectedBankAccount = async (id) => {
  const availableAccount = await getAccountDetail();
  console.log(availableAccount);
  const checkCurrentSelectedBankId = availableAccount.filter((item) => {
    return item.id === id;
  });
  return checkCurrentSelectedBankId;
};

const handlePaymentBtnLogic = async (e) => {
  const currentSelectedBankId = $('.swiper-slide-active').dataset.accountId;
  const productIds = shoppingCartArr.map((items) => {
    return items.id;
  });
  const totalProductPrice = renderCartTotalPrice();
  console.log(totalProductPrice);
  console.log('현재 선택한 계좌 id', currentSelectedBankId);
  console.log('결제할 제품 id', ...productIds);
  const getCurrentSelectedAccount = await checkBalanceOfselectedBankAccount(
    currentSelectedBankId,
  );
  console.log('getCurrentSelectedAccount', getCurrentSelectedAccount);
  const getCurrentSelectedAccountBalance =
    getCurrentSelectedAccount[0]['balance'];

  // 결제 성공
  if (getCurrentSelectedAccountBalance >= totalProductPrice) {
    productIds.map(async (productId) => {
      await buyItemAPI(productId, currentSelectedBankId);
      // localStorage shoppingCart 비워주기
      shoppingCartStore.removeLocalStorage();
      router.navigate('/');
      // 결제 성공 모달
      alert('결제가 성공적으로 되었습니다. 구매내역으로 이동합니다.');
      return;
    });
  } else if (getCurrentSelectedAccountBalance < totalProductPrice) {
    // 결제 실패
    alert('해당 계좌의 잔액이 부족합니다.');
    return;
  }
};
