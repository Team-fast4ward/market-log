import { renderDashboardCurrent, renderDashboardChart } from './renderDetail';
import { toggleLoadingSpinner } from '../../utils/loading';
import { getAllOrder, getAllProducts } from '../../api';
import { formatPrice } from '../../utils/format';
import Chart from 'chart.js/auto';
import { $ } from '../../utils/dom';
import { getDate } from '../../utils/date';
import {
  GetAllProductsInterface,
  TransactionDetailInterface,
} from '../../interface/index';

import { Category } from '../../interface/enum';

import { CurrentStatusInterface } from '../../interface/index';

/** 대시보드 페이지 핸들러 */
export const handleDashboardPage = async (): Promise<void> => {
  toggleLoadingSpinner(true);

  let orders = await getAllOrder();
  let products = await getAllProducts();

  const currentStatus = setCurrentStatus(orders, products);
  renderDashboardCurrent(currentStatus);
  renderDashboardChart();
  setDashBoardChartCategory(products);
  setDashBoardChartAmount(orders);
  toggleLoadingSpinner(false);
};

/** 거래 카테고리 통계 chart 생성 */
const setDashBoardChartCategory = (
  products: GetAllProductsInterface[],
): void => {
  const chartCategory = $<HTMLCanvasElement>('#chartCategory');

  const keyboardNum = products.filter(
    (product: GetAllProductsInterface) =>
      product.tags[0] === Category.keyboards,
  ).length;

  const keycapNum = products.filter(
    (product) => product.tags[0] === Category.keycaps,
  ).length;

  const switchNum = products.filter(
    (product) => product.tags[0] === Category.switches,
  ).length;

  const accessory = products.filter(
    (product) => product.tags[0] === Category.accessories,
  ).length;

  new Chart(chartCategory, {
    type: 'pie',
    data: {
      labels: [
        Category.keyboards,
        Category.keycaps,
        Category.switches,
        Category.accessories,
      ],
      datasets: [
        {
          label: ' 거래 수 ',
          data: [keyboardNum, keycapNum, switchNum, accessory],
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'left',
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    },
  });
};

/** 금주 거래 금액 통계 chart 생성 */
const setDashBoardChartAmount = (
  orders: TransactionDetailInterface[],
): void => {
  const chartAmount = $<HTMLCanvasElement>('#chartAmount');

  const thisWeek: number[] = [];

  for (let i = 0; i < 7; i++) {
    thisWeek.unshift(Number(getDate().today) - i);
  }

  const amountOfthisWeek: number[] = [];

  for (let i = 0; i < 7; i++) {
    const todayOrder = orders.filter(
      (order) =>
        Number(order.timePaid.slice(8, 10)) === thisWeek[i] &&
        order.isCanceled === false,
    );
    amountOfthisWeek.unshift(
      todayOrder.reduce((acc, cur) => acc + cur.product.price, 0),
    );
  }

  new Chart(chartAmount, {
    type: 'line',
    data: {
      labels: thisWeek.map((date) => `${date}일`),
      datasets: [
        {
          label: '거래 금액',
          data: amountOfthisWeek,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};

/** 현재 날짜 가져오기 */

/** 거래, 상품 현황 상태 설정 */
const setCurrentStatus = (
  orders: TransactionDetailInterface[],
  products: GetAllProductsInterface[],
) => {
  const currentStatus: CurrentStatusInterface = {
    orderStatus: {
      num: 0,
      cancelNum: 0,
      doneNum: 0,
      amount: '',
    },
    productStatus: {
      num: products.length,
      soldOutNum: 0,
    },
  };

  currentStatus.orderStatus.num = orders.filter(
    (order) => order.timePaid.slice(5, 7) === getDate().month,
  ).length;

  currentStatus.orderStatus.cancelNum = orders.filter(
    (order) =>
      order.timePaid.slice(5, 7) === getDate().month &&
      order.isCanceled === true,
  ).length;

  currentStatus.orderStatus.doneNum = orders.filter(
    (order) =>
      order.timePaid.slice(5, 7) === getDate().month && order.done === true,
  ).length;

  currentStatus.orderStatus.amount = formatPrice(
    orders
      .filter(
        (order) =>
          order.timePaid.slice(5, 7) === getDate().month &&
          order.isCanceled === false,
      )
      .reduce((acc, cur) => acc + Number(cur.product.price), 0),
  );

  currentStatus.productStatus.soldOutNum = products.filter(
    (product) => product.isSoldOut === true,
  ).length;

  return currentStatus;
};
