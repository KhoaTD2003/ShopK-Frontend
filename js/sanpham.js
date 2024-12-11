function updateProductCount(count) {
    $('#product_count').text(count); // Giả sử bạn có một thẻ HTML với id "product_count" để hiển thị số lượng
}


// Hàm lấy danh sách sản phẩm và sort
function getProducts(list, paramData, builder,pageNumber =1, pageSize = 12) {
    console.log("Param data before API call:", paramData); // Kiểm tra tham số trước khi gọi API

    let { sortOrder, search, thuonghieu, theloai,mausac, size, minPrice, maxPrice } = paramData
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
            mausac,
            size,
            minPrice,
            maxPrice,
            pageNumber: pageNumber-1,        // gửi tham số trang
            pageSize     // gửi tham số số sản phẩm trên trang
        },
        success: function (response) {
            console.log("Response from API:", response);  // Kiểm tra response từ API

            // Xóa danh sách sản phẩm hiện tại trước khi thêm mới
            $(list).empty();

            if (response.content.length === 0) {
                console.log("No products found for this size.");
                updateProductCount(response.content.length);

                return; // Không làm gì nếu không có sản phẩm
            }

            //tính tổng số sản phẩm
            updateProductCount(response.content.length);
            updatePagination(response.totalPages, pageNumber); // Cập nhật phân trang

            console.log(response.content);
            // Xây dựng toàn bộ HTML cho tất cả sản phẩm
            $.each(response.content, function (index, product) {
                var id = product.idSP;
                var maSanPham = product.maSP;
                var tenSanPham = product.tenSP;
                var gia = product.giaBan;
                var anh = product.anh;
                var soLuongTon = product.stock;

                // var giaFormatted = gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                // Gọi hàm builder và thêm kết quả vào HTML
                var productHtml = builder({id,maSanPham, tenSanPham, gia, anh, soLuongTon});
                $(list).append(productHtml); // Thêm sản phẩm vào danh sách
            });


        },
        error: function (xhr, status, error) {
            console.error('Error retrieving products:', error);
        }
    });
}




function updatePagination(totalPages, currentPage) {
    const paginationContainer = $('#pagination');
    paginationContainer.empty();

    const pageLimit = 2; // Số trang hiển thị trước và sau trang hiện tại

    // Hiển thị trang đầu tiên
    if (currentPage > 0) {
        paginationContainer.append($('<a href="#">1</a>').on('click', function (e) {
            e.preventDefault();
            getProducts(".product_list", {}, renderProdItem, 1, 12);
        }));
    }

    // Hiển thị dấu '...' nếu trang hiện tại cách xa trang đầu
    if (currentPage > pageLimit + 1) {
        paginationContainer.append('<span class="pagination-ellipsis">...</span>');

    }

    // Hiển thị các trang xung quanh trang hiện tại
    for (let i = Math.max(2, currentPage - pageLimit); i <= Math.min(totalPages - 1, currentPage + pageLimit); i++) {
        const pageLink = $('<a href="#"></a>').text(i);
        if (i === currentPage) {
            pageLink.addClass('active'); // Thêm class active cho trang hiện tại
            pageLink.css('pointer-events', 'none'); // Vô hiệu hóa sự kiện nhấp cho trang hiện tại

        }

        // Thêm sự kiện click cho mỗi liên kết trang
        pageLink.on('click', function (e) {
            e.preventDefault();
            getProducts(".product_list", {}, renderProdItem, i, 12);
        });

        paginationContainer.append(pageLink);
    }

    // Hiển thị dấu '...' nếu trang hiện tại cách xa trang cuối
    if (currentPage < totalPages - pageLimit) {
        paginationContainer.append('<span class="pagination-ellipsis">...</span>');

    }

    // Hiển thị trang cuối cùng
    if (currentPage < totalPages) {
        paginationContainer.append($('<a href="#"></a>').text(totalPages).on('click', function (e) {
            e.preventDefault();
            getProducts(".product_list", {}, renderProdItem, totalPages, 12);
        }));
    }

    // Thêm nút Next
    if (currentPage < totalPages) {
        const nextLink = $('<a href="#"><i class="fa fa-long-arrow-right"></i></a>').on('click', function (e) {
            e.preventDefault();
            getProducts(".product_list", {}, renderProdItem, currentPage + 1, 12);
        });
        paginationContainer.append(nextLink);
    }

    // Thêm nút Previous
    if (currentPage > 1) {
        const prevLink = $('<a href="#"><i class="fa fa-long-arrow-left"></i></a>').on('click', function (e) {
            e.preventDefault();
            getProducts(".product_list", {}, renderProdItem, currentPage - 1, 12);
        });
        paginationContainer.prepend(prevLink); // Thêm nút Previous ở đầu danh sách trang
    }
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


function getColors() {
    $.support.cors = true;
    var list = $('#list_color'); // Cập nhật selector để lấy đúng container

    $.ajax({
        url: 'http://127.0.0.1:8080/api/mausac', // Đường dẫn API để lấy danh sách màu sắc
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $(list).empty(); // Xóa nội dung cũ trước khi thêm mới

            // Thêm tiêu đề màu sắc
            $(list).append(`<h4>Colors</h4>`);

            // Thêm màu sắc "Tất cả" (nếu cần)
            $(list).append(`<div class="sidebar__item__color sidebar__item__color--all">
                <label for="all-colors" class="color-label">
                    <span class="color-circle all-colors-circle"></span> Tất Cả
                    <input type="radio" id="all-colors" name="color" value="" onchange="getProducts('.product_list', {}, renderProdItem);">
                </label>
            </div>`);


            // Thêm màu sắc từ API
            $.each(response, function (index, color) {
                var colorName = color.ten; // Đặt lại tên biến để không bị ghi đè
                var colorCode = color.ma; // Giả sử 'ma' chứa mã màu trong định dạng HEX hoặc RGB
                var htmlColor = `<div class="sidebar__item__color sidebar__item__color--${colorName.toLowerCase()}">
                                    <label for="${colorName}">
                                        ${colorName}
                                        <input type="radio" id="${colorName}" name="color" value="${colorName}" onchange="getProducts('.product_list', { mausac: '${colorName}' }, renderProdItem);">
                                    </label>
                                </div>`;
                $(list).append(htmlColor); // Thêm màu sắc vào danh sách
            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving colors:', error);
        }
    });
}


function getSizes() {
    $.support.cors = true;
    var list = $('#list_size'); // Cập nhật selector để lấy đúng container

    $.ajax({
        url: 'http://127.0.0.1:8080/api/size', // Đường dẫn API để lấy danh sách kích thước
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $(list).empty(); // Xóa nội dung cũ trước khi thêm mới

            // Thêm kích thước "Tất cả"
            $(list).append(`<div class="sidebar__item__size">
                                <label for="all-sizes">
                                    Tất Cả
                                    <input type="radio" id="all-sizes" name="size" value="" onchange="getProducts('.product_list', {}, renderProdItem);">
                                </label>
                            </div>`);

            // Thêm kích thước từ API
            $.each(response, function (index, size) {
                var sizeName = size.ten; // Đặt lại tên biến để không bị ghi đè
                var htmlSize = `<div class="sidebar__item__size">
                                    <label for="${sizeName}">
                                        ${sizeName}
                                        <input type="radio" id="${sizeName}" name="size" value="${sizeName}" onchange="getProducts('.product_list', { size: '${sizeName}' }, renderProdItem);">
                                    </label>
                                </div>`;
                $(list).append(htmlSize); // Thêm kích thước vào danh sách
            });
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving sizes:', error);
        }
    });
}



$(function() {
    // Thiết lập giá trị tối thiểu và tối đa từ thuộc tính data
    var minPrice = $(".price-range").data("min");
    var maxPrice = $(".price-range").data("max");

    // Tạo thanh trượt
    $(".price-range").slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
            // Cập nhật giá trị trong các ô nhập liệu
            $("#minamount").val(ui.values[0]);
            $("#maxamount").val(ui.values[1]);
            
            // Gọi lại hàm getProducts để lấy sản phẩm mới
            var paramData = {
                minPrice: ui.values[0],
                maxPrice: ui.values[1]
            };
            getProducts(".product_list", paramData, renderProdItem, 1, 12);
        }
    });

    // Khởi tạo giá trị ban đầu cho các ô nhập liệu
    $("#minamount").val($(".price-range").slider("values", 0));
    $("#maxamount").val($(".price-range").slider("values", 1));

    // Xử lý sự kiện khi thay đổi giá trong ô nhập liệu
    $("#minamount").on("change", function() {
        var value = parseInt($(this).val());
        if (isNaN(value) || value < minPrice) {
            value = minPrice;
        } else if (value > $(".price-range").slider("values", 1)) {
            value = $(".price-range").slider("values", 1);
        }
        $(".price-range").slider("values", 0, value);
        
        // Gọi lại hàm getProducts
        getProducts(".product_list", { minPrice: value, maxPrice: $("#maxamount").val() }, renderProdItem, 1, 12);
    });

    $("#maxamount").on("change", function() {
        var value = parseInt($(this).val());
        if (isNaN(value) || value > maxPrice) {
            value = maxPrice;
        } else if (value < $(".price-range").slider("values", 0)) {
            value = $(".price-range").slider("values", 0);
        }
        $(".price-range").slider("values", 1, value);
        
        // Gọi lại hàm getProducts
        getProducts(".product_list", { minPrice: $("#minamount").val(), maxPrice: value }, renderProdItem, 1, 12);
    });
});


getProducts(".product_list", {}, renderProdItem,1,12);
getBrand();
getCategory();
getColors(); // Gọi hàm để lấy danh sách màu sắc
getSizes(); 

// function cartProduct(data) {
//     // prod-id="${data.maSanPham}" prod-name="${data.tenSanPham}" price="${data.gia}" prod-image="${data.anh}"
//     return `<li><a href="javascript:addToCart({'idSP':'${data.idSP}','prodId':'${data.maSanPham}','prodName':'${data.tenSanPham}','price':'${data.gia}','image':'${data.anh}','quantity':1});updateCartNumber()">
//     <i class="fa fa-shopping-cart"></i></a></li>`;
// }

function cartProduct(data) {
    console.log(data.soLuongTon);
    return `<li>
        <a href="javascript:addToCart({
            'idSP': '${data.id}', 
            'prodId': '${data.maSanPham}', 
            'prodName': '${data.tenSanPham}', 
            'price': '${data.gia}', 
            'image': '${data.anh}', 
            'stock': '${data.soLuongTon}',
            'quantity': 1 
        }); updateCartNumber()">
            <i class="fa fa-shopping-cart"></i>
        </a>
    </li>`;
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

});

//search sản phẩm theo tên và sort

function searchAndSortProducts(list, builder, searchQuery, sortOrder) {
    getProducts(
        ".product_list",
        { sortOrder, search: searchQuery },
        renderProdItem
    )
   
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
