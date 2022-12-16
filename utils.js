const getAllProd = "https://api.escuelajs.co/api/v1/products";
export const LSKey = "WestfieldECommerce";
const LSAuth = "WestfieldAUTH";
export const qs = (type) => document.querySelector(type);

export const ce = (type) => document.createElement(type);

export const GET = async (url) => {
  const res = await fetch(url);
  return await res.json();
};
const contentList = qs(".content-list");
const navInput = qs(".search-input");

export const openCart = () => {
  const checkoutModal = qs(".checkout-modal");
  const overlay = qs(".overlay");
  //overlay.classList.toggle("hide");
  checkoutModal.classList.toggle("hide");
};
//create card
//create category buttons on top
export const createCategoryEl = (item) => {
  const categoryEl = qs(".categories");
  const div = ce("div");
  div.className = "categories-btn";
  div.textContent = `${item.name}`;
  categoryEl.append(div);
};
//create category images
export const createCategoryImg = (elem) => {
  const categoryEl = qs(".categories-images");
  const cont = ce("div");
  const imageEl = ce("img");
  const nameEl = ce("h3");
  cont.className = "category-container";
  imageEl.className = "category-img";
  nameEl.className = "category-name ";
  nameEl.textContent = `${elem.name}`;
  imageEl.setAttribute("src", `${elem.image}`);
  cont.append(imageEl, nameEl);
  categoryEl.append(cont);
};

export const createProdEl = (item) => {
  const contentList = qs(".content-list");
  const prodListEl = ce("div");
  prodListEl.className = "product";
  const imgEl = ce("img");
  imgEl.className = "prod-img";
  imgEl.setAttribute("src", `${item.images[0]}`);
  const infoEl = ce("div");
  infoEl.className = "prod-info";
  const prodTitleEl = ce("div");
  prodTitleEl.className = "prod-title";

  prodTitleEl.textContent = `${item.title}`;
  // const stars = ce("span"); TODO
  const prodPriceEl = ce("span");
  prodPriceEl.className = "prod-price";
  prodPriceEl.textContent = `${item.price}€`;
  const otherEl = ce("div");
  otherEl.className = "prod-other";
  otherEl.textContent = `${item.description}`;
  const btnEl = ce("span");
  btnEl.setAttribute("data-id", `${item.id}`);
  btnEl.className = "prod-btn";
  btnEl.textContent = "BUY NOW";
  btnEl.addEventListener("click", () => {
    checkAuth() ? addToCart(item) : showLogin();
  });

  infoEl.append(prodTitleEl, prodPriceEl, otherEl);
  prodListEl.append(imgEl, infoEl, btnEl);
  contentList.append(prodListEl);
};
export const updateNavCheckoutNumber = () => {
  let num = countCartEl();
  if (!num) return;
  console.log("aggiorno");
  qs(".checkout").setAttribute("data-before", `${num}`);
};
export const createCheckoutEl = (item) => {
  const checkout = qs(".checkout-cards");
  const card = ce("div");
  card.className = "checkout-card";
  const checkoutImg = ce("img");
  checkoutImg.setAttribute("src", `${item.img}`);
  checkoutImg.className = "checkout-img";
  const checkoutInfo = ce("div");
  checkoutInfo.className = "checkout-info";
  //QUANTITY
  const infoBottom = ce("div");
  const infoQuantity = ce("div");
  infoQuantity.className = "checkout-quantity";
  const reduceQuantity = ce("span");
  reduceQuantity.className = "material-symbols-outlined arrow-quantity reduce";
  reduceQuantity.textContent = "chevron_left";
  const quantity = ce("div");
  const increaseQuantity = ce("span");
  increaseQuantity.className =
    "material-symbols-outlined arrow-quantity increase";
  increaseQuantity.textContent = "chevron_right";
  quantity.textContent = item.quantity;
  infoQuantity.append(reduceQuantity, quantity, increaseQuantity);
  increaseQuantity.addEventListener("click", () => {
    //console.log(item);
    addToCart(item);
  });
  reduceQuantity.addEventListener("click", () => {
    removeOneFromCart(item.id);
  });
  //DELETE
  const infoDelete = ce("span");
  infoDelete.className = "info-delete material-symbols-outlined";
  infoDelete.textContent = "delete";
  infoDelete.addEventListener("click", () => removeFromCart(item.id));
  infoBottom.className = "info-bottom";
  infoBottom.textContent = "";
  infoBottom.append(infoQuantity, infoDelete);
  //TOP
  const infoTop = ce("div");
  infoTop.className = "info-top";
  const infoTitle = ce("div");
  infoTitle.textContent = `${item.title}`;
  infoTitle.className = "info-title";
  const infoPrice = ce("div");
  infoPrice.textContent = `${item.price * item.quantity} €`;
  infoTop.append(infoTitle, infoPrice);
  //APPEND ALL
  checkoutInfo.append(infoTop, infoBottom);
  card.append(checkoutImg, checkoutInfo);
  checkout.append(card);
};

export const removeHomeElements = () => {
  const carousell = qs(".carousel");
  const categories = qs(".categories-images");
  console.log(carousell, categories);
  carousell.style.display = "none";
  categories.style.display = "none";
  //carousell.classList.add("hide");
  //categories.classList.add("hide");
};

export const searchProd = () => {
  const str = navInput.value;
  if (!str) return;
  contentList.textContent = "";
  addSpinner();
  console.log("Hai scritto: " + str);
  GET(getAllProd).then((res) => {
    const newArr = res.filter(
      (el) => el.title.includes(str) || el.description.includes(str)
    );

    if (!newArr) {
      console.log("array vuoto");
      return;
    }
    // PRODUCTS = newArr;
    removeSpinner();
    newArr.map((el) => createProdEl(el));
    console.log(newArr);
  });
};

export const filterByCategory = (category) => {
  contentList.textContent = "";
  addSpinner();
  console.log(category);
  GET(getAllProd).then((res) => {
    const filteredArr = res.filter((el) => {
      return el.category.name == category;
    });
    if (!filteredArr) {
      console.log("array vuoto");
      return;
    }
    removeHomeElements();
    //console.log(filteredArr);
    //PRODUCTS = filteredArr;
    //remove cards
    removeSpinner();
    filteredArr.map((el) => {
      createProdEl(el);
    });
  });
};

const addSpinner = () => {
  const spinner = ce("div");
  spinner.className = "lds-spinner";
  for (let i = 0; i < 13; i++) {
    const div = ce("div");
    spinner.append(div);
  }
  contentList.append(spinner);
};

const removeSpinner = () => {
  const spinner = qs(".lds-spinner");
  if (!spinner) return;
  spinner.remove();
};

//CARRELLO

export const countCartEl = () => {
  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);
  if (!parsedData) return;
  return parsedData.length;
};
const addTotal = () => {
  const totalEl = qs(".checkout-pay");
  if (totalEl.classList.contains("hide")) return;
  totalEl.classList.remove("hide");
};
const removeTotal = () => {
  const totalEl = qs(".checkout-pay");
  totalEl.classList.add("hide");
};
const createEmptyCartText = () => {
  const checkout = qs(".checkout-cards");
  const textEl = ce("h3");
  textEl.className = "empty-cart";
  textEl.textContent = "Your cart is empty!";
  checkout.append(textEl);
};

export const loadCart = () => {
  //eliminare gli elementi già presenti dentro il carrello
  const allCards = document.querySelector(".checkout-cards");
  const totalAmount = document.querySelector(".pay-amount");
  allCards.textContent = "";
  totalAmount.textContent = "";
  let total = 0;
  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);

  if (parsedData) {
    parsedData.forEach((el) => {
      createCheckoutEl(el);
      total += el.price * el.quantity;
    });
  }
  if (total == 0) {
    createEmptyCartText();
    removeTotal();
    //remove checkout BTN
    //qs(".goto-payment").classList.add("hide");
  }
  /* if (!qs(".goto-payment").classList.contains("hide")) {
    qs(".goto-payment").classList.remove("hide");
  } */
  addTotal();

  totalAmount.textContent = `${total}€`;
  updateNavCheckoutNumber();

  /* let productsArr = localStorage.getItem(CART.key);
  const cartArray = JSON.parse(productsArr);
  cartArray.forEach((el) => createCheckoutEl(el)); */
};

const newCartProd = (item) => {
  const newItem = {
    id: item.id,
    title: item.title,
    quantity: 1,
    price: item.price,
    img: item.images[0],
  };
  return newItem;
};

/* const updateCheckoutElQuantity = (node) => {
  console.log(node);
  if (node.classList.contains("reduce")) {
  } else if (node.classList.contains("increase")) {
    console.log("increase");
    addToCart(item);
  } else {
    console.log("IDK");
  }
}; */

export const addToCart = (item) => {
  let CART = [];
  let newCartProduct;
  if (item.category) {
    newCartProduct = newCartProd(item);
  } else {
    newCartProduct = item;
  }

  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);
  //let id = parseInt(e.target.getAttribute("data-id"));

  //CREATE
  if (!LSData) {
    console.log("creo nuovo el LS");
    CART.push(newCartProduct);
    saveInLocalStorage(CART);
    loadCart();
    return;
  }
  const match = parsedData.findIndex((el) => el.id == item.id);
  //if not present
  //CREATE

  if (match == -1) {
    parsedData.push(newCartProduct);
    CART = parsedData;
    saveInLocalStorage(CART);
    loadCart();
    return;
  }
  // PUT  //if present aggiungere quantità
  console.log(parsedData[match].id);
  parsedData[match].quantity = parsedData[match].quantity + 1;
  saveInLocalStorage(parsedData);
  loadCart();

  console.log("aggiunto al carrello el", item.id);

  //TODO mostrare modale carrello
};
const removeOneFromCart = (id) => {
  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);

  const match = parsedData.findIndex((el) => el.id == id);
  console.log(match);
  if (match < 0) return;
  if (parsedData[match].quantity == 1) {
    removeFromCart(id);
    return;
  }

  parsedData[match].quantity = parsedData[match].quantity - 1;
  saveInLocalStorage(parsedData);
  loadCart();
  console.log(`valore dell'elemento ${id} diminuito di uno`);
};
export const removeFromCart = (id) => {
  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);

  const match = parsedData.findIndex((el) => el.id == id);
  if (match < 0) return;
  const newData = parsedData.filter((el) => el.id != id);
  console.log("elemento rimosso dal carrello");
  saveInLocalStorage(newData);
  loadCart();
};
const removeAllFromCart = () => {};

export const gotoCheckout = () => {
  const LSData = localStorage.getItem(LSKey);
  const parsedData = JSON.parse(LSData);
  console.log(parsedData);
  if (!parsedData || parsedData.length == 0) return;

  location.href = "./checkout.html";
};

const saveInLocalStorage = (jsondata) => {
  const parsedData = JSON.stringify(jsondata);
  //console.log(parsedData);
  localStorage.setItem(LSKey, parsedData);
};

const modifyNavProfile = (username) => {
  const profileBtn = qs(".profile");
  profileBtn.textContent = `ciao ${username}`;
};

//LOGIN

export const showLogin = () => {
  qs(".auth-modal").classList.toggle("hide");
};

export const sendLogin = (logindata) => {
  const USERSURL = "https://api.escuelajs.co/api/v1/users";
  //se va tutto bene
  const parsedData = JSON.stringify(logindata);

  localStorage.setItem(LSAuth, parsedData);
  qs(".auth-modal").classList.toggle("hide"); //nascondo la modale del form

  //modifico bottone profile
  modifyNavProfile(logindata.name);
};

export const checkAuth = () => {
  let authdata = localStorage.getItem(LSAuth);
  if (!authdata) return false;
  authdata = JSON.parse(authdata);
  //console.log("auth ", authdata);
  modifyNavProfile(authdata.name);
  updateNavCheckoutNumber();
  return true;
};

export const logOut = () => {
  localStorage.removeItem(LSAuth);
  console.log("Logout avvenuto con successo");
  location.reload();
};
