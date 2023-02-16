import chevronrightSVG from '../../public/chevronright.svg';
import Navigo from 'navigo';
import { base_url, api_key, user_name, admin_email } from '../js/db.js'; // 로그인 부분 지우면 필요없음
import { htmlMypage_Nav, initFunc, renderMyPageNav } from './page/mypage.js';
import { htmlMypage_Account, initFuncAccount } from './page/mypage/account';
import { htmlMypage_MyHeart, initFuncMyHeart } from './page/mypage/myheart';
import {
  htmlMypage_OrderHistory,
  initFuncOrderHistory,
} from './page/mypage/orderhistory';
import { htmlLogin } from './page/login';
import { htmlSignup, initFuncSignup } from './page/signup';
const $ = (selector) => document.querySelector(selector);
const router = new Navigo('/');
export const renderPage = (html) => {
  $('.app').innerHTML = html;
};
const divLoadingEl = $('.loadingGif');
const ulEl = $('.header__user-login--ul');

export async function renderInitMainPageHeader() {
  const author = await authorization();

  if (!localStorage.getItem('token')) {
    ulEl.innerHTML = /* html */ `
      <li class="header__user-login--li">
        <a href="/login" data-navigo id="btnlogin"> 로그인 </a>
      </li>
    `;
  } else {
    ulEl.innerHTML = /* html */ `
      <li class="header__user-login--li">
        <a href="/mypage" data-navigo>
          <strong strong id="header__user-login-name">${author.displayName}</strong>님 환영합니다
        </a>
      </li>
      <li class="header__user-login--li">
        <button id="btnlogout"> 로그아웃 </button>
      </li>
    `;
    $('#btnlogout').addEventListener('click', async () => {
      const logoutJSON = await logout();
      if (logoutJSON === true) {
        localStorage.removeItem('token');
        ulEl.innerHTML = /* html */ `
          <li class="header__user-login--li">
            <a href="/login" data-navigo id="btnlogin"> 로그인 </a>
          </li>
        `;
        router.navigate('/');
      }
    });
  }
}

const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};

async function authorization() {
  const res = await fetch(`${base_url}/auth/me`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const json = await res.json();
  return json;
}
function initFuncLogin() {
  ulEl.innerHTML = /* html */ `
  <li class="header__user-login--li">
    <a href="/login" data-navigo id="btnlogin"> 로그인 </a>
  </li>
  `;
  const btnLogin = $('.login-btn');
  btnLogin.addEventListener('click', async () => {
    try {
      const loginJSON = await login();
      displayUserName(loginJSON.user.displayName);
      localStorage.setItem('token', loginJSON.accessToken);
      router.navigate('/');
    } catch (exception) {
      alert(exception);
    }
  });
}
function displayUserName(displayName) {
  // $('#btnlogin').removeEventListener('click', );
  ulEl.innerHTML = /* html */ `
    <li class="header__user-login--li">
      <a href="/mypage" data-navigo>
        <strong strong id="header__user-login-name">${displayName}</strong>님 환영합니다
      </a>
    </li>
    <li class="header__user-login--li">
      <button id="btnlogout"> 로그아웃 </button>
    </li>
  `;
}

async function login() {
  const res = await fetch(`${base_url}/auth/login`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: JSON.stringify({
      email: $('#inputID').value,
      password: $('#inputPW').value,
    }),
  });
  const json = await res.json();
  return json;
}

async function logout() {
  const res = await fetch(`${base_url}/auth/logout`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const json = await res.json();
  return json;
}

/** navigo router */

router
  .on({
    '/': () => {
      console.log('route to ////////');
      renderInitMainPageHeader();
      // router.navigate('/');
    },
    '/mypage': () => {
      renderInitMainPageHeader();
      console.log('route to mypage!!');
      $('.app').innerHTML = htmlMypage_Nav;
      router.navigate('mypage/orderHistory');
    },
    '/mypage/orderHistory': async () => {
      renderInitMainPageHeader();
      console.log('route to mypage/orderHistory!!');
      renderMyPageNav(htmlMypage_OrderHistory);
      initFuncOrderHistory();
    },
    '/mypage/account': async () => {
      renderInitMainPageHeader();
      // divLoadingEl.style.display = 'block';
      console.log('route to mypage/account!!');
      renderMyPageNav(htmlMypage_Account);
      await initFuncAccount();
      // divLoadingEl.style.display = 'none';
    },
    '/mypage/myHeart': async () => {
      renderInitMainPageHeader();
      console.log('route to mypage/myHeart!!');
      renderMyPageNav(htmlMypage_MyHeart);
      initFuncMyHeart();
    },
    '/mypage/myPersonalInfoModify': () => {
      renderInitMainPageHeader();
      console.log('route to mypage/myPersonalInfoModify!!');
      renderMyPageNav('');
    },
    // login
    '/login': () => {
      console.log('route to /login!!');
      $('.app').innerHTML = htmlLogin;
      initFuncLogin();
    },
    // signup
    '/signup': () => {
      console.log('route to /signup!!');
      $('.app').innerHTML = htmlSignup;
      initFuncSignup();
    },
  })
  .resolve();
