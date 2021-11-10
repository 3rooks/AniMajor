// ICON MENU "JQUERY SELECTORES"
const ICON_MENU = $("#icon-menu");
const MAIN_MENU = $("#main-menu");
ICON_MENU[0].addEventListener("click", () => {
  MAIN_MENU[0].classList.toggle("menu-show");
});

// API
window.addEventListener("DOMContentLoaded", () => {
  fetch("https://ghibliapi.herokuapp.com/films/")
    .then((res) => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
    .then((res) => res.json())
    .then((res) => HTML_TEMPLATE(res));
});

// EL BODY DE LA PAGINA EN RESPUESTA A LA API
const MAIN = document.querySelector("main");
const HTML_TEMPLATE = (res) => {
  for (const item of res) {
    const CARDS = document.createElement("div");
    CARDS.classList.add("card-main");
    MAIN.appendChild(CARDS);
    CARDS.innerHTML = `<section class="card">
                        <img src="${item.image}"/>
                        <div class="info">
                        <p><b>EN-Title:</b> ${item.title}</p>
                        <p><b>JP-Title:</b> ${item.original_title_romanised}</p>
                        <p><b>Original Title:</b> ${item.original_title}</p>
                        <p><b>Director:</b> ${item.director}</p>
                        <p><b>Producer:</b> ${item.producer}</p>
                        <p><b>Price:</b> $${item.running_time}</p>
                        <button id="${item.running_time}" class="btn-add-cart">Add to Cart</button>
                        </div>
                      </section>`;
  }
  ADD_TO_CART();
  SHOW_CART();
};

/***** FUNCION AGRAGAR AL CARRITO *****/
const ADD_TO_CART = () => {
  // CLASE CONSTRUCTORA PARA GUARDAR LOS PRODUCTOS POR NOMBRE Y PRECIO
  class PRODUCTS {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  }

  // ARRAY + SESSIONSTORAGE DONDE SE ALMACENAN LOS PRODUCTOS ELEGIDOS
  let PRODUCTS_IN_CART = [];
  sessionStorage.setItem("CART", JSON.stringify(PRODUCTS_IN_CART));

  // OBTENIENDO TODOS LOS BOTONES DEL DOM DE LOS PRODUCTOS
  const BTNS = document.querySelectorAll(".btn-add-cart");

  // ASIGNANDO A CADA BOTON CLAVE VALOR Y PUSHEANDOLO EN EL SESSIONSTORAGE
  for (const btn of BTNS) {
    btn.addEventListener("click", (e) => {
      PRODUCTS_IN_CART.push(
        new PRODUCTS(
          e.target.parentElement.children[0].childNodes[1].textContent,
          e.target.id
        )
      );
      sessionStorage.setItem("CART", JSON.stringify(PRODUCTS_IN_CART));
    });
  }
};

/***** FUNCION MOSTRAR EL CARRITO *****/
const SHOW_CART = () => {
  // OBTENIENDO EL ICONO DEL CARRITO Y SU CONTENIDO DEL DOM
  const BODY_CART = document.querySelector("#cart-buy");
  const BTN_ICON_CART = document.querySelector("#cart");

  // CREANDO UNA VARIABLE DONDE MOSTRAMOS EL TOTAL DE LOS PRODUCTOS SELECCIONADOS
  let showTotalPrice = document.createElement("p");
  showTotalPrice.innerHTML = "";

  // EVENTO ESCUCHA AL ICONO DEL CARRITO SELECCIONADO
  BTN_ICON_CART.addEventListener("click", () => {
    BODY_CART.classList.toggle("cart-buy-show");
    const LIST_PRODUCTS = document.querySelector("#list-products");
    LIST_PRODUCTS.innerHTML = "";

    // OBTENIENDO LOS PRODUCTOS ALMACENADOS EN EL SESSIONSTORAGE
    const GET_CART = JSON.parse(sessionStorage.getItem("CART"));

    // ARMANDO UNA LISTA DE LOS PRODUCTOS SELECCIONADOS
    for (const item of GET_CART) {
      const ITEM_PRODUCT = document.createElement("li");
      LIST_PRODUCTS.appendChild(ITEM_PRODUCT);
      ITEM_PRODUCT.innerHTML = `<p>Article:${item.name}</p>
                                <p>Price: ${item.price}$</p>`;
    }

    // OBTENIDO EL PRECIO DE TODOS LOS PRODUCTOS SELECCIONADOS Y AGREGARLO AL DOM
    let totalPrice = 0;
    GET_CART.forEach((elem) => {
      totalPrice += Number(elem.price);
    });
    BODY_CART.appendChild(showTotalPrice);
    showTotalPrice.innerHTML = `<i>> Total Price: ${totalPrice}$</i>`;
  });
};
