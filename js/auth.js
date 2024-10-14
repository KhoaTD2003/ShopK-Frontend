function getAuthUser() {
    if (localStorage.getItem('taiKhoan') == null) {
        return null;
    } else {
        return JSON.parse(localStorage.taiKhoan);
    }
}


function logout() {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất")) {
        return;
    }
    localStorage.setItem('taiKhoan', null)
    alert("Đăng xuất thành công.");
    window.location.href = "shop-grid.html"
}
