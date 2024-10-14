
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    let productIndex = cart.findIndex(item => item.prodId === product.prodId);

    if (productIndex !== -1) {
        // If product is already in the cart, increase quantity (optional)
        cart[productIndex].quantity += 1;
    } else {
        // If product is not in the cart, add it
        product.quantity = 1;
        cart.push(product);
    }
    alert("Đã thêm vào giỏ hàng thành công!")
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.setItem('cart', '[]');
}

function removeProductById(prodId) {
    // Lấy dữ liệu giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Lọc ra các sản phẩm không có id tương ứng
    cart = cart.filter(product => product.prodId !== prodId);

    // Cập nhật lại giỏ hàng trong localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    renderCart();
    updateTotal();
    updateCartNumber();

}

// function updateProductQuantity(prodId, newQuantity) {
//     // Lấy dữ liệu giỏ hàng từ localStorage
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     // Tìm sản phẩm và cập nhật số lượng
//     cart.forEach(product => {
//         if (product.prodId === prodId) {
//             product.quantity = newQuantity; // Cập nhật số lượng mới
//         }
//     });

//     // Cập nhật lại giỏ hàng trong localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
// }
// function removeProductById(prodId) {
//     // Lấy dữ liệu giỏ hàng từ localStorage
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     // Lọc ra các sản phẩm không có id tương ứng
//     cart = cart.filter(product => product.prodId !== prodId);

//     // Cập nhật lại giỏ hàng trong localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
// }

function updateProductQuantity(prodId, newQuantity) {
    // Lấy dữ liệu giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tìm sản phẩm và cập nhật số lượng
    cart.forEach(product => {
        if (product.prodId === prodId) {
            if (newQuantity == 0) {
                // confirm("Bạn có muốn xóa không")
                cart = cart.filter(product => product.prodId !== prodId);
                return;
            }
            product.quantity = newQuantity; // Cập nhật số lượng mới
            
        }
    });

    // Cập nhật lại giỏ hàng trong localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    // Gọi hàm getCart để lấy dữ liệu giỏ hàng
    let cart = getCart(); // Giả sử getCart trả về danh sách sản phẩm
    let cartHtml = '';
    let subtotal = 0;

    if (cart.length == 0) {
        cartHtml = `
        <tr>
            <td colspan="5" style="text-align: center;">
                <h2 style="color: #888; font-weight: 400;">Giỏ hàng của bạn hiện đang trống</h2>
                <p style="color: #aaa;">Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
            </td>
        </tr>`;
    }
    else {
        // Duyệt qua danh sách sản phẩm và tạo HTML cho mỗi sản phẩm
        cart.forEach(function (product) {
            const productTotal = product.price * product.quantity;
            subtotal += productTotal;

            cartHtml += `
            <tr>
                <td class="shoping__cart__item">
                    <img src="${product.image}" alt="${product.prodName}" width="100" height="100">
                    <h5>${product.prodName}</h5>
                </td>
                <td class="shoping__cart__price">
                    ${parseInt(product.price).toLocaleString('vi-VN')} VND
                </td>
                <td class="shoping__cart__quantity">
                    <div class="quantity">
                        <div class="pro-qty" prod-id="${product.prodId}">
                            <input type="text" value="${product.quantity}">
                        </div>
                    </div>
                </td>
                <td class="shoping__cart__total">
                    ${(productTotal).toLocaleString('vi-VN')} VND
                </td>
                <td class="shoping__cart__item__close">
                    <span class="icon_close" prod-id="${product.prodId}"></span>
                </td>
            </tr>
        `;
        });
    }

    // Gắn HTML vào phần tử có id là #cart-list
    $('#cart-list').html(cartHtml);

    
}

function updateTotal() {
    let cart = getCart();
    var subtotal = 0;

    if (cart.length > 0) {
        cart.forEach(function (product) {
            const productTotal = product.price * product.quantity;
            subtotal += productTotal;
        });
    }
    let total = subtotal
    $('.shoping__checkout ul li:nth-child(1) span').text(subtotal.toLocaleString('vi-VN') + ' VND');
    $('.shoping__checkout ul li:nth-child(2) span').text(total.toLocaleString('vi-VN') + ' VND');
}

function updateCartNumber() {
    $('.cart-number').text(getCart().map(e => e.quantity).reduce((a, b) => a + b, 0))
}
