const productListDiv = document.querySelector('.table_list_products');

function showproducts(contenedor,respuesta){
    var tarjet = "";
    respuesta.forEach(function(product) {
        console.log(product)
        tarjet+='<section class="card m-2 list_producto" aria-hidden="true">'+
                    '<div>'+
                        '<img class="list_image" src="'+product.image+'" alt="image.jpg">'+
                    '</div>'+
                    '<div class="list_nombre d-inline-block text-truncate">'+
                        product.name+
                    '</div>'+
                    '<div class="list_precio">'+
                        '$'+product.exit_price+
                    '</div>'+
                    '<button class="list_detalles" onclick="Getinfoproduct(' + product.code + ')"><span></span>'+
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill list_svg_info" viewBox="0 0 16 16">'+
                            '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>'+
                        '</svg> Detalles'+
                    '</button>'+
                '</section>';
    });
    contenedor.innerHTML = tarjet;
}

function Getinfoproduct(codigo) {
    var producto_info = ''
    $.ajax({
        url: '/api/products',
        method: 'GET',
        data: { search: codigo },
        success: function(response){
            for (const product of response) {
                if (product.code == codigo) {
                  producto_info = product;
                  break;
                }
            }
            $.ajax({
                url: 'info/product/',
                method: 'GET',
                data:{
                    'product_info': JSON.stringify(producto_info),
                    'csrfmiddlewaretoken': csrfToken,
                },
                success: function (detail_render) {
                    call_modal(detail_render)
                }
            });
                      
        }
    });
};

function Updateinfoproduct(codigo) {
    var producto_info = ''
    $.ajax({
        url: '/api/products/',
        method: 'GET',
        data: { search: codigo },
        success: function(response){
            for (const product of response) {
                if (product.code == codigo) {
                  producto_info = product;
                  break;
                }
            }
            $.ajax({
                url: '/update/product/',
                method: 'GET',
                data:{
                    'product_info': JSON.stringify(producto_info),
                },
                success: function (detail_render) {
                    call_modal(detail_render)
                }, error: function(error){
                    alert('repailas')
                }
            });
                      
        }
    });
};

function DeleteProduct(codigo) {
    $.ajax({
        url:'delete/product',
        method:'GET',
        data : {
            'codigo':codigo
        },
        success: function(detail_render){
            call_modal(detail_render)
            $(document).on('click', '.delete_product_def', function() {
                $.ajax({
                    url: '/api/v1/products/delete_update/',
                    method: 'DELETE',
                    data : {
                        'codigo':codigo
                    },
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    success: function(data){
                        $('.toast-body').html(data.mensaje);
                        const tostada = document.getElementById('tostada')
                        const toast = new bootstrap.Toast(tostada)
                        toast.show()
                        close_modal()
                        $('#botom_search_producto').click();
                    }
                });
            });
        }
    });
}

function initial_show_prodct(){
    $.ajax({
        url: '/api/products',
        method: 'GET',
        success: function (data) {
            showproducts(productListDiv,data)
        },
        error: function (error) {
            alert("Ha ocurrido un error inesperado")
            console.log(error)
        }
    });
}

document.addEventListener("DOMContentLoaded",function() {

    setTimeout(function() {
        $('#botom_search_producto').click();
    }, 2000);

    $('#botom_search_producto').click(function () {
        const valor = $('#search_producto').val();
        $('#search_producto').val('');
        $.ajax({
            url: '/api/products',
            method: 'GET',
            data: { search: valor },
            success: function (data) { 
                if (data.length == 0) {
                    alert('El producto no existe')
                    $('#search_producto').val('')
                } else {
                    showproducts(productListDiv,data)
                }
            }
        });
    });

    $(document).on('click', '.detail_editar', function() {
        var codigo = $(this).data('codigo');
        close_modal()
        setTimeout(function() {
            Updateinfoproduct(codigo)
            setTimeout(function() {
              add_delete_img()
            }, 300);
        }, 300);
    });
    
    $(document).on('click', '.detail_delete', function() {
        var codigo = $(this).data('codigo');
        close_modal()
        setTimeout(function() {
            DeleteProduct(codigo)
        }, 400);
    });
});