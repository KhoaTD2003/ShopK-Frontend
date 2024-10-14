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
        success: function(response) {
            // Lưu kết quả đăng nhập vào localStorage
            localStorage.setItem('taiKhoan', JSON.stringify(response));

            alert('Đăng nhập thành công!');
            // Chuyển hướng hoặc làm gì đó sau khi đăng nhập thành công
            window.location.href = 'shop-grid.html';  // Thay đổi nếu cần
        },
        error: function(xhr, status, error) {
            if (xhr.status === 404) {
                alert('Tên tài khoản hoặc mật khẩu không đúng!');
            } else {
                alert('Lỗi đăng nhập: ' + error);
            }
        }
    });
});
signupForm.addEventListener("submit", (e) => {
    
    e.preventDefault()
    var tenTaiKhoan = $('#tenTaiKhoan').val();
    var matKhau = $('#matKhau').val();
    var hoten = $('#hoten').val();
    var email = $('#email').val();
    var sdt = $('#sdt').val();

    // Gọi API để đăng ký
    $.ajax({
        url: 'http://localhost:8080/api/taikhoan/register',  // Đường dẫn API của bạn
        type: 'POST',
        contentType: 'application/json',  // Đảm bảo rằng nội dung là JSON
        data: JSON.stringify({
            tenTaiKhoan: tenTaiKhoan,
            matKhau: matKhau,
            hoten: hoten,
            email: email,
            sdt: sdt
        }),
        success: function(response) {
            alert('Đăng ký thành công!');
            // Thực hiện chuyển hướng hoặc làm gì đó sau khi đăng ký thành công
            window.location.href = 'login.html';  // Thay đổi theo yêu cầu của bạn
        },
        error: function(xhr, status, error) {
            if (xhr.status === 400) {
                alert('Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.');
            } else {
                alert('Lỗi đăng ký: ' + error);
            }
        }
    });


});
