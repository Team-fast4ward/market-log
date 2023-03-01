import { $ } from '../utils/dom.js';
import { htmlHeaderLogin } from './login.js';
import { base_url, api_key, user_name } from '../db.js';
import { router } from '../main.js';
import { renderPage } from '../utils/render.js';
const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};
const RegexID =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const RegexPW = /^(?=.*[a-zA-Z\d])[a-zA-Z\d]{8,}$/;
const ulLoginHeaderEl = $('.header__user-login--ul');
let bSignup = false;
export const htmlSignup = /* html */ `
  <div class="signup__container">
    <h1 class="title">회원가입</h1>
    <div class="signup__container__input">
      <ul>
        <li>
          <div class="inputBox">
            <input id="inputID" autocomplete="off" type="text" placeholder="아이디 (이메일 형식)" />
            <button>중복 확인</button>
          </div>
          <p id="noticeID"></p>
        </li>
        <li>
          <input id="inputPW" autocomplete="off" type="password" placeholder="비밀번호 (영문 대/소문자, 숫자의 2가지 조합, 8~20자)" />
          <input id="inputConfirmPW" autocomplete="off" type="password" placeholder="비밀번호확인" />
          <p id="noticePW"></p>
        </li>
        <li>
          <input id="inputName" autocomplete="off" type="text" placeholder="사용자 이름" />
          <p id="noticeName"></p>
        </li>
      </ul>
    </div>
    <div class="signup__container__checkbox">
      <div class="box">
        <input type="checkbox" id="chk_essentialFirst" />
        <span><span>(필수)</span> 이용약관</span>
        <a href="javascript:void(0);">보기</a>
      </div>
      <div class="box">
        <input type="checkbox" id="chk_essentialSecond" />
        <span><span>(필수)</span> 개인정보 수집 및 이용</span>
        <a href="javascript:void(0);">보기</a>
      </div>
      <div class="box">
        <input type="checkbox" class="chk_choice" />
        <span><span>(선택)</span> 전체 약관 및 마케팅 수신에 동의합니다.</span>
      </div>
      <button type="button" class="submit-btn">가입하기</button>
    </div>
  </div>
`;

/** API : 회원가입 */
async function signup() {
  const res = await fetch(`${base_url}/auth/signup`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      email: $('#inputID').value,
      password: $('#inputPW').value,
      displayName: $('#inputName').value,
    }),
  });
  const json = await res.json();
  return json;
}

/** API : 사용자 목록 조회 */
async function getUserList() {
  const res = await fetch(`${base_url}/auth/users`, {
    method: 'GET',
    headers: {
      ...headers,
      masterkey: true,
    },
  });
  const json = await res.json();
  return json;
}

export const handleSignupPage = () => {
  renderPage(htmlSignup);
  initFuncSignup();
};

export function initFuncSignup() {
  ulLoginHeaderEl.innerHTML = htmlHeaderLogin;
  const btnSubmit = $('.submit-btn');
  const btnCheckDuplication = $('.signup__container__input button');

  /** 가입하기 button 클릭 */
  btnSubmit.addEventListener('click', async () => {
    if (checkValidation() === true) {
      const res = await signup();
      if (res.accessToken != null) {
        localStorage.setItem('token', res.accessToken);
      }
      router.navigate('/');
    }
  });

  /** 중복확인 button 클릭 */
  btnCheckDuplication.addEventListener('click', async (e) => {
    const userIDList = (await getUserList()).map((user) => user.email);
    console.log(userIDList);
    const ID = $('#inputID').value;
    const noticeID = $('#noticeID');

    if (!RegexID.test(ID)) {
      alert('아이디가 양식에 맞지 않습니다');
    } else if (userIDList.includes($('#inputID').value) === true) {
      bSignup = false;
      alert('동일한 ID가 이미 사용중입니다!');
    } else {
      bSignup = true;
      e.target.innerText = '확인 완료';
      e.target.style.backgroundColor = '#333';
      e.target.style.color = '#eee';
      noticeID.innerText = '아이디 사용 가능!';
      noticeID.style.color = 'blue';
      noticeID.style.display = 'block';
    }
  });

  addValidationEvent();
}

/** 정보를 입력할 때마다 유효성 검사 Event */
function addValidationEvent() {
  const btnCheckDuplication = $('.signup__container__input button');
  const inputID = $('#inputID');
  const inputPW = $('#inputPW');
  const inputConfirmPW = $('#inputConfirmPW');
  const inputName = $('#inputName');
  const noticeID = $('#noticeID');
  const noticePW = $('#noticePW');
  const noticeName = $('#noticeName');

  inputID.addEventListener('input', (e) => {
    btnCheckDuplication.innerText = '중복 확인';
    btnCheckDuplication.style.backgroundColor = '#fff';
    btnCheckDuplication.style.color = '#000';
    bSignup = false;

    if (!RegexID.test(inputID.value)) {
      noticeID.style.display = 'block';
      noticeID.style.color = 'red';
      noticeID.innerText = '이메일 양식에 맞춰주세요';
    } else {
      noticeID.style.display = 'none';
    }
  });

  inputPW.addEventListener('input', () => {
    if (!RegexPW.test(inputPW.value)) {
      noticePW.innerText = '비밀번호 양식에 맞춰주세요';
      noticePW.style.color = 'red';
      noticePW.style.display = 'block';
    } else {
      noticePW.style.display = 'none';
    }
  });

  inputConfirmPW.addEventListener('input', () => {
    if (inputPW.value === inputConfirmPW.value) {
      noticePW.style.color = 'blue';
      noticePW.innerText = '비밀번호가 일치합니다!';
    } else {
      noticePW.style.color = 'red';
      noticePW.innerText = '비밀번호가 일치하지 않습니다';
    }
    noticePW.style.display = 'block';
  });

  inputName.addEventListener('input', () => {
    if (inputName.value.length < 3) {
      noticeName.innerText = '3글자 이상 작성해주세요!';
      noticeName.style.display = 'block';
    } else {
      noticeName.style.display = 'none';
    }
  });
}

/** 가입하기 버튼을 눌렀을 때, 유효성 검사 */
function checkValidation() {
  const ID = $('#inputID').value;
  const PW = $('#inputPW').value;
  const confirmPW = $('#inputConfirmPW').value;
  const Name = $('#inputName').value;
  const chkEssentialFirst = $('#chk_essentialFirst');
  const chkEssentialSecond = $('#chk_essentialSecond');

  if (!RegexID.test(ID)) {
    alert('아이디가 양식에 맞지 않습니다');
    return false;
  } else if (!bSignup) {
    alert('아이디 중복확인을 해주세요');
    return false;
  } else if (!chkEssentialFirst.checked || !chkEssentialSecond.checked) {
    alert('필수 약관을 체크해주세요');
    return false;
  } else if (!RegexPW.test(PW)) {
    alert('비밀번호가 양식에 맞지 않습니다\n영어,숫자 조합의 8~20자리');
    return false;
  } else if (!(PW === confirmPW)) {
    alert('비밀번호와 비밀번호 확인란이 일치하지 않습니다');
    return false;
  } else if (Name.length < 3) {
    alert('사용자 이름은 3글자 이상 입력해주세요');
    return false;
  }
  return true;
}
