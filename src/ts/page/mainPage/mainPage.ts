import { $ } from '../../utils/dom';
import { renderPage } from '../../utils/render';
import { air60, air75, halo65, halo75, halo96 } from '../../importIMGFiles';
import { shoppingCartStore } from '../../store/shoppingCartStore';
import { wishListStore } from '../../store/wishListStore';
import { router } from '../../main';
import { getAllProducts } from '../../api';
import { GetAllProductsInterface } from '../../types';
import { getCategoryName } from '../productDetailPage/productDetailPage';
import { Category } from '../../types/enum';

/*-----------------------------------*\
  #메인 페이지
\*-----------------------------------*/

/** 메인 페이지 초기 템플릿 */
export const renderMainPageTemplate = `
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

$('.app')?.addEventListener('click', (e: MouseEvent) => {
  if (
    (e.target as HTMLButtonElement).classList.contains('mainPage__hero--btn')
  ) {
    router.navigate('/category/keyboards');
  }
});

// [메인페이지] 헤더 서치바
$<HTMLButtonElement>('.header-main__search--button').addEventListener(
  'click',
  () => {
    $('.header-main__search--input').classList.add('active');
    $('.header-main__search--button').style.display = 'none';
    $('.header-main__search--close-button').style.display = 'block';
  },
);

$<HTMLImageElement>('.header-main__search--close-button').addEventListener(
  'click',
  () => {
    $('.header-main__search--input').classList.remove('active');
    $('.header-main__search--close-button').style.display = 'none';
    $('.header-main__search--button').style.display = 'block';
  },
);

/** 장바구니, 찜하기 상품 수량 */
$<HTMLSpanElement>('.header__cart--qty').innerHTML = shoppingCartStore
  .getLocalStorage()
  .length.toString();

$<HTMLSpanElement>('.header__wishlist--qty').innerHTML = wishListStore
  .getLocalStorage()
  .length.toString();

/** 장바구니 상품 수량 카운팅 함수*/
export const updateCartItemQty = () => {
  $<HTMLSpanElement>('.header__cart--qty').innerHTML = shoppingCartStore
    .getLocalStorage()
    .length.toString();
};

export const updateWishListItemQty = () => {
  $<HTMLSpanElement>('.header__wishlist--qty').innerHTML = wishListStore
    .getLocalStorage()
    .length.toString();
};

/** 카테고리 navbar 렌더 함수 */
export const renderCategoryNav = async (items: GetAllProductsInterface[]) => {
  const categoryList = Array.from(new Set(items.map((item) => item.tags[0])));
  categoryList.sort((a, b) => {
    const categoryOrder = [
      Category.keyboards,
      Category.keycaps,
      Category.switches,
      Category.switches,
    ];
    return (
      categoryOrder.indexOf(a as Category) -
      categoryOrder.indexOf(b as Category)
    );
  });

  const renderCategoryNavTemplate = categoryList
    .map(
      (category) => `
      <a href="/category/${getCategoryName(category)}" data-navigo>
        <li class="header-nav__category--list">${category}</li>
      </a>
    `,
    )
    .join('');

  $('.header-nav__category--lists').innerHTML = renderCategoryNavTemplate;
};

/** router on '/' 핸들링 함수 */
export const handleMainPage = async () => {
  $('.modal__addCart').style.display = 'none';
  updateCartItemQty();
  renderCategoryNav(await getAllProducts());
  renderPage(renderMainPageTemplate);
};
