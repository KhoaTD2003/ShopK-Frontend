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
    updateCheckoutTotal();
}

function updateCheckoutTotal() {
    // Cập nhật subtotal và total vào giao diện
    let total = getTotalPrice(); // Tổng giá ban đầu
    let discount = getGiamgia(total); // Tính số tiền giảm giá
    let subtotal = - discount; // Tiền giảm giá để hiển thị
    total = Math.max(total - discount, 0); // Giá sau khi giảm, đảm bảo >= 0


    $('.checkout__order__subtotal span').text(subtotal.toLocaleString('vi-VN') + ' VND');
    $('.checkout__order__total span').text((total).toLocaleString('vi-VN') + ' VND'); // Bạn có thể thêm phí vận chuyển nếu cần
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


$(document).ready(function () {
    // Hàm xử lý khi người dùng nhấn nút "PLACE ORDER"
    $('.site-btn').click(function (e) {

        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Gọi hàm getAuthUser để lấy ID tài khoản
        const user = getAuthUser(); // Giả sử hàm này trả về đối tượng người dùng

        if (user == null) {
            alert("Vui lòng đăng nhập trước để mua hàng.");
            window.location.href = '/login.html';
            return;
        }

        // Lấy dữ liệu từ form
        const hoTen = $('#full-name').val();
        const diaChi = $('#address').val();
        const sdt = $('#phone').val();
        const email = $('#email').val();

        // Kiểm tra xem các trường bắt buộc có được điền đầy đủ không
        if (!hoTen || !diaChi || !email || !sdt) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return; // Ngăn chặn việc gửi yêu cầu
        }
        if (!/^\d{10}$/.test(sdt)) {
            alert("Số điện thoại phải có đúng 10 chữ số.");
            return; // Ngăn chặn việc gửi yêu cầu
        }
        const idTaiKhoan = user.id; // Lấy ID tài khoản từ đối tượng người dùng

        // Giả sử phần tính tổng tiền đã được tính toán sẵn
        const tongTien = getTotalPrice();
        const maHoaDon = generateRandomCode();  // Bạn có thể tạo mã hóa đơn ngẫu nhiên
          // Lấy thông tin sản phẩm từ giỏ hàng
          let cart = getCart(); // Giả sử hàm này trả về giỏ hàng
        //   let productDetails = cart.map(product => `${product.prodName} x${product.quantity} (${(product.price * product.quantity).toLocaleString('vi-VN')} VND)`).join(', ');
          // Ghi chú bao gồm thông tin sản phẩm
        //   const ghiChu = `Sản phẩm: ${productDetails}`;
        
        let sanPhamList = cart.map(product => {
            return {
                idSanPham: product.idSP, 
                ten: product.prodName,// ID sản phẩm
                soLuong: product.quantity, // Số lượng
                donGia: product.price // Đơn giá
            };
        });
        const ghiChu = `Sản phẩm: ${sanPhamList.map(p => `${p.soLuong} x ${p.ten}`).join(', ')}`;

        // const ghiChu = $('#note').val()
        const gh = $('#gh-or:checked').val() || 'cơ bản'

        // Tạo object dữ liệu cho người dùng và hóa đơn
        const data = {
            nguoiDung: {
                hoTen: hoTen,
                diaChi: diaChi,
                email: email,
                sdt: sdt,
                idTaiKhoan: idTaiKhoan // Gán ID tài khoản vào DTO
            },
            tongTien: tongTien.toString(), // Chuyển sang chuỗi nếu cần
            tienThu: getTotalPrice()-getGiamgia(getTotalPrice()),  // Tiền thu mặc định là 0 khi chưa thanh toán
            tienGiam: getGiamgia(getTotalPrice())  , // Tiền giảm mặc định
            // ghiChu: `LOAI GIAO HANG: ${gh}, KHACH HANG GHI CHU: ${ghiChu}`,
            // ghiChu: `${ghiChu}, LOAI GIAO HANG: ${gh}`, // Thêm loại giao hàng vào ghi chú
            ghiChu: "Online",
            maGiamGia: getDiscount().ma,
            sanPhamList: sanPhamList // Thêm danh sách sản phẩm vào yêu cầu

        };

        // Gửi dữ liệu lên server qua AJAX
        $.ajax({
            url: `http://127.0.0.1:8080/api/datdon`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                $('#successModal').modal('show'); // Sử dụng jQuery
                // Chuyển trang khi modal bị đóng
                $('#successModal').on('hidden.bs.modal', function () {
                    window.location.href = '/shop-grid.html'; // Thay đổi URL này thành trang bạn muốn chuyển đến
                });
                // alert("Đặt đơn thành công!");
                // Xử lý điều hướng sau khi đặt hàng thành công
                deleteCoupon();
                clearCart();

                // window.location.href = "/checkout-success.html"; // Chuyển hướng đến trang thành công
            },
            error: function (xhr, status, error) {
                console.log("Có lỗi xảy ra: ", error);
                console.log("Chi tiết lỗi: ", xhr.responseText); // In ra chi tiết lỗi
                alert(xhr.responseText);
            }
        });
    });

    // Hàm tạo mã hóa đơn ngẫu nhiên (có thể thay đổi theo nhu cầu của bạn)
    function generateRandomCode() {
        return 'HD' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

});


