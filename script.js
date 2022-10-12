const cartList = document.querySelector('.cart__items');
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const itemSection = document.querySelector('.items');

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itemSection.appendChild(section);

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const parse = (number) => Math.round(((number)) * 100) / 100; 

const sumTotalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let totalSum = 0;
  cartItem.forEach((get) => {
    const getTotal = parseFloat(get.innerText.split('$')[1]);
    totalSum += getTotal;
    parse(totalSum);
  });
  total.innerText = (totalSum);
  return totalSum;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  sumTotalPrice();
  saveCartItems(cartList.innerHTML);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  getSavedCartItems();
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const returnAction = async (event) => {
  const childFirst = (event.target).parentNode;
  const id = (childFirst.firstChild).textContent;
  const product = await fetchItem(id);
  
  cartList.appendChild(createCartItemElement(product));
  sumTotalPrice();
  saveCartItems(cartList.innerHTML);
};

function buttonAction() {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((get) => {
    get.addEventListener('click', returnAction);
  });
}

function loadingMessage() {
  const loadingPage = document.querySelector('.items');
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'carregando...';
  loadingPage.appendChild(loading);
  return loading;
}

function loadingMessageDelete() {
  const loadingMessageDel = document.querySelector('.items').firstChild.remove();
  return loadingMessageDel;
}

const addProducts = async () => {
  loadingMessage();
  const products = await fetchProducts('computador');
  const sku = products.results.map((get) => {
    const produto = {
      sku: get.id,
      name: get.title,
      image: get.thumbnail,
    };
    return produto;
  });
  sku.forEach((product) => {
    createProductItemElement(product);
  });
  loadingMessageDelete();
  buttonAction();
};

async function clearCart() {
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', () => {
    document.querySelectorAll('.cart__item').forEach((e) => e.remove());
    sumTotalPrice();
    localStorage.removeItem('cartItems');
  });
}

function getLocalSaved() {
  cartList.innerHTML = getSavedCartItems();

  cartList.childNodes.forEach((get) => {
    get.addEventListener('click', cartItemClickListener);
  });
  sumTotalPrice();
}

window.onload = () => {
  clearCart();
  addProducts();
  getLocalSaved();
};