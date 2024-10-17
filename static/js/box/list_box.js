const productListDiv = document.querySelector('.showResults');

function showSales(contenedor, respuesta) {
    var tarjet = "";
    console.log(respuesta);

    // Asegúrate de que 'respuesta' sea un array
    if (!Array.isArray(respuesta)) {
        respuesta = [respuesta];  // Si no es un array, lo convierte en uno
    }

    respuesta.forEach(function (box) {
        tarjet += '<tr>' +
            '<th scope="row">#' + box.id + '</th>' +
            '<td>' + box.fecha_apertura + '</td>' +
            '<td>' + box.fecha_cierre + '</td>' +
            '<td>$' + box.saldo_inicial + '</td>' +
            '<td>$' + box.saldo_final + '</td>' +
            '<td>' + box.estado + '</td>' +
            '<td style="text-align: center;">' +
                '<i class="bi bi-eye visualizer" data-id="' + box.id + '"></i>' +
            '</td>' +
            '</tr>';
    });

    contenedor.innerHTML = tarjet;
}


function imprimirFactura(ventaId) {
    var factura = document.getElementById('factura').innerHTML;
    var impresora = window.open('', '', 'width=0,height=0');
    impresora.document.write(factura);
    impresora.document.title = 'Factura N°'+ventaId;
    impresora.print();
    impresora.close();
}


$(document).ready(function() {
    $(document).on('click', '.visualizer', function() {
        var ventaId = $(this).data('id');
        $.ajax({
            url: '/api/v1/box/',
            method : 'GET',
            data : {search : ventaId},
            success: function(data) {
                console.log(data);
                if (data.length > 0) {
                    var caja = data[0]; // Acceder al primer objeto dentro del array
                    // Crear el HTML del modal
                    var modalHtml = `
                            <h3 class="text-center mb-3 font-weight-bold text-uppercase">Informe de Caja</h3>
                            <hr>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">ID de la Caja</h5>
                                <p class="lead text-dark">${caja.id}</p>
                            </div>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Fecha de Apertura</h5>
                                <p class="text-dark">${caja.fecha_apertura}</p>
                            </div>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Saldo Inicial</h5>
                                <p class="text-success h5">$${caja.saldo_inicial}</p>
                            </div>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Saldo Final</h5>
                                <p class="text-primary h5">$${caja.saldo_final}</p>
                            </div>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Valor de entradas</h5>
                                <p class="lead text-dark">${caja.total_entradas}</p>
                            </div>
                            
                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Valor de salida</h5>
                                <p class="lead text-dark">${caja.total_salidas}</p>
                            </div>
                            
                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Fecha de Cierre</h5>
                                <p class="text-dark">${caja.fecha_cierre ? caja.fecha_cierre : 'No cerrada aún'}</p>
                            </div>

                            <div class="info-box bg-light p-2 rounded mb-2 shadow-sm">
                                <h5 class="text-muted">Estado</h5>
                                <p class="text-dark">${caja.estado}</p>
                            </div>

                    `;
                    // Mostrar el modal
                    call_modal(modalHtml);
                }
            }            
                              
        });
    });

    $('#botom_search_box').click(function () {
        const valor = $('#search_box').val();
        $.ajax({
            url: '/api/v1/box/',
            method: 'GET',
            data: { search: valor },
            success: function (data) { 
                if (data.length == 0) {
                    $('#search_box').val('')
                } else {
                    showSales(productListDiv,data)
                }
            }
        });
    });
});