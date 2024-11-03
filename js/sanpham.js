function updateProductCount(count) {
    $('#product_count').text(count); // Giả sử bạn có một thẻ HTML với id "product_count" để hiển thị số lượng
}


// Hàm lấy danh sách sản phẩm và sort
function getProducts(list, paramData, builder) {
    let { sortOrder, search, thuonghieu, theloai } = paramData
    $.support.cors = true;
    $.ajax({
        url: 'http://127.0.0.1:8080/api/sanpham', // Đường dẫn API có hỗ trợ sắp xếp
        type: 'GET',
        dataType: 'json',
        data: {
            sortOrder: sortOrder || "asc",
            search,
            thuonghieu,
            theloai,
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

function getBrand() {
    $.support.cors = true;
    var list = $('#list_thuonghieu')
    $.ajax({
        url: 'http://127.0.0.1:8080/api/thuonghieu', // Đường dẫn API có hỗ trợ sắp xếp
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // Xóa danh sách sản phẩm hiện tại trước khi thêm mới
            $(list).empty();
            $(list).append(`<li><a href='javascript:getProducts(".product_list",{}, renderProdItem,);'>Tất Cả</a></li>`)
            // Xây dựng toàn bộ HTML cho tất cả sản phẩm
            $.each(response, function (index, thuonghieu) {
                var ten = thuonghieu.ten

                // var giaFormatted = gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                var html = `<li><a href='javascript:getProducts(".product_list",{thuonghieu:"${ten}"}, renderProdItem,);'>${ten}</a></li>`;
                $(list).append(html); // Thêm sản phẩm vào danh sách
            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving products:', error);
        }
    });
}

function getCategory() {
    $.support.cores = true;
    var list = $('#list_category')
    $.ajax({
        url: 'http://127.0.0.1:8080/api/theloai',
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {
            $(list).empty(),
            $(list).append(`<li><a href='javascript:getProducts(".product_list",{}, renderProdItem,);'>Tất Cả</a></li>`)

                console.log(response)

            $.each(response, function (index, theloai) {
                var ten = theloai.ten

                var htmlCategory = `<li><a href='javascript:getProducts(".product_list",{theloai: "${ten}"}, renderProdItem);'>${ten}</a></li>`
                $(list).append(htmlCategory);

            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving products:', error);
        }


    });
}

getProducts(".product_list", {}, renderProdItem,);
getBrand();
getCategory();

function cartProduct(data) {
    // prod-id="${data.maSanPham}" prod-name="${data.tenSanPham}" price="${data.gia}" prod-image="${data.anh}"
    return `<li><a href="javascript:addToCart({'prodId':'${data.maSanPham}','prodName':'${data.tenSanPham}','price':'${data.gia}','image':'${data.anh}','quantity':1});updateCartNumber()">
    <i class="fa fa-shopping-cart"></i></a></li>`;
}
function viewProduct(data) {
    return `<li><a href="shop-details.html#prodId=${data.maSanPham}"> <i class="fa fa-eye"></i></a></li>`;
}

function renderProdItem(data) {
    return `
    <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="product__item">
            <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;"> 
            <ul class="product__item__pic__hover">
                 ${viewProduct(data)}
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
}

//         <li><a href="#"><i class="fa fa-heart"></i></a></li>
// <li><a href="#"><i class="fa fa-retweet"></i></a></li> 
// Khi chọn sortOrder từ dropdown
$('#sortOrder').on('change', function () {
    var sortOrder = $(this).val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')
    getProducts(
        ".product_list",
        { sortOrder },
        renderProdItem
    )
    // // Gọi lại hàm getProducts với sortOrder được chọn
    // getProducts(".product_list", (data) => {
    //     return `
    //     <div class="col-lg-4 col-md-6 col-sm-6">
    //         <div class="product__item">
    //             <div class="product__item__pic" style="background-image: url(&quot;${data.anh}&quot;);background-size: cover;background-position: top center;">
    //                 <ul class="product__item__pic__hover">
    //                     ${cartProduct(data)}
    //                 </ul>
    //             </div>
    //             <div class="product__item__text">
    //                 <h6><a href="#">${data.tenSanPham}</a></h6>
    //                 <h5>${data.gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h5>
    //             </div>
    //         </div>
    //     </div>
    // `;
    // }, sortOrder); // Truyền sortOrder để sắp xếp khi người dùng thay đổi filter
});

//search sản phẩm theo tên và sort

function searchAndSortProducts(list, builder, searchQuery, sortOrder) {
    getProducts(
        ".product_list",
        { sortOrder, search: searchQuery },
        renderProdItem
    )
    // $.support.cors = true;
    // $.ajax({
    //     url: 'http://127.0.0.1:8080/api/sanpham/search-and-sort', // Đường dẫn API hỗ trợ tìm kiếm và sắp xếp
    //     type: 'GET',
    //     dataType: 'json',
    //     data: {
    //         tenSP: searchQuery,  // Từ khóa tìm kiếm
    //         sortOrder: sortOrder // Thứ tự sắp xếp ('asc' hoặc 'desc')
    //     },
    //     success: function (response) {
    //         // Xóa danh sách sản phẩm hiện tại trước khi thêm mới
    //         $(list).empty();

    //         //tính tổng số sản phẩm
    //         updateProductCount(response.length);

    //         // Xây dựng toàn bộ HTML cho tất cả sản phẩm
    //         $.each(response, function (index, product) {
    //             var maSanPham = product.maSP;
    //             var tenSanPham = product.tenSP;
    //             var gia = product.giaBan;
    //             var anh = product.anh;

    //             // Gọi hàm builder và thêm kết quả vào HTML
    //             var productHtml = builder({ maSanPham, tenSanPham, gia, anh });
    //             $(list).append(productHtml); // Thêm sản phẩm vào danh sách
    //         });
    //     },
    //     error: function (xhr, status, error) {
    //         console.error('Error retrieving products:', error);
    //     }
    // });
}



$(document).ready(function () {
    // Khi người dùng tìm kiếm
    $('#search_form').on('submit', function (event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định
        var searchQuery = $('#search_input').val(); // Lấy giá trị từ input
        var sortOrder = $('#sortOrder').val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')

        if (searchQuery.trim() === "") {
            alert("Please enter a product name to search");
            return;
        }

        getProducts(
            ".product_list",
            { sortOrder, search: searchQuery },
            renderProdItem
        )
    });

    // Khi người dùng thay đổi sắp xếp
    $('#sortOrder').on('change', function () {
        var sortOrder = $(this).val(); // Lấy giá trị sắp xếp từ dropdown ('asc' hoặc 'desc')
        var searchQuery = $('#search_input').val(); // Lấy giá trị tìm kiếm hiện tại

        getProducts(
            ".product_list",
            { sortOrder, search: searchQuery },
            renderProdItem
        )
    });
});
