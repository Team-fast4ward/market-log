import listImg from '../../../../public/list.svg';
export {
  modalOrderCancel,
  modalOrderCancelFix,
  modalOrderFix,
  modalOrderFixFix,
  modalEditPersonalInfo,
};

//[마이페이지-주문 내역] 모달
const createOrderModalHtml = (className: string, modalMessage: string) => {
  const modalHtml = `
<div class="modal ${className}">
    <img src="${listImg}" alt="modal icon" />
    <span class="modal-text">${modalMessage}</span>
    <div class="buttons">
      <button class="modal_cancel-btn">취소</button>
      <button class="modal_confirm-btn">확인</button>
    </div>
</div>`;
  return modalHtml;
};

const modalOrderCancel = createOrderModalHtml(
  'modal--ordercancel',
  '주문을 취소 하시겠습니까?',
);
const modalOrderCancelFix = createOrderModalHtml(
  'modal--ordercancel-fix',
  '주문이 취소되었습니다',
);
const modalOrderFix = createOrderModalHtml(
  'modal--orderfix',
  '구매를 확정 하시겠습니까?',
);
const modalOrderFixFix = createOrderModalHtml(
  'modal--orderfix-fix',
  '구매가 확정되었습니다',
);

//[마이페이지-개인정보수정] 모달
const createEditPersonalInfoModalHtml = (className, modalMessage) => {
  const modalHtml = `
<div class="modal ${className}">
    <span class="modal-text">${modalMessage}</span>
    <div class="buttons">
      <button class="modal_confirm-btn">확인</button>
    </div>
</div>`;
  return modalHtml;
};

const modalEditPersonalInfo = createEditPersonalInfoModalHtml(
  'modal--edit-personal-info',
  '수정이 완료되었습니다',
);
