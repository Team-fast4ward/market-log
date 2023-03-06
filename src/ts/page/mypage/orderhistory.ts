import {
  modalOrderCancel,
  modalOrderCancelFix,
  modalOrderFix,
  modalOrderFixFix,
} from '../modal/modalTemplates';
import { $ } from '../../utils/dom';
import { reload } from '../../importIMGFiles';
import { renderPage } from '../../utils/render';
import {
  calendar,
  exclamationmark,
  transaction,
  paginationLeft,
  paginationRight,
} from '../../importIMGFiles';
import {
  getAllTransactions,
  cancelTransactionAPI,
  confirmTransactionAPI,
} from '../../api';
import { formatDate } from '../../utils/format';
import { htmlMypage_Nav, resetNavbarActive } from '../mypage';
import { router } from '../../main';
import { getLoginStatus, showAlertPlzLogin } from '../login';
import { GetAllTransactionsInterface } from '../../interface/index';
import { toggleLoadingSpinner } from '../../utils/loading';

/** 거래 완료/취소 확인 함수 */
const checkWhetherTransactionIsDone = (
  done: boolean,
  isCanceled: boolean,
): string => {
  const buttons = `<button class="button cancel-btn orderHistory__list--cancelBtn">주문 취소</button>
                  <button class="button orderfix-btn orderHistory__list--confirmBtn">구매 확정</button>`;
  const emptyButtons = ``;
  if (done || isCanceled) {
    return emptyButtons;
  } else if (!done || !isCanceled) {
    return buttons;
  }
};

/** 마이 페이지 mypage__navigo__container 초기 템플릿 */
export const renderInitMypageTemplate = `
      <div class="mypage__app">
        <div class="mypage__container">
          <div class="mypage__navbar">
            <h1>마이페이지</h1>
            <nav>
              <ul>
                <li>
                  <a href="/mypage/order" data-navigo
                    >주문내역
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/account" data-navigo
                    >계좌 관리
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/wishlist" data-navigo
                    >찜한 상품
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
                <li>
                  <a href="/mypage/editPersonalInfo" data-navigo
                    >개인 정보 수정
                    <img src="./public/chevronright.svg" alt="chevronright" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="mypage__navigo__container"></div>
        </div>
      </div>
`;

/** 구매내역 초기 템플릿 */

export const handleOrderHistoryInitTemplate = (): void => {
  const renderOrderHistoryPageInitTemplate = `
  <div class="mypage__orderhistory">
    <h2>주문 내역</h2>
    <form class="calendar-box">
      <input class="calendar-date" type="date"></input>
      <button><img class="orderhistory_reload-btn" src="${reload}" alt="reload icon"></button>
    </form>
    <div class="products-container">
      <div class="nocontent-box nodisplay">
        <p>
          <img src="${exclamationmark}" alt="exclamationmark">
          <span>주문내역이 존재하지 않습니다.</span>
        </p>
      </div>
      <ul class="products orderHistory__lists"></ul>
    </div>
    <div class="order-history__pagination--btnsContainer"></div>
  </div>
  </div>
  `;
  $('.mypage__navigo__container').innerHTML =
    renderOrderHistoryPageInitTemplate;
};

/** 제품 구매 내역 */
const renderOrderedProductList = (
  orderedItems: GetAllTransactionsInterface[],
): void => {
  const orderedProductListTemplate = orderedItems
    .map((item) => {
      const { detailId, product, timePaid, done, isCanceled } = item;
      const { productId, title, price, thumbnail } = product;
      return `
      <li class="product orderHistory__list" data-product-id="${productId}" data-detail-id="${detailId}">
        <img src="${thumbnail}" alt="${title}" class="product--img orderHistory__list--img" />
        <div class="product--info">
          <a href="/mypage/order/${detailId}" class="product--name orderHistory__list--name">${
        title.length > 30 ? title.substring(0, 30).concat(' ...') : title
      }</a>
          <div class="product--info-numbers orderHistory__list--info">
            <div class="product--price orderHistory__list--info-price">${price.toLocaleString()} 원</div>
            <div class="product--order-date orderHistory__list--info-date">${formatDate(
              timePaid,
            )}</div>
          </div>
          <span class="order-status orderHistory__list--orderStatus">${
            done ? '주문 확정' : isCanceled ? '주문 취소' : '대기'
          }</span>
          <span style="font-size:18px;">${
            done
              ? '주문이 확정되었습니다.'
              : isCanceled
              ? '주문이 취소되었습니다'
              : '주문 확정 이후에는 주문 취소가 불가능합니다.'
          }</span>
          <span class="orderHistory__list--confirmed-order"></span>
        </div>
        <div class="buttons orderHistory__list--buttons">
          ${checkWhetherTransactionIsDone(done, isCanceled)}
        </div>
      </li>
    `;
    })
    .join('');

  if ($('.orderHistory__lists')) {
    $('.orderHistory__lists').innerHTML = orderedProductListTemplate;
  }
};

/** 주문 내역 skeleton ui 초기 렌더링 */
const renderSkeletonUIinOrderHistoryPage = (): void => {
  const skeletonUITemplate = `
  <li class="orderHistoryPage__skeleton"></li>
`;
  const skeletonUI12 = Array(12)
    .fill(skeletonUITemplate)
    .map((v) => {
      return v;
    })
    .join('');
  $('.orderHistory__lists').innerHTML = skeletonUI12;
};

/** 구매내역이 없을 경우 render 핸들링 함수, 빈 구매내역 template */
const emptyOrderHistory = (): void => {
  const emptyOrderHistoryTemplate = `
    <div class="cart__empty">
      <img src="${transaction}" alt="빈 구매내역" />
      <h3>구매내역이 없습니다.</h3>
      <a href="/category/keyboards">쇼핑하러 가기</a>
    </div>
  `;
  $('.orderHistory__lists').innerHTML = emptyOrderHistoryTemplate;
};

/** 제품 구매 내역 유/무 예외처리 */
const renderOrderedListPage = async (): Promise<void> => {
  renderPage(htmlMypage_Nav);
  handleOrderHistoryInitTemplate();
  resetNavbarActive();
  setNavbarActive();
  renderSkeletonUIinOrderHistoryPage();
  const transactionArray = await getAllTransactions();
  // 주문한 제품 없을 경우
  if (transactionArray.length === 0) {
    emptyOrderHistory();
  } else {
    // 주문한 제품 있을 경우
    // renderOrderedProductList(transactionArray);
    orderHistoryUtilInit();
    // 새로고침 버튼
    await $('.orderhistory_reload-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }
};
// const setNavbacActive = () => {
//   const active = document.querySelector('#mpOrderHistory');
//   active.parentElement.classList.add('active');
// };

// [주문 내역 페이지] 구매확정/취소 버튼 클릭 이벤트 */
$('.app').addEventListener('click', async (e: MouseEvent) => {
  const detailId = (e.target as HTMLLIElement).closest('li')?.dataset.detailId;
  //주문 확정 버튼 눌렀을 때
  if (
    (e.target as HTMLElement).classList.contains(
      'orderHistory__list--confirmBtn',
    )
  ) {
    // 주문 확정 첫번째 모달창
    $('.modal-container').innerHTML = modalOrderFix;
    $('.modal_confirm-btn').addEventListener('click', async () => {
      // 주문 확정 두번째 모달창
      await confirmTransactionAPI(detailId);
      console.log('api 전송');
      (e.target as HTMLElement)
        .closest('li')
        .querySelector('.orderHistory__list--confirmed-order').innerHTML =
        '구매가 확정되었습니다.';
      (e.target as HTMLElement)
        .closest('li')
        .querySelector('.orderHistory__list--buttons').style.display = 'none';
      $('.modal-container').innerHTML = modalOrderFixFix;
      $('.modal_cancel-btn').style.display = 'none';
      $('.modal_container').addEventListener('click', (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('modal_confirm-btn')) {
          $('.modal-container').innerHTML = '';
        }
      });
    });
    //첫 번쨰 모달에서 취소버튼 눌렀을 떄(창닫기)
    $('.modal_cancel-btn').addEventListener('click', (e: MouseEvent) => {
      if (e.target === $('.modal_cancel')) {
        $('.modal-container').innerHTML = '';
      }
    });
  }

  //주문 취소 버튼 눌렀을 때
  else if (
    (e.target as HTMLElement).classList.contains(
      'orderHistory__list--cancelBtn',
    )
  ) {
    //주문 취소 첫번째 모달
    $('.modal-container').innerHTML = modalOrderCancel;
    $('.modal_confirm-btn').addEventListener('click', async (e: MouseEvent) => {
      // 주문 취소 두번째 모달
      await cancelTransactionAPI(detailId);
      console.log('api 전송');
      (e.target as HTMLElement)
        .closest('li')
        .querySelector('.orderHistory__list--confirmed-order').innerHTML =
        '구매가 취소되었습니다.';
      (e.target as HTMLElement)
        .closest('li')
        .querySelector('.orderHistory__list--buttons').style.display = 'none';
      $('.modal-container').innerHTML = modalOrderCancelFix;
      $('.modal_cancel-btn').style.display = 'none';
      $('.modal_confirm-btn').addEventListener('click', () => {
        $('.modal-container').innerHTML = '';
      });
      return;
    });
    $('.modal_cancel-btn').addEventListener('click', () => {
      $('.modal-container').innerHTML = '';
      return;
    });
    // cancelTransactionAPI(detailId);
    // e.target
    //   .closest('li')
    //   .querySelector('.orderHistory__list--confirmed-order').innerHTML =
    //   '구매가 취소되었습니다.';
    // e.target
    //   .closest('li')
    //   .querySelector('.orderHistory__list--buttons').style.display = 'none';
    // return;
  }
});

/** /mypage/order 핸들링 함수 */
export const handleOrderHistoryPage = async () => {
  if (getLoginStatus() === false) {
    showAlertPlzLogin();
    router.navigate('/login');
    return;
  }
  $('.modal__addCart').style.display = 'none';
  toggleLoadingSpinner(true);
  await renderOrderedListPage();
  toggleLoadingSpinner(false);
};

/*-----------------------------------*\
  #pagination
\*-----------------------------------*/

/** 처음 index = 0 */
let orderHistoryUtilIndex: number = 0;
/** 페이지네이션 배열 초기화 = 0 */
let orderHistoryUtilPages: GetAllTransactionsInterface[][] = [];

/** 주문내역 페이지 제품, 버튼 초기 렌더링 */
const orderHistoryUtilSetupUI = () => {
  renderOrderedProductList(orderHistoryUtilPages[orderHistoryUtilIndex]);
  orderHistoryUtilDisplayButtons(
    $('.order-history__pagination--btnsContainer'),
    orderHistoryUtilPages,
    orderHistoryUtilIndex,
  );
};

/** 주문내역 페이지 초기 렌더링 시 ui, api 불러오는 함수 */
const orderHistoryUtilInit = async (): Promise<void> => {
  const orderHistory = await getAllTransactions();
  orderHistory.sort(
    (a, b) => new Date(b.timePaid).getTime() - new Date(a.timePaid).getTime(),
  );

  orderHistoryUtilPages = orderHistoryUtilPaginate(orderHistory);
  orderHistoryUtilSetupUI();
};

/** 주문내역 페이지 페이지네이션 1페이지 당 10개, slice 메서드로 배열에 삽입 */
const orderHistoryUtilPaginate = (
  list: GetAllTransactionsInterface[],
): GetAllTransactionsInterface[][] => {
  const itemsPerPage: number = 10;
  const numberOfPages: number = Math.ceil(list.length / itemsPerPage);

  const newList = Array.from({ length: numberOfPages }, (_, index) => {
    const start: number = index * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  });
  return newList;
};

/** 주문내역 페이지 페이지네이션 버튼 */
const orderHistoryUtilDisplayButtons = (
  container: HTMLDivElement,
  pages: GetAllTransactionsInterface[][],
  activeIndex: number,
): void => {
  let utilBtns = pages.map((_: unknown, pageIndex: number) => {
    return `
    <button class="order-history__pagination--btn ${
      activeIndex === pageIndex ? 'active-btn' : 'null'
    }" data-index="${pageIndex}">
      ${pageIndex + 1}
    </button>`;
  });
  utilBtns.push(
    `<button class="order-history__pagination--btn-next">></button>`,
  );
  utilBtns.unshift(
    `<button class="order-history__pagination--btn-prev"><</button>`,
  );
  if (container) {
    container.innerHTML = utilBtns.join('');
  }
};

/** prev, next, 페이지네이션 버튼 핸들링 이벤트 */
$('.app').addEventListener('click', (e: MouseEvent): void => {
  if (
    e.target instanceof HTMLDivElement &&
    e.target.classList.contains('order-history__pagination--btnsContainer')
  )
    return;
  if (
    e.target instanceof HTMLButtonElement &&
    e.target.classList.contains('order-history__pagination--btn')
  ) {
    orderHistoryUtilIndex = Number(e.target.dataset.index);
    orderHistoryUtilSetupUI();
  }

  if (
    e.target instanceof HTMLButtonElement &&
    e.target.classList.contains('order-history__pagination--btn-next')
  ) {
    orderHistoryUtilIndex++;
    if (orderHistoryUtilIndex > orderHistoryUtilPages.length - 1) {
      orderHistoryUtilIndex = 0;
    }
    orderHistoryUtilSetupUI();
  }
  if (
    e.target instanceof HTMLButtonElement &&
    e.target.classList.contains('order-history__pagination--btn-prev')
  ) {
    orderHistoryUtilIndex--;
    if (orderHistoryUtilIndex < 0) {
      orderHistoryUtilIndex = orderHistoryUtilPages.length - 1;
    }
    orderHistoryUtilSetupUI();
  }
});

const setNavbarActive = (): void => {
  const active = $('#mpOrderHistory');
  active.parentElement.classList.add('active');
};
