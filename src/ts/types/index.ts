// export type MasterKeyHeaders = Record<string, string> & { masterKey: string };

export type HeadersOptions = {
  isMasterKey?: boolean;
  token?: string;
};

/** 전체 제품 가져오기api */
/** 검색한 제품, 태그 가져오기 */
export interface GetAllProductsInterface {
  // 제품 정보
  id: string; // 제품 ID
  title: string; // 제품 이름
  price: number; // 제품 가격
  description?: string; // 제품 설명(최대 100자)
  tags: string[]; // 제품 태그
  thumbnail?: string | null; // 제품 썸네일 이미지(URL)
  isSoldOut?: boolean; // 제품 매진 여부
  reservations?: Reservation[]; // 제품의 모든 예약 정보 목록
  discountRate?: number; // 제품 할인율
}

interface Reservation {
  start: string; // 예약 시작 시간
  end: string; // 예약 종료 시간
  isCanceled: boolean; // 예약 취소 여부
  isExpired: boolean; // 예약 만료 여부
}

/** 제품 전체 거래(구매) 내역 */
// export type GetAllTransactionsValue = GetAllTransactionsInterface[]; // 모든 거래 내역의 목록

export interface GetAllTransactionsInterface {
  // 거래 내역 정보
  detailId: string; // 거래 내역 ID
  product: {
    // 거래한 제품 정보
    productId: string;
    title: string;
    price: number;
    description: string;
    tags: string[];
    thumbnail: string | null;
    discountRate: number; // 제품 할인율
  };
  reservation: Reservation | null; // 거래한 제품의 예약 정보
  timePaid: string; // 제품을 거래한 시간
  isCanceled: boolean; // 거래 취소 여부
  done: boolean; // 거래 완료 여부
}

/** 제품 거래(구매) 확정/취소 */
export interface CancelConfirmTransactionAPI {
  detailId: string; // 취소할 제품의 거래 내역 ID
}

/** 계좌연결 */
export interface GetAccountDetail {
  // [x: string]: number;
  totalBalance?: number; // 사용자 계좌 잔액 총합
  accounts: Bank[]; // 사용자 계좌 정보 목록
}

export interface Bank {
  // 사용자 계좌 정보
  id: string; // 계좌 ID
  bankName: string; // 은행 이름
  bankCode: string; // 은행 코드
  accountNumber: string; // 계좌 번호
  balance: number; // 계좌 잔액
}

/** 제품 결제 API */
export interface BuyItemAPI {
  productId: string; // 거래할 제품 ID (필수!)
  accountId: string; // 결제할 사용자 계좌 ID (필수!)
  reservation?: {
    // 예약 정보(예약 시스템을 사용하는 경우만 필요)
    start: string; // 예약 시작 시간(ISO)
    end: string; // 예약 종료 시간(ISO)
  };
}

/** 유저 정보 가져오기 */
export interface GetUserInfoAPI {
  email: string; // 사용자 아이디
  displayName: string; // 사용자 표시 이름
  profileImg: string | null; // 사용자 프로필 이미지(URL)
}

/** 제품 추가 */
//  https://asia-northeast3-heropy-api.cloudfunctions.net/api/products
export interface AddProduct {
  title: string; // 제품 이름 (필수!)
  price: number; // 제품 가격 (필수!)
  description: string; // 제품 상세 설명 (필수!)
  tags?: string[]; // 제품 태그
  thumbnailBase64?: string; // 제품 썸네일(대표) 사진(base64) - jpg, jpeg, webp, png, gif, svg
  photoBase64?: string; // 제품 상세 사진(base64) - jpg, jpeg, webp, png, gif, svg
  discountRate?: number; // 제품 할인율
}

export interface EditProductParams extends AddProduct {
  id: string;
  isSoldOut: boolean;
  thumbnailBase64: string;
}

// 전체 거래(판매) 내역
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/all

export interface TransactionDetailInterface {
  // 거래 내역 정보
  detailId: string; // 거래 내역 ID
  user: {
    // 거래한 사용자 정보
    email: string;
    displayName: string;
    profileImg: string | null;
  };
  account: {
    // 거래한 사용자의 계좌 정보
    bankName: string;
    bankCode: string;
    accountNumber: string;
  };
  product: {
    // 거래한 제품 정보
    productId: string;
    title: string;
    price: number;
    description: string;
    tags: string[];
    thumbnail: string | null;
    discountRate: number;
  };
  reservation: Reservation | null; // 거래한 제품의 예약 정보
  timePaid: string; // 제품을 거래한 시간
  isCanceled: boolean; // 거래 취소 여부
  done: boolean; // 거래 완료 여부
}

export interface ConfirmOrder {
  detailId?: string;
  isCanceled?: boolean; // 거래 취소 여부 (사용자의 '제품 거래(구매) 취소' 상태와 같습니다)
  done?: boolean; // 거래 완료 여부 (사용자의 '제품 거래(구매) 확정' 상태와 같습니다)
}

/** API : 은행 목록 */
export interface GetBankList {
  // 선택 가능한 은행 정보
  name: string; // 은행 이름
  code: string; // 은행 코드
  digits: number[]; // 은행 계좌 자릿수
  disabled: boolean; // 사용자가 추가한 계좌 여부
}
export type GetBankListValue = GetBankList[]; // 선택 가능한 은행 정보 목록

/** API : 계좌 조회 */
export interface GetUserAccounts {
  totalBalance: number; // 사용자 계좌 잔액 총합
  accounts: UserBank[]; // 사용자 계좌 정보 목록
}

export interface UserBank {
  // 사용자 계좌 정보
  id: string; // 계좌 ID
  bankName: string; // 은행 이름
  bankCode: string; // 은행 코드
  accountNumber: string; // 계좌 번호
  balance: number; // 계좌 잔액
}

/** API : 계좌 개설 */
export interface CreateUserAccount {
  // 연결된 계좌 정보
  id: string; // 계좌 ID
  bankName: string; // 은행 이름
  bankCode: string; // 은행 코드
  accountNumber: string; // 계좌 번호
  balance: number; // 계좌 잔액
}

// 계좌 해지
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/account
export type DeleteAccount = true;

// 회원가입
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup
export interface RegisterReq {
  email: string; // 사용자 아이디 (필수!)
  password: string; // 사용자 비밀번호, 8자 이상 (필수!)
  displayName: string; // 사용자 이름, 20자 이하 (필수!)
  profileImgBase64?: string; // 사용자 프로필 이미지(base64) - jpg, jpeg, webp, png, gif, svg
}

export interface RegisterRes {
  user: {
    email: string; // 사용자 아이디
    displayName: string; // 사용자 표시 이름
    profileImg: string | null; // 사용자 프로필 이미지(URL)
  };
  accessToken: string; // 사용자 접근 토큰
}

// 로그인
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login
export interface PersonalInfoLogin {
  user: {
    // 회원가입한 사용자 정보
    email: string; // 사용자 아이디
    displayName: string; // 사용자 표시 이름
    profileImg: string | null; // 사용자 프로필 이미지(URL)
  };
  accessToken: string; // 사용자 접근 토큰
}

// 인증 확인
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me
export interface Authorization {
  email: string; // 사용자 아이디
  displayName: string; // 사용자 표시 이름
  profileImg: string | null; // 사용자 프로필 이미지(URL)
}

// 사용자 정보 수정
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout

// 사용자 목록 조회
// https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/users
export type GetUserInfos = UserInfo[];

export interface UserInfo {
  email: string; // 사용자 아이디
  displayName: string; // 사용자 표시 이름
  profileImg: string; // 사용자 프로필 이미지 URL
}

export interface CurrentStatusInterface {
  orderStatus: {
    num: number;
    cancelNum: number;
    doneNum: number;
    amount: string;
  };
  productStatus: {
    num: number;
    soldOutNum: number;
  };
}
