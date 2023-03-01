import { $ } from '../../utils/dom.js';
import { base_url, api_key, user_name } from '../../db.js';
import { renderPage } from '../../utils/render.js';
import { htmlMypage_Nav } from '../mypage.js';
import { getLoginStatus, showAlertPlzLogin } from '../login.js';
import { router } from '../../main.js';
const headers = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};

// HTML : mypage 계좌관리 탭
const handleAccountInitTemplate = () => {
  const htmlMypage_Account = /* html */ `
  <div class="mypage__account">
    <h2>계좌 관리</h2>
    <div class="user__account">
      <p class="total__balance"></p>
      <ul></ul>
      <button class="btn__create__account">계좌추가</button>
    </div>
  </div>
  <div class="create__account">
    <div class="create__account__modal">
      <div class="modal__container">
        <h3>계좌 추가</h3>
        <ul></ul>
        <div class="accountNumber">
          <span>계좌 번호</span>
          <input type="text" id="input__account" class="create__input" />
        </div>
        <div class="phoneNumber">
          <span>전화 번호</span>
          <input type="text" id="input__phone" class="create__input" />
        </div>
        <div class="modal__notice">
          <p>· 계좌번호와 전화번호에는 - 구분이 없어야 합니다.</p>
          <p>
            · 은행 [] 안의 숫자를 모두 더하면 각 은행의 유효한 계좌번호
            길이가 됩니다.
          </p>
        </div>
        <div class="modal__button__create">
          <button id="btnFinalCreate">추가</button>
        </div>
        <button id="btnCloseModal">X</button>
      </div>
    </div>
  </div>
  <div class="delete__account">
    <div class="delete__account__modal">
      <div class="modal__container">
        <h3>계좌 삭제</h3>
        <span>정말로 삭제 하시겠습니까?</span>
        <div>
          <button id="delete-ok">예</button>
          <button id="delete-cancel">아니오</button>
        </div>
      </div>
    </div>
  </div>
  `;

  $('.mypage__navigo__container').innerHTML = htmlMypage_Account;
};

export const handleAccountPage = async () => {
  if (getLoginStatus() === false) {
    showAlertPlzLogin();
    router.navigate('/login');
    return;
  }
  await renderAccountPage();
};

const renderAccountPage = async () => {
  renderPage(htmlMypage_Nav);
  handleAccountInitTemplate();
  await initFuncAccount();
};

async function initFuncAccount() {
  const active = document.querySelector('#mpAccount');
  active.parentElement.classList.add('active');

  const divUserAccount = document.querySelector('.user__account');
  const dicCreateAccount = document.querySelector('.create__account');
  const btnCloseModal = document.querySelector('#btnCloseModal');
  const inputAccountNumberEl =
    dicCreateAccount.querySelector('#input__account');
  const inputPhoneNumberEl = dicCreateAccount.querySelector('#input__phone');
  const btnFinalCreate = document.querySelector('#btnFinalCreate');

  const btnCreateAccount = document.querySelector('.btn__create__account');
  const UserAccounts = await getUserAccounts();
  showUserAccounts(divUserAccount, UserAccounts);

  // Input Tag Custom : 숫자만 입력 가능
  inputAccountNumberEl.addEventListener('keyup', checkInputNumber());
  inputPhoneNumberEl.addEventListener('keyup', checkInputNumber());

  // 계좌 추가 modal Open
  btnCreateAccount.addEventListener('click', async () => {
    const createAbleBankList = Array.from(await getBankList()).filter(
      (x) => x.disabled === false,
    );
    getPossibleBankList(
      dicCreateAccount.querySelector('.modal__container'),
      createAbleBankList,
    );
    dicCreateAccount.style.display = 'block';
  });

  // 계좌 추가 modal Close
  btnCloseModal.addEventListener('click', () => {
    dicCreateAccount.querySelector('ul').innerHTML = '';
    dicCreateAccount.style.display = 'none';
  });

  // 계좌 생성 버튼
  btnFinalCreate.addEventListener('click', () => {
    const bankCode = getUserSelectBank();
    createUserAccount(bankCode);
  });
}

// API : 은행 목록
const getBankList = async () => {
  const res = await fetch(`${base_url}/account/banks`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  });
  const json = await res.json();

  return json;
};

// API : 계좌 조회
const getUserAccounts = async () => {
  const res = await fetch(`${base_url}/account`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  });
  const json = await res.json();

  return json;
};

// API : 계좌 개설
const createUserAccount = async (bankCode) => {
  const res = await fetch(`${base_url}/account`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      bankCode: bankCode,
      accountNumber: document.querySelector('#input__account').value,
      phoneNumber: document.querySelector('#input__phone').value,
      signature: true,
    }),
  });

  if (res.ok) {
    renderAccountPage();
  }
};

// API : 계좌 해지
const deleteAccount = async (e) => {
  const accountId = e.target.dataset.id;
  const res = await fetch(`${base_url}/account`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      accountId: accountId,
      signature: true,
    }),
  });

  if (res.ok) {
    // renderPage(htmlMypage_Account);
    // initFuncAccount();
    renderAccountPage();
  }

  const json = await res.json();
  return json;
};

// Input Tag Custom : 숫자만 입력 가능
function checkInputNumber() {
  return (e) => {
    if (e.key === /[0-9]/) {
    } else {
      e.target.value = e.target.value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1');
    }
  };
}

// 등록 가능한 은행 목록을 가져와 은행 이름과 계좌번호 형식과 Render
const getPossibleBankList = (div, data) => {
  const ulEl = div.querySelector('ul');
  const liEls = data.map((_data) => {
    const liEl = document.createElement('li');
    liEl.innerHTML = /* html */ `
    <input type="radio" name="bank" class="selectBank">
    ${_data.name}, [${_data.digits}]
    `;
    liEl.dataset.code = _data.code;

    return liEl;
  });
  ulEl.append(...liEls);
};

// 계좌 개설 시, 사용자가 선택한 은행Code를 가져옴
const getUserSelectBank = () => {
  const checkBoxs = document.querySelectorAll('.selectBank');
  const bchecked = Array.from(checkBoxs).every((x) => x.checked === false);

  if (bchecked === true) {
    alert('Check');
    return;
  } else {
    const liEl = Array.from(checkBoxs).find(
      (x) => x.checked === true,
    ).parentElement;
    return liEl.dataset.code;
  }
};

// 사용자의 계좌를 전부 보여준다
const showUserAccounts = (div, datas) => {
  const totalBalance = document.createElement('span');
  totalBalance.textContent = `총 계좌 잔액 : ${datas.totalBalance.toLocaleString()}`;
  totalBalance.classList.add('total__balance');
  const UserAccountList = div.querySelector('ul');

  if (datas.accounts.length === 0) {
    const pNotExistAccountEl = document.createElement('p');
    pNotExistAccountEl.textContent = '등록된 계좌가 없습니다';
    Object.assign(pNotExistAccountEl.style, {
      textAlign: 'center',
      padding: '50px',
    });

    UserAccountList.append(pNotExistAccountEl);
    return;
  }
  const accounts = datas.accounts;

  const totalBalanceEl = div.querySelector('p');

  const liEls = accounts.map((data) => {
    const liEl = document.createElement('li');

    const bankName = document.createElement('h4');
    bankName.innerHTML = `${data.bankName}`;

    const accountNumber = document.createElement('p');
    accountNumber.innerHTML = `${data.accountNumber}`;

    const balance = document.createElement('span');
    balance.innerHTML = `${data.balance.toLocaleString()}`;

    const btnDeleteAccount = document.createElement('button');
    btnDeleteAccount.textContent = '삭제';
    btnDeleteAccount.id = 'btnDeleteAccount';
    btnDeleteAccount.dataset.id = data.id;

    btnDeleteAccount.addEventListener('click', async (event) => {
      showDeleteAccountModal(event);
    });

    liEl.append(bankName, accountNumber, balance, btnDeleteAccount);

    return liEl;
  });
  UserAccountList.append(...liEls);
  totalBalanceEl.append(totalBalance);
};

// 계좌 삭제 Click시 modal Open
const showDeleteAccountModal = (event) => {
  const divDeleteAccount = document.querySelector('.delete__account');
  divDeleteAccount.style.display = 'block';

  document.querySelector('#delete-ok').addEventListener('click', async () => {
    const result = await deleteAccount(event);
    if (result === false) {
      alert('삭제 오류');
    }
  });

  document.querySelector('#delete-cancel').addEventListener('click', () => {
    divDeleteAccount.style.display = 'none';
  });
};
