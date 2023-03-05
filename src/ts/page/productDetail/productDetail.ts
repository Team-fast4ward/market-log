/*-----------------------------------*\
  제품 상세 페이지  #productDetail js
\*-----------------------------------*/

import { router } from '../../main';
import { $ } from '../../utils/dom';
import { addHeart, emptyHeart } from '../../importIMGFiles';
import { getDetailProduct } from '../../api';
import { wishListStore } from '../../store/wishListStore';
import { shoppingCartStore } from '../../store/shoppingCartStore';
import { recentViewStore } from '../../store/recentViewStore';
import { renderInitHeaderLogin } from '../login';
import { formatPrice } from '../../utils/format';
import { countQtyInCart, countQtyInWishlist } from '../mainPage/mainPage';
import { WishListStore } from '../../interface/store';

/** 찜하기 상품 유/무에 따라 다른 초기화면 렌더링 */
export const checkWhetherAddWishList = (id: string): string => {
  let wishListArr = wishListStore.getLocalStorage();
  const existingItem = wishListArr.find((item) => item.id === id);
  return existingItem ? addHeart : emptyHeart;
};

/** 찜하기 목록에 저장 */
export const storeWishList = (
  id: string,
  count: number,
  thumbnail: string,
  title: string,
  pricePerOne: number,
): void => {
  let wishListArr = wishListStore.getLocalStorage();
  const existingItem = wishListStore
    .getLocalStorage()
    .find((item: WishListStore): boolean => item.id === id);
  if (!existingItem) {
    wishListArr.unshift({ id, count, thumbnail, title, pricePerOne });
    wishListStore.setLocalStorage(wishListArr);
  } else if (existingItem) {
    wishListArr = wishListArr.filter(
      (item: WishListStore): boolean => item.id !== id,
    );

    wishListStore.setLocalStorage(wishListArr);
  }
};

///////////////////////////

/** [제품 상세페이지] skeleton ui 초기 렌더링 */
export const renderSkeletonUIinDetailProductPage = (): void => {
  const skeletonUITemplate: string = `
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

  const skeletonUI12: string = Array(1)
    .fill(skeletonUITemplate)
    .map((v: string) => {
      return v;
    })
    .join('');

  $('.app').innerHTML = skeletonUI12;
};
/** 장바구니에 저장 */
export const storeCart = (
  id: string,
  price: number,
  count: number,
  thumbnail: string,
  title: string,
  pricePerOne: number,
) => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  // id 값을 찾고
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  // 새로운 아이템이면 추가
  if (!existingItem) {
    shoppingCartArr.push({ id, price, count, thumbnail, title, pricePerOne });
    shoppingCartStore.setLocalStorage(shoppingCartArr);

    return;
  } else if (existingItem) {
    // 이미 아이템이면 기존 수량, 가격에 누적 추가
    existingItem.count += count;
    existingItem.price += pricePerOne * count;
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    return;
  }
};

/** 구매 수량 */
let productDetailProductQty: number = 1;
/** 총 상품 금액 */
let productDetailTotalPrice: number;
// let productDetailCount: number;
let productDetailTitle: string;
let productDetailThumbnail: string;
let productDetailPricePerOne: number;

/** [제품 상세페이지] 렌더링 함수 */
export const renderDetailProduct = async (productId: string) => {
  // renderInitHeaderLogin();
  const productDetail = await getDetailProduct(productId);
  const { description, id, isSoldOut, price, tags, title, thumbnail } =
    productDetail;

  storeRecentViewed(id, title, thumbnail);

  // 총 금액 계산, 제품title, thumbnail, 상품 개당 가격
  productDetailTotalPrice = price * productDetailProductQty;
  productDetailTitle = title;
  productDetailThumbnail = thumbnail;
  productDetailPricePerOne = price;

  const productTags = tags
    .map((tag: string) => {
      return `<li class="aside__productDetail--info-tagLists-tag">${tag}</li>`;
    })
    .join('');

  /** 상세 제품 레이아웃 html */
  const detailProductTemplate = /* html */ `
  <li class="section__container" data-product-id="${id}">
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
        <p id="productDetail-totalPrice">${productDetailTotalPrice.toLocaleString()} 원</p>
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
  </li>
  `;

  $('.app')!.innerHTML = detailProductTemplate;
};

/** [제품 상세 페이지] 장바구니 담기 핸들 함수 */
export const pushInCart = (e: MouseEvent): void => {
  if (
    (e.target as HTMLButtonElement).classList.contains('addCartBtn') ||
    (e.target as HTMLButtonElement).classList.contains('buyBtn')
  ) {
    const id = (e.target as HTMLLIElement).closest('li').dataset.productId;

    const price = productDetailPricePerOne * productDetailProductQty;
    const count = productDetailProductQty;
    const title = productDetailTitle;
    const thumbnail = productDetailThumbnail;
    const pricePerOne = productDetailPricePerOne;

    storeCart(id, price, count, thumbnail, title, pricePerOne);
    countQtyInCart();
  }
};

/** '장바구니 추가버튼' 클릭 -> 장바구니에 추가 이벤트 */
$('.app').addEventListener('click', (e: MouseEvent) => {
  if ((e.target as HTMLButtonElement).classList.contains('addCartBtn')) {
    pushInCart(e);
  }
});

/** 구매수량 핸들링 함수 */
export const updateInfo = async (e: MouseEvent) => {
  let shoppingCartArr = shoppingCartStore.getLocalStorage();
  // 구매 수량 -
  if ((e.target as HTMLButtonElement).classList.contains('minusQtyBtn')) {
    productDetailProductQty -= 1;
    // 구매 수량 렌더링
    $<HTMLSpanElement>(
      '.aside__productDetail--count-qty',
    )!.innerHTML = `${productDetailProductQty}`;
    // 구매 가격 렌더링
    $<HTMLParagraphElement>(
      '#productDetail-totalPrice',
    )!.innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;
    if (productDetailProductQty === 0) {
      productDetailProductQty = 1;
    }
    $(
      '.aside__productDetail--count-qty',
    )!.innerHTML = `${productDetailProductQty}`;
    $<HTMLSpanElement>('#productDetail-totalPrice')!.innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;

    return;
  }
  // 구매 수량 +
  if ((e.target as HTMLButtonElement).classList.contains('addQtyBtn')) {
    productDetailProductQty += 1;
    // 구매 수량 렌더링
    $(
      '.aside__productDetail--count-qty',
    )!.innerHTML = `${productDetailProductQty}`;
    // 구매 가격 렌더링
    $('#productDetail-totalPrice')!.innerHTML = `${formatPrice(
      productDetailPricePerOne * productDetailProductQty,
    )} 원`;
    // productDetailProductQty += 1;

    return;
  }

  shoppingCartStore.setLocalStorage(shoppingCartArr);
};

/** 모달 핸들 함수 */
export const handleModal = (e: MouseEvent) => {
  // '장바구니에 담기' 버튼 클릭 시, 모달 오픈
  if (
    (e.target as HTMLButtonElement).classList.contains('addCartBtn') ||
    (e.target as HTMLButtonElement).classList.contains('wishList-AddToCartBtn')
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
document.body.addEventListener('click', (e: MouseEvent) => {
  handleModal(e);
});

/** 제품 상세 페이지 찜하기 버튼 핸들링 이벤트  */
$('.app').addEventListener('click', (e: MouseEvent) => {
  if (
    (e.target as HTMLImageElement).classList.contains(
      'aside__productDetail--info-wishlistImg',
    )
  ) {
    const id = (e.target as HTMLLIElement).closest('li')?.dataset.productId;
    const count = 1;
    const title = productDetailTitle;
    const thumbnail = productDetailThumbnail;
    const pricePerOne = productDetailPricePerOne;

    storeWishList(id, count, thumbnail, title, pricePerOne);
    wishListStore.setLocalStorage(wishListStore.getLocalStorage());

    // 찜하기 버튼
    const wishListIMG = `<img class="aside__productDetail--info-wishlistImg" 
    src="${checkWhetherAddWishList(id)}" alt="찜하기 버튼" />`;
    $<HTMLButtonElement>('.aside__productDetail--info-wishlistBtn').innerHTML =
      wishListIMG;

    countQtyInWishlist();
  }

  // [제품 상세 페이지]에서 '장바구니로 바로가기' 버튼 클릭 클릭 -> [장바구니 페이지]로 이동
  if ((e.target as HTMLAnchorElement).classList.contains('goToCart')) {
    router.navigate('/cart');
    return;
  }

  // [제품 상세 페이지]에서 '구매하기' 버튼 클릭 클릭 -> [결제 페이지]로 이동
  if ((e.target as HTMLButtonElement).classList.contains('buyBtn')) {
    if (localStorage.getItem('marketLogToken')) {
      // '장바구니에 담기/구매하기' 핸들링 함수
      pushInCart(e);
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
const storeRecentViewed = (
  id: string,
  title: string,
  thumbnail: string,
): void => {
  let recentViewedArr = recentViewStore.getLocalStorage();
  const existingItem = recentViewedArr.find(
    (item: WishListStore): boolean => item.id === id,
  );

  if (existingItem) {
    const existingIndex = recentViewedArr.findIndex(
      (item: WishListStore): boolean => item.id === existingItem.id,
    );

    recentViewedArr.splice(existingIndex, existingIndex);
    // recentViewedArr.unshift({ id, title, thumbnail });
    recentViewStore.setLocalStorage(recentViewedArr);
  }
  recentViewedArr.unshift({ id, title, thumbnail });
  recentViewStore.setLocalStorage(recentViewedArr);
};

/** /product/:id 핸들링 함수 */
export const handleDetailProductPage = async (
  params: string,
): Promise<void> => {
  renderInitHeaderLogin();
  renderSkeletonUIinDetailProductPage();
  await renderDetailProduct(params);
};
