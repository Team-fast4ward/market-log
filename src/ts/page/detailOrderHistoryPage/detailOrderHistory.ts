/*-----------------------------------*\
  마이 페이지 - 주문내역 상세 페이지  # mypage/order/:id
\*-----------------------------------*/
import { $ } from '../../utils/dom';
import { renderPage } from '../../utils/render';
import { getDetailOrderProduct } from '../../api';
import { formatDate } from '../../utils/format';
import { getLoginStatus, showAlertPlzLogin } from '../login';
import { htmlMypage_Nav } from '../mypage';
import { router } from '../../main';

/** 마이 페이지 mypage__navigo__container 초기 템플릿 */
// const renderInitMypageTemplate = `
//       <div class="mypage__app">
//         <div class="mypage__container">
//           <div class="mypage__navbar">
//             <h1>마이페이지</h1>
//             <nav>
//               <ul>
//                 <li>
//                   <a href="/mypage/order" data-navigo
//                     >주문내역
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/account" data-navigo
//                     >계좌 관리
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/wishlist" data-navigo
//                     >찜한 상품
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/mypage/editPersonalInfo" data-navigo
//                     >개인 정보 수정
//                     <img src="./public/chevronright.svg" alt="chevronright" />
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//           <div class="mypage__navigo__container"></div>
//         </div>
//       </div>
// `;

/** 주문 상세정보 구매확정/취소/완료 체크 함수 */
const checkWhetherDetailOrderTransactionIsDone = (
  done: boolean,
  isCanceled: boolean,
) => {
  if (done) {
    return '구매 확정';
  } else if (isCanceled) {
    return '구매 취소';
  } else if (!done && !isCanceled) {
    return '구매 완료';
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
        ${checkWhetherDetailOrderTransactionIsDone(done, isCanceled)}
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

/** 상세 주문 내역 skeleton ui 초기 렌더링 */
const renderSkeletonUIinDetailOrderHistoryPage = (): void => {
  const skeletonUITemplate = `
  <li class="orderHistoryPage__skeleton"></li>
`;

  const skeletonUI12: string = Array(2)
    .fill(skeletonUITemplate)
    .map((v: string) => {
      return v;
    })
    .join('');

  $('.mypage__navigo__container').innerHTML = skeletonUI12;
};

/** 상세 주문내역 핸들링 함수 */
const renderDetailOrderPage = async (params: string): Promise<void> => {
  renderPage(htmlMypage_Nav);
  renderSkeletonUIinDetailOrderHistoryPage();
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
