
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
    // document.getElementById('coupon-code').value = '';
    updateTotal();
    // document.getElementById('discount-message').textContent = '';

}

function deleteCoupon2() {
    localStorage.setItem('discount', '')
    // Xóa nội dung của ô input mã giảm giá
    document.getElementById('coupon-code').value = "";
    updateTotal();
    document.getElementById('discount-message').textContent = '';

}


// function addToCart(product) {

//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     console.log("Adding product to cart:", product);
// // Kiểm tra từng sản phẩm trong giỏ hàng
// // cart.forEach(item => {
// //     console.log("ID sản phẩm:", item.idSP); })
//     // Check if the product is already in the cart
//     let productIndex = cart.findIndex(item => item.prodId === product.prodId);

//     if (productIndex !== -1) {
//         // If product is already in the cart, increase quantity (optional)
//         // cart[productIndex].quantity += 1;
//         cart[productIndex].quantity += product.quantity; // Tăng số lượng bằng số lượng nhập từ ô input

//     } else {
//         // If product is not in the cart, add it
//         // product.quantity = 1;
//         cart.push(product);
//         // cart.push({
//         //     idSP: product.idSP, // Sử dụng product.id thay vì product.idSP
//         //     prodId: product.maSanPham, // Mã sản phẩm
//         //     prodName: product.tenSanPham, // Tên sản phẩm
//         //     price: product.gia, // Giá sản phẩm
//         //     quantity: 1, // Số lượng
//         //     image: product.anh, // Hình ảnh sản phẩm
//         // });
//     }

//     alert("Đã thêm vào giỏ hàng thành công!")
//     // Save updated cart to localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
//     console.log("Giỏ hàng sau khi thêm:", cart); // In ra giỏ hàng sau khi thêm

// }
function addToCart(product) {
    // Lấy giỏ hàng từ localStorage (nếu có)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    console.log("Adding product to cart:", product);

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    let productIndex = cart.findIndex(item => item.prodId === product.prodId);

    // Kiểm tra nếu số lượng sản phẩm nhập vào vượt quá số lượng tồn kho
    if (product.quantity > product.stock) {
        alert(`Sản phẩm "${product.prodName}" không đủ số lượng trong kho. Tồn kho hiện tại: ${product.stock}`);
        return; // Dừng việc thêm sản phẩm vào giỏ hàng nếu số lượng vượt quá tồn kho
    }

    if (productIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng của sản phẩm đó
        if (cart[productIndex].quantity + product.quantity > product.stock) {
            alert(`Không thể thêm vào giỏ, số lượng sản phẩm "${product.prodName}" vượt quá số lượng tồn kho. Tồn kho: ${product.stock}`);
            return;
        }
        cart[productIndex].quantity += product.quantity; // Tăng số lượng
    } else {
        // Nếu chưa có trong giỏ, thêm sản phẩm vào giỏ
        cart.push(product);
    }

    // Lưu giỏ hàng lại vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Giỏ hàng sau khi thêm:", cart); // In giỏ hàng ra console

    // Thông báo thêm thành công
    alert("Đã thêm vào giỏ hàng thành công!");
}

function clearCart() {
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('discount'); // Xóa mã giảm giá
    updateTotal();
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
                    <h5>${product.prodName}
                        <small class="form-text text-muted">Chỉ Còn ${product.stock} Sản Phẩm</small>
                    </h5>
               
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

        // Kiểm tra số lượng tồn kho
        var productId = $button.parent().attr('prod-id');
        var product = cart.find(item => item.prodId === productId);

        if (newVal > product.stock) {
            alert(`Không thể thêm số lượng này. Tồn kho hiện tại của sản phẩm "${product.prodName}" là ${product.stock}.`);
            return; // Không cập nhật số lượng nếu vượt quá tồn kho
        }

        $button.parent().find('input').val(newVal);
        onQtyButtonClick($button);

    });


}

// function updateTotal() {
//     let total = getTotalPrice()
//     let subtotal = -getGiamgia(total);



//     $('.shoping__checkout ul li:nth-child(1) span').text(subtotal.toLocaleString('vi-VN') + ' VND');
//     $('.shoping__checkout ul li:nth-child(2) span').text((total + subtotal).toLocaleString('vi-VN') + ' VND');


// }

// function updateTotal() {
//     let total = getTotalPrice(); // Tổng tiền trước giảm giá
//     let discountAmount = getGiamgia(total); // Giá trị giảm giá
//     let finalTotal = total - discountAmount; // Tính tổng sau giảm giá

//     // Cập nhật hiển thị trên giao diện
//     $('.shoping__checkout ul li:nth-child(1) span').text(discountAmount.toLocaleString('vi-VN') + ' VND'); // Hiển thị số tiền giảm giá
//     $('.shoping__checkout ul li:nth-child(2) span').text(finalTotal.toLocaleString('vi-VN') + ' VND'); // Hiển thị tổng sau giảm giá
// }

    function updateTotal() {
        let total = getTotalPrice(); // Tổng giá ban đầu
        let discount = getGiamgia(total); // Tính số tiền giảm giá
        let subtotal = - discount; // Tiền giảm giá để hiển thị
        total = Math.max(total - discount, 0); // Giá sau khi giảm, đảm bảo >= 0

        // Hiển thị tiền giảm giá
        $('.shoping__checkout ul li:nth-child(1) span').text(subtotal.toLocaleString('vi-VN') + ' VND');

        // Hiển thị giá sau khi giảm
        $('.shoping__checkout ul li:nth-child(2) span').text(total.toLocaleString('vi-VN') + ' VND');
    }


function updateCartNumber() {
    $('.cart-number').text(getCart().map(e => e.quantity).reduce((a, b) => a + b, 0))
}

// $(document).ready(function () {
//     $('#discount-form').submit(function (e) {
//         e.preventDefault(); // Ngăn chặn hành vi mặc định của form

//         // Lấy mã giảm giá từ input
//         const couponCode = $('#coupon-code').val();

//         // Kiểm tra xem người dùng đã nhập mã chưa
//         if (!couponCode) {
//             $('#discount-message').text("Vui lòng nhập mã giảm giá.");
//             return;
//         }

//         // Gửi yêu cầu AJAX để kiểm tra mã giảm giá
//         $.ajax({
//             url: `http://localhost:8080/api/giamgia/code?maGiamGia=${couponCode}`,    // URL đến API
//             type: 'GET', // Loại yêu cầu
//             success: function (response) {
//                 // Tìm mã giảm giá trong kết quả trả về
//                 console.log(response)
//                 let discount = response.giamGia
//                 if (!discount) {
//                     $('#discount-message').text("Mã giảm giá không hợp lệ.");
//                     return;
//                 }

//                 // Kiểm tra số lần sử dụng của mã giảm giá
//                 if (response.soLansd > 0) {
//                     localStorage.setItem('discount', JSON.stringify(response));
//                     $('#discount-message').text("Áp dụng mã giảm giá thành công")
//                     updateTotal();

//                 } else {
//                     $('#discount-message').text("Mã giảm giá này đã hết lượt sử dụng.");
//                 }
//             },
//             error: function () {
//                 deleteCoupon();
//                 $('#discount-message').text("Vui lòng kiểm tra lại");
//             }
//         });
//     });
// });


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
            url: `http://localhost:8080/api/giamgia/code?maGiamGia=${couponCode}`, // URL đến API
            type: 'GET', // Loại yêu cầu
            success: function (response) {
                console.log(response); // Ghi lại phản hồi để kiểm tra

                // Kiểm tra nếu mã giảm giá không tồn tại
                if (!response || !response.giamGia) {
                    $('#discount-message').text("Mã giảm giá không hợp lệ.");
                    return;
                }

                // Kiểm tra số lần sử dụng
                if (response.soLansd <= 0) {
                    $('#discount-message').text("Mã giảm giá này đã hết lượt sử dụng.");
                    return;
                }


                // Kiểm tra thời gian bắt đầu và kết thúc
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const startDate = new Date(response.ngayBatDau);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(response.ngayKetThuc);
                endDate.setHours(0, 0, 0, 0);


                if (now < startDate) {
                    $('#discount-message').text("Mã giảm giá chưa bắt đầu.");
                    deleteCoupon();
                    updateTotal()
                    return;
                }

                if (now > endDate) {
                    $('#discount-message').text("Mã giảm giá đã hết hiệu lực.");
                    deleteCoupon();
                    updateTotal()
                    return;

                }
                
                // Kiểm tra giá trị tối thiểu để áp dụng mã giảm giá
                const totalOrderValue = getTotalPrice();
                if (totalOrderValue < response.giaTriMin) {
                    $('#discount-message').text(`Đơn hàng phải có giá trị tối thiểu ${response.giaTriMin} để áp dụng mã giảm giá.`);
                    deleteCoupon();
                    updateTotal()
                    return;
                }

                // Nếu tất cả các điều kiện đều đúng
                localStorage.setItem('discount', JSON.stringify(response));
                $('#discount-message').text("Áp dụng mã giảm giá thành công.");
                updateTotal(); // Hàm cập nhật tổng giá trị đơn hàng sau khi áp dụng giảm giá
            },
            error: function () {
                deleteCoupon(); // Hàm xóa mã giảm giá trong localStorage (nếu cần)
                $('#discount-message').text("Mã giảm giá không tồn tại.");
            }
        });
    });
});
