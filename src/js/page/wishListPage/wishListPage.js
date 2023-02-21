/*-----------------------------------*\
  마이 페이지 - 찜하기 페이지 / 찜한 상품 페이지 #wishList js
\*-----------------------------------*/

import { $ } from '../../utils/dom.js';
import { renderPage } from '../../utils/render.js';
import { shoppingCart, hearted } from '../../importIMGFiles.js';
import { storeCart } from '../productDetail/productDetail.js';
import { wishListStore } from '../../store/wishListStore.js';
import { shoppingCartStore } from '../../store/shoppingCartStore.js';
import { htmlMypage_Nav, resetNavbarActive } from '../mypage.js';

import { router } from '../../main.js';

/** 마이 페이지 mypage__navigo__container 초기 템플릿 */

// const renderInitMypageTemplate = `
//       <div class="mypage__app">
//         <div class="mypage__container">
//           <div class="mypage__navbar">
//             <h1>마이페이지</h1>
//             <nav>
//               <ul>
//                 <li>
//                   <a href="/mypage/order" data-navigo
//                     >주문내역
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/account" data-navigo
//                     >계좌 관리
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/wishlist" data-navigo
//                     >찜한 상품
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/myPersonalInfoModify" data-navigo
//                     >개인 정보 수정
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//           <div class="mypage__navigo__container"></div>
//         </div>
//       </div>
// `;

/** 찜한상품 제목, ul 태그 템플릿 삽입 */
const handleWishListInitTemplate = () => {
  const renderWishListPageInitTemplate = `
    <div class="mypage__wishlist">
      <div class="mypage__wishlist--container">
        <h2>찜한 상품</h2>
        <ul class="wishlist__product--lists">
        </ul>
      </div>
    </div>
`;

  $('.mypage__navigo__container').innerHTML = renderWishListPageInitTemplate;
};

/** ul 태그에 찜한 제품 li 삽입, */
const renderWishListProductList = (store) => {
  console.log(store);
  const wishListProductListTemplate = store
    .map((item) => {
      const { id, pricePerOne, thumbnail, title } = item;
      console.log(pricePerOne);

      return `
    <li class="wishlist__product--list" data-product-id="${id}">
      <div class="wishlist__product--list-container">
        <img src="${thumbnail}" alt="${title}" />
        <div class="wishlist__product--info">
          <h4 class="wishlist__product--info-desc">
            <a
              href="/product/${id}"
              data-navigo
              class="wishlist__product--info-title"
            >
              ${title}
            </a>
            <div class="wishlist__product--info-price">
              ${pricePerOne.toLocaleString()} 원
            </div>
          </h4>
        </div>
      </div>
      <div class="wishlist__product--list-AddRemoveBtn">
        <button
          class="wishlist__product--list-removeFromWishListBtn removeFromWishListBtn"
        >
          삭제
        </button>
        <button class="wishlist__product--list-AddToCartBtn wishList-AddToCartBtn">
          <img src="${shoppingCart}" alt="shopping cart" />
          담기
        </button>
      </div>
    </li>
    `;
    })
    .join('');

  $('.wishlist__product--lists').innerHTML = wishListProductListTemplate;
};

/** 찜하기 목록이 비어있을 때 템플릿 */
const handleEmptyWishlistInit = () => {
  const emptyWishlistTemplate = `
  <div class="cart__empty">
    <img src="${hearted}" alt="빈 장바구니" />
    <h3>찜하기 목록이 비었습니다.</h3>
    <a href="/category/keyboards">쇼핑하러 가기</a>
  </div>
  `;
  $('.app').querySelector('.wishlist__product--lists').innerHTML =
    emptyWishlistTemplate;
};

/** 찜한 상품이 (없을 때 / 있을 때) 예외처리 후 렌더링 */
const renderWishListPage = () => {
  renderPage(htmlMypage_Nav);
  handleWishListInitTemplate();
  resetNavbarActive();
  setNavbacActive();
  if (wishListStore.getLocalStorage().length === 0) {
    // renderPage(renderInitMypageTemplate);
    // renderPage(htmlMypage_Nav);
    // handleWishListInitTemplate();
    handleEmptyWishlistInit();
    return;
  } else if (wishListStore.getLocalStorage().length >= 1) {
    // 장바구니에 넣은 상품 렌더링
    // renderPage(renderInitMypageTemplate);
    // renderPage(htmlMypage_Nav);
    // handleWishListInitTemplate();
    renderWishListProductList(wishListStore.getLocalStorage());
    return;
  }
};
const setNavbacActive = () => {
  const active = document.querySelector('#mpWishList');
  active.parentElement.classList.add('active');
};

/** [찜하기 페이지]에서 제품 제거 버튼 이벤트, 함수 */
$('.app').addEventListener('click', (e) => {
  let wishListArr = wishListStore.getLocalStorage();
  const id = e.target.closest('li')?.dataset.productId;
  if (e.target.classList.contains('removeFromWishListBtn')) {
    wishListArr = wishListArr.filter((item) => item.id !== id);
    console.log('removeItem from wishListArr', wishListArr);
    wishListStore.setLocalStorage(wishListArr);
    renderWishListPage();
  }
});

/** [찜하기 페이지]에서 '카트에 담기' 버튼 클릭 시, 해당 제품을 장바구니에 저장  */
$('.app').addEventListener('click', (e) => {
  const id = e.target.closest('li')?.dataset.productId;
  let wishListArr = wishListStore.getLocalStorage();
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  if (e.target.classList.contains('wishList-AddToCartBtn')) {
    const wishListAddToCart = wishListArr.filter((item) => item.id === id);

    const wishListInfo = wishListAddToCart[0];
    storeCart(
      wishListInfo.id,
      wishListInfo.pricePerOne,
      wishListInfo.count,
      wishListInfo.thumbnail,
      wishListInfo.title,
      wishListInfo.pricePerOne,
    );
    shoppingCartStore.setLocalStorage(shoppingCartStore.getLocalStorage());
    console.log(shoppingCartStore.getLocalStorage());
  }
});

/** /mypage/wishlist 핸들링 함수 */
export const handleWishListPage = () => {
  renderWishListPage();
};
