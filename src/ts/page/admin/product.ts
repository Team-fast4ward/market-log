import { deleteProduct, getAllProducts } from '../../api';
import { renderPageBtn, renderProductList } from './renderDetail';

import { $, $$ } from '../../utils/dom';

import { GetAllProductsValue } from '../../interface/index';

let products: GetAllProductsValue = [];

let activeIdx: number = 1;
let btnIdx: number = 1;
const itemsPerPage: number = 10;

/** 현재 페이지의 상품목록 가져오기 */
const getProductCurrentPage = (
  products: GetAllProductsValue,
  activeIdx: number,
  itemsPerPage: number,
): GetAllProductsValue => {
  const start = (activeIdx - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const newProducts = products.slice(start, end);
  return newProducts;
};

/** 상품 목록 페이지 초기화 */
const setUpUI = (
  productPageBtn: HTMLButtonElement,
  productList: HTMLUListElement,
): void => {
  renderPageBtn(productPageBtn, products, activeIdx, itemsPerPage, btnIdx);
  newProducts = getProductCurrentPage(products, activeIdx, itemsPerPage);
  renderProductList(productList, newProducts, activeIdx);
};

let newProducts = getProductCurrentPage(products, activeIdx, itemsPerPage);

/** 상품관리 페이지 핸들러 */
export const productHandler = async (): Promise<void> => {
  const productList = $('.product-container__list') as HTMLUListElement;
  const checkProductAll = $(
    '.product-container__title input',
  ) as HTMLInputElement;
  const productPageBtn = $('.product-container__btn-page') as HTMLButtonElement;

  products = await getAllProducts();

  setUpUI(productPageBtn, productList);

  const searchedProductInput = $(
    '.product-container__search-container--input input',
  ) as HTMLInputElement;

  const searchProductHandler = (): void => {
    const filteredProduct = products.filter((product) =>
      product.title.toLowerCase().includes(searchedProductInput.value),
    );

    products = filteredProduct;
    productList.innerHTML = ``;
    renderPageBtn(productPageBtn, filteredProduct, 1, itemsPerPage, 1);
    newProducts = getProductCurrentPage(filteredProduct, 1, itemsPerPage);
    renderProductList(productList, newProducts, 1);
  };

  /** 상품 검색(enter) 이벤트 리스너 */
  searchedProductInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.isComposing) {
      searchProductHandler();
    }
  });

  searchedProductInput.addEventListener('input', async () => {
    searchedProductInput.value === ''
      ? (products = await getAllProducts())
      : products;
    searchProductHandler();
  });

  /** 상품 검색(버튼 클릭) 이벤트 리스너 */
  // searchedProductBtn.addEventListener('click', searchProductHandler);

  /** 페이지 버튼 클릭 이벤트 리스너 */
  productPageBtn.addEventListener('click', (e: MouseEvent) => {
    if (
      (e.target as HTMLButtonElement).classList.contains(
        'product-container__btn-delete',
      )
    )
      return;

    if (
      (e.target as HTMLButtonElement).classList.contains('btn-page--number')
    ) {
      let numberBtn = e.target as HTMLButtonElement;
      activeIdx = Number(numberBtn.textContent);

      if (activeIdx === btnIdx * itemsPerPage + 1) {
        btnIdx++;
      }

      if (activeIdx === (btnIdx - 1) * itemsPerPage) {
        btnIdx--;
      }
    }

    if ((e.target as HTMLButtonElement).classList.contains('btn-page--next')) {
      activeIdx++;

      if (activeIdx > Math.ceil(products.length / itemsPerPage) - 1) {
        activeIdx = Math.ceil(products.length / itemsPerPage);
      }

      if (activeIdx === btnIdx * itemsPerPage + 1) {
        btnIdx++;
      }
    }

    if ((e.target as HTMLButtonElement).classList.contains('btn-page--prev')) {
      activeIdx--;

      if (activeIdx < 1) {
        activeIdx = 1;
      }

      if (activeIdx === (btnIdx - 1) * itemsPerPage) {
        btnIdx--;
      }
    }

    productList.innerHTML = ``;
    setUpUI(productPageBtn, productList);
  });

  const deleteBtn = $<HTMLButtonElement>('.product-container__btn-delete');

  /** 상품 목록 체크리스트 모두 선택 및 해제 이벤트 리스너 */
  checkProductAll.addEventListener('change', () => {
    const productsEl = $$(
      '.product-container__list li',
    ) as unknown as NodeListOf<Element>;

    checkProductAll.checked
      ? [...[productsEl]].forEach(
          (productEl: any) =>
            ((productEl.querySelector('input') as HTMLInputElement).checked =
              true),
        )
      : [...[productsEl]].forEach(
          (productEl: any) =>
            ((productEl.querySelector('input') as HTMLInputElement).checked =
              false),
        );
  });

  /** 상품 목록 체크리스트 선택한 상품 삭제  이벤트 리스너 */
  deleteBtn.addEventListener('click', async () => {
    const productsEl = $$(
      '.product-container__list li',
    ) as unknown as NodeListOf<Element>;

    const newProductsEl = [...[productsEl]].filter(
      (productEl: any) => productEl.querySelector('input').checked === true,
    );

    if (newProductsEl.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (confirm('선택한 상품을 삭제하시겠습니까? ')) {
      // async function deleteProductPromise(newProductsEl) {
      //   const productsMap = newProductsEl.map(async (newProductEl) => {
      //     return await deleteProduct(newProductEl.dataset.id);
      //   });
      //   return productsMap;
      // }

      // await deleteProductPromise(newProductsEl);
      await Promise.all(
        newProductsEl.map(
          async (newProductEl: any) =>
            await deleteProduct(newProductEl.dataset.id),
        ),
      );

      products = await getAllProducts();
      productList.innerHTML = '';

      alert('선택한 상품이 삭제되었습니다.');
    } else {
      return;
    }

    setUpUI(productPageBtn, productList);
  });
};
