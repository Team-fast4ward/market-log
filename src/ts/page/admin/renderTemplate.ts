import searchPNG from '../../../../public/search.gif';

/**사이드 메뉴  */
export const sideBar: string = `
      <aside class="aside-container">
        <ul>
          <h1>관리자 페이지</h1>
          <nav>
            <li class="aside-container__list">
              <a href="/admin" data-navigo>대시보드</a>
            </li>
            <li class="aside-container__list">
              <a href="/admin/product" data-navigo>상품관리</a>
            </li>
            <li class="aside-container__list">
              <a href="/admin/order" data-navigo>거래내역</a>
            </li>
            <nav>
        </ul>
      </aside>
  `;

/**대시보드 페이지 */
export const dashboardPage: string = ` 
    <div class='dashboard-container' data-page='dashboard'>

      <div class='dashboard-container__current'>
        
      </div>

      <div class='dashboard-container__chart'>
       
      </div>

  </div>
`;

/** 거래내역 페이지 */
export const orderPage: string = `
    <div class='order-container' data-page='order'>
      <h2>거래 내역 관리</h2>
      <div class ='order-container__search'>
          <div class='order-container__search-container--input'>
              <input placeholder='거래자명을 입력해 주세요.'>
              <button><img src='${searchPNG}' alt='검색'></button>
          </div>
      </div>
      <li class='order-container__title'>
        <span style='flex-basis: 7%;'>NO</span>
        <span style='flex-basis: 34%;'>상품명</span>
        <span style='flex-basis: 10%;'>가격</span>
        <span style='flex-basis: 15%;'>거래자</span>
        <span style='flex-basis: 20%;'>거래일시</span>
        <span style='flex-basis: 8%;'>취소여부</span>
        <span style='flex-basis: 8%;'>완료여부</span>
      </li>
      <ul class='order-container__list'>
        
      </ul>
      <div class='order-container__btn'>
        <nav class='order-container__btn-page'></nav> 
      </div>
    </div>
      `;

/** 상품 관리 페이지 */
export const productPage: string = `
    <div class='product-container' data-page='product'>
        <h2>상품 관리</h2>
        <div class ='product-container__search'>
            <div class='product-container__search-container--input'>
                <input placeholder='상품명을 입력해 주세요.'>
                <button>
                  <img src='${searchPNG}' alt='검색'>
                </button>
            </div>
        </div>
        <li class='product-container__title'>
          <input type="checkbox" style='flex-basis: 4%'>
          <span style='flex-basis: 4%;'>NO</span>
          <span style='flex-basis: 14%;'>카테고리</span>
          <span style='flex-basis: 55%;'>상품명</span>
          <span style='flex-basis: 13%;'>가격</span>
          <span style='flex-basis: 10%;'>품절여부</span>
        </li>
        <ul class='product-container__list'>
          
        </ul>
        <div class='product-container__btn'>
            <button class='product-container__btn-delete'>삭제</button>
            <nav class='product-container__btn-page'></nav> 
            <a href ='/admin/product/add' data-navigo class='product-container__btn-add'>등록</a> 
        </div>
    </div>
`;

/** 상품 추가 페이지 */
export const productAddPage: string = `
  <div class='productAdd-container' data-page='productAdd'>
    <form class='container-form'>
      <h2 class='container-form__header'>상품 등록</h2>
      <div class='container-form__content'>

          <div class='container-form__content--tags'>
            <p>카테고리<span>*</span></p>
            <select name='tags' required>
              <option value=''>선택</option>
              <option value='키보드'>키보드</option>
              <option value='키캡'>키캡</option>
              <option value='스위치'>스위치</option>
              <option value='액세서리'>액세서리</option>
            </select>
          </div>  
          <div class='container-form__content--title'>
            <p>제품명 <span>*</span></p>
            <input type='text' name='title' placeholder='제품명' required>
          </div>  
          <div class='container-form__content--price'>
            <p>가격 <span>*</span></p>
            <input type='number' name='price' placeholder='가격' required>
          </div>  
          <div class='container-form__content--description'>
            <p>제품상세설명<span>*</span></p>
            <textarea type='text' name='description' placeholder='제품 상세 설명' required></textarea>
          </div>
          <div class='container-form__content--thumbnail'>
            <div class='container-form__content--thumbnail--box'>
              <p>썸네일 이미지 <span>*</span></p>
              <input type="file" required accept="image/*">
            </div>
            <div class='container-form__content--thumbnail--preview'>
              <img src=''>
            </div>
          </div>
        </div>
        <div class='container-form__btn'>
          <button type='submit' class='container-form__btn--add'>추가</button>
          <a href ='/admin/product/' data-navigo class='container-form__btn--cancel'>취소</a> 
        </div>
        
      </div>    
    </form>
  </div>
`;

/** 상품상세 페이지 */
export const productDetailPage: string = `
  <div class='productDetail-container'>
    <h2>상품 상세</h2>
    <section class='section'>
    
    </section>
    <div class='productDetail-container__btn'>
      <button class='productDetail-container__btn--edit'>수정</button>
      <button class='productDetail-container__btn--delete'>삭제</button>
    </div>
  </div>
`;

/** 상품수정 페이지 */
export const productEditPage: string = `
  <div class='productEdit-container'>

  </div>
`;

/** 거래내역상세 페이지 */
export const orderDetailPage: string = `
  <div class='orderDetail-container'>
    <h2>거래 내역 상세</h2>
    <div class="orderDetail-container__info">

    </div>
    <div class='orderDetail-container__btn'>

    </div>
  </div>
`;
