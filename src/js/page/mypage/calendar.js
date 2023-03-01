import { $ } from '../../utils/dom.js';
import { getAllTransactions } from '../../api.js';
// export { renderCalendarEl, renderCalendarDates };
export default function () {
  const currDate = $('.curr-date span:first-child');
  const monthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysUl = $('.days');
  let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
  const prevNextBtns = document.querySelectorAll('.material-symbols-outlined');
  const noContentEl = $('.nocontent-box');

  //[캘린더] 캘린더 렌더 함수
  const renderCalendarEl = () => {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDate(),
      lastDayOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    lastDayOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = '';
    for (i = firstDayOfMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDayOfLastMonth - i + 1}</li>`;
    }
    for (i = 1; i <= lastDayOfMonth; i++) {
      let isToday =
        i === date.getDate() &&
        currMonth === date.getMonth() &&
        currYear === date.getFullYear()
          ? 'today'
          : '';
      liTag += `<li class="day active ${isToday}">${i}</li>`;
    }
    // selected();
    currDate.innerText = `${monthsArr[currMonth]}, ${currYear}`;
    daysUl.innerHTML = liTag;
  };

  //[캘린더] 이전 달, 다음 달 버튼
  const renderCalendarDates = function () {
    [...prevNextBtns].forEach((icon) => {
      icon.addEventListener('click', () => {
        currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0 || currMonth > 11) {
          date = new Date(currYear, currMonth);
          currYear = date.getFullYear();
          currMonth = date.getMonth();
        } else {
          date = new Date();
        }
        renderCalendarEl();
      });
    });
  };
  // const dateDate = new Date().toISOString().slice(0, 10); === timePaid.slice(0,10)
  // console.log(dateDate);

  // function myCalender(options) {
  // const { el, on } = options;
  // const calendarEl = calendarBoxEl.querySelector(el);

  // 영은 님의 캘린더 기능 코드..

  // const dateEls = calendarEl.querySelectorAll('li.date'); // 캘런더의 선택 가능한 각 날짜!
  // dateEls.forEach((dateEl) => {
  //   dateEl.addEventListener('click', () => {
  //     const date = `${year}-${month}-${dateEl.textContent}`; // E.g, '2023-12-12'
  //     on.select(date);
  //   });
  // });
  //}

  // async function addProduct(startDate, endDate) {
  //   const res = await fetch('API_END_POINT', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       // 포함할 데이터,
  //       reservation: {
  //         start: new Date(`${startDate} 12:00:00`).toISOString(),
  //         end: new Date(`${endDate} 18:30:00`).toISOString(),
  //       },
  //     }),
  //   });
  //   const json = await res.json();
  //   console.log(json);
  // }

  ///////////////////////////////////

  // let startDate = '';
  // let endDate = '';

  // myCalender({
  //   el: '.calendar--start',
  //   on: {
  //     select(date) {
  //       console.log(date); // E.g, '2023-01-01'
  //       startDate = date;
  //     },
  //   },
  // });
  // myCalender({
  //   el: '.calendar--end',
  //   on: {
  //     select(date) {
  //       console.log(date); // E.g, '2023-01-07'
  //       endDate = date;
  //     },
  //   },
  // });

  // const addProductBtnEl = document.querySelector('.add-product-btn');
  // addProductBtnEl.addEventListener('click', () => {
  //   addProduct(startDate, endDate);
  // });
  const selectDay = () => {
    $('.days').addEventListener(click, (e) => {
      console.log(e.target);
    });
  };
}
