import { chevronrightSVG, paginationRight } from '../importIMGFiles';
import { router } from '../main';
import { $$ } from '../utils/dom';
import { renderPage } from '../utils/render';
import { getLoginStatus, showAlertPlzLogin } from './login';
let navliList;

/** HTML : mypage nav 목록 */
export const htmlMypage_Nav = /* html */ `
<div class="mypage__app">
  <div class="mypage__container">
    <div class="mypage__navbar">
      <h1>마이페이지</h1>
      <nav>
        <ul>
          <li>
            <a href="/mypage/order" data-navigo id="mpOrderHistory">주문 내역
              <img src="${paginationRight}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/account" data-navigo id="mpAccount">계좌 관리
              <img src="${paginationRight}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/wishlist" data-navigo id="mpWishList">찜한 상품
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/editPersonalInfo" data-navigo id="mpEditPersonalInfo">개인 정보 수정
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
        </ul>
      </nav>
    </div>
  <div class="mypage__navigo__container"></div>
</div>
`;

export function handleMyPage(): void {
  if (getLoginStatus() === false) {
    showAlertPlzLogin();
    router.navigate('/login');
    return;
  } else {
    renderPage(htmlMypage_Nav);
    router.navigate('mypage/order');
  }
}

/** mypage nav탭 선택시 영역 acitve */

export const resetNavbarActive = (): void => {
  navliList = $$<any>('.mypage__navbar nav ul li');
  navliList?.forEach((navli: HTMLLIElement) =>
    navli.classList.remove('active'),
  );
};
