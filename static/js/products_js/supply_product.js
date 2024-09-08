function SupplyProduct(datos) {
  $.ajax({
      url:'/api/v1/products/delete_update/',
      method: 'POST',
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

var formularioEnviado = false;

$(document).on('click', '#modal_supply_product', function () {
  if (!formularioEnviado) {
    $.ajax({
      url: '/supply/product/',
      success: function (data) {
        call_modal(data);
      },
      error: function (error) {
        alert('Algo salió mal');
      }
    });
  }
});

$(document).on('click', '.supply_send', function() {
  if (!formularioEnviado) {
    formularioEnviado = true;
    var FormUpdate = {
      'code' : $("#supply_id").val(),
      'amount': $("#amount_supply").val(),
    }
    $.ajax({
      url: '/api/products/',
      method: 'GET',
      data: { search: FormUpdate.code },
      success: function (data) {
        let existe = false
        for (let i = 0; i < data.length; i++) {
          if (data[i].code == FormUpdate.code){
            existe = true;
            break;
          }
        }
        if (existe) {
          document.getElementById("supplyform").reset();
          SupplyProduct(FormUpdate)
        } else{
          document.getElementById("supplyform").reset();
          alert('el producto no existe')
        }
      },
      complete: function () {
        formularioEnviado = false;
      }
    });
  }
});
