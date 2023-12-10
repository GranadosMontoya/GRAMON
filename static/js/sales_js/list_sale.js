const productListDiv = document.querySelector('.showResults');

function showSales(contenedor,respuesta){
    var tarjet = "";
    console.log(respuesta.results)
    respuesta.results.forEach(function(sale) {
        tarjet+='<tr>'+
                    '<th scope="row">#'+sale.id+'</th>'+
                    '<td>'+sale.client_full_name+'</td>'+
                    '<td>'+sale.user_full_name+'</td>'+
                    '<td>$'+sale.valor_final+'</td>'+
                    '<td>'+sale.created_at+'</td>'+
                    '<td style="text-align: center;">'+
                        '<i class="bi bi-eye visualizer" data-id="'+sale.id+'"></i>'+
                    '</td>'+
                ' </tr>';
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
            url: '/api/v1/sales/',
            method : 'GET',
            data : {search : ventaId},
            success: function(data){
                var productos = data.productos;
                var info_venta = data.info_venta

                var tablaHtml = '';
                for (var i = 0; i < productos.length; i++) {
                    var producto = productos[i];
                    var filaHtml = '<tr>' +
                                        '<td style="max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+
                                            producto.name+
                                        '</td>'+
                                        '<td>' + producto.cantidad + '</td>' +
                                        '<td>' + '$'+producto.precio_unitario + '</td>' +
                                        '<td>' + '$'+ producto.valor_total + '</td>' +
                                    '</tr>';
                    tablaHtml += filaHtml;
                }

                var modalHtml = '<div id="factura" class="invoice-container">'+
                                    '<div class="invoice-header">'+
                                        '<h5>Factura N° '+info_venta.id+'</h5>'+
                                    '</div>'+
                                    '<div class="invoice-details">'+
                                        '<table>'+
                                            '<tr>'+
                                                '<th>Fecha y hora de venta</th>'+
                                                '<td>'+info_venta.created_at+'</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<th>Cajero</th>'+
                                                '<td style="max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+info_venta.user_full_name+'</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<th>Cliente</th>'+
                                                '<td style="max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+info_venta.client_full_name+'</td>'+
                                            '</tr>'+
                                        '</table>'+
                                    '</div>'+
                                    '<div class="invoice-details">'+
                                        '<table>'+
                                            '<thead>'+
                                                '<tr>'+
                                                    '<th>Producto</th>'+
                                                    '<th>Cantidad</th>'+
                                                    '<th>Precio Unitario</th>'+
                                                    '<th>Total</th>'+
                                            '</tr>'+
                                            '</thead>'+
                                            '<tbody>'+
                                                tablaHtml+
                                            '</tbody>'+
                                        '</table>'+
                                    '</div>'+
                                    '<div class="invoice-details">'+
                                        '<p class="invoice-total">Subtotal: $'+info_venta.valor_final+'</p>'+
                                        '<p class="invoice-total">Impuesto (IVA 16%): $-----</p>'+
                                        '<p class="invoice-total">Total: $'+info_venta.valor_final+'</</p>'+
                                        '<p class="invoice-total">Pago con: $'+info_venta.pay+'</</p>'+
                                        '<p class="invoice-total">Cambio: $'+info_venta.change+'</</p>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="invoice-details-botons">'+
                                    '<button class="btn btn-danger  mx-1" disabled>Eliminar</button>'+
                                    '<button class="btn btn-success mx-3" onclick="imprimirFactura('+info_venta.id+')">Imprimir</button>'+
                                '</div>';
                setTimeout(function() {
                    call_modal(modalHtml)
                }, 300);
            }
        });
    });

    $('#botom_search_sale').click(function () {
        const valor = $('#search_sale').val();
        $.ajax({
            url: '/api/sales/',
            method: 'GET',
            data: { search: valor },
            success: function (data) { 
                if (data.length == 0) {
                    alert('La no existe')
                    $('#search_sale').val('')
                } else {
                    showSales(productListDiv,data)
                }
            }
        });
    });
});