// <!-- 스와이퍼 -->
// import * as swiper from './swiper.js';
import swiperImg1 from '../../public/image/swiper-sale.jpg';
import swiperImg2 from '../../public/image/swiper-keyboard.gif';

export const mainPageSwiper = /*html*/ `
<div class="swiper swiper_wrap">
  <div class="swiper_item">
    <img src="${swiperImg2}" alt="swiper" />
  </div>
  <div class="swiper_item">
    <img src="${swiperImg1}" alt="swiper" />
  </div>
  <div class="swiper_prev_button swiper_button">
    <span class="material-symbols-outlined swiper-button-prev">arrow_back_ios</span>
  </div>
  <div class="swiper_next_button swiper_button">
    <span class="material-symbols-outlined swiper-button-next">arrow_forward_ios</span>
  </div>
  <ul class="swiper_pagination"></ul>
</div>
`;
// swiper;

// <!-- WEEKLY BEST 주간 베스트 상품-->
import weeklybest from '../../public/image/weekly-best0.jpg';
import weeklyproduct from '../../public/image/weekly-best0.jpg';
import purpleline from '../../public/purple-line.svg';

export const mainPageWeekly = /*html*/ `
<div class="weekly-container">
<div class="section-header">
  <div class="title"> Weekly Best
    <img src="${purpleline}" alt="purple-line">
  </div>
</div>
<div class="weekly--wrap">
  <img src="${weeklybest}" alt="weekly" class="weekly--mainImg" />
  <ul class="weekly-products">
    <li class="weekly-product">
      <a href="">
        <img src="${weeklyproduct}" alt="weekly" />
    <li class="weekly-info-area">
      <ul class="info-list">
        <li class="info--name">[CASE] 이천이십삼년, 2023</li>
        <li class="info--descr">상품에 대한 간략한 설명</li>
        <li class="info--price">14,000원</li>
      </ul>
    </li>
    </a>
    </li>
  </ul>
</div>
</div>
`;

//<!-- NEW PRODUCT 새상품-->
import newProduct from '../../public/image/best-design.jpg';
export const mainPageNewProduct = /*html*/ `
    <div class="new-product-modal">
      <div class="section-header">
        <div class="title">New Product</div>
      </div>
      <ul class="new-products">
        <li class="new-product">
          <a href="/productDetail" data-navigo>
            <div class="new-product--item">
              <img src="${newProduct}" alt="newproduct" />
              <div class="product--fullname">
                <span class="product--category">[CASE]</span>
                <span class="product--name">이천이십삼년, 2023</span>
              </div>
              <div class="division-line"></div>
              <span class="product--price">14,000원</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
`;

// <!-- BEST DESIGN -->
import bestDesign from '../../public/image/best-design.jpg';
import curveLine from '../../public/curve-line.svg';
export const mainPageBestDesign = /*html*/ `
 <div class="modal-wrap">
  <div class="best-design-modal">
    <div class="main-header">
      <div class="curve-line">
        <img src="${curveLine}" alt="curve-line" />
      </div>
      <span class="section-header">Best Design</span>

    </div>
    <div class="best-designs">
      <div class="best-design__products">
        <ul class="best_items">
          <div class="sub">
            마켓로그 선정 최고의 디자인<br />
            제품을 눌러 상세 내용을 살펴보세요!!
          </div>
          <li class="best_item">
            <a href="/productDetail" data-navigo>
              <img src="${bestDesign}" alt="best">
          <li class="best_item--info-area">
            <ul class="info-list">
              <li class="info--name">[CASE] 이천이십삼년, 2023</li>
              <li class="info--descr">상품에 대한 간략한 설명</li>
              <li class="info--price">14,000원</li>
            </ul>
          </li>
          </a>
          </li>
        </ul>
        <img src=${bestDesign} alt="best-design--main" class="best-design--main" />
      </div>
    </div>
  </div>
</div>`;
