function AddBox(datos) {
    $.ajax({
        url:'/api/box/',
        method: 'POST',
        data: JSON.stringify(datos),
        contentType: 'application/json',
        headers:{
            'X-CSRFToken': csrfToken
        },
        success: function (data) {
           $('.toast-body').html('Apertura de caja exitosa');    //$('.toast-body').html(data.response);
            const tostada = document.getElementById('tostada')
            const toast = new bootstrap.Toast(tostada)
            toast.show()
            close_modal()
            // $('#botom_search_departure').click();
        },
        error: function (xhr, status, error) {
            console.error('Error al intentar abrir la caja', error);
            console.log(error)
        },
    });
};
  
var formularioEnviado = false;  
  
$(document).on('click', '#modal_apertura_caja', function () {
    if (!formularioEnviado) {
        $.ajax({
            url: '/add/box/',
            success: function (data) {
                call_modal(data);
            },
            error: function (error) {
                alert('Algo salió mal');
            }
        });
    }
});

$(document).on('click', '.box_send', function() {
    if (!formularioEnviado) {
        formularioEnviado = true;
        var FormUpdate = {
            'saldo_inicial' : $("#add_box").val(),
        }
        document.getElementById("add_box_form").reset();
        AddBox(FormUpdate)
    }
});




$('.modal_close_box').click(function () {

    $.ajax({
        url:'/api/box/',
        method: 'GET',
        contentType: 'application/json',
        headers:{
            'X-CSRFToken': csrfToken
        },
        success: function(caja){
            caja.results.forEach(function(cajaItem) {
                $.ajax({
                    url: '/close/box/',
                    success: function (data) {
                    call_modal(data)
                    $(document).ready(function() {
                        formularioEnviado = false;  
                        $("#mi_formulario_cierre_caja").submit(function(event) {
                            $('.addproduct_boton').prop('disabled', true);    
                            $('.addproduct_boton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
                            event.preventDefault();
                            var formData = new FormData();
                            formData.append('box_id', cajaItem.id);
                            formData.append('saldo_final', $("#monto_real").val());
                            $.ajax({
                                url: '/api/box/',
                                method: 'PUT',  
                                headers: {
                                    'X-CSRFToken': csrfToken
                                },
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function(response) {
                                    $('.toast-body').html('Caja cerrrada de manera exitosa');
                                    const tostada = document.getElementById('tostada')
                                    const toast = new bootstrap.Toast(tostada)
                                    toast.show()
                                    close_modal()
                                },
                                error: function (xhr, status, error) {
                                    console.log(error)
                                },
                            });
                        });
                    });
                    },
                    error: function (error) {
                    alert('Algo salió mal');
                    }
                });
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al intentar recuperar el ID de la caja', error);
            console.log(error)
        },
    });
});


$(document).on('click', '#modal_apertura_caja2', function () {
    if (!formularioEnviado) {
        $.ajax({
            url: '/add/box2/',
            success: function (data) {
                call_modal(data);
                formularioEnviado = false; 
            },
            error: function (error) {
                alert('Algo salió mal');
            }
        });
    }
});