import {
  qs,
  GET,
  createCategoryEl,
  createCategoryImg,
  openCart,
  filterByCategory,
  searchProd,
  loadCart,
  removeFromCart,
  sendLogin,
  logOut,
  checkAuth,
  showLogin,
  updateNavCheckoutNumber,
  gotoCheckout,
} from "./utils.js";

const loginFormEl = document.forms["login-form"];

console.log(loginFormEl);
const navBtn = qs(".search-icon");
const slides = document.querySelectorAll(".slide");
const checkoutBtn = qs(".checkout");
const profile = qs(".profile");
const authElement = qs(".auth-modal");
const gotoCheckoutBtn = qs(".goto-payment");
const gotoLogin = qs(".goto-login");
const gotoSignUp = qs(".goto-signup");
const loginBtn = qs(".send-login");

//FORMS ANIMATION
const moveForms = (target) => {
  const gap = 40; //px
  console.log(target.textContent);
  const movingModals = qs(".moving-modals");
  const formElement = qs(".login-modal");
  const divLength = formElement.offsetWidth; //prendo larghezza div
  const moveLength = divLength + gap; //gli aggiungo il gap
  console.log(moveLength);
  if (target.textContent === "sign up") {
    movingModals.style.transform = `translateX(-${moveLength}px)`;
  } else {
    movingModals.style.transform = "translateX(0)";
  }
};

//Sliding carousel
slides.forEach((item, idx) => {
  item.style.transform = `translateX(${idx * 100}%)`;
});
let currentSlide = 0;
const nextSlide = qs(".next");
const prevSlide = qs(".prev");

const checkSlideNum = () => {
  const slidesArr = document.querySelectorAll(".slide");
  return slidesArr.length;
};
nextSlide.addEventListener("click", () => {
  const slidesNum = checkSlideNum();
  if (currentSlide === slidesNum - 1) return;
  currentSlide++;
  slides.forEach(
    (item, idx) =>
      (item.style.transform = `translateX(${100 * (idx - currentSlide)}%`)
  );
});
prevSlide.addEventListener("click", () => {
  const slidesNum = checkSlideNum();
  if (currentSlide === 0) return;
  currentSlide--;
  slides.forEach(
    (item, idx) =>
      (item.style.transform = `translateX(${100 * (idx - currentSlide)}%`)
  );
});

//check if auth
//update navbar profile button

const getCategory = () => {
  const categoriesURL = "https://api.escuelajs.co/api/v1/categories";
  GET(categoriesURL)
    .then((res) => {
      console.log(res);
      const categories = res.slice(1, 5);
      //console.log(categories);
      categories.map((el) => {
        createCategoryEl(el);
        createCategoryImg(el);
      });
    })
    .then((res) => {
      const navCategoriesBtns = document.querySelectorAll(".categories-btn");
      const categoriesImgs = document.querySelectorAll(".category-container");

      categoriesImgs.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          filterByCategory(btn.textContent);
        });
      });

      navCategoriesBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          //console.log(btn.textContent);
          filterByCategory(btn.textContent);
        });
      });

      //Al click del bottone devono essere passati i dati dell'oggetto alla funzione che stampa i dati nel carrello
      //prodBtn.addEventListener("click", reloadCart);
    });
};
getCategory();
checkAuth();
//updateNavCheckoutNumber();

//search product
profile.addEventListener("click", (e) => {
  if (e.target.textContent.toLowerCase() !== "accedi") {
    logOut();
  }
});
profile.addEventListener("click", () => {
  showLogin();
});
navBtn.addEventListener("click", searchProd);
console.log(gotoLogin);
gotoLogin.addEventListener("click", (e) => {
  moveForms(e.target);
});
gotoSignUp.addEventListener("click", (e) => {
  moveForms(e.target);
});
checkoutBtn.addEventListener("click", () => {
  if (!checkAuth()) {
    showLogin();
    return;
  }
  openCart();
  loadCart();
});

gotoCheckoutBtn.addEventListener("click", () => gotoCheckout());

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    name: loginFormEl["login-text"].value,
    password: loginFormEl["login-password"].value,
  };
  sendLogin(data);
  profile.removeEventListener("click", () => {
    showLogin();
  });
});
/* document.addEventListener("DOMContentLoaded", () => {
  CART.init();
  console.log(CART);
}); */
