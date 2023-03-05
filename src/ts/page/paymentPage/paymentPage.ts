/*-----------------------------------*\
  # 결제 페이지 # pay js
\*-----------------------------------*/
import { router } from '../../main';
import { $, $$ } from '../../utils/dom';
import { renderPage } from '../../utils/render';

import {
  hanaBank,
  kakaoBank,
  kbBank,
  nhBank,
  shinhanBank,
  wooriBank,
} from './payIMG';
import { getAccountDetail, buyItemAPI, getUserInfoAPI } from '../../api';
import Swiper, { Navigation, Pagination } from 'swiper';
import { renderCartTotalPrice } from '../cartPage/cartPage';
import { shoppingCartStore } from '../../store/shoppingCartStore';
import {
  ShoppingCartStore,
  ShoppingCartStoreValue,
} from '../../interface/store';
import { Bank } from '../../interface/index';

Swiper.use([Navigation, Pagination]);

/** 제품 총 개수 렌더링 함수 */
const renderProductTotalQty = (): number => {
  const paymentItemCount = shoppingCartStore
    .getLocalStorage()
    .map((items: ShoppingCartStore) => items.count);
  const renderProductTotalQty = paymentItemCount.reduce<number>((acc, val) => {
    return acc + val;
  }, 0);

  return renderProductTotalQty;
};

/** 결제 페이지 처음 렌더링 */
const renderInitPaymentPage = `
<section class="pay">
  <div class="pay__container">
    <div class="pay__header"><h2>결제하기</h2></div>
    <div class="pay__info">
      <form class="paymentPage__submitForm">
        <div class="pay__info--header"><h3>주문정보</h3></div>
        <div class="pay__info--orderItem pay__info--order-item">
          <h4>주문상품 <span class="paymentProductQty"></span>개</h4>
          <ul class="pay__info--orderItem-lists"></ul>
        </div>
        <div class="pay__info--orderItem pay__info--address-info">
          <h4>배송지</h4>
          <div class="pay__info--address-container">
            <div class="pay__info--address-form">
              <div class="pay__info-zipcode">
                <h6>우편번호</h6>
                <div class="pay__info-zipcode--data">
                  <input
                    class="pay__info-zipcode--data-input"
                    placeholder="우편번호 찾기를 버튼을 클릭하세요"
                    id="sample5_address"
                    readonly
                    required
                  />
                  <button class="pay__info-zipcode--data-searchBtn">
                    우편번호 찾기
                  </button>
                </div>
              </div>

              <div class="pay__info--order">
                <h6>주소지</h6>
                <div class="pay__info--order-data">
                  <input
                    placeholder="상세 주소"
                    class="pay__info--order-data-address"
                    required
                  />
                </div>
              </div>

              <div class="pay__info--delivery">
                <h6>배송메모</h6>
                <div>
                  <select>
                    <option value="default">
                      배송 메세지를 선택해주세요.
                    </option>
                    <option value="purchase-item">
                      배송 전에 미리 연락 바랍니다.
                    </option>
                    <option value="purchase-item">
                      부재시 경비실에 맡겨 주세요.
                    </option>
                    <option value="purchase-item">
                      부재시 전화 주시거나 문자 남겨 주세요.
                    </option>
                  </select>
                </div>
              </div>
              <div id="map" style="width:300px;height:300px;margin-top:10px;display:none"></div>
            </div>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--payer-info">
          <h4>받으시는 분</h4>
          <div class="pay__info--payer--container">
            <form class="pay__info--payer--form">
              <div class="pay__info--payer--checkbox">
                <h6>주문자와 동일</h6>
                <input type="checkbox" class="pay__info--payer-sameWithPayer" />
              </div>
              <div class="pay__info--payer--name">
                <h6>성함</h6>
                <input
                class="pay__info--payer--name-input"
                placeholder="이름을 입력해주세요"
                required
                />
              </div>
              <div class="pay__info--payer--email">
                <h6>이메일</h6>
                <input
                  class="pay__info--payer--email-input"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div class="pay__info--payer--phoneNum">
                <h6>휴대폰</h6>
                <input
                  class="pay__info--payer--phoneNum-input"
                  type="tel"
                  placeholder="휴대폰 번호를 입력해주세요"
                />
              </div>
            </form>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--price-sum">
          <div class="pay__info--width400px">
            <h4>결제 금액</h4>
            <div class="pay__info--payment--container">
              <div class="pay__info--container-totalOrderPrice">
                <h6>총 주문 금액</h6>
                <span class="payTotalOrderPrice">${renderCartTotalPrice().toLocaleString()} 원</span>
              </div>
              <div class="pay__info--container-discountPrice">
                <h6>할인 금액</h6>
                <span class="payDiscountPrice">0 원</span>
              </div>
              <div class="pay__info--container-deliveryPrice">
                <h6>배송비</h6>
                <span class="payDeliveryPrice">0 원</span>
              </div>
              <div class="pay__info--container-totalPaymentPrice">
                <h6>총 결제 금액</h6>
                <span class="payTotalAccountBalance"></span>
                <span class="payTotalPaymentPrice">${renderCartTotalPrice().toLocaleString()} 원</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pay__info--orderItem pay__info--payment-method">
          <div class="payment-method">
            <h4>결제수단</h4>
            선택된 계좌: <span class="payment-method__account-selected"></span>
          </div>
          <div class="payment-method__select-card">
            <div class="swiper payment-method__swiper-wrapper">
              <ul class="swiper-wrapper payment-method__card-lists"></ul>
              <div class="swiper-pagination"></div>
              
            </div>
          </div>
          <div class="payment-method__final">
            <ul class="payment-method__final-alert">
              <li>
                - 최소 결제 가능 금액은 총 결제 금액에서 배송비를 제외한
                금액입니다.
              </li>
              <li>
                - 소액 결제의 경우 정책에 따라 결제 금액 제한이 있을 수
                있습니다.
              </li>
            </ul>
            <div class="payment-method__final-confirm--container">
              <button class="payment-method__final-confirm--btn">
                총 ${renderCartTotalPrice().toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>
`;

/** 결제페이지 구매할 제품 리스트 렌더링 */
const renderPaymentProductList = (storage: ShoppingCartStoreValue) => {
  const paymentProductListTemplate = storage
    .map((item: ShoppingCartStore) => {
      const { id, price, count, thumbnail, title } = item;

      return `
    <li class="pay__info--orderItem-list" data-product-id="${id}">
      <img
        src="${thumbnail}"
        alt="${title}"
      />
      <div class="pay__info--orderItem-desc">
        <h5 class="pay__info--orderItem-title">${title}</h5>
        <div class="pay__info--orderItem-qty">${count} 개</div>
        <div class="pay__info--orderItem-totalprice">${price.toLocaleString()}원</div>
      </div>
    </li>
    `;
    })
    .join('');

  $<HTMLUListElement>('.pay__info--orderItem-lists').innerHTML =
    paymentProductListTemplate;
};

/** 로그인한 사용자 정보 렌더링 */
const renderUserInfoInPaymentPage = async () => {
  const getUserInformation = await getUserInfoAPI();
  const { email, displayName } = getUserInformation;
  $<HTMLInputElement>('.pay__info--payer--name-input').value = displayName;
  $<HTMLInputElement>('.pay__info--payer--email-input').value = email;
};
// pay__info--payer-sameWithPayer

/** '주문자와 동일' 체크박스 이벤트 */
$('.app').addEventListener('change', (e: Event) => {
  if (
    (e.target as HTMLInputElement).classList.contains(
      'pay__info--payer-sameWithPayer',
    )
  ) {
    if (
      $<HTMLInputElement>('.pay__info--payer-sameWithPayer').checked === true
    ) {
      renderUserInfoInPaymentPage();
    } else {
      $<HTMLInputElement>('.pay__info--payer--name-input').value = '';
      $<HTMLInputElement>('.pay__info--payer--email-input').value = '';
    }
  }
});

/** 계좌목록 및 잔액 조회 */
const renderPaymentAccount = async (items: Bank[]) => {
  const paymentAccountListTemplate = items
    .map((item: Bank) => {
      const { id, bankName, bankCode, accountNumber, balance } = item;

      return `
    <li class="swiper-slide payment-method__card-list" data-account-id="${id}">
      <img
        src="${
          bankCode === '081'
            ? hanaBank
            : bankCode === '089'
            ? kbBank
            : bankCode === '090'
            ? kakaoBank
            : bankCode === '011'
            ? nhBank
            : bankCode === '088'
            ? shinhanBank
            : bankCode === '020'
            ? wooriBank
            : bankCode === '004'
            ? kbBank
            : ''
        }"
        width="210"
        height="140"
        alt="${bankName}"
      />
      <p class="payment-method__card-name">${bankName}</p>
      
      <p>${bankCode}</p>
      <p>${accountNumber}</p>
      <p>${balance.toLocaleString()} 원</p>
    </li>
    `;
    })
    .join('');
  $('.app').querySelector('.payment-method__card-lists').innerHTML =
    paymentAccountListTemplate;
};

/** 연결된 계좌가 없을 때 예외처리 */
const renderNoPaymentAccount = () => {
  const NoPaymentAccountTemplate = `
  <li class="swiper-slide payment-method__card-list">
    <img class="payment-method__card-list--noPaymentBankAccount"
      src="${kakaoBank}"
      width="210"
      height="140"
      alt="결제 정보 없음"
    />
    <a href="/mypage/account" data-navigo>
      <button class="payment-method__card-list--goToLinkBankAccount-button">
        계좌 연결하러 가기
      </button>
    </a>
  </li>
  `;

  $('.app').querySelector('.payment-method__card-lists').innerHTML =
    NoPaymentAccountTemplate;
};

/** 카카오 맵 렌더링 */
const renderKakaoMap = () => {
  var mapContainer = document.getElementById('map') as HTMLElement, // 지도를 표시할 div
    mapOption = {
      center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
      level: 5, // 지도의 확대 레벨
    };

  //지도를 미리 생성
  var map = new daum.maps.Map(mapContainer, mapOption);
  //주소-좌표 변환 객체를 생성
  var geocoder = new daum.maps.services.Geocoder();
  //마커를 미리 생성
  var marker = new daum.maps.Marker({
    position: new daum.maps.LatLng(37.537187, 127.005476),
    map: map,
  });
  function sample5_execDaumPostcode() {
    new daum.Postcode({
      oncomplete: function (data: any) {
        var addr = data.address; // 최종 주소 변수

        // 주소 정보를 해당 필드에 넣는다.
        (document.getElementById('sample5_address') as HTMLInputElement).value =
          addr;
        // 주소로 상세 정보를 검색
        geocoder.addressSearch(
          data.address,
          function (results: any, status: any) {
            // 정상적으로 검색이 완료됐으면
            if (status === daum.maps.services.Status.OK) {
              var result = results[0]; //첫번째 결과의 값을 활용

              // 해당 주소에 대한 좌표를 받아서
              var coords = new daum.maps.LatLng(result.y, result.x);
              // 지도를 보여준다.
              mapContainer.style.display = 'block';
              map.relayout();
              // 지도 중심을 변경한다.
              map.setCenter(coords);
              // 마커를 결과값으로 받은 위치로 옮긴다.
              marker.setPosition(coords);
            }
          },
        );
      },
    }).open();
  }
  $<HTMLButtonElement>('.pay__info-zipcode--data-searchBtn').addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      sample5_execDaumPostcode();
    },
  );
};

/** 결제하기 버튼 활성화/비활성화 */
const activePaymentBtn = async (): Promise<void> => {
  const finalPaymentBtn = $<HTMLButtonElement>(
    '.payment-method__final-confirm--btn',
  );
  // const selectedPaymentAccount = $<HTMLSpanElement>(
  //   '.payment-method__account-selected',
  // );
  // console.log(selectedPaymentAccount.textContent);
  const accountList = await getAccountDetail();
  if (accountList.length === 0) {
    finalPaymentBtn.style.backgroundColor = 'gray';
    finalPaymentBtn.setAttribute('disabled', 'true');
  } else if (accountList.length >= 1) {
    finalPaymentBtn.style.backgroundColor = 'var(--logo-color)';
    finalPaymentBtn.style.cursor = 'pointer';
  }
};

/** swiper 결제 페이지 선택된 계좌 이름 렌더링 */
const renderSelectedPayment = (e: any) => {
  const availableBankAccount = $$<any>('.payment-method__card-list')[
    e.realIndex
  ]?.querySelector('.payment-method__card-name')?.textContent;

  if (availableBankAccount === undefined) {
    $<HTMLSpanElement>('.payment-method__account-selected').innerHTML =
      '등록된 계좌가 없습니다.';
  } else {
    $<HTMLSpanElement>('.payment-method__account-selected').innerHTML =
      availableBankAccount;
  }
};

/** 결제 페이지 최종 결제 버튼의 결제 가격 재렌더링 함수 */
const renderFinalPaymentPrice = () => {
  $(
    '.payment-method__final-confirm--btn',
  ).innerHTML = `총 ${renderCartTotalPrice().toLocaleString()} 원 결제하기`;
  $(
    '.payTotalOrderPrice',
  ).innerHTML = `${renderCartTotalPrice().toLocaleString()} 원`;
  $(
    '.payTotalPaymentPrice',
  ).innerHTML = `${renderCartTotalPrice().toLocaleString()} 원`;
};

/** 결제페이지에서 작동하는 함수들 */
const paymentPageFunction = async () => {
  // 1. 결제가격 재렌더링
  renderCartTotalPrice();
  // 2. 결제할 제품들 렌더링
  renderPaymentProductList(shoppingCartStore.getLocalStorage());
  // 3. 제품 개수
  $<HTMLSpanElement>('.paymentProductQty').innerHTML =
    renderProductTotalQty().toString();
  renderFinalPaymentPrice();
  // 4. 주소찾기 카카오api
  renderKakaoMap();
  // 4-1. 사용자 정보 가져오기
  // await renderUserInfoInPaymentPage();
  // 5. 결제수단 불러오기
  // 예외처리: 불러올 결제수단이 없으면 '계좌 연결하러 가기 버튼 생성'
  const accountList = await getAccountDetail();

  accountList === undefined || accountList.length === 0
    ? renderNoPaymentAccount()
    : await renderPaymentAccount(await getAccountDetail());

  // 5. 연결된 계좌 swiper
  paymentCardSwiper;
  var paymentCardSwiper = new Swiper('.payment-method__swiper-wrapper', {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    grabCursor: true,
    spaceBetween: 30,
    on: {
      afterInit: (e) => {
        renderSelectedPayment(e);
        activePaymentBtn();
      },
      slideChange: (e) => {
        renderSelectedPayment(e);
        activePaymentBtn();
      },
    },
  });
};

/////////////////////////////

/** 현재 선택한 은행계좌의 잔액 확인해주는 함수 */
const checkBalanceOfselectedBankAccount = async (
  id: string,
): Promise<Bank[]> => {
  const availableAccount = await getAccountDetail();

  const checkCurrentSelectedBankId = availableAccount.filter((item) => {
    return item.id === id;
  });
  return checkCurrentSelectedBankId;
};

/** [결제 페이지] 결제버튼 로직 */
const handlePaymentBtnLogic = async (): Promise<void> => {
  const currentSelectedBankId = $('.swiper-slide-active').dataset.accountId;
  const productIds = shoppingCartStore.getLocalStorage().map((items) => {
    return items.id;
  });
  const totalProductPrice = renderCartTotalPrice();

  const getCurrentSelectedAccount = await checkBalanceOfselectedBankAccount(
    currentSelectedBankId,
  );

  const getCurrentSelectedAccountBalance =
    getCurrentSelectedAccount[0]['balance'];

  // 결제 성공 했을 때
  if (getCurrentSelectedAccountBalance >= totalProductPrice) {
    productIds.map(async (productId) => {
      await buyItemAPI(productId, currentSelectedBankId);
      // localStorage shoppingCart 비워주기
      shoppingCartStore.removeLocalStorage();
      return;
    });
    // 결제 성공 alert
    alert('결제가 성공적으로 되었습니다. 구매내역으로 이동합니다.');
    router.navigate('/mypage/order');
  } else if (getCurrentSelectedAccountBalance < totalProductPrice) {
    // 결제 실패 했을 때
    alert('해당 계좌의 잔액이 부족합니다.');
    return;
  }
};

$('.app').addEventListener('click', async (e) => {
  /** 결제 버튼 클릭시 결제 진행 (리팩토링 예정)*/
  if (
    (e.target as HTMLButtonElement).classList.contains(
      'payment-method__final-confirm--btn',
    )
  ) {
    if ($<HTMLInputElement>('.pay__info-zipcode--data-input').value === '') {
      $<HTMLInputElement>('.pay__info-zipcode--data-input').focus();
      alert('우편번호를 입력해주세요');
      return;
    }
    if ($<HTMLInputElement>('.pay__info--payer--name-input').value === '') {
      $<HTMLInputElement>('.pay__info--payer--name-input').focus();
      alert('주문자 이름을 입력해주세요.');
      return;
    }
    // 결제가 성공하면 구매내역 페이지로 라우팅 (지금은 홈으로 이동)
    await handlePaymentBtnLogic();
  }
});

/** /payment 핸들링 함수 */
export const handlePaymentPage = async (): Promise<void> => {
  $('.modal__addCart').style.display = 'none';

  renderPage(renderInitPaymentPage);
  await paymentPageFunction();
};
