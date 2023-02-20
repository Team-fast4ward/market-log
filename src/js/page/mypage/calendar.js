export default function () {
  const calendarBoxEl = document.querySelector('.calendar-box');
  const calendarbtn = calendarBoxEl.querySelector('.calendar-icon');
  const reloadbtn = calendarBoxEl.querySelector('button');
  const calendarEl = calendarBoxEl.querySelector('.calendar');
  const currDate = calendarEl.querySelector('.curr-date span:first-child');
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
  const daysTag = calendarEl.querySelector('.days');
  let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
  const prevNextBtns = calendarEl.querySelectorAll(
    '.material-symbols-outlined',
  );
  const noContentEl = document.querySelector('.nocontent-box');
  const productsEl = document.querySelector('.products');
  const productArr = document.querySelectorAll('.product');
  const todayEl = document.querySelector('.today');
  const selectedEl = document.querySelector('.selected');

  calendarbtn.addEventListener('click', () => {
    if (calendarEl.classList.contains('nodisplay')) {
      // productsEl.classList.add('nodisplay');
      // noContentEl.classList.remove('nodisplay');
      calendarEl.classList.remove('nodisplay');
    } else {
      calendarEl.classList.add('nodisplay');
    }
  });
  reloadbtn.addEventListener('click', () => {
    if (!calendarEl.classList.contains('nodisplay')) {
      calendarEl.classList.add('nodisplay');
    }
    window.location.reload();
  });

  //달력 불러오기
  const renderCalendar = () => {
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
    daysTag.innerHTML = liTag;
  };
  renderCalendar();
  console.log(currYear, currMonth);

  //이전 달, 다음 달 버튼
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
      renderCalendar();
    });
  });
}
// function selected() {
//   const dayEl = document.querySelectorAll('.day'); //array
//   console.log(dayEl);
//   [...dayEl].forEach((day) => {
//     day.addEventListener('click', () => {
//       day.classList.add('selected')
//       //selected 날짜 가져오기

//       day.classList.remove('selected')
//     });
//   });
// }
// const dateDate = new Date().toISOString().slice(0, 10); === timePaid.slice(0,10)
// console.log(dateDate);
