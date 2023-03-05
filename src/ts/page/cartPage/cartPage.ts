/*-----------------------------------*\
  # 장바구니 페이지 cart js
\*-----------------------------------*/

import { router } from '../../main';
import { $ } from '../../utils/dom';
import { updateInfo } from '../productDetail/productDetail';
import { shoppingCartStore } from '../../store/shoppingCartStore';
import { cartSVG } from '../../importIMGFiles';
import { renderPage } from '../../utils/render';
import { formatPrice } from '../../utils/format';
import { countQtyInCart } from '../mainPage/mainPage';
import {
  ShoppingCartStore,
  ShoppingCartStoreValue,
} from '../../interface/store';

/** 장바구니 총 가격 렌더링 */
export const renderCartTotalPrice = (): number => {
  const cartTotalPrice = shoppingCartStore
    .getLocalStorage()
    .map((items: ShoppingCartStore) => items.price);

  const cartTotalPriceReduce = cartTotalPrice.reduce(
    (acc: number, val: number): number => {
      return acc + val;
    },
    0,
  );

  return cartTotalPriceReduce;
};

/** 장바구니 비었을 때 '결제하기 버튼' 예외처리 */
// const handleCartPaymentBtn = () => {
//   // const shoppingCartArr = shoppingCartStore.getLocalStorage();
//   const enableBtn = `<button class="cart__price--paymentBtn cartPaymentBtn">결제하기</button>`;
//   const disabledBtn = `<button class="cart__price--paymentBtn-disabled cartPaymentBtn" disabled='true' >결제하기</button>`;
//   if (shoppingCartStore.getLocalStorage().length > 0) {
//     return enableBtn;
//   } else if (shoppingCartStore.getLocalStorage().length === 0) {
//     return disabledBtn;
//   }
// };

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
            <span>총 주문 금액</span>
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
        ><div class="handleCartPaymentBtn"><button class="cart__price--paymentBtn-disabled cartPaymentBtn" disabled="true">결제하기</button></div></a
      >
    </aside>
  </div>
</section>
`;

/** 장바구니 결제금액 렌더링 */
const renderCartOrderPrice = (): void => {
  // [장바구니] 총 결제 금액
  $('.cartOrderPrice').innerHTML = `${formatPrice(renderCartTotalPrice())} 원`;
  $('.cartTotalPaymentPrice').innerHTML = `${formatPrice(
    renderCartTotalPrice(),
  )} 원`;
};

/** 장바구니 제품 리스트 렌더링 */
export const renderCartList = (storage: ShoppingCartStoreValue): void => {
  const cartListTemplate = storage
    .map((item: ShoppingCartStore) => {
      const { id, count, thumbnail, title, pricePerOne } = item;

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
        <span class="cart__item--price cartProductTotalPrice">${(
          pricePerOne * count
        ).toLocaleString()} 원</span>
        <button class="cart__item--deleteBtn cartProductDeleteBtn">삭제</button>
      </div>
    </li>
    `;
    })
    .join('');

  // renderCartTotalPrice();
  renderCartOrderPrice();
  $<HTMLUListElement>('.cart__list').innerHTML = cartListTemplate;
};

/** 장바구니 localStorage에 저장하는 함수 - 찜하기 페이지에서 재활용 */
export const storeLocalStorage = (id: string): void => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  const existingItem = shoppingCartArr.find(
    (item: ShoppingCartStore) => item.id === id,
  );

  if (existingItem) {
    existingItem.price += existingItem.pricePerOne;
    existingItem.qty += 1;
    existingItem.count += 1;
    shoppingCartStore.setLocalStorage(shoppingCartArr);
  }
};

/** 빈 장바구니일 때, 상품이 있는 장바구니일 때 */
export const renderCartPage = (): void => {
  const shoppingCartArr = shoppingCartStore.getLocalStorage();
  renderPage(renderInitCartPage);
  if (shoppingCartArr.length === 0) {
    return;
  } else if (shoppingCartArr.length > 0) {
    // 장바구니에 넣은 상품 렌더링
    renderCartList(shoppingCartArr);
    $(
      '.handleCartPaymentBtn',
    ).innerHTML = `<button class="cart__price--paymentBtn cartPaymentBtn">결제하기</button>`;

    // 결제금액 렌더링
    // renderCartTotalPrice();
    return;
  }
};

/** 버튼 요소 핸들링 이벤트 */
$('.app').addEventListener('click', (e: MouseEvent) => {
  // [장바구니 페이지]에서 장바구니에 상품이 없을 때, '계속 쇼핑하기' 버튼 클릭 -> [메인페이지]로 이동
  if (
    (e.target as HTMLButtonElement).classList.contains(
      'cartEmpty-goToShoppingBtn',
    )
  ) {
    router.navigate('/category/keyboards');
    return;
  }

  // [장바구니]에서 '구매하기' 버튼 클릭 클릭 -> [결제 페이지]로 이동
  if ((e.target as HTMLButtonElement).classList.contains('cartPaymentBtn')) {
    if (localStorage.getItem('marketLogToken')) {
      router.navigate('/payment');
    } else {
      alert('로그인이 필요한 페이지 입니다. 로그인 페이지로 이동합니다.');
      // 로그인 페이지로 이동
      router.navigate('/login');
    }
    return;
  }
});

/** 구매수량 추가 핸들링 이벤트 */
$('.app')?.addEventListener('click', (e: MouseEvent) => {
  // const detailProductId = (e.target as HTMLLIElement)?.closest('li')?.dataset
  //   .productId;
  updateInfo(e);
});

/** 장바구니 담기 핸들링 이벤트 */
// $('.app').addEventListener('click', (e) => {
//   pushInCart(e);
// });

/** 장바구니 페이지에서 수량 핸들링 */
$('.app').addEventListener('click', (e: MouseEvent) => {
  const id = (e.target as HTMLLIElement).closest('li')?.dataset.productId;
  // 구매 수량 +
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  if ((e.target as HTMLButtonElement).classList.contains('cart-addQtyBtn')) {
    storeLocalStorage(id);
    // shoppingCartStore.setLocalStorage(shoppingCartArr);
    // 카트 페이지 렌더
    renderCartPage();
    return;
  }

  // 구매 수량 -
  if ((e.target as HTMLButtonElement).classList.contains('cart-minusQtyBtn')) {
    // let shoppingCartArr = shoppingCartStore.getLocalStorage();
    const existingItem = shoppingCartArr.find(
      (item: ShoppingCartStore): boolean => item.id === id,
    );

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

      // 카트 페이지 렌더
      shoppingCartStore.setLocalStorage(shoppingCartArr);
      renderCartPage();
    }
  }

  // 장바구니에서 삭제
  if (
    (e.target as HTMLButtonElement).classList.contains('cartProductDeleteBtn')
  ) {
    shoppingCartArr = shoppingCartStore
      .getLocalStorage()
      .filter((item: ShoppingCartStore): boolean => item.id !== id);
    // storeLocalStorage(id);
    shoppingCartStore.setLocalStorage(shoppingCartArr);

    countQtyInCart();
    renderCartPage();
    return;
  }
});

/** /cart 핸들링 함수 */
export const handleCartPage = (): void => {
  $('.modal__addCart').style.display = 'none';
  // 카트 페이지 렌더
  renderCartPage();
};
