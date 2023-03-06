/*-----------------------------------*\
  마이 페이지 - 주문내역 상세 페이지  # mypage/order/:id
\*-----------------------------------*/
import { $ } from '../../utils/dom';
import { renderPage } from '../../utils/render';
import { getDetailOrderProduct } from '../../api';
import { formatDate } from '../../utils/format';
import { getLoginStatus, showAlertPlzLogin } from '../loginPage';
import { htmlMypage_Nav } from '../mypage';
import { router } from '../../main';
import { OrderStatus } from '../../types/enum';
import {
  renderSkeletonUI,
  skeletonUITemplateDetailOrderHistoryPage,
} from '../../utils/skeletonUI';

/** 주문 상세정보 구매확정/취소/완료 체크 함수 */
const checkTransactionStatus = (done: boolean, isCanceled: boolean): string => {
  if (done) {
    return OrderStatus.DONE;
  } else if (isCanceled) {
    return OrderStatus.CANCELED;
  } else if (!done && !isCanceled) {
    return OrderStatus.COMPLETED;
  }
};

/** 주문 상세정보 렌더링 함수 */
const renderDetailOrderProduct = async (id: string): Promise<void> => {
  const detailOrderProduct = await getDetailOrderProduct(id);

  const { detailId, product, account, timePaid, isCanceled, done } =
    detailOrderProduct;
  const { bankName, accountNumber } = account;
  const { productId, title, price, thumbnail } = product;

  const detailOrderTemplate = `
  <section class="mypage__detailorderhistory">
    <h2>주문 상세정보</h2>
    <div class="detailorderhistory__order--info">
      <span class="detailorderhistory__order--info-date">
        주문 날짜: ${formatDate(timePaid)}</span
      >
      <span class="detailorderhistory__order--info-id"
        >주문 번호: ${detailId}</span
      >
    </div>
    <div class="detailorderhistory__product" data-product-id=${productId}>
      <div class="detailorderhistory__product--container">
        <img
          class="detailorderhistory__product--image"
          src="${thumbnail}"
          alt="${title}"
        />
        <div class="detailorderhistory__product--info">
          <a
            href="/product/${productId}"
            data-navigo
            class="detailorderhistory__product--name"
          >
            ${title}
          </a>
          <div>
            <span class="detailorderhistory__product--price"
              >${price.toLocaleString()} 원</span
            >
            <span class="detailorderhistory__product--count"
              >(1개)</span
            >
          </div>
        </div>
      </div>
      <div class="detailorderhistory__product--order-status">
        ${checkTransactionStatus(done, isCanceled)}
      </div>
    </div>
    <h2 class="detailorderhistory__product--payment-info-title">
      결제 정보
    </h2>
    <div class="detailorderhistory__payment--detail-container">
      <div class="detailorderhistory__payment--detail">
        <span class="detailorderhistory__payment--detail-type"
          >결제수단</span
        >
        <span class="detailorderhistory__payment--detail-bank"
          >${bankName}(${accountNumber})</span
        >
      </div>
      <div
        class="detailorderhistory__payment--detail-price-container"
      >
        <span class="detailorderhistory__payment--detail-price-title"
          >결제 금액</span
        >
        <span class="detailorderhistory__payment--detail-price"
          >${price.toLocaleString()} 원</span
        >
      </div>
    </div>
  </section>
  `;
  $('.mypage__navigo__container').innerHTML = detailOrderTemplate;
};

/** 상세 주문내역 핸들링 함수 */
const renderDetailOrderPage = async (params: string): Promise<void> => {
  renderPage(htmlMypage_Nav);
  renderSkeletonUI(
    skeletonUITemplateDetailOrderHistoryPage,
    2,
    $('.mypage__navigo__container'),
  );
  await renderDetailOrderProduct(params);
};

/** /mypage/order/:id 핸들링 함수 */
export const handleDetailOrderHistoryPage = async (
  params: string,
): Promise<void> => {
  if (getLoginStatus() === false) {
    showAlertPlzLogin();
    router.navigate('/login');
    return;
  }
  await renderDetailOrderPage(params);
};
