import { getAllOrder, editCancelOrder, editDoneOrder } from '../../api.js';
import { renderOrderDetail, renderOrderDetailBtn } from './renderDetail.js';
import { $ } from '../../utils/dom.js';

/** 거래내역관리상세 페이지 핸들러 */
export const orderDetailHandler = async (detailId: string) => {
  const orders = await getAllOrder();
  let order = orders.filter((order) => order.detailId === detailId)[0];
  renderOrderDetail(order);
  renderOrderDetailBtn(order);

  const orderCancelBtn = $(
    '.orderDetail-container__btn--cancel',
  ) as HTMLButtonElement;

  const orderDoneBtn = $(
    '.orderDetail-container__btn--done',
  ) as HTMLButtonElement;

  /** 거래 취소, 취소 해제 이벤트리스너 */
  orderCancelBtn.addEventListener('click', async () => {
    if (
      confirm(
        `${
          order.isCanceled
            ? '거래 취소를 해제 처리하시겠습니까?'
            : `거래를 취소 처리하시겠습니까?`
        }`,
      )
    ) {
      await editCancelOrder(order);
      order.isCanceled = !order.isCanceled;
      orderCancelBtn.textContent = order.isCanceled
        ? '거래 취소 해제'
        : '거래 취소';
      renderOrderDetail(order);
    }
  });

  /** 거래 완료, 완료 해제 이벤트리스너 */
  orderDoneBtn.addEventListener('click', async () => {
    if (
      confirm(
        `${
          order.isCanceled
            ? '거래 완료를 해제 처리하시겠습니까?'
            : `거래를 완료 처리하시겠습니까?`
        }`,
      )
    ) {
      await editDoneOrder(order);
      order.done = !order.done;
      orderDoneBtn.textContent = order.done ? '거래 완료 해제' : '거래 완료';
      renderOrderDetail(order);
    }
  });
};
