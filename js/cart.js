
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function getDiscount() {
    if (localStorage.getItem('discount')) return JSON.parse(localStorage.getItem('discount')) || {}
    return 0;
};


function getGiamgia(giagoc) {
    var giamGia = getDiscount().giamGia || 0;
    if (typeof giamGia === 'string' && giamGia.includes("%")) {
        giamGia = giagoc * Number(giamGia.replace("%", "")) / 100;
    } else if (typeof giamGia === 'number') {
        giamGia = giamGia; // nếu đã là số thì không cần xử lý
    }
    return giamGia;
}

function deleteCoupon() {
    localStorage.setItem('discount', '')
    // Xóa nội dung của ô input mã giảm giá
    document.getElementById('coupon-code').value = "";
    updateTotal();
    document.getElementById('discount-message').textContent = '';


}

// Function to add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    console.log("Adding product to cart:", product);

    // Check if the product is already in the cart
    let productIndex = cart.findIndex(item => item.prodId === product.prodId);

    if (productIndex !== -1) {
        // If product is already in the cart, increase quantity (optional)
        // cart[productIndex].quantity += 1;
        cart[productIndex].quantity += product.quantity; // Tăng số lượng bằng số lượng nhập từ ô input

    } else {
        // If product is not in the cart, add it
        // product.quantity = 1;
        cart.push(product);
    }
    alert("Đã thêm vào giỏ hàng thành công!")
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('discount'); // Xóa mã giảm giá
    renderCart();
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

function getTotalPrice() {
    return getCart().map((e) => Number(e.price * e.quantity)).reduce((a, b) => a + b, 0);
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
                            <span class="dec qtybtn">-</span>
                            <input type="text" value="${product.quantity}">
                            <span class="inc qtybtn">+</span>
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
    var proQty = $('.pro-qty');
    proQty.on('click', '.qtybtn', function () {
        console.log(`${onQtyButtonClick}`)
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
        onQtyButtonClick($button);

    });


}

function updateTotal() {
    let total = getTotalPrice()
    let subtotal = -getGiamgia(total);
    $('.shoping__checkout ul li:nth-child(1) span').text(subtotal.toLocaleString('vi-VN') + ' VND');
    $('.shoping__checkout ul li:nth-child(2) span').text((total + subtotal).toLocaleString('vi-VN') + ' VND');
}

// function updateTotal() {
//     let total = getTotalPrice(); // Tổng tiền trước giảm giá
//     let discountAmount = getGiamgia(total); // Giá trị giảm giá
//     let finalTotal = total - discountAmount; // Tính tổng sau giảm giá

//     // Cập nhật hiển thị trên giao diện
//     $('.shoping__checkout ul li:nth-child(1) span').text(discountAmount.toLocaleString('vi-VN') + ' VND'); // Hiển thị số tiền giảm giá
//     $('.shoping__checkout ul li:nth-child(2) span').text(finalTotal.toLocaleString('vi-VN') + ' VND'); // Hiển thị tổng sau giảm giá
// }

function updateCartNumber() {
    $('.cart-number').text(getCart().map(e => e.quantity).reduce((a, b) => a + b, 0))
}

$(document).ready(function () {
    $('#discount-form').submit(function (e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Lấy mã giảm giá từ input
        const couponCode = $('#coupon-code').val();

        // Kiểm tra xem người dùng đã nhập mã chưa
        if (!couponCode) {
            $('#discount-message').text("Vui lòng nhập mã giảm giá.");
            return;
        }

        // Gửi yêu cầu AJAX để kiểm tra mã giảm giá
        $.ajax({
            url: `http://localhost:8080/api/giamgia/code?maGiamGia=${couponCode}`,    // URL đến API
            type: 'GET', // Loại yêu cầu
            success: function (response) {
                // Tìm mã giảm giá trong kết quả trả về
                console.log(response)
                let discount = response.giamGia
                if (!discount) {
                    $('#discount-message').text("Mã giảm giá không hợp lệ.");
                    return;
                }

                // Kiểm tra số lần sử dụng của mã giảm giá
                if (response.soLansd > 0) {
                    localStorage.setItem('discount', JSON.stringify(response));
                    $('#discount-message').text("Áp dụng mã giảm giá thành công")
                    updateTotal();

                } else {
                    $('#discount-message').text("Mã giảm giá này đã hết lượt sử dụng.");
                }
            },
            error: function () {
                $('#discount-message').text("Vui lòng kiểm tra lại");
            }
        });
    });
});
