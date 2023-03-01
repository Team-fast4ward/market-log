import { $ } from '../utils/dom.js';
import { base_url, api_key, user_name, admin_email } from '../db.js';
import { router } from '../main.js';
import { renderPage } from '../utils/render.js';
const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};
const ulLoginHeaderEl = $('.header__user-login--ul');

/** HTML : 로그인 페이지 템플릿 */
const htmlLogin = /* html */ `
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
/** HTML : header login 템플릿 */
export const htmlHeaderLogin = /* html */ `
  <li class="header__user-login--li">
    <a href="/login" data-navigo id="btnlogin"> 로그인 </a>
  </li>
  `;
/** HTML : header logout 템플릿 */
const htmlHeaderLogout = /* html */ `
  <li class="header__user-login--li">
    <a href="/mypage" data-navigo id="btnMypage">
      <strong id="header__user-login-name"></strong>님 환영합니다
    </a>
  </li>
  <li class="header__user-login--li">
  <button id="btnlogout"> 로그아웃 </button>
  </li>
  `;

/** API : Login */
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

/** API : Logout */
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

/** API : 인증확인 */
export async function authorization() {
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

/** 로그인 후, displayName Render */
function displayUserName(user) {
  ulLoginHeaderEl.innerHTML = htmlHeaderLogout;
  $('#header__user-login-name').innerText = user.displayName;
  if (user.email === admin_email) {
    $('#btnMypage').innerHTML = `
      <strong id="header__user-login-name">관리자 페이지로 이동</strong>
      `;
  }
}

/** 로그인,아웃 후, header의 로그인,아웃 영역을 Render */
export async function renderInitHeaderLogin() {
  $('.app').innerHTML = '';
  const author = await authorization();

  if (!localStorage.getItem('token')) {
    ulLoginHeaderEl.innerHTML = htmlHeaderLogin;
  } else {
    ulLoginHeaderEl.innerHTML = htmlHeaderLogout;
    $('#header__user-login-name').innerText = author.displayName;

    if (author.email === admin_email) {
      $('#btnMypage').href = '/admin';
      $('#btnMypage').innerHTML = `
        <strong id="header__user-login-name">관리자 페이지로 이동</strong>
        `;
    }
    $('#btnlogout').addEventListener('click', async () => {
      const logoutJSON = await logout();
      if (logoutJSON === true) {
        localStorage.removeItem('token');
        ulLoginHeaderEl.innerHTML = htmlHeaderLogin;
        router.navigate('/');
      }
    });
  }
}
export const handleLoginPage = () => {
  renderPage(htmlLogin);
  initFuncLogin();
};

/** 초기화면 Render시 Inititalize */
function initFuncLogin() {
  const btnLogin = $('.login-btn');
  btnLogin.addEventListener('click', async () => {
    let errMessage;
    try {
      const loginJSON = await login();
      console.log(loginJSON);
      errMessage = loginJSON;
      displayUserName(loginJSON.user);
      localStorage.setItem('token', loginJSON.accessToken);
      router.navigate('/');
    } catch (exception) {
      alert(errMessage);
    }
  });

  const inputPW = $('#inputPW');
  inputPW.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      btnLogin.click();
    }
  });
}

export function getLoginStatus() {
  return localStorage.getItem('token') ? true : false;
}
export function showAlertPlzLogin() {
  alert('로그인이 필요한 서비스입니다');
  router.navigate('/login');
}
