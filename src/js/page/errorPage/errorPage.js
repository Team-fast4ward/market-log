import { router } from '../../main.js';
import { $ } from '../../utils/dom';
import { renderPage } from '../../utils/render.js';

export const handleErrorPage = () => {
  const htmlErrorPage = `
<div class="error-page">
    <div class="error-message--container">
      <p class="error-message--title">원하시는 페이지를 찾을 수 없습니다 ;(</p>
      <p class="error-message--desc">찾으려는 페이지의 주소가 잘못 입력되었거나,주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.<br>입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주세요.</p>
    </div>
</div>
`;
  renderPage(htmlErrorPage);
};
