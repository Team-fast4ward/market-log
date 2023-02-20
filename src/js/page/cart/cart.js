// // import { shoppingCartStore } from '../productDetail/productDetail.js';
// import cartSVG from '../../../../public/cart.svg';
// const $ = (selector) => document.querySelector(selector);

// const shoppingCartStore = {
//   setLocalStorage(product) {
//     localStorage.setItem('shoppingCart', JSON.stringify(product));
//   },
//   getLocalStorage() {
//     return JSON.parse(localStorage.getItem('shoppingCart')) || [];
//   },
//   removeLocalStorage() {
//     localStorage.removeItem('shoppingCart').slice(0, 1);
//   },
//   clearLocalStorage() {
//     localStorage.clear();
//   },
// };

// const cartIdLocalStorage = shoppingCartStore.getLocalStorage();
// console.log(cartIdLocalStorage);

// let shoppingCartArray = [];
// shoppingCartArray = cartIdLocalStorage;

// let cartProductTotalPrice;

// /** 장바구니 페이지 렌더링 */
// // const renderCartPage = () => {
// // const cartSection = document.createElement('section');
// // cartSection.classList.add('cart');
// // $('.app').append(cartSection);

// // const cartHeader = document.createElement('div');
// // cartHeader.classList.add('cart__header');
// // cartSection.append(cartHeader);

// // const cartH2 = document.createElement('h2');
// // cartH2.textContent = '장바구니';
// // cartHeader.innerHTML(cartH2);

// // const cartContainer = document.createElement('div');
// // cartContainer.classList.add('cart__container');
// // cartHeader.append();

// // const cartList = document.createElement('ul');
// // cartList.classList.add('cart__list');
// // cartContainer.innerHTML = cartList;

// // };
// // renderCartPage();

// // `

// /* <section class="cart">
//   <div class="cart__header">
//     <h2>장바구니</h2>
//   </div>
//   <div class="cart__container">
//     <ul class="cart__list"></ul>
//   </div>
// </section>; */

// // `;

// /** 장바구니에 상품이 있을 때 화면 렌더링 */
// const renderCartList = (cartIdLocalStorage) => {
//   const cartListTemplate = cartIdLocalStorage
//     .map((item) => {
//       const { id, price, count, thumbnail, title } = item;
//       cartProductTotalPrice = price;
//       return `
//     <li class="cart__item" data-product-id="${id}">
//       <div class="cart__item-info">
//         <div class="cart__item-info--checkbox">
//           <input type="checkbox" checked />
//         </div>
//         <a href="#" data-navigo
//           ><div class="cart__item-info--img">
//             <img
//               src="${thumbnail}"
//               alt="${title}"
//             /></div
//         ></a>
//         <a href="#" data-navigo
//           ><span class="cart__item-info--title">
//             ${title}
//           </span></a
//         >
//       </div>
//       <div class="cart__item--calc">
//         <div class="cart__item--calc-count">
//           <button class="cart-minusQtyBtn">-</button>
//           <p class="cartProductQty">${count}</p>
//           <button class="cart-addQtyBtn">+</button>
//         </div>
//         <span class="cart__item--price cartProductTotalPrice">${price}</span>
//         <button class="cart__item--deleteBtn cartProductDeleteBtn">X</button>
//       </div>
//     </li>
//     `;
//     })
//     .join('');

//   $('.cart__list').innerHTML = cartListTemplate;
// };

// const storeLocalStorage = (id) => {
//   const existingItem = shoppingCartArray.find((item) => item.id === id);
//   console.log('existingItem', existingItem);

//   if (existingItem) {
//     existingItem.price += existingItem.pricePerOne;
//     existingItem.qty += 1;
//     existingItem.count += 1;
//     return;
//   }
// shoppingCartArr
//   shoppingCartStore.setLocalStorage(shoppingCartArray);
//   console.log('장바구니', shoppingCartArray);
// };

// /** 장바구니 구매수량 핸들링 이벤트 */
// $('.cart__list').addEventListener('click', (e) => {
// const price = Number(
//   e.target.closest('li').querySelector('.cartProductTotalPrice').innerHTML,
// );
// const qty = Number(
//   e.target.closest('li').querySelector('.cartProductQty').textContent,
// );
// handleCartQty(e);
// });
// /** 장바구니 구매수량 핸들링 함수 */
// const handleCartQty = (e) => {
//   const id = e.target.closest('li')?.dataset.productId;

// 수량+ 버튼
//   if (e.target.classList.contains('cart-addQtyBtn')) {
//     storeLocalStorage(id);
//     renderCartList(cartIdLocalStorage);
//     shoppingCartStore.setLocalStorage(shoppingCartArray);
//     return;
//   }

// 수량- 버튼
// if (e.target.classList.contains('cart-minusQtyBtn')) {
//   const existingItem = shoppingCartArray.find((item) => item.id === id);
//   console.log('existingItem', existingItem);

//   if (existingItem) {
//     existingItem.price -= existingItem.pricePerOne;
//     existingItem.qty -= 1;
//     existingItem.count -= 1;
//     shoppingCartStore.setLocalStorage(shoppingCartArray);
//     renderCartList(cartIdLocalStorage);
//     return;
//   }
// }
// };

// /** 장바구니에서 삭제 이벤트*/
// $('.cart__list').addEventListener('click', (e) => {
//   const id = e.target.closest('li')?.dataset.productId;

//   if (e.target.classList.contains('cartProductDeleteBtn')) {
//     console.log(e.target);
//   }
// });

// /** 장바구니에서 삭제 함수 */

// /** 빈 장바구니일 때 화면에 표시 */
// const renderEmptyCart = () => {
//   const cartListEmptyTemplate = `
//     <div class="cart__empty">
//       <img src="${cartSVG}" alt="빈 장바구니" />
//       <h3>장바구니가 비었습니다.</h3>
//       <a href="/" data-navigo><button>쇼핑하러 가기</button></a>
//     </div>
//   `;

//   $('.cart__list').innerHTML = cartListEmptyTemplate;
// };

// /** 장바구니 localStorage length가 0일 때 '장바구니 비었다는 표시'
//  * 아니면 localStorage 상품 렌더링 */
// shoppingCartStore.getLocalStorage().length === 0
//   ? renderEmptyCart()
//   : renderCartList(cartIdLocalStorage);

// /** 장바구니 총 가격 렌더링 */
// const renderCartPrice = () => {
//   // const cartPriceTemplate =
// };
