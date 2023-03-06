import { $ } from '../../utils/dom';
import { renderPage } from '../../utils/render';
import { getAllProducts } from '../../api';
import { recentViewStore } from '../../store/recentViewStore';
import { GetAllProductsInterface } from '../../interface/index';
import { RecentView } from '../../interface/store';
import { Category } from '../../interface/enum';

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
export const renderSkeletonUIinCategoryPage = (): void => {
  const skeletonUITemplate: string = `
  <li class="categoryPage__skeleton">
    <div class="categoryPage__skeleton--img"></div>
    <div class="categoryPage__product--info">
      <h3 class="categoryPage__skeleton--title"></h3>
    </div>
  </li>
`;
  const skeletonUI12: string = Array(12)
    .fill(skeletonUITemplate)
    .map((v: string) => {
      return v;
    })
    .join('');

  $<HTMLUListElement>('.categoryPage__product--lists')!.innerHTML =
    skeletonUI12;
};

/** 카테고리 페이지 제품 db에서 불러오기 */
const renderCategoryProductList = (items: GetAllProductsInterface[]): void => {
  const categoryProductListTemplate = items
    .map((item: GetAllProductsInterface) => {
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

  $<HTMLUListElement>('.categoryPage__product--lists')!.innerHTML =
    categoryProductListTemplate;
};

/** 최근 본 상품 템플릿 */
export const renderRecentViewed = (items: RecentView[]) => {
  const recentViewedTemplate = items
    .map((item: RecentView) => {
      const { id, thumbnail, title } = item;

      return `
    <li class="categoryPage__aside--img" data-product-id="${id}">
      <a href="/product/${id}"><img src="${thumbnail}" alt="${title}" /></a>
    </li>
    `;
    })
    .join('');

  $('.categoryPage__aside--wrapper')!.innerHTML = recentViewedTemplate;
};

/** 카테고리 태그 필터링 함수 */
const getProductTags = async () => {
  const allProductArray = await getAllProducts();

  const filterKeyboardTag = allProductArray.filter(
    (item: GetAllProductsInterface): boolean => {
      return item.tags[0] === Category.keyboards;
    },
  );

  const filterKeycapTag = allProductArray.filter(
    (item: GetAllProductsInterface): boolean => {
      return item.tags[0] === Category.keycaps;
    },
  );
  const filterSwitchTag = allProductArray.filter(
    (item: GetAllProductsInterface): boolean => {
      return item.tags[0] === Category.switches;
    },
  );
  const filterAccessoryTag = allProductArray.filter(
    (item: GetAllProductsInterface): boolean => {
      return item.tags[0] === Category.accessories;
    },
  );
  return [
    filterKeyboardTag,
    filterKeycapTag,
    filterSwitchTag,
    filterAccessoryTag,
  ];
};

/** 가격낮은순 정렬 후 렌더링 함수 */
const getSortedLowToHighPriceProduct = async (i: number): Promise<void> => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = getKeyBoardCategory[i];
  const LowToHighPrice = keyboardCategoryProduct.sort(
    (a: GetAllProductsInterface, b: GetAllProductsInterface) => {
      return a.price - b.price;
    },
  );

  renderCategoryProductList(LowToHighPrice);
  return;
};

/** 가격높은순 정렬 후 렌더링 함수 */
const getSortedHighToLowPriceProduct = async (i: number): Promise<void> => {
  const getKeyBoardCategory = await getProductTags();
  const keyboardCategoryProduct = getKeyBoardCategory[i];
  const HighToLowPrice = keyboardCategoryProduct.sort(
    (a: GetAllProductsInterface, b: GetAllProductsInterface) => {
      return b.price - a.price;
    },
  );

  renderCategoryProductList(HighToLowPrice);
  return;
};

/** select option에 의해 정렬 */
const renderCategoryProductBySelect = async (
  condition: string,
  i: number,
): Promise<void> => {
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
const renderCategoryProductQty = async (i: number): Promise<void> => {
  const getKeyBoardCategory = await getProductTags();
  const categoryTotalQty = getKeyBoardCategory[i];
  $(
    '.categoryPage__main--filter-totalQty',
  )!.innerHTML = `${categoryTotalQty.length}개 상품`;
};

/** /category 핸들링 함수 */
export const handleCategoryPage = async (i: number): Promise<void> => {
  $('.modal__addCart').style.display = 'none';

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
    ?.addEventListener('change', async () => {
      renderCategoryProductBySelect(
        $<HTMLSelectElement>('#categoryPage-filterByPrice').options[
          $<HTMLSelectElement>('#categoryPage-filterByPrice').selectedIndex
        ].value,
        i,
      );
    });
};
/*-----------------------------------*\
  #pagination
\*-----------------------------------*/

/** 처음 index = 0 */
let categoryUtilIndex: number = 0;
/** 페이지네이션 배열 초기화 = 0 */
let categoryUtilPages: GetAllProductsInterface[][] = [];

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
const categoryUtilInit = async (i: number) => {
  // const getProductTagList = await getProductTags();
  const getProductTagList = await getProductTags();
  categoryUtilPages = categoryUtilPaginate(getProductTagList[i]);

  categoryUtilSetupUI();
};

/** 카테고리 페이지 페이지네이션 1페이지 당 10개, slice 메서드로 배열에 삽입 */
const categoryUtilPaginate = (
  list: GetAllProductsInterface[],
): GetAllProductsInterface[][] => {
  const itemsPerPage = 9;
  const numberOfPages = Math.ceil(list.length / itemsPerPage);
  const newList = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;

    return list.slice(start, start + itemsPerPage);
  });
  return newList;
};

/** 카테고리 페이지 페이지네이션 버튼 */
const categoryUtilDisplayButtons = (
  container: HTMLDivElement,
  pages: GetAllProductsInterface[][],
  activeIndex: number,
) => {
  let categoryUtilBtns = pages.map((_, pageIndex) => {
    return `
    <button class="categoryPage__pagination--btn ${
      activeIndex === pageIndex ? 'active-btn' : 'null'
    }" data-index="${pageIndex}">
      ${pageIndex + 1}
    </button>`;
  });

  categoryUtilBtns.push(
    `<button class="categoryPage__pagination--btn-next">></button>`,
  );
  categoryUtilBtns.unshift(
    `<button class="categoryPage__pagination--btn-prev"><</button>`,
  );
  container.innerHTML = categoryUtilBtns.join('');
};

/** prev, next, 페이지네이션 버튼 핸들링 이벤트 */
$('.app')?.addEventListener('click', (e: MouseEvent) => {
  if (
    (e.target as HTMLDivElement).classList.contains(
      'categoryPage__pagination--btn-container',
    )
  )
    return;

  if (
    (e.target as HTMLButtonElement).classList.contains(
      'categoryPage__pagination--btn',
    )
  ) {
    categoryUtilIndex = Number((e.target as HTMLButtonElement).dataset.index);
    categoryUtilSetupUI();
  }

  if (
    (e.target as HTMLButtonElement).classList.contains(
      'categoryPage__pagination--btn-next',
    )
  ) {
    categoryUtilIndex++;
    if (categoryUtilIndex > categoryUtilPages.length - 1) {
      categoryUtilIndex = 0;
    }
    categoryUtilSetupUI();
  }
  if (
    (e.target as HTMLButtonElement).classList.contains(
      'categoryPage__pagination--btn-prev',
    )
  ) {
    categoryUtilIndex--;
    if (categoryUtilIndex < 0) {
      categoryUtilIndex = categoryUtilPages.length - 1;
    }
    categoryUtilSetupUI();
  }
});
