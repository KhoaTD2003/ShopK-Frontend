function updateProductCount(count) {
    $('#product_count').text(count); // Giả sử bạn có một thẻ HTML với id "product_count" để hiển thị số lượng
}


// Hàm lấy danh sách sản phẩm và sort
function getProducts(list, builder, sortOrder = null) {
    $.support.cors = true;
    $.ajax({
        url: 'http://127.0.0.1:8080/api/sanpham/sorted-by-price', // Đường dẫn API có hỗ trợ sắp xếp
        type: 'GET',
        dataType: 'json',
        data: {
            sortOrder: sortOrder // Gửi tham số sortOrder (nếu có)
        },
        success: function (response) {
            // Xóa danh sách sản phẩm hiện tại trước khi thêm mới
            $(list).empty();

            //tính tổng số sản phẩm
            updateProductCount(response.length);

            // Xây dựng toàn bộ HTML cho tất cả sản phẩm
            $.each(response, function (index, product) {
                var maSanPham = product.maSP;
                var tenSanPham = product.tenSP;
                var gia = product.giaBan;
                var anh = product.anh;

                // var giaFormatted = gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                // Gọi hàm builder và thêm kết quả vào HTML
                var productHtml = builder({ maSanPham, tenSanPham, gia, anh });
                $(list).append(productHtml); // Thêm sản phẩm vào danh sách
            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving products:', error);
        }
    });
}
function cartProduct(data) {
    // prod-id="${data.maSanPham}" prod-name="${data.tenSanPham}" price="${data.gia}" prod-image="${data.anh}"
    return `<li><a href="javascript:addToCart({'prodId':'${data.maSanPham}','prodName':'${data.tenSanPham}','price':'${data.gia}','image':'${data.anh}','quantity':1});updateCartNumber()"><i class="fa fa-shopping-cart" ></i></a></li>`;
}
 // Hàm load danh sách sản phẩm ban đầu (không sắp xếp)
 getProducts(".product_list", (data) => {
    return `
    <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="product__item">
            <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;">
                <ul class="product__item__pic__hover">
                   ${cartProduct(data)}
                </ul>
            </div>
            <div class="product__item__text">
                <h6><a href="#">${data.tenSanPham}</a></h6>
                <h5>${data.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h5>
            </div>
        </div>
    </div>
`;
});
// Khi chọn sortOrder từ dropdown
$('#sortOrder').on('change', function () {
    var sortOrder = $(this).val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')

    // Gọi lại hàm getProducts với sortOrder được chọn
    getProducts(".product_list", (data) => {
        return `
        <div class="col-lg-4 col-md-6 col-sm-6">
            <div class="product__item">
                <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;">
                    <ul class="product__item__pic__hover">
                        ${cartProduct(data)}
                    </ul>
                </div>
                <div class="product__item__text">
                    <h6><a href="#">${data.tenSanPham}</a></h6>
                    <h5>${data.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h5>
                </div>
            </div>
        </div>
    `;
    }, sortOrder); // Truyền sortOrder để sắp xếp khi người dùng thay đổi filter
});

//search sản phẩm theo tên và sort

function searchAndSortProducts(list, builder, searchQuery, sortOrder) {
    $.support.cors = true;
    $.ajax({
        url: 'http://127.0.0.1:8080/api/sanpham/search-and-sort', // Đường dẫn API hỗ trợ tìm kiếm và sắp xếp
        type: 'GET',
        dataType: 'json',
        data: {
            tenSP: searchQuery,  // Từ khóa tìm kiếm
            sortOrder: sortOrder // Thứ tự sắp xếp ('asc' hoặc 'desc')
        },
        success: function (response) {
            // Xóa danh sách sản phẩm hiện tại trước khi thêm mới
            $(list).empty();

            //tính tổng số sản phẩm
            updateProductCount(response.length);

            // Xây dựng toàn bộ HTML cho tất cả sản phẩm
            $.each(response, function (index, product) {
                var maSanPham = product.maSP;
                var tenSanPham = product.tenSP;
                var gia = product.giaBan;
                var anh = product.anh;

                // Gọi hàm builder và thêm kết quả vào HTML
                var productHtml = builder({ maSanPham, tenSanPham, gia, anh });
                $(list).append(productHtml); // Thêm sản phẩm vào danh sách
            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving products:', error);
        }
    });
}

$(document).ready(function() {
    // Khi người dùng tìm kiếm
    $('#search_form').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định
        var searchQuery = $('#search_input').val(); // Lấy giá trị từ input
        var sortOrder = $('#sortOrder').val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')

        if (searchQuery.trim() === "") {
            alert("Please enter a product name to search");
            return;
        }

        // Gọi hàm tìm kiếm và sắp xếp sản phẩm theo tên
        searchAndSortProducts(".product_list", (data) => {
            return `
            <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="product__item">
                    <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;">
                        <ul class="product__item__pic__hover">
                            ${cartProduct(data)}
                        </ul>
                    </div>
                    <div class="product__item__text">
                        <h6><a href="#">${data.tenSanPham}</a></h6>
                        <h5>${data.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h5>
                    </div>
                </div>
            </div>
            `;
        }, searchQuery, sortOrder); // Truyền searchQuery và sortOrder để tìm kiếm và sắp xếp
    });

    // Khi người dùng thay đổi sắp xếp
    $('#sortOrder').on('change', function () {
        var sortOrder = $(this).val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')
        var searchQuery = $('#search_input').val(); // Lấy giá trị tìm kiếm hiện tại

        // Gọi lại hàm tìm kiếm và sắp xếp sản phẩm theo tên
        searchAndSortProducts(".product_list", (data) => {
            return `
            <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="product__item">
                    <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;">
                        <ul class="product__item__pic__hover">
                            ${cartProduct(data)}
                        </ul>
                    </div>
                    <div class="product__item__text">
                        <h6><a href="#">${data.tenSanPham}</a></h6>
                        <h5>${data.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h5>
                    </div>
                </div>
            </div>
            `;
        }, searchQuery, sortOrder); // Truyền searchQuery và sortOrder để tìm kiếm và sắp xếp
    });
});
