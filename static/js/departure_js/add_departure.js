function  AddDeparture(datos) {
    $.ajax({
        url:'/api/departures/',
        method: 'POST',
        data: JSON.stringify(datos),
        contentType: 'application/json',
        headers:{
            'X-CSRFToken': csrfToken
        },
        success: function (data) {
           $('.toast-body').html('Salida registrada exitosamente');    //$('.toast-body').html(data.response);
            const tostada = document.getElementById('tostada')
            const toast = new bootstrap.Toast(tostada)
            toast.show()
            close_modal()
            $('#botom_search_departure').click();
          },
        error: function (xhr, status, error) {
          console.error('Error al registrar la salida', error);
          console.log('Detalles del error:', xhr.responseText); // Esto mostrará el mensaje de error completo
        },
    });
};
  
var formularioEnviado = false;  
  
$(document).on('click', '#modal_add_departure', function () {
    if (!formularioEnviado) {
      $.ajax({
        url: '/add/departure/',
        success: function (data) {
          call_modal(data);
        },
        error: function (error) {
          alert('Algo salió mal');
        }
      });
    }
});

$(document).on('click', '.departure_send', function() {
    if (!formularioEnviado) {
        var FormUpdate = {
            'name' : $("#name_departure").val(),
            'exit_price': $("#exit_price_departure").val(),
        }
      document.getElementById("add_departure_form").reset();
      AddDeparture(FormUpdate)
    }
});

  