/*-----------------------------------*\
  # 장바구니 페이지 cart js
\*-----------------------------------*/

import { router } from '../../main.js';
import { $ } from '../../utils/dom.js';
import { pushInCart, updateInfo } from '../productDetail/productDetail.js';
import { shoppingCartStore } from '../../store/shoppingCartStore.js';
import { cartSVG } from '../../importIMGFiles.js';
import { renderPage } from '../../utils/render.js';

/** 장바구니 총 가격 렌더링 */
export const renderCartTotalPrice = () => {
  const cartTotalPrice = shoppingCartStore
    .getLocalStorage()
    .map((items) => items.price);

  const cartTotalPriceReduce = cartTotalPrice.reduce((acc, val) => {
    return acc + val;
  }, 0);

  return cartTotalPriceReduce;
};

/** 장바구니 비었을 때 '결제하기 버튼' 예외처리 */
const handleCartPaymentBtn = () => {
  const enableBtn = `<button class="cart__price--paymentBtn cartPaymentBtn">결제하기</button>`;
  const disabledBtn = `<button class="cart__price--paymentBtn-disabled cartPaymentBtn" disabled='true' >결제하기</button>`;
  if (shoppingCartStore.getLocalStorage().length >= 1) {
    return enableBtn;
  } else if (shoppingCartStore.getLocalStorage().length === 0) {
    return disabledBtn;
  }
};

// 장바구니 페이지 초기 렌더링
export const renderInitCartPage = `
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
        >${handleCartPaymentBtn()}</a
      >
    </aside>
  </div>
</section>
`;

/** 장바구니 결제금액 렌더링 */
export const renderCartOrderPrice = () => {
  // [장바구니] 총 결제 금액
  // cartTotalPaymentPrice =
  //   cartTotalOrderPrice + cartDiscountPrice + cartDeliveryPrice;
  const cartOrderPriceTemplate = `
  <div class="cart__price--border">
    <div class="cart__price--calc">
      <div class="cart__price--calc-orderPrice">
        <span class="cartOrderPrice">총 주문 금액</span>
        <p class="cartOrderPrice">${renderCartTotalPrice().toLocaleString()} 원</p>
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
      <p class="cartTotalPaymentPrice">${renderCartTotalPrice().toLocaleString()} 원</p>
    </div>
  </div>
  <a href="/payment" data-navigo>
    ${handleCartPaymentBtn()}
  </a>
`;

  $('.app').querySelector('.cart__price').innerHTML = cartOrderPriceTemplate;
};

console.log(shoppingCartStore.getLocalStorage().length);
/** 장바구니 제품 리스트 렌더링 */
export const renderCartList = (storage) => {
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
        <div class="btn-wrap"><button class="cart__item--deleteBtn cartProductDeleteBtn">삭제</button></div>
      </div>
    </li>
    `;
    })
    .join('');

  renderCartTotalPrice();
  renderCartOrderPrice();
  $('.app').querySelector('.cart__list').innerHTML = cartListTemplate;
};

/** 장바구니 localStorage에 저장하는 함수 - 찜하기 페이지에서 재활용 */
export const storeLocalStorage = (id) => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  console.log('existingItem', existingItem);

  if (existingItem) {
    existingItem.price += existingItem.pricePerOne;
    existingItem.qty += 1;
    existingItem.count += 1;
    shoppingCartStore.setLocalStorage(shoppingCartArr);
  }
  // shoppingCartArr
  console.log('장바구니에서 ++', shoppingCartArr);
};

/** 빈 장바구니일 때, 상품이 있는 장바구니일 때 */
export const renderCartPage = () => {
  if (shoppingCartStore.getLocalStorage().length === 0) {
    renderCartList(shoppingCartStore.getLocalStorage());
    renderPage(renderInitCartPage);
    // return;
  } else if (shoppingCartStore.getLocalStorage().length >= 1) {
    // 장바구니에 넣은 상품 렌더링
    renderCartList(shoppingCartStore.getLocalStorage());
    // 결제금액 렌더링
    // renderCartTotalPrice();
    return;
  }
};

/** 버튼 요소 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  // [장바구니 페이지]에서 장바구니에 상품이 없을 때, '계속 쇼핑하기' 버튼 클릭 -> [메인페이지]로 이동
  if (e.target.classList.contains('cartEmpty-goToShoppingBtn')) {
    console.log(e.target);
    router.navigate('/category/keyboards');
    return;
  }

  // [장바구니]에서 '구매하기' 버튼 클릭 클릭 -> [결제 페이지]로 이동
  if (e.target.classList.contains('cartPaymentBtn')) {
    console.log(e.target);
    if (localStorage.getItem('token')) {
      router.navigate('/payment');
    } else {
      alert('로그인이 필요한 페이지 입니다. 로그인 페이지로 이동합니다.');
      // 로그인 페이지로 이동
      router.navigate('/');
    }
    return;
  }
});

/** 구매수량 추가 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  const detailProductId = e.target.closest('.section__container')?.dataset
    .productId;
  updateInfo(e, detailProductId);
});

/** 장바구니 담기 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  pushInCart(e);
});

/** 장바구니 페이지에서 수량 핸들링 */
$('.app').addEventListener('click', (e) => {
  const id = e.target.closest('li')?.dataset.productId;
  // 구매 수량 +
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  if (e.target.classList.contains('cart-addQtyBtn')) {
    storeLocalStorage(id);
    // shoppingCartStore.setLocalStorage(shoppingCartArr);
    // 카트 페이지 렌더
    renderCartPage();
    return;
  }

  // 구매 수량 -
  if (e.target.classList.contains('cart-minusQtyBtn')) {
    // let shoppingCartArr = shoppingCartStore.getLocalStorage();
    const existingItem = shoppingCartArr.find((item) => item.id === id);
    console.log('existingItem', existingItem);

    if (existingItem) {
      if (existingItem.price > existingItem.pricePerOne) {
        existingItem.price -= existingItem.pricePerOne;
      }
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;
      }
      if (existingItem.count > 1) {
        existingItem.count -= 1;
      }

      console.log('장바구니에서 --', shoppingCartArr);
      // 카트 페이지 렌더
      shoppingCartStore.setLocalStorage(shoppingCartArr);
      renderCartPage();
    }
  }

  // 장바구니에서 삭제
  if (e.target.classList.contains('cartProductDeleteBtn')) {
    shoppingCartArr = shoppingCartStore
      .getLocalStorage()
      .filter((item) => item.id !== id);
    // storeLocalStorage(id);
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    console.log(shoppingCartArr);
    renderCartPage();
    return;
  }
});

/** /cart 핸들링 함수 */
export const handleCartPage = () => {
  $('.modal__addCart').style.display = 'none';
  console.log('/cart');

  renderPage(renderInitCartPage);
  // 카트 페이지 렌더
  renderCartPage();
};
