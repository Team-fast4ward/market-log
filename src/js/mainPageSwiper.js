// 스와이퍼 전체 크기
export const swiper = document.querySelector('.swiper');
let swiperWidth = swiper.clientWidth;

// BtnEl 선택
export const prevBtn = document.querySelector('.swiper_prev_button');
export const nextBtn = document.querySelector('.swiper_next_button');

// 슬라이드 전체를 선택해 값을 변경 + 슬라이드 전체 선택
let swiperItems = document.querySelectorAll('.swiper_item');
// 현재 슬라이드 위치가 슬라이드 개수를 넘기지 않게 하기 위한 변수
const maxswiper = swiperItems.length;

// 버튼 클릭할 때 마다 현재 슬라이드가 어디인지 알려주기 위한 변수
let currswiper = 1;

// 페이지네이션 생성
export const pagination = document.querySelector('.swiper_pagination');

for (let i = 0; i < maxswiper; i++) {
  if (i === 0) pagination.innerHTML += `<li class="active">•</li>`;
  else pagination.innerHTML += `<li>•</li>`;
}

export const paginationItems = document.querySelectorAll(
  '.swiper_pagination > li',
);

// start, end 슬라이드 복사 -> 무한 슬라이드
const startswiper = swiperItems[0];
const endswiper = swiperItems[swiperItems.length - 1];
const startEl = document.createElement('div');
const endEl = document.createElement('div');

endswiper.classList.forEach((c) => endEl.classList.add(c));
endEl.innerHTML = endswiper.innerHTML;

startswiper.classList.forEach((c) => startEl.classList.add(c));
startEl.innerHTML = startswiper.innerHTML;

// 각 복제한 El 추가
swiperItems[0].before(endEl);
swiperItems[swiperItems.length - 1].after(startEl);

// 슬라이드 전체를 선택해 값을 변경해주기 위해 슬라이드 전체선택
swiperItems = document.querySelectorAll('.swiper_item');
//
let offset = swiperWidth + currswiper;
swiperItems.forEach((i) => {
  i.setAttribute('style', `left: ${-offset}px`);
});

function nextMove() {
  currswiper++;
  // 마지막 슬라이드 이상으로 넘어가지 않게 하기 위해
  if (currswiper <= maxswiper) {
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = swiperWidth * currswiper;
    // 각 슬라이드 아이템의 left에 offset 적용
    swiperItems.forEach((i) => {
      i.setAttribute('style', `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove('active'));
    paginationItems[currswiper - 1].classList.add('active');
  } else {
    // 무한 슬라이드 기능 - currswiper 값만 변경해줘도 되지만 시각적으로 자연스럽게 하기 위해 아래 코드 작성
    currswiper = 0;
    let offset = swiperWidth * currswiper;
    swiperItems.forEach((i) => {
      i.setAttribute('style', `transition: ${0}s; left: ${-offset}px`);
    });
    currswiper++;
    offset = swiperWidth * currswiper;
    // 각 슬라이드 아이템의 left에 offset 적용
    setTimeout(() => {
      // 각 슬라이드 아이템의 left에 offset 적용
      swiperItems.forEach((i) => {
        i.setAttribute('style', `transition: ${0.35}s; left: ${-offset}px`);
      });
    }, 0);
    // // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove('active'));
    paginationItems[currswiper - 1].classList.add('active');
  }
}

function prevMove() {
  currswiper--;
  // 1번째 슬라이드 이하로 넘어가지 않게 하기 위해
  if (currswiper > 0) {
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = swiperWidth * currswiper;
    // 각 슬라이드 아이템의 left에 offset 적용
    swiperItems.forEach((i) => {
      i.setAttribute('style', `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove('active'));
    paginationItems[currswiper - 1].classList.add('active');
  } else {
    // 무한 슬라이드 기능 - currswiper 값만 변경해줘도 되지만 시각적으로 자연스럽게 하기 위해 아래 코드 작성
    currswiper = maxswiper + 1;
    let offset = swiperWidth * currswiper;
    // 각 슬라이드 아이템의 left에 offset 적용
    swiperItems.forEach((i) => {
      i.setAttribute('style', `transition: ${0}s; left: ${-offset}px`);
    });
    currswiper--;
    offset = swiperWidth * currswiper;
    setTimeout(() => {
      // 각 슬라이드 아이템의 left에 offset 적용
      swiperItems.forEach((i) => {
        // i.setAttribute("style", `transition: ${0}s; left: ${-offset}px`);
        i.setAttribute('style', `transition: ${0.35}s; left: ${-offset}px`);
      });
    }, 0);
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove('active'));
    paginationItems[currswiper - 1].classList.add('active');
  }
}

// 버튼 엘리먼트에 클릭 이벤트 추가
nextBtn.addEventListener('click', () => {
  // 이후 버튼 누를 경우 현재 슬라이드를 변경
  nextMove();
});
// 버튼 엘리먼트에 클릭 이벤트 추가
prevBtn.addEventListener('click', () => {
  // 이전 버튼 누를 경우 현재 슬라이드를 변경
  prevMove();
});

// 브라우저 화면이 조정될 때 마다 swiperWidth를 변경하기 위해
window.addEventListener('resize', () => {
  swiperWidth = swiper.clientWidth;
});

// 각 페이지네이션 클릭 시 해당 슬라이드로 이동
for (let i = 0; i < maxswiper; i++) {
  // 각 페이지네이션마다 클릭 이벤트 추가
  paginationItems[i].addEventListener('click', () => {
    // 클릭한 페이지네이션에 따라 현재 슬라이드 변경해주기(currswiper는 시작 위치가 1이기 때문에 + 1)
    currswiper = i + 1;
    // 슬라이드를 이동시키기 위한 offset 계산
    const offset = swiperWidth * currswiper;
    // 각 슬라이드 아이템의 left에 offset 적용
    swiperItems.forEach((i) => {
      i.setAttribute('style', `left: ${-offset}px`);
    });
    // 슬라이드 이동 시 현재 활성화된 pagination 변경
    paginationItems.forEach((i) => i.classList.remove('active'));
    paginationItems[currswiper - 1].classList.add('active');
  });
}

// 드래그(스와이프) 이벤트를 위한 변수 초기화
let startPoint = 0;
let endPoint = 0;

// PC 클릭 이벤트 (드래그)
swiper.addEventListener('mousedown', (e) => {
  startPoint = e.pageX; // 마우스 드래그 시작 위치 저장
});

swiper.addEventListener('mouseup', (e) => {
  endPoint = e.pageX; // 마우스 드래그 끝 위치 저장
  if (startPoint < endPoint) {
    // 마우스가 오른쪽으로 드래그 된 경우
    prevMove();
  } else if (startPoint > endPoint) {
    // 마우스가 왼쪽으로 드래그 된 경우
    nextMove();
  }
});

// 모바일 터치 이벤트 (스와이프)
swiper.addEventListener('touchstart', (e) => {
  startPoint = e.touches[0].pageX; // 터치가 시작되는 위치 저장
});
swiper.addEventListener('touchend', (e) => {
  endPoint = e.changedTouches[0].pageX; // 터치가 끝나는 위치 저장
  if (startPoint < endPoint) {
    // 오른쪽으로 스와이프 된 경우
    prevMove();
  } else if (startPoint > endPoint) {
    // 왼쪽으로 스와이프 된 경우
    nextMove();
  }
});

// 기본적으로 슬라이드 루프 시작하기
let loopInterval = setInterval(() => {
  nextMove();
}, 3000);

// 슬라이드에 마우스가 올라간 경우 루프 멈추기
swiper.addEventListener('mouseover', () => {
  clearInterval(loopInterval);
});

// 슬라이드에서 마우스가 나온 경우 루프 재시작하기
swiper.addEventListener('mouseout', () => {
  loopInterval = setInterval(() => {
    nextMove();
  }, 3000);
});
