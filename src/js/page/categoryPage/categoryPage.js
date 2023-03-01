import Navigo from 'navigo';
import { $ } from '../../utils/dom.js';
import { renderPage } from '../../utils/render.js';
import {
  halo75,
  halo96,
  air96,
  nufolio,
  twilight,
  xmas,
  paginationLeft,
  paginationRight,
} from '../../importIMGFiles.js';
import { getAllProducts, getDetailProduct } from '../../api.js';
import { recentViewStore } from '../../store/recentViewStore.js';

/*-----------------------------------*\
  #카테고리 페이지 # category js
\*-----------------------------------*/

/** 카테고리 페이지 초기 템플릿 */
export const renderInitCategoryPage = `
  <div class="categoryPage">
    
      <!-- aside -->
      <aside class="categoryPage__aside">
        <div class="categoryPage__aside--container categoryPageSwiper">
        <h4>최근 본 상품</h4>
          <ul class="categoryPage__aside--wrapper"></ul>
        </div>
        <div class="categoryPage-pagination"></div>
      </aside>
      <!-- category main -->
      <div class="categoryPage__main">
        <div class="categoryPage__main--container">
          <div class="categoryPage__main--filter">
            <div class="categoryPage__main--filter-totalQty"></div>
            <div class="categoryPage__main--filter-sort">
              <select class="categoryPage__main--filter-select" id="categoryPage-filterByPrice">
                <option selected value="reset">정렬</option>
                <option value="LowToHigh">낮은 가격 순</option>
                <option value="HighToLow">높은 가격 순</option>
              </select>
            </div>
          </div>
        </div>
        <ul class="categoryPage__product--lists"></ul>
        <div class="categoryPage__pagination--btn-container"></div>
      </div>
    
  </div>
`;

/** 카테고리 페이지 skeleton ui 초기 렌더링 */
export const renderSkeletonUIinCategoryPage = () => {
  const skeletonUITemplate = `
  <li class="categoryPage__skeleton">
    <div class="categoryPage__skeleton--img"></div>
    <div class="categoryPage__product--info">
      <h3 class="categoryPage__skeleton--title"></h3>
    </div>
  </li>
`;
  const skeletonUI12 = Array(12)
    .fill(skeletonUITemplate)
    .map((v, i) => {
      return v;
    })
    .join('');

  $('.categoryPage__product--lists').innerHTML = skeletonUI12;
};

/** 카테고리 페이지 제품 db에서 불러오기 */
const renderCategoryProductList = (items) => {
  const categoryProductListTemplate = items
    .map((item) => {
      const { id, price, thumbnail, title, tags } = item;

      return `
    <li class="categoryPage__product--list" data-product-id="${id}" data-category-tag="${tags}">
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

/** 최근 본 상품 템플릿 */
const renderRecentViewed = (items) => {
  const recentViewedTemplate = items
    .map((item) => {
      const { id, thumbnail, title } = item;

      return `
    <li class="categoryPage__aside--img" data-product-id="${id}">
      <a href="/product/${id}"><img src="${thumbnail}" alt="${title}" /></a>
    </li>
    `;
    })
    .join('');

  $('.categoryPage__aside--wrapper').innerHTML = recentViewedTemplate;
};

/** 카테고리 태그 필터링 함수 */
const getProductTags = async () => {
  const allProductArray = await getAllProducts();
  console.log(allProductArray);
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
const getSortedLowToHighPriceProduct = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[i];
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
const getSortedHighToLowPriceProduct = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = await getKeyBoardCategory[i];
  const HighToLowPrice = keyboardCategoryProduct.sort((a, b) => {
    return b.price - a.price;
  });
  console.log('HighToLowPrice', HighToLowPrice);
  renderCategoryProductList(await HighToLowPrice);
  return;
};

/** select option에 의해 정렬 */
const renderCategoryProductBySelect = async (condition, i) => {
  renderSkeletonUIinCategoryPage();
  // const getProductTagList = await getProductTags();

  if (condition === 'reset') {
    return categoryUtilInit(i);
  }
  if (condition === 'LowToHigh') {
    return await getSortedLowToHighPriceProduct(i);
  } else if (condition === 'HighToLow') {
    return await getSortedHighToLowPriceProduct(i);
  }
};

/** 카테고리별 상품 개수 렌더링 */
const renderCategoryProductQty = async (i) => {
  const getKeyBoardCategory = await getProductTags();
  const categoryTotalQty = await getKeyBoardCategory[i];
  $(
    '.categoryPage__main--filter-totalQty',
  ).innerHTML = `${categoryTotalQty.length}개 상품`;
};

/** /category 핸들링 함수 */
export const handleCategoryPage = async (i) => {
  $('.modal__addCart').style.display = 'none';
  console.log('/category/0');
  renderPage(renderInitCategoryPage);
  renderRecentViewed(recentViewStore.getLocalStorage().slice(0, 5));
  renderSkeletonUIinCategoryPage();
  //
  // const getKeyBoardCategory = await getProductTags();
  // renderCategoryProductList(await getKeyBoardCategory[i]);
  categoryUtilInit(i);
  //

  await renderCategoryProductQty(i);

  // 가격 정렬 이벤트
  $('.app')
    .querySelector('#categoryPage-filterByPrice')
    ?.addEventListener('change', async (e) => {
      console.log(e.target);

      renderCategoryProductBySelect(
        await $('#categoryPage-filterByPrice').options[
          $('#categoryPage-filterByPrice').selectedIndex
        ].value,
        i,
      );
    });
};
/*-----------------------------------*\
  #pagination
\*-----------------------------------*/

/** 처음 index = 0 */
let categoryUtilIndex = 0;
/** 페이지네이션 배열 초기화 = 0 */
let categoryUtilPages = [];

/** 카테고리 페이지 제품, 버튼 초기 렌더링 */
const categoryUtilSetupUI = () => {
  // const getKeyBoardCategory = await getProductTags();
  // renderCategoryProductList(await getKeyBoardCategory[i]);

  renderCategoryProductList(categoryUtilPages[categoryUtilIndex]);
  categoryUtilDisplayButtons(
    $('.categoryPage__pagination--btn-container'),
    categoryUtilPages,
    categoryUtilIndex,
  );
};

/** 카테고리 페이지 초기 렌더링 시 ui, api 불러오는 함수 */
const categoryUtilInit = async (i) => {
  // const getProductTagList = await getProductTags();
  const getProductTagList = await getProductTags();
  categoryUtilPages = categoryUtilPaginate(getProductTagList[i]);

  categoryUtilSetupUI();
};

/** 카테고리 페이지 페이지네이션 1페이지 당 10개, slice 메서드로 배열에 삽입 */
const categoryUtilPaginate = (list) => {
  const itemsPerPage = 9;
  const numberOfPages = Math.ceil(list.length / itemsPerPage);
  const newList = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;

    return list.slice(start, start + itemsPerPage);
  });
  return newList;
};

/** 카테고리 페이지 페이지네이션 버튼 */
const categoryUtilDisplayButtons = () => {
  let categoryUtilBtns = pages.map((_, pageIndex) => {
    return `
    <button class="categoryPage__pagination--btn ${
      activeIndex === pageIndex ? 'active-btn' : 'null'
    }" data-index="${pageIndex}">
      ${pageIndex + 1}
    </button>`;
  });

  categoryUtilBtns.push(
    `<button class="categoryPage__pagination--btn-next">${paginationRight}</button>`,
  );
  categoryUtilBtns.unshift(
    `<button class="categoryPage__pagination--btn-prev">${paginationLeft}</button>`,
  );
  container.innerHTML = categoryUtilBtns.join('');
};

/** prev, next, 페이지네이션 버튼 핸들링 이벤트 */
$('.app')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('categoryPage__pagination--btn-container'))
    return;

  if (e.target.classList.contains('categoryPage__pagination--btn')) {
    categoryUtilIndex = Number(e.target.dataset.index);
    categoryUtilSetupUI();
  }

  if (e.target.classList.contains('categoryPage__pagination--btn-next')) {
    categoryUtilIndex++;
    if (categoryUtilIndex > categoryUtilPages.length - 1) {
      categoryUtilIndex = 0;
    }
    categoryUtilSetupUI();
  }
  if (e.target.classList.contains('categoryPage__pagination--btn-prev')) {
    categoryUtilIndex--;
    if (categoryUtilIndex < 0) {
      categoryUtilIndex = categoryUtilPages.length - 1;
    }
    categoryUtilSetupUI();
  }
});
