import { doc } from 'prettier';

//상세주문내역(단일주문내역)불러오기
const orderSpecific = document.querySelector('.order-specific');
const orderDate = document.querySelector('.order-date');
const orderId = document.querySelector('.order-id');
// orderDate.innerText = `주문 날짜 : ${}`;
// orderId.innerText = `주문 번호 : ${}`;

const productContainer = document.querySelector('.product-container');

const detailHistoryURL =
  'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/detail';
async function getDetailHistory(item) {
  const res = await fetch(orderhistoryURL, {
    method: 'POST',
    headers: 'Authorization: Bearer <accessToken>',
    body: JSON.stringify(item.detailId),
  });
  const json = await res.json();
  console.log('단일주문내역', json);
  return json;
}
window.addEventListener('load', () => {
  const detailHistory = getDetailHistory();
  productContainer.innerHTML = `
<img class="product--image" src="" alt="product image" />
            <div class="product-info">
              <span class="product--name"
                >${detailHistory.product.title}</span
              >
              <div>
                <span class="product--price">${
                  detailHistory.product.price
                }</span>
                <span class="product--count">(${
                  JSON.parse(localStorage.getItem('')).count
                }개)</span>
              </div>
            </div>
            <div class="order-status"></div>`;
});
