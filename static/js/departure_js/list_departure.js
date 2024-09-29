const DeparturesList = document.querySelector('.showResults');

function showSales(contenedor,respuesta){
    var tarjet = "";
    respuesta.results.forEach(function(departure) {
        tarjet+='<tr>'+
                    '<th scope="row">#'+departure.id+'</th>'+
                    '<td>'+departure.name+'</td>'+
                    '<td>$'+departure.exit_price+'</td>'+
                    '<td>'+departure.created_at+'</td>'+
                    '<td style="text-align: center;">'+
                        '<i class="bi bi-eye visualizer" data-id="'+departure.id+'"></i>'+
                    '</td>'+
                ' </tr>';
    });
    contenedor.innerHTML = tarjet;
}

function imprimirFactura(SalidaId) {
    var salida = document.getElementById('Salida').innerHTML;
    var impresora = window.open('', '', 'width=0,height=0');
    impresora.document.write(salida);
    impresora.document.title = 'Salida N°'+SalidaId;
    impresora.print();
    impresora.close();
}


$(document).ready(function() {
    $(document).on('click', '.visualizer', function() {
        var SalidaId = $(this).data('id');
        $.ajax({
            url: '/api/v1/departure/',
            method : 'GET',
            data : {search : SalidaId},
            success: function(data){
                var modalHtml = '<div class="invoice" id="Salida">'+
                                    '<h2>Factura de Salida</h2>'+
                                    '<ul class="invoice-details">'+
                                        '<li><strong>ID de Salida:</strong> <span id="departure-id">'+data.info_salida.id+'</span></li>'+
                                        '<li><strong>Motivo:</strong> <span id="departure-name">'+data.info_salida.name+'</span></li>'+
                                        '<li><strong>Precio de Salida:</strong> <span id="departure-price">$'+data.info_salida.exit_price+'</span></li>'+
                                        '<li><strong>Fecha de Creación:</strong> <span id="departure-date">'+data.info_salida.created_at+'</span></li>'+
                                    '</ul>'+
                                    '<div class="departure_user">'+
                                        '<strong>Usuario:</strong> <span id="user-price">'+data.info_salida.user_full_name+'</span>'+
                                    '</div>'+
                                    '<button class="btn-print" onclick="imprimirFactura('+data.info_salida.id+')"">Imprimir Factura</button>'+
                                '</div>';
                call_modal(modalHtml)
            }
        });
    });

    $('#botom_search_departure').click(function () {
        const valor = $('#search_departure').val();
        $.ajax({
            url: '/api/departures/',
            method: 'GET',
            data: { search: valor },
            success: function (data) { 
                if (data.length == 0) {
                    $('#search_departure').val('')
                } else {
                    showSales(DeparturesList,data)
                }
            }
        });
    });
});