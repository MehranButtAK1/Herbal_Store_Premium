/* ===========================
   CONFIG / STATE
=========================== */
const LS_KEY = "products_v2";
const ADMIN_KEY = "isAdmin";
const THEME_KEY = "theme";
const ADMIN_PASSWORD = "123";

let products = JSON.parse(localStorage.getItem(LS_KEY)) || [
  {
    "id": 1,
    "name": "Marsea Herbal Oil (150 ml)",
    "category": "Hair Oil",
    "price": 800,
    "image": "/images/marsea-oil.jpg",
    "details": "100% pure herbal hair oil, crafted with coconut oil, castor oil, and olive oil, enriched with amla, bhringraj, fenugreek, hibiscus, neem, black seeds, aloe vera, and rosemary. Strengthens roots, promotes hair growth, soothes the scalp, and is suitable for all hair types."
  },
  // Add other objects here if needed
{
  "id": 2,
  "name": "Apricot Kernel Oil (100ml)",
  "category": "Hair Oil",
  "price": 700,
  "image": "/images/apricot.jpg",
  "details": "Lightweight oil rich in vitamins A, C, and E; nourishes the scalp, improves shine, and strengthens hair follicles. Ideal for daily use, sensitive scalps, and those seeking a non-greasy, hydrating treatment that promotes softness and reduces frizz."
}, 
  {
  "id": 3,
  "name": "Natural Teeth Whitening Powder",
  "category": "Teeth Whitener",
  "price": 500,
  "image": "/images/teeth-whitening-powder.jpg",
  "details": "Herbal formula for naturally whiter teeth without harsh chemicals, crafted with activated charcoal and gentle natural abrasives. Safe for daily use, removes stains, promotes gum health, and leaves a fresh, clean feel with a subtle mint flavor."
}, 
{
  "id": 4,
  "name": "Aloe Vera Skin Toner",
  "category": "Skin Toners",
  "price": 750,
  "image": "/images/face-toner.jpg",
  "details": "Hydrates skin and soothes irritation with a gentle, all-natural formula crafted from aloe vera, cucumber, honey, and rose water. Aloe vera calms redness, cucumber refreshes and tightens pores, honey locks in moisture, and rose water balances skin tone. Suitable for all skin types."
}, 
];

let isAdmin = localStorage.getItem(ADMIN_KEY) === "true";
let currentFilterCat = "All";
let currentSearch = "";

/* ===========================
   ELEMENTS
=========================== */
const navToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const darkToggle = document.getElementById("darkToggle");
const searchInput = document.getElementById("search");

const productList = document.getElementById("product-list");
const categoryButtons = document.getElementById("category-buttons");

const modal = document.getElementById("product-modal");
const modalClose = document.getElementById("modal-close");
const modalImg = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDetails = document.getElementById("modal-details");
const modalPrice = document.getElementById("modal-price");
const modalBuy = document.getElementById("modal-buy");
const modalQtyWrap = document.getElementById("modal-qty");
const modalQtyMinus = modalQtyWrap.querySelector(".qty-minus");
const modalQtyPlus = modalQtyWrap.querySelector(".qty-plus");
const modalQtySpan = modalQtyWrap.querySelector("span");

const adminGear = document.getElementById("admin-gear");
const adminSidebar = document.getElementById("admin-sidebar");
const adminClose = document.getElementById("admin-close");
const adminLoginWrap = document.getElementById("admin-login");
const adminPass = document.getElementById("admin-pass");
const adminLoginBtn = document.getElementById("admin-login-btn");
const productForm = document.getElementById("product-form");
const adminActionSection = document.getElementById("admin-action-section");
const adminExitBtn = document.getElementById("admin-exit");

const inpId = document.getElementById("prod-id");
const inpName = document.getElementById("prod-name");
const selCategory = document.getElementById("prod-category-select");
const inpNewCategory = document.getElementById("prod-category-new");
const inpPrice = document.getElementById("prod-price");
const inpImageURL = document.getElementById("prod-image-url");
const inpImageFile = document.getElementById("prod-image-file");
const inpDetails = document.getElementById("prod-details");
const formReset = document.getElementById("form-reset");

/* ===========================
   THEME
=========================== */
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if(saved === "dark") document.documentElement.classList.add("dark");
})();
darkToggle.addEventListener("click", ()=>{
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(THEME_KEY,
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
});

/* ===========================
   NAV MOBILE TOGGLE
=========================== */
navToggle.addEventListener("click", ()=> {
  navLinks.classList.toggle("show");
});

/* Active nav link highlight + close on click (mobile) */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
    navLinks.classList.remove("show");
  });
});

/* ===========================
   PERSISTENCE HELPERS
=========================== */
function saveProducts(){
  localStorage.setItem(LS_KEY, JSON.stringify(products));
}
function uniqueCategories(){
  return [...new Set(products.map(p => p.category))].sort();
}

/* ===========================
   CATEGORY CHIPS + DROPDOWN
=========================== */
function populateCategoryChips(active = "All"){
  currentFilterCat = active;
  categoryButtons.innerHTML = "";
  const cats = ["All", ...uniqueCategories()];
  cats.forEach(cat=>{
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = cat === active ? "active" : "";
    btn.addEventListener("click", ()=> {
      populateCategoryChips(cat);
      renderProducts();
    });
    categoryButtons.appendChild(btn);
  });
}
function populateCategoryDropdown(){
  selCategory.innerHTML = '<option value="">Select a category</option>';
  uniqueCategories().forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat; opt.textContent = cat;
    selCategory.appendChild(opt);
  });
}

/* ===========================
   SEARCH
=========================== */
searchInput.addEventListener("input", ()=>{
  currentSearch = (searchInput.value || "").toLowerCase();
  renderProducts();
});

/* ===========================
   RENDER PRODUCTS
=========================== */
function filteredList(){
  let list = products;

  // category
  if(currentFilterCat !== "All"){
    list = list.filter(p => p.category === currentFilterCat);
  }
  // search
  if(currentSearch){
    list = list.filter(p =>
      p.name.toLowerCase().includes(currentSearch) ||
      p.category.toLowerCase().includes(currentSearch) ||
      (p.details||"").toLowerCase().includes(currentSearch)
    );
  }
  return list;
}

function renderProducts(){
  productList.innerHTML = "";
  const list = filteredList();

  list.forEach((product)=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", product.id);

    card.innerHTML = `
      <div class="card-actions" style="${isAdmin?'':'display:none'}">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn danger"><i class="fa-solid fa-trash"></i></button>
      </div>

      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <h3 class="title">${product.name}</h3>
      <div class="price">Rs ${Number(product.price).toLocaleString()}</div>

      <div class="quantity-control">
        <button class="qty-minus">-</button>
        <span>1</span>
        <button class="qty-plus">+</button>
      </div>

      <button class="buy-now">Buy on WhatsApp</button>
    `;

    // Image fallback if wrong path/URL
    const img = card.querySelector("img");
    img.addEventListener("error", ()=>{
      img.src = "images/placeholder.png"; // add a placeholder.png if you want
      img.alt = product.name + " (image missing)";
    });

    // Open modal on image/title click
    card.querySelector(".product-image").addEventListener("click", ()=> showDetails(product));
    card.querySelector(".title").addEventListener("click", ()=> showDetails(product));

    // Quantity controls
    const qtySpan = card.querySelector(".quantity-control span");
    card.querySelector(".qty-minus").addEventListener("click", ()=>{
      qtySpan.textContent = Math.max(1, parseInt(qtySpan.textContent) - 1);
    });
    card.querySelector(".qty-plus").addEventListener("click", ()=>{
      qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
    });

    // Buy on WhatsApp
    card.querySelector(".buy-now").addEventListener("click", ()=>{
      const qty = parseInt(qtySpan.textContent);
      const message = `Hello, I want to buy ${qty} x ${product.name} for Rs ${product.price * qty}`;
      window.open(`https://wa.me/923115121207?text=${encodeURIComponent(message)}`, "_blank");
    });

    // Edit/Delete (admin)
    const editBtn = card.querySelector(".edit-btn");
    const delBtn = card.querySelector(".delete-btn");
    if(editBtn){
      editBtn.addEventListener("click", ()=> startEdit(product));
    }
    if(delBtn){
      delBtn.addEventListener("click", ()=>{
        if(confirm(`Delete "${product.name}"?`)){
          products = products.filter(p => p.id !== product.id);
          saveProducts();
          populateCategoryChips(currentFilterCat);
          renderProducts();
          populateCategoryDropdown();
        }
      });
    }

    productList.appendChild(card);
  });
}

/* ===========================
   MODAL
=========================== */
let modalProduct = null;

function showDetails(product){
  modalProduct = product;
  modalImg.src = product.image;
  modalTitle.textContent = product.name;
  modalDetails.textContent = product.details;
  modalPrice.textContent = `Rs ${Number(product.price).toLocaleString()}`;
  modalQtySpan.textContent = "1";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });
window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeModal(); });
function closeModal(){
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modalProduct = null;
}

// modal qty + buy
modalQtyMinus.addEventListener("click", ()=>{
  modalQtySpan.textContent = Math.max(1, parseInt(modalQtySpan.textContent) - 1);
});
modalQtyPlus.addEventListener("click", ()=>{
  modalQtySpan.textContent = parseInt(modalQtySpan.textContent) + 1;
});
modalBuy.addEventListener("click", ()=>{
  if(!modalProduct) return;
  const qty = parseInt(modalQtySpan.textContent);
  const message = `Hello, I want to buy ${qty} x ${modalProduct.name} for Rs ${modalProduct.price * qty}`;
  window.open(`https://wa.me/923115121207?text=${encodeURIComponent(message)}`, "_blank");
});

/* ===========================
   ADMIN SIDEBAR OPEN/CLOSE
=========================== */
adminGear.addEventListener("click", ()=>{
  adminSidebar.classList.add("open");
  adminSidebar.setAttribute("aria-hidden","false");
  refreshAdminUI();
});
adminClose.addEventListener("click", ()=>{
  adminSidebar.classList.remove("open");
  adminSidebar.setAttribute("aria-hidden","true");
});
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape") {
    adminSidebar.classList.remove("open");
    adminSidebar.setAttribute("aria-hidden","true");
  }
});

/* ===========================
   ADMIN LOGIN / EXIT
=========================== */
function refreshAdminUI(){
  if(isAdmin){
    adminLoginWrap.style.display = "none";
    productForm.style.display = "flex";
    adminActionSection.style.display = "block";
    document.querySelectorAll(".card-actions").forEach(el => el.style.display = "flex");
  }else{
    adminLoginWrap.style.display = "flex";
    productForm.style.display = "none";
    adminActionSection.style.display = "none";
    document.querySelectorAll(".card-actions").forEach(el => el.style.display = "none");
  }
}

adminLoginBtn.addEventListener("click", ()=>{
  const val = (adminPass.value || "").trim();
  if(val === ADMIN_PASSWORD){
    isAdmin = true;
    localStorage.setItem(ADMIN_KEY, "true");
    adminPass.value = "";
    refreshAdminUI();
  }else{
    alert("Incorrect password!");
  }
});

adminExitBtn && adminExitBtn.addEventListener("click", ()=>{
  isAdmin = false;
  localStorage.setItem(ADMIN_KEY, "false");
  refreshAdminUI();
});

/* ===========================
   ADD / EDIT PRODUCT
=========================== */
let editingId = null;

productForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!isAdmin){ alert("Login as admin first."); return; }

  const idVal = inpId.value ? parseInt(inpId.value) : null;
  const name = inpName.value.trim();
  const categorySelect = selCategory.value;
  const newCategory = inpNewCategory.value.trim();
  const price = parseFloat(inpPrice.value);
  const details = inpDetails.value.trim();
  const url = inpImageURL.value.trim();
  const file = inpImageFile.files[0];

  if(!name || (!categorySelect && !newCategory) || isNaN(price) || !details || (!url && !file)){
    alert("Fill all required fields and provide an image (URL/local path or upload).");
    return;
  }
  const category = newCategory || categorySelect;

  let imageData = url;
  if(file){
    imageData = await fileToBase64(file); // stored as base64
  }

  if(idVal || editingId){
    // Update existing
    const idToUse = idVal || editingId;
    const idx = products.findIndex(p=> p.id === idToUse);
    if(idx !== -1){
      products[idx] = { id: idToUse, name, category, price, image: imageData, details };
    }
    editingId = null;
  }else{
    // Create new
    const newId = products.length ? Math.max(...products.map(p=>p.id||0))+1 : 1;
    products.push({ id:newId, name, category, price, image:imageData, details });
  }

  saveProducts();
  productForm.reset();
  inpId.value = "";
  selCategory.value = "";
  inpNewCategory.value = "";

  populateCategoryDropdown();
  populateCategoryChips(currentFilterCat);
  renderProducts();

  alert("Saved!");
});

formReset.addEventListener("click", ()=>{
  editingId = null;
  productForm.reset();
  inpId.value = "";
  selCategory.value = "";
});

/* Start editing a product */
function startEdit(product){
  editingId = product.id;
  inpId.value = product.id;
  inpName.value = product.name;
  inpPrice.value = product.price;
  inpDetails.value = product.details;

  // category: select if exists, otherwise put into new
  if(uniqueCategories().includes(product.category)){
    selCategory.value = product.category;
    inpNewCategory.value = "";
  }else{
    selCategory.value = "";
    inpNewCategory.value = product.category;
  }
  // image URL field gets current value (if it was base64 user may choose to overwrite)
  inpImageURL.value = product.image.startsWith("data:") ? "" : product.image;

  // open admin panel
  adminSidebar.classList.add("open");
  refreshAdminUI();
}

/* Base64 helper */
function fileToBase64(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ===========================
   INIT
=========================== */
function init(){
  populateCategoryDropdown();
  populateCategoryChips("All");
  renderProducts();
  refreshAdminUI();
}
init();

//======For-Home&About-Animation===============//
// 🌟 Scroll Fade-In Effect
document.addEventListener("scroll", () => {
  document.querySelectorAll(".fade-in").forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight - 100) {
      section.classList.add("show");
    }
  });
});

// Trigger animation if sections are already in view
document.dispatchEvent(new Event("scroll"));