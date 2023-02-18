import Navigo from 'navigo';
export const router = new Navigo('/');
const $ = (selector) => document.querySelector(selector);

import { handleCartPage, shoppingCartStore } from './page/cartPage/cartPage.js';
import {
  handleMainPage,
  renderMainPageTemplate,
} from './page/mainPage/mainPage.js';
import {
  renderInitCategoryPage,
  renderSkeletonUIinCategoryPage,
  renderCategoryProductList,
  getProductTags,
  getSortedLowToHighPriceProduct,
  getSortedHighToLowPriceProduct,
  renderCategoryProductBySelect,
  renderCategoryProductQty,
  handleCategoryPage,
} from './page/categoryPage/categoryPage.js';
import {
  renderSearchedProductList,
  searchPageNoSearchResultTemplate,
  findProduct,
  handleSearchPageResult,
  handleSearchPage,
} from './page/searchPage/searchPage.js';
import {
  wishListStore,
  checkWhetherAddWishList,
  storeWishList,
  handleDetailProductPage,
} from './page/productDetail/productDetail.js';
import {
  renderInitMypageTemplate,
  handleWishListInitTemplate,
  renderWishListProductList,
  handleEmptyWishlistInit,
  renderWishListPage,
} from './page/wishListPage/wishListPage.js';
import {
  handleOrderHistoryInitTemplate,
  renderOrderedProductList,
  renderSkeletonUIinOrderHistoryPage,
  emptyOrderHistory,
  renderOrderedListPage,
  checkWhetherTransactionIsDone,
} from './page/orderHistory/orderHistory.js';
import {
  checkWhetherDetailOrderTransactionIsDone,
  renderDetailOrderProduct,
  renderSkeletonUIinDetailOrderHistoryPage,
  renderDetailOrderPage,
} from './page/detailOrderHistoryPage/detailOrderHistory.js';
import {
  renderSkeletonUIinDetailProductPage,
  storeCart,
  renderDetailProduct,
  pushInCart,
  renderCartTotalPrice,
  renderInitCartPage,
  renderCartOrderPrice,
  renderCartList,
  storeLocalStorage,
  renderCartPage,
  handleModal,
  updateInfo,
} from './page/productDetail/productDetail.js';
import {
  renderProductTotalQty,
  renderInitPaymentPage,
  renderPaymentProductList,
  renderPaymentAccount,
  renderNoPaymentAccount,
  renderKakaoMap,
  activePaymentBtn,
  renderSelectedPayment,
  paymentPageFunction,
  renderFinalPaymentPrice,
  checkBalanceOfselectedBankAccount,
  handlePaymentBtnLogic,
  handlePaymentPage,
} from './page/paymentPage/paymentPage.js';

/** Navigo innerHTML template */
export const renderPage = (html) => {
  $('.app').innerHTML = html;
};

/** 날짜 format 함수 */
export const formatDate = (target) => {
  const date = new Date(target);
  const year = String(date.getFullYear()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const today = String(date.getDate()).padStart(2, 0);
  const hour = String(date.getHours()).padStart(2, 0);
  const min = String(date.getMinutes()).padStart(2, 0);
  return `${year}.${month}.${today} | ${hour}:${min}`;
};
export const formatPrice = (target) => {
  if (target) {
    let result = target.toLocaleString('ko-KR');
    return result;
  }
};

/*-----------------------------------*\
  제품 상세 페이지 이벤트 #productDetail js
\*-----------------------------------*/

/*-----------------------------------*\
  찜하기 페이지 이벤트 #wishList js
\*-----------------------------------*/

/*-----------------------------------*\
  주문 내역 페이지 이벤트 #orderHistory js
\*-----------------------------------*/

// productDetail 제품 상세페이지

import cartSVG from '../../public/cart.svg';

/*-----------------------------------*\
  # 장바구니 페이지 cart js
\*-----------------------------------*/

/*-----------------------------------*\
  # 결제 페이지 # pay js
\*-----------------------------------*/

/*-----------------------------------*\
  # navigo router
\*-----------------------------------*/

router
  .on({
    '/': async () => {
      handleMainPage();
    },
    '/products/search': async () => {
      await handleSearchPage();
    },
    '/product/:id': async (params) => {
      console.log('product/:id route is working');
      await handleDetailProductPage(params.data.id);
    },
    '/cart': () => {
      handleCartPage();
    },
    '/payment': async () => {
      await handlePaymentPage();
    },
    '/category/keyboards': async () => {
      await handleCategoryPage(0);
    },
    '/category/keycaps': async () => {
      await handleCategoryPage(1);
    },
    '/category/switches': async () => {
      await handleCategoryPage(2);
    },
    '/category/accessories': async () => {
      await handleCategoryPage(3);
    },
    // 마이페이지 찜하기 목록
    '/mypage/wishlist': () => {
      renderWishListPage();
    },
    // 마이페이지 주문내역 목록
    '/mypage/order': async () => {
      await renderOrderedListPage();
    },
    '/mypage/order/:id': async (params) => {
      console.log('order params', params);
      renderPage(renderInitMypageTemplate);
      renderSkeletonUIinDetailOrderHistoryPage();
      console.log(params.data.id);
      await renderDetailOrderPage(params.data.id);
    },
  })
  .resolve();

/** 모달 핸들 함수 */
// export const handleModal = (e) => {
//   // '장바구니에 담기' 버튼 클릭 시, 모달 오픈
//   if (
//     e.target.classList.contains('addCartBtn') ||
//     e.target.classList.contains('wishList-AddToCartBtn')
//   ) {
//     $('.modal__addCart').style.display = 'block';
//     return;
//   }

//   // '모달 창 밖에 클릭 시 닫기'
//   if (e.target !== $('.modal__addCart')) {
//     $('.modal__addCart').style.display = 'none';
//     return;
//   }

//   // 모달 '장바구니로 바로가기' or '계속 쇼핑하기' 클릭 시 모달 닫기
//   if (e.target === $('.goToCart') || e.target === $('.modal-keepShopping')) {
//     $('.modal__addCart').style.display = 'none';
//     return;
//   }
// };

// /** 장바구니 페이지에서 수량 핸들링 */
// $('.app').addEventListener('click', (e) => {
//   const id = e.target.closest('li')?.dataset.productId;
//   // 구매 수량 +
//   let shoppingCartArr = shoppingCartStore.getLocalStorage();
//   if (e.target.classList.contains('cart-addQtyBtn')) {
//     storeLocalStorage(id);
//     // shoppingCartStore.setLocalStorage(shoppingCartArr);
//     // 카트 페이지 렌더
//     renderCartPage();
//     return;
//   }

//   // 구매 수량 -
//   if (e.target.classList.contains('cart-minusQtyBtn')) {
//     // let shoppingCartArr = shoppingCartStore.getLocalStorage();
//     const existingItem = shoppingCartArr.find((item) => item.id === id);
//     console.log('existingItem', existingItem);

//     if (existingItem) {
//       if (existingItem.price > existingItem.pricePerOne) {
//         existingItem.price -= existingItem.pricePerOne;
//       }
//       if (existingItem.qty > 1) {
//         existingItem.qty -= 1;
//       }
//       if (existingItem.count > 1) {
//         existingItem.count -= 1;
//       }

//       console.log('장바구니에서 --', shoppingCartArr);
//       // 카트 페이지 렌더
//       shoppingCartStore.setLocalStorage(shoppingCartArr);
//       renderCartPage();
//     }
//   }

//   // 장바구니에서 삭제
//   if (e.target.classList.contains('cartProductDeleteBtn')) {
//     shoppingCartArr = shoppingCartStore
//       .getLocalStorage()
//       .filter((item) => item.id !== id);
//     // storeLocalStorage(id);
//     shoppingCartStore.setLocalStorage(shoppingCartArr);
//     console.log(shoppingCartArr);
//     renderCartPage();
//     return;
//   }
// });
