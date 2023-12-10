function actualizarProducto(datos) {
    $.ajax({
        url:'/api/v1/products/delete_update/',
        method: 'PUT',
        data: JSON.stringify(datos),
        contentType: 'application/json',
        headers:{
            'X-CSRFToken': csrfToken
        },
        success: function (data) {
            $('.toast-body').html(data.response);
            const tostada = document.getElementById('tostada')
            const toast = new bootstrap.Toast(tostada)
            toast.show()
            close_modal()
            $('#botom_search_producto').click();
          },
          error: function (xhr, status, error) {
            console.error('Error al actualizar el producto:', error);
            console.log(error)
          },
    });
}

document.addEventListener("DOMContentLoaded",function() {
    $(document).ready(function() {
        $(document).on('click', '.updateproduct_boton', function() {
            var FormUpdate = {
                'code' : existingCode,
                'name' : $("#name").val(),
                'amount': $("#amount").val(),
                'entry_price': $("#entry_price").val(),
                'exit_price': $("#exit_price").val(),
            }
            var exit = $("#exit_price").val();
            var entry = $("#entry_price").val()
            if(parseInt(exit) < parseInt(entry)){
                alert('el precio de salida debe ser mayor al precio de entrada')
            }else{
                $('.updateproduct_boton').prop('disabled', true);
                $('.updateproduct_boton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
                setTimeout(function(){
                    actualizarProducto(FormUpdate)
                    $('.updateproduct_boton').prop('disabled', false);
                },2000)
            }
        });    
    });
});