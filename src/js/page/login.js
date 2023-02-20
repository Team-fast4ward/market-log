import { base_url, api_key, user_name, admin_email } from '../db.js';
import Navigo from 'navigo';
const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};
const $ = (selector) => document.querySelector(selector);
const userHeaderUL = $('.header__user-login--ul');
// const router = new Navigo('/');

export const htmlLogin = /* html */ `
  <div class="login__container">
    <h1 class="title">로그인</h1>
    <ul>
      <li>
        <input id="inputID" type="text" placeholder="아이디" />
      </li>
      <li>
        <input id="inputPW" type="password" placeholder="비밀번호" />
      </li>
    </ul>
    <div class="buttons">
      <button class="login-btn">로그인</button>
      <button class="signup-btn">
        <a href="/signup" data-navigo>회원가입</a>
      </button>
    </div>
  </div>
`;

export function initFuncLogin() {
  userHeaderUL.innerHTML = /* html */ `
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
      // router.navigate('/');
    } catch (exception) {
      alert(exception);
    }
  });
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

function displayUserName(displayName) {
  userHeaderUL.innerHTML = /* html */ `
    <li class="header__user-login--li">
      <a href="/mypage" data-navigo>
        <strong strong id="header__user-login-name">${displayName}</strong>님 환영합니다
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
      userHeaderUL.innerHTML = /* html */ `
      <li class="header__user-login--li">
        <a href="/login" data-navigo id="btnlogin"> 로그인 </a>
      </li>
    `;
      // router.navigate('/');
    }
  });
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
  console.log(json);
  return json;
}
