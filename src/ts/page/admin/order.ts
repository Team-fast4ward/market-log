import { getAllOrder } from '../../api';
import { renderPageBtn, renderOrderList } from './renderDetail';
import { toggleLoadingSpinner } from '../../utils/loading';
import { $ } from '../../utils/dom';

import { TransactionDetailInterface } from '../../interface/index';

let orders: TransactionDetailInterface[] = [];

let activeIdx: number = 1;
let btnIdx: number = 1;
const itemsPerPage: number = 10;

/**현재 페이지의 거래내역 가져오기 */
const getOrderCurrentPage = (
  orders: TransactionDetailInterface[],
  activeIdx: number,
  itemsPerPage: number,
): TransactionDetailInterface[] => {
  const start = (activeIdx - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const newOrders = orders.slice(start, end);

  return newOrders;
};

/** 거래내역 목록 페이지 초기화 */
const setUpUI = (
  orderPageBtn: HTMLElement,
  orderList: HTMLUListElement,
): void => {
  renderPageBtn(orderPageBtn, orders, activeIdx, itemsPerPage, btnIdx);
  newOrders = getOrderCurrentPage(orders, activeIdx, itemsPerPage);
  renderOrderList(orderList, newOrders, activeIdx);
};

let newOrders = getOrderCurrentPage(orders, activeIdx, itemsPerPage);

/** 거래내역관리 페이지 핸들러 */
export const handleOrderPage = async (): Promise<void> => {
  toggleLoadingSpinner(true);

  const orderList = $<HTMLUListElement>('.order-container__list');
  const orderPageBtn = $<HTMLElement>('.order-container__btn-page');

  orders = await getAllOrder();
  orders = orders.sort((a, b) => +new Date(b.timePaid) - +new Date(a.timePaid));

  setUpUI(orderPageBtn, orderList);

  const searchedOrderInput = $<HTMLInputElement>(
    '.order-container__search-container--input input',
  );

  const searchOrderHandler = (): void => {
    const filteredOrder = orders.filter((order) =>
      order.user.displayName.includes(searchedOrderInput.value),
    );

    orders = filteredOrder;

    orderList.innerHTML = ``;
    renderPageBtn(orderPageBtn, filteredOrder, 1, itemsPerPage, 1);
    newOrders = getOrderCurrentPage(filteredOrder, 1, itemsPerPage);
    renderOrderList(orderList, newOrders, 1);
  };

  /** 거래내역 검색(enter) 이벤트 리스너 */
  searchedOrderInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      searchOrderHandler();
    }
  });

  searchedOrderInput.addEventListener('input', async () => {
    searchedOrderInput.value === '' ? (orders = await getAllOrder()) : orders;
    searchOrderHandler();
  });

  /** 거래내역 검색(버튼 클릭) 이벤트 리스너 */
  // searchedOrderBtn.addEventListener('click', searchOrderHandler);

  /** 버튼 클릭 페이지 이동 이벤트 리스너 */
  orderPageBtn.addEventListener('click', (e: MouseEvent) => {
    if ((e.target as HTMLButtonElement).classList.contains('btn-page')) return;

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

      if (activeIdx > Math.ceil(orders.length / itemsPerPage) - 1) {
        activeIdx = Math.ceil(orders.length / itemsPerPage);
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
    orderList.innerHTML = ``;
    setUpUI(orderPageBtn, orderList);
  });

  toggleLoadingSpinner(false);
};
