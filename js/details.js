
     
    $('.primary-btn').on('click', function () {
        // Lấy sản phẩm từ data attributes của nút ADD TO CART
        const product = $(this).data('product');
        
        // Lấy số lượng từ input
        const quantity = parseInt($('#product_quantity').val(), 10) || 1; // Mặc định là 1 nếu không có giá trị hợp lệ
        console.log('Số lượng sản phẩm:', quantity); // Log giá trị để kiểm tra

        // Gọi hàm addToCart với sản phẩm và số lượng
        product.quantity = quantity; // Cập nhật số lượng cho sản phẩm
        addToCart(product);
        updateCartNumber();
        
        $('#product_quantity').val(1); // Hoặc có thể để trống bằng $('#product_quantity').val('');
        // renderCart(); // Cập nhật hiển thị giỏ hàng

    });

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
                newVal = 1;
            }
        }
        $button.parent().find('input').val(newVal);
        onQtyButtonClick($button);

    });
    
    function getDetail() {
        $.support.cors = true;
        let hash = window.location.hash //lay data sau .html#
        if(hash == ''){
            window.history.back();
            return;
        }
        let masp =hash.split('=')[1]
        
        $.ajax({
            url:`http://127.0.0.1:8080/api/sanpham/maSP?maSP=${masp}`,
            type: 'GET',
            success: function(response){
                var productTitle = $('#product_name');
                var productImage = $('#product_image');
                var productPrice = $('#product_price');
                var productDesc  = $('#product_description');


                console.log($('.primary-btn').data('product')); // Dòng này sẽ log ra object sản phẩm, kiểm tra xem có dữ liệu không

                productTitle.text(response.tenSP);
                productImage.attr("src", response.anh);
                productPrice.text(`${response.giaBan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",",)}`+'₫');
                productDesc.text(response.mota);

                $('.primary-btn').data('product', {
                    
                        prodId: response.maSP, // Mã sản phẩm
                        prodName: response.tenSP, // Tên sản phẩm
                        price: response.giaBan, // Giá sản phẩm
                        image: response.anh, // Đường dẫn ảnh
                        quantity: 1// Số lượng
                    
                    
                });
            },

            error: function() {
                console.log("Lỗi khi lấy thông tin sản phẩm");
            }
        })

    }

    getDetail();


