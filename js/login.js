const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const signupForm = document.getElementById("form1");
const loginForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var tenTaiKhoan = $('#account').val();
    var matKhau = $('#password').val();

    // Gọi API để đăng nhập
    $.ajax({
        url: 'http://localhost:8080/api/taikhoan/login',  // Đường dẫn API của bạn
        type: 'POST',
        data: {
            tenTaiKhoan: tenTaiKhoan,
            matKhau: matKhau
        },
        success: function (response) {
            // Lưu kết quả đăng nhập vào localStorage
            localStorage.setItem('taiKhoan', JSON.stringify(response));

            alert('Đăng nhập thành công!');
            // Chuyển hướng hoặc làm gì đó sau khi đăng nhập thành công
            window.location.href = 'shop-grid.html';  // Thay đổi nếu cần
        },
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                alert('Tên tài khoản hoặc mật khẩu không đúng!');
            } else {
                alert('Lỗi đăng nhập: ' + error);
            }
        }
    });
});



signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var tenTaiKhoan = $('#tenTaiKhoan').val();
    var matKhau = $('#matKhau').val();
    var email = $('#email').val();
    var sdt = $('#sdt').val();

    // Kiểm tra các trường không được bỏ trống
    if (!tenTaiKhoan || !matKhau || !email || !sdt) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;  // Dừng quá trình nếu có trường nào đó bị bỏ trống
    }

    // Kiểm tra độ dài số điện thoại phải là 10 số
    if (sdt.length !== 10 || !/^\d{10}$/.test(sdt)) {
        alert('Số điện thoại phải bao gồm đúng 10 chữ số.');
        return;
    }

    // Kiểm tra định dạng email hợp lệ
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ.');
        return;
    }

    // Gọi API đăng ký và kiểm tra trùng lặp
    $.ajax({
        url: 'http://localhost:8080/api/taikhoan/register',  // Đường dẫn API đăng ký
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            tenTaiKhoan: tenTaiKhoan,
            matKhau: matKhau,
            email: email,
            sdt: sdt
        }),
        success: function (response) {
            alert('Đăng ký thành công!');
            window.location.href = 'login.html';  // Thay đổi theo yêu cầu của bạn
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseText ? xhr.responseText : 'Đã xảy ra lỗi không xác định.';
            alert('Đăng ký thất bại! Lỗi: ' + errorMessage);
        }
    });
});
