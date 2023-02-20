import dotenv from 'dotenv';
import Navigo from 'navigo';
import chevronrightSVG from '../../../public/chevronright.svg';
import { htmlMypage_Account, initFuncAccount } from './mypage/account.js';
import { htmlMypage_MyHeart, initFuncMyHeart } from './mypage/myheart.js';
import {
  htmlMypage_OrderHistory,
  initFuncOrderHistory,
} from './mypage/orderhistory.js';
import { htmlLogin, initFuncLogin } from './login.js';
import { htmlSingup, initFuncSignup } from './signup.js';
import { renderPage } from '../main.js';
dotenv.config();
// window.localStorage.clear(); // TODO : 삭제
const $ = (selector) => document.querySelector(selector);
// export const router = new Navigo('/');
const divLoadingEl = document.querySelector('.loadingGif');

let navliList;

// HTML : mypage nav 목록
export const htmlMypage_Nav = /* html */ `
<div class="mypage__app">
  <div class="mypage__container">
    <div class="mypage__navbar">
      <h1>마이페이지</h1>
      <nav>
        <ul>
          <li>
            <a href="/mypage/orderHistory" data-navigo id="mpOrderHistory">주문 내역
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/account" data-navigo id="mpAccount">계좌 관리
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/myHeart" data-navigo id="mpMyHeart">찜한 상품
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
          <li>
            <a href="/mypage/myPersonalInfoModify" data-navigo id="mpMyPersonalInfoModify">개인 정보 수정
              <img src="${chevronrightSVG}" alt="chevronright">
            </a>
          </li>
        </ul>
      </nav>
    </div>
  <div class="mypage__navigo__container"></div>
</div>
`;

export function initFunc() {
  const btnGetList = document.querySelector('.getlist'); // 삭제 예정
  const temporaryEl = document.querySelector('.temporary'); // 삭제 예정
  btnGetList.textContent = '은행 목록 가져오기'; // 삭제 예정

  // 삭제 예정
  btnGetList.addEventListener('click', () => {
    temporaryEl.style.display = 'none';
  });
}

export function renderMyPageNav(html) {
  $('.app').innerHTML = htmlMypage_Nav;
  $('.app').querySelector('.mypage__navigo__container').innerHTML = html;
  resetliActive();
}

function resetliActive() {
  navliList = document.querySelectorAll('.mypage__navbar nav ul li a');
  navliList.forEach((navli) => navli.classList.remove('active'));
}
