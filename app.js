let products = JSON.parse(localStorage.getItem("products")) || [];

let bill = JSON.parse(localStorage.getItem("bill")) || [];

let settings = JSON.parse(localStorage.getItem("settings")) || {
  shopName:"NOOR E ARSH",
  address:"Habshiguda, Hyderabad",
  phone:"9876543210",
  footer:"Thank You Visit Again",
  instagram:"@shopname"
};

function saveProducts(){
  localStorage.setItem("products",JSON.stringify(products));
}

function saveBill(){
  localStorage.setItem("bill",JSON.stringify(bill));
}

function saveSettingsData(){
  localStorage.setItem("settings",JSON.stringify(settings));
}

/* DATE TIME */

const dateTime = document.getElementById("dateTime");

if(dateTime){

  setInterval(()=>{

    let now = new Date();

    dateTime.innerText = now.toLocaleString();

  },1000);

}

/* BILL NUMBER */

const billNumber = document.getElementById("billNumber");

if(billNumber){
  billNumber.innerText = "Bill #" + Math.floor(Math.random()*99999);
}

/* ADD PRODUCT */

function addProduct(){

  let id = document.getElementById("product_id").value;
  let name = document.getElementById("product_name").value;
  let price = document.getElementById("product_price").value;

  if(!id || !name || !price){
    alert("Fill all fields");
    return;
  }

  products.push({
    id,
    name,
    price:Number(price)
  });

  saveProducts();

  renderProducts();

  alert("Product Added");

}

function renderProducts(){

  const table = document.getElementById("productTable");

  if(!table) return;

  let search = document.getElementById("searchInput").value.toLowerCase();

  table.innerHTML = "";

  products
  .filter(p=>p.name.toLowerCase().includes(search))
  .forEach((product,index)=>{

    table.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>₹${product.price}</td>
        <td>
          <button class="delete-btn" onclick="deleteProduct(${index})">
            Delete
          </button>
        </td>
      </tr>
    `;

  });

}

function deleteProduct(index){

  products.splice(index,1);

  saveProducts();

  renderProducts();

}

/* QR SCANNER */

let scanner;

function openScanner(){

  document.getElementById("scannerModal").style.display = "flex";

  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode:"environment" },
    {
      fps:10,
      qrbox:250
    },
    (decodedText)=>{

      addToBill(decodedText);

      navigator.vibrate(200);

      closeScanner();

    }
  );

}

function closeScanner(){

  document.getElementById("scannerModal").style.display = "none";

  if(scanner){
    scanner.stop();
  }

}

/* ADD TO BILL */

function addToBill(productId){

  let product = products.find(p=>p.id == productId);

  if(!product){
    alert("Product Not Found");
    return;
  }

  let existing = bill.find(item=>item.id == productId);

  if(existing){

    existing.qty++;

  }else{

    bill.push({
      ...product,
      qty:1
    });

  }

  saveBill();

  renderBill();

}

/* RENDER BILL */

function renderBill(){

  const container = document.getElementById("billItems");

  if(!container) return;

  if(bill.length === 0){

    container.innerHTML = `
      <div class="empty-state">
        <h3>No Products Added</h3>
        <p>Scan QR Or Enter Product Code</p>
      </div>
    `;

    updateTotals();

    return;
  }

  container.innerHTML = `

    <div class="bill-table">

      <div class="bill-table-header">
        <span>Product</span>
        <span>Qty</span>
        <span>Price</span>
        <span></span>
      </div>

      <div id="billRows"></div>

    </div>

  `;

  const rows = document.getElementById("billRows");

  bill.forEach((item,index)=>{

    rows.innerHTML += `

      <div class="bill-row-item">

        <div class="product-name">
          ${item.name}
        </div>

        <div class="qty-controls">

          <button onclick="decreaseQty(${index})">
            -
          </button>

          <span>${item.qty}</span>

          <button onclick="increaseQty(${index})">
            +
          </button>

        </div>

        <div class="product-price">
          ₹${item.price * item.qty}
        </div>

        <button class="delete-icon" onclick="removeItem(${index})">
          🗑
        </button>

      </div>

    `;

  });

  updateTotals();

}

function updateQty(index,qty){

  bill[index].qty = Number(qty);

  saveBill();

  renderBill();

}

function removeItem(index){

  bill.splice(index,1);

  saveBill();

  renderBill();

}

function increaseQty(index){

  bill[index].qty++;

  saveBill();

  renderBill();

}

function decreaseQty(index){

  bill[index].qty--;

  if(bill[index].qty <= 0){

    bill.splice(index,1);

  }

  saveBill();

  renderBill();

}

/* TOTALS */

function updateTotals(){

  let subtotal = bill.reduce((a,b)=>a + (b.price * b.qty),0);

  let tax = 0;

  let total = subtotal + tax;

  if(document.getElementById("subtotal")){
    document.getElementById("subtotal").innerText = "₹" + subtotal;
    document.getElementById("tax").innerText = "₹" + tax;
    document.getElementById("grandTotal").innerText = "₹" + total;
  }

  generateReceipt();

}

/* RECEIPT */

function generateReceipt(){

  let receiptItems = document.getElementById("receiptItems");

  if(!receiptItems) return;

  receiptItems.innerHTML = "";

  let total = 0;

  bill.forEach(item=>{

    let itemTotal = item.price * item.qty;

    total += itemTotal;

    receiptItems.innerHTML += `

  <div class="receipt-item">

    <span>
      ${item.name} x${item.qty}
    </span>

    <span>
      ₹${itemTotal}
    </span>

  </div>

`;

  });

  document.getElementById("receiptTotal").innerText = "₹" + total;

  document.getElementById("receiptShopName").innerText = settings.shopName;
  document.getElementById("receiptAddress").innerText = settings.address;
  document.getElementById("receiptPhone").innerText = settings.phone;
  document.getElementById("receiptFooter").innerText = settings.footer;
  document.getElementById("receiptInstagram").innerText = settings.instagram;

}

/* PRINT */

function printBill(){

  generateReceipt();

  window.print();

}

/* CLEAR BILL */

function clearBill(){

  bill = [];

  saveBill();

  renderBill();

}

/* SETTINGS */

function saveSettings(){

  settings = {
    shopName:document.getElementById("shop_name").value,
    address:document.getElementById("shop_address").value,
    phone:document.getElementById("shop_phone").value,
    footer:document.getElementById("shop_footer").value,
    instagram:document.getElementById("shop_instagram").value
  };

  saveSettingsData();

  alert("Settings Saved");

}

function manualAddProduct(){

  let code = document.getElementById("manualCode").value;

  if(!code) return;

  addToBill(code);

  document.getElementById("manualCode").value = "";

}

function loadSettings(){

  if(document.getElementById("shop_name")){

    document.getElementById("shop_name").value = settings.shopName;
    document.getElementById("shop_address").value = settings.address;
    document.getElementById("shop_phone").value = settings.phone;
    document.getElementById("shop_footer").value = settings.footer;
    document.getElementById("shop_instagram").value = settings.instagram;

  }

}

/* INIT */

renderProducts();
renderBill();
loadSettings();
generateReceipt();