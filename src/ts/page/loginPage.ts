import { $ } from '../utils/dom';
import { admin_email } from '../db';
import { router } from '../main';
import { renderPage } from '../utils/render';
import { outlink } from '../importIMGFiles';
import { login, logout, authorization } from '../api';
import { PersonalInfoLogin } from '../types/index';

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

/** 로그인 후, displayName Render */
function displayUserName(personalInfo: PersonalInfoLogin) {
  ulLoginHeaderEl.innerHTML = htmlHeaderLogout;
  $('#header__user-login-name').innerText = personalInfo.user.displayName;
  if (personalInfo.user.email === admin_email) {
    $('#btnMypage').innerHTML = `
      <strong id="header__user-login-name">관리자 페이지로 이동</strong>
      `;
  }
}

/** 로그인,아웃 후, header의 로그인,아웃 영역을 Render */
export async function renderInitHeaderLogin() {
  $('.app').innerHTML = '';
  if (!localStorage.getItem('marketLogToken')) {
    ulLoginHeaderEl.innerHTML = htmlHeaderLogin;
  } else {
    const author = await authorization();
    ulLoginHeaderEl.innerHTML = htmlHeaderLogout;

    $('#header__user-login-name').innerText = author.displayName;
    if (author.email === admin_email) {
      $<HTMLAnchorElement>('#btnMypage').href = '/admin';
      $<HTMLAnchorElement>('#btnMypage').innerHTML = `
        <strong id="header__user-login-name">관리자 페이지로 이동
          <img src="${outlink}" alt="OutLink"/>
        </strong>
        `;
    }
    $<HTMLButtonElement>('#btnlogout').addEventListener('click', async () => {
      const logoutJSON = await logout();
      if (logoutJSON === true) {
        localStorage.removeItem('marketLogToken');
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
  const btnLogin = $<HTMLButtonElement>('.login-btn');
  btnLogin.addEventListener('click', async () => {
    let errMessage;
    // try {
    const loginJSON = await login();
    errMessage = loginJSON;
    displayUserName(loginJSON);
    localStorage.setItem('marketLogToken', loginJSON.accessToken);
    router.navigate('/');
    // } catch (exception) {
    //   alert(errMessage);
    // }
  });

  const inputPW = $('#inputPW');
  inputPW.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      btnLogin.click();
    }
  });
}
export function getLoginStatus() {
  return localStorage.getItem('marketLogToken') ? true : false;
}
export function showAlertPlzLogin() {
  alert('로그인이 필요한 서비스입니다');
  router.navigate('/login');
}
