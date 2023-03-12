import {
  AddProduct,
  Authorization,
  Bank,
  BuyItemAPI,
  CancelConfirmTransactionAPI,
  ConfirmOrder,
  DeleteAccount,
  EditProductParams,
  GetAllProductsInterface,
  GetAllTransactionsInterface,
  GetBankListValue,
  GetUserAccounts,
  GetUserInfoAPI,
  GetUserInfos,
  HeadersOptions,
  PersonalInfoLogin,
  TransactionDetailInterface,
  RegisterRes,
} from './types/index';
// api 파일입니다.

// dotenv 사용 예시
import dotenv from 'dotenv';
import { base_url, api_key, user_name } from './db';
import { $ } from './utils/dom';
dotenv.config();

export const HEADERS = {
  'content-type': 'application/json',
  apikey: api_key,
  username: user_name,
};

/** API headers 함수 */
const createHeaders = ({
  isMasterKey = false,
  token,
}: HeadersOptions = {}): HeadersInit => {
  const headers: HeadersInit = {
    'content-type': 'application/json',
    apikey: api_key,
    username: user_name,
  };

  if (isMasterKey) {
    headers.masterKey = 'true';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const headers = createHeaders();
export const masterKeyHeaders = createHeaders({ isMasterKey: true });
export let tokenHeaders = createHeaders({
  token: localStorage.getItem('marketLogToken') ?? undefined,
});

/** 전체 제품 가져오기api */
export const getAllProducts = async (): Promise<GetAllProductsInterface[]> => {
  try {
    const res = await fetch(`${base_url}/products`, {
      headers: createHeaders({ isMasterKey: true }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('제품 가져오기 실패');
  }
};

/** 검색한 제품, 태그 가져오기 */
export const getSearchedProducts = async (
  title: string,
): Promise<GetAllProductsInterface[]> => {
  try {
    const res = await fetch(`${base_url}/products/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        searchText: title,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    console.log('제품 검색을 실패했습니다.');
  }
};

/** 상세 제품 db에서 불러오기 */
export const getDetailProduct = async (
  productId: string,
): Promise<GetAllProductsInterface> => {
  try {
    const res = await fetch(`${base_url}/products/${productId}`, {
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    console.log('err: ', '해당 제품을 불러오기 실패');
  }
};

/** 구매내역 확인 API */
export const getAllTransactions = async (): Promise<
  GetAllTransactionsInterface[]
> => {
  try {
    const res = await fetch(`${base_url}/products/transactions/details`, {
      headers: tokenHeaders,
    });
    const data = await res.json();

    if (res.status === 400) {
      return [];
    } else {
      return data;
    }
  } catch (err) {
    console.log('거래내역 가져오기 실패', err);
  }
};

/** 구매 확정 API */
export const confirmTransactionAPI = async (
  detailId: string,
): Promise<CancelConfirmTransactionAPI> => {
  try {
    const res = await fetch(`${base_url}/products/ok`, {
      method: 'POST',
      headers: tokenHeaders,
      body: JSON.stringify({
        detailId,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('구매 확정 실패', err);
  }
};

/** 구매 취소 API */
export const cancelTransactionAPI = async (
  detailId: string,
): Promise<CancelConfirmTransactionAPI> => {
  try {
    const res = await fetch(`${base_url}/products/cancel`, {
      method: 'POST',
      headers: tokenHeaders,
      body: JSON.stringify({
        detailId,
      }),
    });
    const data = await res.json();
    return data;
    // return data;
  } catch (err) {
    console.log('구매 취소 실패', err);
  }
};

/** 주문 상세정보 조회 API */
export const getDetailOrderProduct = async (detailId: string) => {
  try {
    const res = await fetch(`${base_url}/products/transactions/detail`, {
      method: 'POST',
      headers: tokenHeaders,
      body: JSON.stringify({
        detailId,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('상세 거래내역 가져오기 실패', err);
  }
};

/** 계좌 목록 및 잔액 조회 db에서 불러오기 */
export const getAccountDetail = async (): Promise<Bank[]> => {
  try {
    const res = await fetch(`${base_url}/account`, {
      headers: tokenHeaders,
    });
    const data = await res.json();
    const { accounts } = data;

    return accounts;
  } catch (err) {
    console.log('계좌목록 조회 실패', err);
  }
};

/** 제품 결제 API */
export const buyItemAPI = async (
  productId: string,
  accountId: string,
): Promise<BuyItemAPI> => {
  try {
    const res = await fetch(`${base_url}/products/buy`, {
      method: 'POST',
      headers: tokenHeaders,
      body: JSON.stringify({
        productId,
        accountId,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('결제 실패', err);
  }
};

/** [결제 페이지] 로그인 한 정보 가져오기 */
export const getUserInfoAPI = async (): Promise<GetUserInfoAPI> => {
  try {
    const res = await fetch(`${base_url}/auth/me`, {
      method: 'POST',
      headers: tokenHeaders,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('사용자 정보 가져오기 실패', err);
  }
};

// [관리자 페이지]
/** 단일 상품 가져오기 API */
export const addProduct = async (product: AddProduct): Promise<void> => {
  const { title, price, description, tags, thumbnailBase64 } = product;

  try {
    await fetch(`${base_url}/products`, {
      method: 'POST',
      headers: masterKeyHeaders,
      body: JSON.stringify({
        title,
        price,
        description,
        tags,
        thumbnailBase64,
      }),
    });
  } catch (err) {
    console.log('선택 상품 조희 실패', err);
  }
};

/** 단일 상품 삭제 API */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await fetch(`${base_url}/products/${id}`, {
      method: 'DELETE',
      headers: masterKeyHeaders,
    });
  } catch (err) {
    console.log('선택 상품 삭제 실패', err);
  }
};

/** 단일 상품 수정 API */
export const editProduct = async (
  product: EditProductParams,
): Promise<void> => {
  const { title, price, description, tags, isSoldOut, thumbnailBase64 } =
    product;

  try {
    await fetch(`${base_url}/products/${product.id}`, {
      method: 'PUT',
      headers: masterKeyHeaders,
      body: JSON.stringify({
        title,
        price,
        description,
        tags,
        isSoldOut,
        thumbnailBase64,
      }),
    });
  } catch (err) {
    console.log('선택 상품 수정 실패', err);
  }
};

/**전체 거래 내역 가져오기 API */
export const getAllOrder = async (): Promise<TransactionDetailInterface[]> => {
  try {
    const res = await fetch(`${base_url}/products/transactions/all`, {
      method: 'GET',
      headers: masterKeyHeaders,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('전체 거래 내역 불러오기 실패', err);
  }
};

/** 거래 내역 완료 및 완료 해제 API */
export const editDoneOrder = async (order: ConfirmOrder): Promise<void> => {
  const { detailId, done } = order;

  try {
    const res = await fetch(`${base_url}/products/transactions/${detailId}`, {
      method: 'PUT',
      headers: masterKeyHeaders,
      body: JSON.stringify({
        done: !done,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('거래 내역 완료/완료해제 실패', err);
  }
};

/** 거래 내역 취소 및 취소 해제 API */

export const editCancelOrder = async (order: ConfirmOrder): Promise<void> => {
  const { detailId, isCanceled } = order;

  try {
    await fetch(`${base_url}/products/transactions/${detailId}`, {
      method: 'PUT',
      headers: masterKeyHeaders,
      body: JSON.stringify({
        isCanceled: !isCanceled,
      }),
    });
  } catch (err) {
    console.log('err: ', '거래 내역 취소/취소해제 실패', err);
  }
};

/** API : 은행 목록 */
export const getBankList = async (): Promise<GetBankListValue> => {
  const res = await fetch(`${base_url}/account/banks`, {
    method: 'GET',
    headers: tokenHeaders,
  });
  const json = await res.json();

  return json;
};

/** API : 계좌 조회 */
export const getUserAccounts = async (): Promise<GetUserAccounts> => {
  const res = await fetch(`${base_url}/account`, {
    method: 'GET',
    headers: tokenHeaders,
  });
  const json = await res.json();

  return json;
};

/** API : 계좌 개설 */
export const createUserAccount = async (bankCode: string): Promise<boolean> => {
  const res = await fetch(`${base_url}/account`, {
    method: 'POST',
    headers: tokenHeaders,
    body: JSON.stringify({
      bankCode: bankCode,
      accountNumber: $<HTMLInputElement>('#input__account').value,
      phoneNumber: $<HTMLInputElement>('#input__phone').value,
      signature: true,
    }),
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
  return false;
};

// API : 계좌 해지
export const deleteAccount = async (e: any): Promise<DeleteAccount> => {
  const accountId = e.target.dataset.id;
  const res = await fetch(`${base_url}/account`, {
    method: 'DELETE',
    headers: tokenHeaders,
    body: JSON.stringify({
      accountId: accountId,
      signature: true,
    }),
  });

  const json = await res.json();
  return json;
};

/** API : Login */
export async function login(): Promise<PersonalInfoLogin> {
  const res = await fetch(`${base_url}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: $<HTMLInputElement>('#inputID').value,
      password: $<HTMLInputElement>('#inputPW').value,
    }),
  });
  const json = await res.json();

  if (res.ok) {
    tokenHeaders = createHeaders({
      token: json.accessToken ?? undefined,
    });
  }
  return json;
}

/** API : Logout */
export async function logout(): Promise<boolean> {
  const res = await fetch(`${base_url}/auth/logout`, {
    method: 'POST',
    headers: tokenHeaders,
  });
  const json = await res.json();
  return json;
}

/** API : 인증확인 */
export async function authorization(): Promise<Authorization> {
  // 처음 로그인할 때 undefined 오류 발생으로 추가
  tokenHeaders = createHeaders({
    token: localStorage.getItem('marketLogToken'),
  });
  const res = await fetch(`${base_url}/auth/me`, {
    method: 'POST',
    headers: tokenHeaders,
    // headers: {
    //   ...HEADERS,
    //   Authorization: `Bearer ${localStorage.getItem('marketLogToken')}`,
    // },
  });

  if (res.ok) {
    const json = await res.json();
    return json;
  }
  return undefined;
}

//사용자 정보 수정 api 사용
export async function submitChangeInfo() {
  const res = await fetch(`${base_url}/auth/user`, {
    method: 'PUT',
    headers: tokenHeaders,
    body: JSON.stringify({
      displayName: $<HTMLInputElement>('#user-name').value,
      oldPassword: $<HTMLInputElement>('#user-oldpw').value,
      newPassword: $<HTMLInputElement>('#user-newpw').value,
    }),
  });
  const json = await res.json();
  return json;
}
// 비밀번호 재확인(login api 사용)
export async function personalInfoLogin(auth: any): Promise<PersonalInfoLogin> {
  const res = await fetch(`${base_url}/auth/login`, {
    method: 'POST',
    headers: tokenHeaders,
    body: JSON.stringify({
      email: auth.email,
      password: $<HTMLInputElement>('#inputPW').value,
    }),
  });
  const json = await res.json();

  return json;
}
/** API : 회원가입 */
export async function signup(): Promise<RegisterRes> {
  const res = await fetch(`${base_url}/auth/signup`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      email: $<HTMLInputElement>('#inputID').value,
      password: $<HTMLInputElement>('#inputPW').value,
      displayName: $<HTMLInputElement>('#inputName').value,
    }),
  });
  const json = await res.json();
  return json;
}

/** API : 사용자 목록 조회 */
export async function getUserList(): Promise<GetUserInfos> {
  const res = await fetch(`${base_url}/auth/users`, {
    method: 'GET',
    headers: masterKeyHeaders,
  });
  const json = await res.json();
  return json;
}
