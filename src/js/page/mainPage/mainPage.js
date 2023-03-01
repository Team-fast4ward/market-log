import { $ } from '../../utils/dom.js';
import { renderPage } from '../../utils/render.js';
import {
  air60,
  air75,
  halo65,
  halo75,
  halo96,
  halo96,
} from '../../importIMGFiles.js';
import { renderInitHeaderLogin } from '../login.js';

/*-----------------------------------*\
  #메인 페이지
\*-----------------------------------*/

/** 메인 페이지 초기 템플릿 */
export const renderMainPageTemplate = `
<div class="mainPage">
  <div class="mainPage__container">
    <div class="mainPage__content">
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <img
            class="mainPage__hero--img"
            src="${halo96}"
            alt=""
          />
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 96</h2>
            <div class="mainPage__hero--desc">Shortcut your 9 to 6</div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>
      <!-- Halo 75 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <img
            class="mainPage__hero--img"
            src="${halo75}"
            alt=""
          />
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 75</h2>
            <div class="mainPage__hero--desc">
              New heights, new lights, and new highlights
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Halo 65 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${halo65}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Halo 65</h2>
            <div class="mainPage__hero--desc">
              New heights, new lights, and new highlights
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Air 60 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${air60}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Air 60</h2>
            <div class="mainPage__hero--desc">
              Revolutionizing the laptop experience
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>

      <!-- Air 75 -->
      <div class="mainPage__hero">
        <a href="/category/keyboards">
          <div class="mainPage__img-container">
            <img
              class="mainPage__hero--img"
              src="${air75}"
              alt=""
            />
          </div>
          <div class="mainPage__hero--info-container">
            <h2 class="mainPage__hero--title">Air 75</h2>
            <div class="mainPage__hero--desc">
              The world's thinnest mechanical keyboard
            </div>
            <button class="mainPage__hero--btn">BUY NOW</button>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
`;

// 버튼으로 해당 페이지 이동
$('.app').addEventListener('click', (e) => {
  if (e.target.classList.contains('mainPage__hero--btn')) {
    router.navigate('/category/keyboards');
  }
});

// [메인페이지] 헤더 서치바
const headerSearchInputEl = document.querySelector(
  '.header-main__search--input',
);
const headerSearchBtnEl = document.querySelector(
  '.header-main__search--button',
);
const headerSearchCloseBtnEl = document.querySelector(
  '.header-main__search--close-button',
);
$('.header-main__search--button').addEventListener('click', () => {
  $('.header-main__search--input').classList.add('active');
  $('.header-main__search--button').style.display = 'none';
  $('.header-main__search--close-button').style.display = 'block';
});

$('.header-main__search--close-button').addEventListener('click', () => {
  $('.header-main__search--input').classList.remove('active');
  $('.header-main__search--close-button').style.display = 'none';
  $('.header-main__search--button').style.display = 'block';
});

/** router on '/' 핸들링 함수 */
export const handleMainPage = () => {
  $('.modal__addCart').style.display = 'none';
  renderPage(renderMainPageTemplate);
};
