import { checkAuth, LSKey, ce, qs, showLogin } from "./utils.js";

const auth = checkAuth();
const submitBtn = qs(".cc-submit");
const showSummaryEL = () => {
  const lStorageData = getLSData();
  lStorageData.forEach((el) => {
    createSummaryEl(el);
  });
  createTotalEl(lStorageData);
};

const checkForm = () => {
  const name = document.querySelector(".cc-name").value;
  const number = document.querySelector(".cc-number").value;
  const date = document.querySelector(".cc-date").value;
  const cvc = document.querySelector(".cc-pin").value;

  if (!name) return false;
  if (!number || number.length !== 16) return false;
  if (!date) return false;
  if (!cvc || cvc.length !== 3) return false;

  const formObj = {
    name: name,
    number: number,
    date: date,
    cvc: cvc,
  };
  console.log(formObj);
  return true;
};

const getLSData = () => {
  const data = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(data);
  if (!parsedData) return;
  return parsedData;
};

const createModal = (bool) => {
  //const overlay = ce("div");
  //overlay.className = "checkout-overlay";
  const checkoutModal = ce("div");
  checkoutModal.className = "checkout-modal";
  const title = ce("h2");
  const reloadBtn = ce("button");
  reloadBtn.className = "reload-btn";

  if (bool) {
    title.textContent = "Purchase Successful";
    title.className = "checkout-modal-title";

    reloadBtn.textContent = "Go to our homepage";
    reloadBtn.addEventListener("click", () => {
      location.href = "./index.html";
      //remove cart
      localStorage.removeItem(LSKey);
      console.log(bool);
    });
  } else {
    title.textContent = "An error occurred, try again";
    title.className = "checkout-modal-title title-error";

    reloadBtn.textContent = "TRY AGAIN";
    reloadBtn.addEventListener("click", () => {
      location.reload();
      console.log(bool);
    });
  }
  checkoutModal.append(title, reloadBtn);
  qs("body").append(checkoutModal);
};

const createSummaryEl = (item) => {
  const dataEl = qs(".summary-data");
  const card = ce("div");
  card.className = "summary-card";
  const img = ce("img");
  img.setAttribute("src", `${item.img}`);
  img.className = "summary-img";
  const info = ce("div");
  info.className = "summary-info";
  const title = ce("div");
  title.className = "summary-title";
  title.textContent = `${item.title}`;
  const bottom = ce("div");
  bottom.className = "summary-bottom";
  const quantity = ce("h4");
  quantity.textContent = `Quantity: ${item.quantity}`;
  quantity.className = "summary-quantity";
  const price = ce("h4");
  price.className = "summary-price";
  price.textContent = `Price: ${item.price * item.quantity}€`;
  bottom.append(quantity, price);
  info.append(title, bottom);
  card.append(img, info);
  dataEl.append(card);
};
const createTotalEl = (data) => {
  let total = 0;
  data.forEach((el) => {
    total += el.price * el.quantity;
  });
  qs(".summary-total").textContent = `Total: ${total}€`;
};

showSummaryEL();

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const formValidy = checkForm();
  formValidy ? createModal(true) : createModal(false);
});
