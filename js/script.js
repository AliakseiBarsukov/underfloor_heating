// Swiper slider

new Swiper('.hero__slider', {
  slidesPerView: 2,
  spaceBetween: 10,
  loop: true,

  navigation: {
    prevEl: '.hero__slider-btn_prev',
    nextEl: '.hero__slider-btn_next',
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    560: {
      spaceBetween: 8,
    },
  },
});


// Calculator

const calcForm = document.querySelector('.js-calc-form');
const totalSquare = document.querySelector('.js-square');
const totalPrice = document.querySelector('.js-total-price');
const calcResultWrapper = document.querySelector('.calc__result-wrapper');

const tariff = {
  economy: 550,
  comfort: 1400,
  premium: 2700,
}

calcForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (calcForm.width.value > 0 &&
      calcForm.lenght.value > 0) {
      const square = calcForm.width.value * calcForm.lenght.value;
      const totalSum = square * tariff[calcForm.tariff.value]
      totalSquare.textContent = `${square} кв м`;
      totalPrice.textContent = `${totalSum} руб`;
      }
      calcResultWrapper.style.display = 'block';
})