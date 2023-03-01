import { $ } from '../../utils/dom.js';
import { base_url, api_key, user_name } from '../../db.js';
import { router } from '../../main.js';
import { renderPage } from '../../utils/render.js';
import { getLoginStatus, showAlertPlzLogin, authorization } from '../login.js';
import { htmlMypage_Nav, resetNavbarActive } from '../mypage.js';
import { modalEditPersonalInfo } from '../modal/modalTemplates';
const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};
/** 개인정보 수정 페이지 html 템플릿 */
const handleEditPersonalInfoPrecheckTemplate = () => {
  const htmlMypage_editPersonalInfo_precheck = /* html */ `
  <h2>개인 정보 수정</h2>
  <div class="mypage__editPersonalInfo">
    <div class="mypage__editPersonalInfo__notice">
      <h4>비밀번호 재확인</h4>
      <p>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해주세요</p>
    </div>
    <div class="mypage__editPersonalInfo__inputPassWord">
      <input type="password" id="inputPW" />
      <button id="btnSubmit">확인</button>
    </div>
  </div>
  `;
  $('.mypage__navigo__container').innerHTML =
    htmlMypage_editPersonalInfo_precheck;
};
const handleEditPersonalInfoTemplate = (email, displayName) => {
  const htmlMypage_editPersonalInfo_edit = /* html */ `
    <h2>개인 정보 수정</h2>
    <div class="edit_PersonalInfo">
      <div class="edit_PersonalInfo_grid">
        <label>아이디</label>
        <p id="user-id">${email}</p>
        <label>기존 비밀번호</label>
        <input type="password" id="user-oldpw" placeholder="기존 비밀번호"/>
        <label>새 비밀번호</label>
        <input type="password" id="user-newpw" placeholder="새로운 비밀번호"/>
        <label>새 비밀번호 확인</label>
        <input type="password" id="user-newpwConfirm" placeholder="새로운 비밀번호 확인"/>
        <label>닉네임 변경</label>
        <input id="user-name" value="${displayName}"/>
      </div>
      <div class="buttonBox">
        <button id="btnEditComplete">정보 수정</button>
        <button id="btnEditCancel">취소</button>
      </div>
    </div>
  `;
  $('.mypage__navigo__container').innerHTML = htmlMypage_editPersonalInfo_edit;
};

/** 처음 진입점 */
export const handleEditPersonalInfoPage = () => {
  if (getLoginStatus() === false) {
    showAlertPlzLogin();
    router.navigate('/login');
    return;
  }
  renderEditPersonalInfoPage();
  //mypage navbar
  resetNavbarActive();
  setNavbarActive();
};
/** 페이지 렌더 및 기능 부여 */
const renderEditPersonalInfoPage = () => {
  renderPage(htmlMypage_Nav);
  handleEditPersonalInfoPrecheckTemplate();
  checkPersonalPassword();
};

/** 기능 부여 */
// 비밀번호 재확인 페이지 함수
function checkPersonalPassword() {
  $('#btnSubmit').addEventListener('click', async () => {
    const auth = await authorization();
    console.log(auth);
    const res = await personalInfoLogin(auth);
    console.log(res.accessToken);
    res.accessToken ? page(auth) : alert('비밀번호가 잘못되었습니다');
  });
  $('#inputPW').addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      $('#btnSubmit').click();
    }
  });
}
const page = function (auth) {
  handleEditPersonalInfoTemplate(auth.email, auth.displayName);
  //사용자 정보 수정 submit
  $('#btnEditComplete').addEventListener('click', async () => {
    if (
      !$('#user-newpwConfirm').value ||
      !$('#user-oldpw').value ||
      !$('#user-newpw').value ||
      !$('#user-name').value
    ) {
      alert('내용을 전부 기입해주세요');
      return;
    } else if ($('#user-newpw').value !== $('#user-newpwConfirm').value) {
      alert('새로운 비밀번호가 일치하지 않습니다');
      return;
    }
    const res = await submitChangeInfo();
    console.log(res.email);
    if (res.email) {
      //개인정보 수정 완료 모달
      $('.modal-container').innerHTML = modalEditPersonalInfo;
      $('.modal_confirm-btn').addEventListener('click', async () => {
        $('.modal-container').innerHTML = '';
        await router.navigate('/');
      });
    } else {
      alert(res);
    }
  });
  $('#btnEditCancel').addEventListener('click', () => {
    window.location.reload();
  });
};
const setNavbarActive = () => {
  const active = document.querySelector('#mpEditPersonalInfo');
  active.parentElement.classList.add('active');
};

// 비밀번호 재확인(login api 사용)
async function personalInfoLogin(auth) {
  const res = await fetch(`${base_url}/auth/login`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      email: auth.email,
      password: $('#inputPW').value,
    }),
  });
  const json = await res.json();
  return json;
}

//사용자 정보 수정 api 사용
async function submitChangeInfo() {
  console.log(`$('#user-name').value`);
  const res = await fetch(`${base_url}/auth/user`, {
    method: 'PUT',
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      displayName: $('#user-name').value,
      oldPassword: $('#user-oldpw').value,
      newPassword: $('#user-newpw').value,
    }),
  });
  const json = await res.json();
  return json;
}
