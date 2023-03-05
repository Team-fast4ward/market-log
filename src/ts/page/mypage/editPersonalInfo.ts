import { $ } from '../../utils/dom';
import { router } from '../../main';
import { renderPage } from '../../utils/render';
import { getLoginStatus, showAlertPlzLogin } from '../login';
import { htmlMypage_Nav, resetNavbarActive } from '../mypage';
import { authorization, personalInfoLogin, submitChangeInfo } from '../../api';
import { Authorization } from '../../interface/index';
/** 개인정보 수정 페이지 html 템플릿 */
const handleEditPersonalInfoPrecheckTemplate = () => {
  const htmlMypage_editPersonalInfo_precheck = /* html */ `
  <h2>개인 정보 수정</h2>
  <div class="mypage__editPersonalInfo">
    <div class="mypage__editPersonalInfo__notice">
      <h4>비밀번호 재확인</h4>
      <p>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해주세요.</p>
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
const handleEditPersonalInfoTemplate = (email: string, displayName: string) => {
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

// 비밀번호 재확인 페이지 함수
function checkPersonalPassword() {
  $<HTMLButtonElement>('#btnSubmit').addEventListener('click', async () => {
    const auth = await authorization();
    const res = await personalInfoLogin(auth);
    res.accessToken ? page(auth) : alert('비밀번호가 잘못되었습니다');
  });
  $<HTMLInputElement>('#inputPW').addEventListener(
    'keydown',
    async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        $<HTMLButtonElement>('#btnSubmit').click();
      }
    },
  );
}
const page = function (auth: Authorization) {
  handleEditPersonalInfoTemplate(auth.email, auth.displayName);
  //사용자 정보 수정 submit
  $<HTMLButtonElement>('#btnEditComplete').addEventListener(
    'click',
    async () => {
      if (
        !$<HTMLInputElement>('#user-newpwConfirm').value ||
        !$<HTMLInputElement>('#user-oldpw').value ||
        !$<HTMLInputElement>('#user-newpw').value ||
        !$<HTMLInputElement>('#user-name').value
      ) {
        alert('내용을 전부 기입해주세요');
        return;
      } else if (
        $<HTMLInputElement>('#user-newpw').value !==
        $<HTMLInputElement>('#user-newpwConfirm').value
      ) {
        alert('새로운 비밀번호가 일치하지 않습니다');
        return;
      }
      const res = await submitChangeInfo();
      if (res.email) {
        alert('수정이 완료되었습니다');
        await router.navigate('/');
      } else {
        alert(res);
      }
    },
  );
  $<HTMLButtonElement>('#btnEditCancel').addEventListener('click', () => {
    window.location.reload();
  });
};
const setNavbarActive = () => {
  const active = document.querySelector('#mpEditPersonalInfo');
  active.parentElement.classList.add('active');
};
