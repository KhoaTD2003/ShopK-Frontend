function renderCheckout() {
    // Gọi hàm getCart để lấy dữ liệu giỏ hàng
    let cart = getCart();
    let checkoutHtml = '';
    let subtotal = 0;

    if (cart.length == 0) {
        checkoutHtml = `
        <li style="text-align: center;">
            <h2 style="color: #888; font-weight: 400;">Giỏ hàng của bạn hiện đang trống</h2>
            <p style="color: #aaa;">Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
        </li>`;
    } else {
        // Duyệt qua danh sách sản phẩm và tạo HTML cho mỗi sản phẩm
        cart.forEach(function (product) {
            const productTotal = product.price * product.quantity;
            subtotal += productTotal;

            checkoutHtml += `
            <li>${product.prodName} <span>${(productTotal).toLocaleString('vi-VN')} VND</span></li>
            `;
        });
    }

    // Gắn HTML vào phần tử có id là #checkout-list
    $('#checkout-list').html(checkoutHtml);

    // Cập nhật subtotal và total
    updateCheckoutTotal(subtotal);
}

function updateCheckoutTotal(subtotal) {
    // Cập nhật subtotal và total vào giao diện
    $('.checkout__order__subtotal span').text(subtotal.toLocaleString('vi-VN') + ' VND');
    $('.checkout__order__total span').text(subtotal.toLocaleString('vi-VN') + ' VND'); // Bạn có thể thêm phí vận chuyển nếu cần
}

// Gọi hàm renderCheckout để hiển thị hóa đơn
renderCheckout();

// Gọi API để lấy dữ liệu người dùng từ idTaiKhoan
$(document).ready(function () {
    // ID tài khoản mà bạn muốn lấy dữ liệu
    const user = getAuthUser().id;
    console.log("Thông tin người dùng:", user);
    

    // Gọi API lấy dữ liệu người dùng
    $.ajax({
        url: `http://127.0.0.1:8080/api/nguoidung/user?idTaiKhoan=${user}`,
        type: 'GET',
        success: function (response) {
            // Giả sử response trả về là một mảng, ta lấy phần tử đầu tiên
            if (response && response.length > 0) {
                const user = response[0];

                // Điền thông tin vào form
                $('#full-name').val(user.hoTen);
                $('#address').val(user.diaChi);
                $('#phone').val(user.sdt);
                $('#email').val(user.email);
            } else {
                alert("Không tìm thấy thông tin người dùng!");
            }
        },
        error: function (xhr, status, error) {
            console.log("Có lỗi xảy ra khi lấy dữ liệu người dùng: ", error);
        }
    });
});

// $(document).ready(function() {
//     // Hàm xử lý khi người dùng nhấn nút "PLACE ORDER"
//     $('.site-btn').click(function(e) {
//         e.preventDefault(); // Ngăn chặn hành vi mặc định của form

//         // Lấy dữ liệu từ form
//         const hoTen = $('#full-name').val();
//         const diaChi = $('#address').val();
//         const sdt = $('#phone').val();
//         const email = $('#email').val();
//         const ghiChu = $('input[placeholder="Notes about your order, e.g. special notes for delivery."]').val();

//         // Giả sử phần tính tổng tiền đã được tính toán sẵn
//         const tongTien = $('#checkout-list').data('total') || 0;
//         const maHoaDon = generateRandomCode();  // Bạn có thể tạo mã hóa đơn ngẫu nhiên

//         // Tạo object dữ liệu cho người dùng và hóa đơn
//         const data = {
//             nguoiDung: {
//                 maNguoiDung: '', // Để trống nếu là người dùng mới
//                 hoTen: hoTen,
//                 diaChi: diaChi,
//                 email: email,
//                 sdt: sdt
//             },
//             hoaDon: {
//                 maHoaDon: maHoaDon,
//                 tenKH: hoTen,
//                 tongTien: tongTien,
//                 trangThai: "Chưa thanh toán",
//                 ghiChu: ghiChu,
//                 tienThu: "0",  // Tiền thu mặc định là 0 khi chưa thanh toán
//                 tienGiam: "0"  // Tiền giảm mặc định
//             }
//         };

//         // Gửi dữ liệu lên server qua AJAX
//         $.ajax({
//             url: `http://127.0.0.1:8080/api/datdon`,
//             type: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(data),
//             success: function(response) {
//                 alert("Đặt đơn thành công!");
//                 // Xử lý điều hướng sau khi đặt hàng thành công
//                 window.location.href = "/checkout-success.html"; // Chuyển hướng đến trang thành công
//             },
//             error: function(xhr, status, error) {
//                 console.log("Có lỗi xảy ra: ", error);
//                 alert("Có lỗi xảy ra trong quá trình đặt hàng.");
//             }
//         });
//     });

//     // Hàm tạo mã hóa đơn ngẫu nhiên (có thể thay đổi theo nhu cầu của bạn)
//     function generateRandomCode() {
//         return 'HD' + Math.random().toString(36).substring(2, 10).toUpperCase();
//     }
// });

$(document).ready(function() {
    // Hàm xử lý khi người dùng nhấn nút "PLACE ORDER"
    $('.site-btn').click(function(e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Lấy dữ liệu từ form
        const hoTen = $('#full-name').val();
        const diaChi = $('#address').val();
        const sdt = $('#phone').val();
        const email = $('#email').val();
        const ghiChu = $('input[placeholder="Notes about your order, e.g. special notes for delivery."]').val();

        // Kiểm tra xem các trường bắt buộc có được điền đầy đủ không
        if (!hoTen || !diaChi || !email || !sdt) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return; // Ngăn chặn việc gửi yêu cầu
        }

        // Gọi hàm getAuthUser để lấy ID tài khoản
        const user = getAuthUser(); // Giả sử hàm này trả về đối tượng người dùng
        const idTaiKhoan = user.id; // Lấy ID tài khoản từ đối tượng người dùng

        // Giả sử phần tính tổng tiền đã được tính toán sẵn
        const tongTien = $('#checkout-list').data('total') || 0;
        const maHoaDon = generateRandomCode();  // Bạn có thể tạo mã hóa đơn ngẫu nhiên
        const maNguoiDung = generateRandomCode();  // Bạn có thể tạo mã hóa đơn ngẫu nhiên

        // Tạo object dữ liệu cho người dùng và hóa đơn
        const data = {
            nguoiDung: {
                maNguoiDung: maNguoiDung , // Để trống nếu là người dùng mới
                hoTen: hoTen,
                diaChi: diaChi,
                email: email,
                sdt: sdt,
                ghiChu: ghiChu,
                idTaiKhoan: idTaiKhoan // Gán ID tài khoản vào DTO
            },
            tongTien: tongTien.toString(), // Chuyển sang chuỗi nếu cần
            tienThu: "0",  // Tiền thu mặc định là 0 khi chưa thanh toán
            tienGiam: "0"  // Tiền giảm mặc định
        };

        // Gửi dữ liệu lên server qua AJAX
        $.ajax({
            url: `http://127.0.0.1:8080/api/datdon`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                alert("Đặt đơn thành công!");
                // Xử lý điều hướng sau khi đặt hàng thành công
                window.location.href = "/checkout-success.html"; // Chuyển hướng đến trang thành công
            },
            error: function(xhr, status, error) {
                console.log("Có lỗi xảy ra: ", error);
                console.log("Chi tiết lỗi: ", xhr.responseText); // In ra chi tiết lỗi
                alert("Có lỗi xảy ra trong quá trình đặt hàng.");
            }
        });
    });

    // Hàm tạo mã hóa đơn ngẫu nhiên (có thể thay đổi theo nhu cầu của bạn)
    function generateRandomCode() {
        return 'HD' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
});


