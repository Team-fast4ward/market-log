import { $ } from '../../utils/dom.js';
import { renderPage } from '../../utils/render.js';
import { getSearchedProducts } from '../../api.js';
import { renderInitCategoryPage } from '../categoryPage/categoryPage.js';
import { renderSkeletonUIinCategoryPage } from '../categoryPage/categoryPage.js';
import { router } from '../../main.js';

/*-----------------------------------*\
  검색 페이지  #search
\*-----------------------------------*/

/** 제품 이름 검색 */
const renderSearchedProductList = (title = '') => {
  const categoryProductListTemplate = title
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

/** 검색한 제품이 없을 때 렌더링, 추천 검색어 클릭 -> 카테고리 페이지로 이동 */
const searchPageNoSearchResultTemplate = `
  <div class="searchPage__noResult--container">
    <span class="searchPage__noResult--inputValue"></span>
    <span>관련 상품이 없습니다.</span>
    <span>추천 검색어</span>
    <div class="searchPage__noResult--buttons">
      <a class="searchPage__noResult--button" href="/category/keyboards">키보드</a>
      <a class="searchPage__noResult--button" href="/category/keycaps">NuPhy</a>
      <a class="searchPage__noResult--button" href="/category/switches">Xmas</a>
      <a class="searchPage__noResult--button" href="/category/accessories">Nufolio</a>
    </div>
  </div>
`;

/** input 값이 입력된 제품 찾기 함수 */
const findProduct = async () => {
  $inputValue = $('.header-main__search--input').value;
  console.log('inputValue', $inputValue);
  return await getSearchedProducts($inputValue);
};

/** 검색한 제품의 유/무 예외처리 핸들링 함수 */
const handleSearchPageResult = async () => {
  renderPage(renderInitCategoryPage);
  renderSkeletonUIinCategoryPage();
  const findProductArr = await findProduct();
  if (findProductArr.length === 0) {
    // '검색 결과 없음'의 초기 템플릿 init
    $('.categoryPage__product--lists').innerHTML =
      searchPageNoSearchResultTemplate;
    // 검색한 단어 화면에 표시
    $('.searchPage__noResult--inputValue').innerHTML = $(
      '.header-main__search--input',
    ).value;
  } else if (findProductArr.length >= 1) {
    renderSearchedProductList(findProductArr);
  }
};

/** 검색창 폼 태그 새로고침 방지 */
$('.header-main__search--form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.key === 'Enter') {
    router.navigate('/products/search');
    await handleSearchPageResult();
  }
});

/** [모든 페이지]에서 제품 검색 버튼 'click' 이벤트 */
$('.header-main__search--button').addEventListener('click', async (e) => {
  // e.preventDefault();
});

/** [모든 페이지]에서 제품 검색 버튼 'Enter'이벤트 */
$('.header-main__search--input').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    router.navigate('/products/search');
    await handleSearchPageResult();
  }
});

/** /products/search 핸들링 함수 */
export const handleSearchPage = async () => {
  $('.modal__addCart').style.display = 'none';

  console.log('/products/search route is working');
  // 제품 검색
  await handleSearchPageResult();
};
