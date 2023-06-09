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
const calcOrder = document.querySelector('.calc__order');
const btnSubmit = document.querySelector('.js-submit');

const tariff = {
  economy: 550,
  comfort: 1400,
  premium: 2700,
}

calcForm.addEventListener('input', () => {
  btnSubmit.disabled = !(calcForm.width.value > 0 &&
    calcForm.lenght.value > 0);
})

calcForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (calcForm.width.value > 0 &&
      calcForm.lenght.value > 0) {
      const square = calcForm.width.value * calcForm.lenght.value;
      const totalSum = square * tariff[calcForm.tariff.value]
      totalSquare.textContent = `${square} кв м`;
      totalPrice.textContent = `${totalSum} руб`;
      }
      calcResultWrapper.classList.add('calc__result-wrapper_show');
      calcOrder.classList.add('calc__order_show');
})


// modal

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({top: scrollController.scrollPosition})
    document.documentElement.style.scrollBehavior = '';
  },
}


const modalController = ({modal, btnOpen, btnClose, modalSubmit, time = 300}) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);

  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out;
  `;

  const closeModal = event => {
    const target = event.target;

    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      // (modalSubmit && target.closest(modalSubmit)) ||
      event.code === 'Escape'
      ) {
      
      modalElem.style.opacity = 0;

      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, time);

      window.removeEventListener('keydown', closeModal);
    }
  }

  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  buttonElems.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalElem.addEventListener('click', closeModal);
};

modalController({
  modal: '.modal', 
  btnOpen: '.js-order', 
  btnClose: '.modal__close', 
  modalSubmit: '.modal__submit',
});


// mask phone

const phone = document.querySelector('#phone');
const imPhone = new Inputmask('+7(999)999-99-99');

imPhone.mask(phone);


const validator = new JustValidate('.modal__form', {
  errorLabelCssClass: 'modal__input-error',
  errorLabelStyle: {
    color: '#ffc700',
  }
});


validator.addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Введите имя',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Не менее 3 символов',
    },
    {
      rule: 'maxLength',
      value: 25,
      errorMessage: 'Слишком длинное имя',
    },
  ])

validator.addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'Введите номер',
    },
    {
      validator: value => {
        const number = phone.inputmask.unmaskedvalue()
        return number.length === 10;
      },
      errorMessage: 'Номер не корректный',
    }
  ]);

validator.onSuccess((event) => {
  const form = event.currentTarget;
  const modalContent = document.querySelector('.modal__content');

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      name: form.name.value,
      phone: form.phone.value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      form.reset();

      modalContent.innerHTML = '';
      const responseText = document.createElement('div');
      responseText.className = 'modal__res';
      responseText.innerHTML = `
        <h2 class="modal__title">Спасибо за доверие!</h2> 
        <p class="modal__subtitle">Наши менеджеры с вами скоро свяжутся.</p>
        <p class="modal__text">Номер Вашей заявки ${data.id}</p>
      `;
      modalContent.append(responseText)
    });
  })