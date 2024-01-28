var venta = [];
var nombres_productos = [];
var liId = [];
let producto;
let valor_final = 0;
var spent = [];
var spent_alert = [];

function additem(item, cantidad) {
  var result = false;
  var cantidadItem = cantidad || 1;

  for (let i = 0; i < venta.length; i++) {//El producto ya existe
    if (venta[i].code == item.code) {
      venta[i].quantity += cantidadItem;
      venta[i].full_value = item.exit_price * venta[i].quantity;
      result = true;
      document.getElementById('cant' + venta[i].code).innerHTML = 'Cantidad: ' + venta[i].quantity;
      document.getElementById('value' + venta[i].code).innerHTML = 'Valor: $' + venta[i].full_value;

      if (item.amount < venta[i].quantity) {
        var validation_spent = spent.includes(item.code);
        if (!validation_spent) {
          spent.push(item.code);
        }
      }
      break;
    }
  }

  if (!result) { // El producto no existe en la venta, agrega uno nuevo
    var producto = {
      code: parseInt(item.code),
      quantity: cantidadItem,
      unit_price: parseFloat(item.exit_price),
      full_value: parseFloat(cantidadItem * item.exit_price)
    };

    var nombres_productos_item = {
      nombre: item.name
    };
    nombres_productos.push(nombres_productos_item);
    venta.push(producto);


    if (item.amount <= 0) {
      var validation_spent = spent.includes(item.code);
      if (!validation_spent) {
        spent.push(item.code);
      }
    }
    

    // Actualiza elementos HTML para reflejar los cambios
    $('#cart-items').html('');
    for (let i = 0; i < venta.length; i++) {
      const productoId = parseInt(venta[i].code);
      const validation_bonus = liId.includes(productoId);
      const validation_spent = spent_alert.includes(item.code);

      // Construye elementos HTML para cada producto en el carrito
      itemHtml = '<li class="list-group-item d-flex justify-content-between lh-sm' + (validation_bonus ? ' clicked' : '') + '" id="Li' + productoId + '" style="margin-left: 15px; margin-bottom: 5px">' +
        '<div>' +
          '<h6 class="my-0">' + nombres_productos[i].nombre + '</h6>' +
          '<div class="text-group">' +
            '<small class="text-muted" id="cant' + venta[i].code + '">'+
                '</span> Cantidad: ' + venta[i].quantity + '</span>' +
            '</small>' +
            '<small class="text-muted">Precio unitario: $' + venta[i].unit_price + '</span>' + '</small>' +
          '</div>' +
        '</div>' +
        '<div id="alert_spent'+item.code+'" class="icon-container">'+
          '<i class="bi bi-exclamation-triangle icon_sale spent-icon'+ (validation_spent ? ' active_bonus' : '')+'" id="alert_'+item.code+'"></i>'+
        '</div>'+
        '<span class="text-success full-value" id="value' + venta[i].code + '">Valor: $' + venta[i].full_value + '</span>' +
        '<div class="icon-container" id=' + 'icon-container' + productoId + '>' +
          '<i class="bi bi-patch-check icon_sale bonus-item' + (validation_bonus ? ' active_bonus' : '') + '" data-producto-idbonus=' + venta[i].code + '></i>' +
          '<i class="bi bi-dash-circle icon_sale menos-item" data-producto-idrest=' + venta[i].code + '></i>' +
          '<i class="bi bi-trash icon_sale remove-item" data-producto-idremove=' + venta[i].code + '></i>' +
        '</div>' +
        '</li>';
      $('#cart-items').prepend(itemHtml);
    }
  }

  if (spent.includes(item.code)) {
    alert('oe')
    $('#alert_'+item.code).addClass('active_bonus');
  }else{
    alert('chao')
  }
  // Calcula el precio total y lo muestra
  valor_final = 0;
  for (let i = 0; i < venta.length; i++) {
    valor_final += parseFloat(venta[i].full_value);
  }

  // Actualiza el contador del carrito
  const count = $('#cart-items li').length;
  $('.badge').text(count);

  // Actualiza el total y aplica un estilo si es necesario
  $('#cart-total').html('<h3 id="valor_final">Total: $<strong class="' + (valor_final <= 0 ? 'producto-agotado' : '') + '">' + valor_final + '</strong>' +
    '<button type="button" class="btn btn-success float-end" data-bs-toggle="modal" id="Next" data-bs-target="#modalclient">Siguiente</button></h3>');
}

function pre_venta(item, cantidad) {
  
}

function removeItem(productoId, element) {
  for (let i = 0; i < venta.length; i++) {
    if (venta[i].code == productoId) {
      valor_final -= venta[i].full_value;
      nombres_productos.splice(i, 1);
      venta.splice(i, 1);
      if (venta.length <= 0) {
        document.getElementById('valor_final').innerHTML = 'Total: $<strong>' + valor_final + '</strong>'+
        '<button type="button" class="btn btn-outline-success float-end" disabled>Siguiente</button>';
      }else{
        $('#cart-total').html('<h3 id="valor_final">Total: $<strong>' + valor_final + '</strong>'+ 
        '<button type="button" class="btn btn-success float-end" data-bs-toggle="modal" id="Next" data-bs-target="#modalclient">Siguiente</button></h3>');
      }
      break;
    }
  }
  element.closest('.list-group-item').remove();
  // Actualiza el contador del venta
  const count = $('#cart-items li').length;
  $('.badge').text(count);
  const index = liId.indexOf(productoId);
  if (index > -1) {
    liId.splice(index, 1);
  }
}

function sendsale(client, products, final_value, pay) {
  const devuelta = pay - final_value
  $.ajax({
      url: '/api/v1/sales/',
      type: 'POST',
      dataType: 'json',
      headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          "client": client,
          "products": products,
          "valor_final" : final_value,
          "pay" : pay,
          "change" : devuelta
      }),
      traditional: true,
      success: function(response) {
        emptyHtml = ''
        $('#client').val(emptyHtml);
        $('#pay').val(emptyHtml);
        $('#cart-items').html(emptyHtml);
        $('.badge').text('0');
        $('#cart-total').html('<h3 id="valor_final">Total: $<strong>0</strong>'+ 
        '<button type="button" class="btn btn-outline-success float-end" data-bs-toggle="modal" id="Next" disabled>Siguiente</button></h3>');
        $('#modalclient').modal('hide');
        $('.toast-body').html('Venta N° ' + response.factura+ ' realizada exitosamente');
        tostada = document.getElementById('tostada')
        toast = new bootstrap.Toast(tostada)
        toast.show()
        venta = [];
        nombres_productos = [];
        $.ajax({
          url: '/api/v1/sales/',
          method : 'GET',
          data : {search : response.factura},
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
                                  '<div class="invoice-header modal-header">'+
                                      '<h5>Factura N° '+info_venta.id+'</h5>'+
                                      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
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
                                  '<button class="btn btn-success mx-3" onclick="imprimirFactura('+info_venta.id+')">Imprimir</button>'+
                              '</div>';
              setTimeout(function() {
                  call_modal(modalHtml)
              }, 300);
          }
        });
      },
      error: function (error) {
        document.getElementById('mensaje_error').innerHTML = 'Ha ocurrido un error al intentar registrar la venta';
        $('#errorModal').modal('show');
        $('#client').val(emptyHtml);
        $('#pay').val(emptyHtml);
        console.log(error)
      }
  });
}

function imprimirFactura(ventaId) {
  var factura = document.getElementById('factura').innerHTML;
  var impresora = window.open('', '', 'width=0,height=0');
  impresora.document.write(factura);
  impresora.document.title = 'Factura N°'+ventaId;
  impresora.print();
  impresora.close();
}

$('.inputproducts').keypress(function(event) {
  if (event.which === 13) {
    $('#sendproduct').click();
  }
});

document.addEventListener("DOMContentLoaded", function() {

  $('#sendproduct').click(function () {
    const valor = $('.inputproducts').val();
    $.ajax({
      url: '/api/products/',
      method: 'GET',
      data: { search: valor },
      success: function (data) {
        let existe = false
        for (let i = 0; i < data.length; i++) {
          if (data[i].code == valor){
            var item = data[i];
            existe = true;
            break;
          }
        }
        if (existe) { // El producto existe en la base de datos
          $('.inputproducts').val(''); // vaciar el campo de búsqueda
          additem(item)
        } else{
          alert('el producto no existe')
        }
      }
    });
  });

  $(document).on('click', '#searchproducts_button', function() {
    const valor = $('.searchproducts').val();
    const lista = $('#list-search-items');
    lista.empty();
    const spinnerContainer = $('<div id="spinner-container" class="spinner-container"><div class="spinner-border text-success" role="status"><span class="visually-hidden">Loading...</span></div></div>');
    lista.append(spinnerContainer);
    setTimeout(function (){
      $.ajax({
        url: '/api/products/',
        method: 'GET',
        data: { search: valor },
        success: function (data) {
          if (data.length > 0){
            data.forEach(function (resultado) {
              spinnerContainer.hide();
              itemHtml = '<li class="d-flex gap-4 justify-content-between">'+
                              '<div>'+
                                '<h5>'+resultado.name+'</h5>'+
                                '<p class="propiedades_result">Precio: '+resultado.exit_price+'</p>'+
                                '<p class="propiedades_result">Cantidad en inventario: '+resultado.amount+'</p>'+
                              '</div>'+
                              '<button type="button" class="btn btn-outline-success float-end add_product_button" data-producto=\''+JSON.stringify(resultado)+'\'>Seleccionar</button>' +
                            '</li>'+
                            '</br>'
              lista.append(itemHtml);
              console.log(lista)
            });
            // Actualiza el contenido de la tabla con los resultados
            $('#list-search-items').append(lista);
          }else{
            lista.text('No se encontraron resultados');
          }
        },
        error: function () {
          spinnerContainer.hide();
        }
      });
    },2000);
  });

  $('#client').on('input', function() {
    var query = $(this).val();
    $.ajax({
      url: '/api/v1/search/customer/',
      method: 'GET',
      data: { search: query },
      success: function (data) {
        var opciones = '';
        if (data.length === 0) {
          alert('No se encontraron clientes con ese nombre.');
        } else {
          data.forEach(function(customer) {
            opciones += '<option value="'+ customer.id + '">' + customer.name +' ' +customer.last_name+'</option>';
          });
          $('#sugerencias').html(opciones);
        }
      }
    });
  });

  $('#registrar_venta').click(function () {
    let clientlengt = false
    const cliente = $('#client').val();
    let existe = false;
    if (cliente.length != 0) {
      clientlengt = true
    }
    if (clientlengt) {
      $(this).prop('disabled', true);
      $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
      setTimeout(function (){
        $.ajax({
          url: '/api/v1/search/customer/',
          method: 'GET',
          data: { search: cliente },
          success: function (data) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id == cliente){
                existe = true;
                break;
              }
            }
            if (existe) {
              const pay = $('#pay').val();
              if (pay < valor_final) {
                alert('El valor a pagar debe ser superior al valor de la factura')
              }
              else{
                sendsale(cliente, venta, valor_final, pay)
              }
            }else{
              alert('Los datos ingresado no son validos, ingrese o seleccione la cedula del cliente')
            }
            $('#registrar_venta').prop('disabled', false);
            $('#registrar_venta').html('Registrar venta');
          },
          error: function(error){
            $('#errorModal').modal('show');
            console.log(error)
          }
        });
      },3000);
    }else{
      alert('el campo no puede estar vacio')
    }
  });

  $(document).on('click', '.add_product_button', function() {
    producto = $(this).data('producto');
    $('#productexplorer').modal('hide');
    $('.searchproducts').val('');
    $('#product-name').text(producto.name+':');
    $('#quantityProduct').modal('show');
  });
  
  $(document).on('click', '.sendcantidad', function() {
    let cantidad = $('.inputcantidad').val();
    cantidad = parseFloat(cantidad);
    additem(producto, cantidad);
    $('.inputcantidad').val('');
    $('#quantityProduct').modal('hide');
  });

  $(document).on('click', '.bonus-item', function(){
    let productoId = $(this).data('producto-idbonus');
    if ($(this).hasClass('active_bonus')) {
      // Si el botón ya tiene la clase 'active_bonus', se elimina la clase y se remueve el elemento del array
      $(this).removeClass('active_bonus');
      $('#Li' + productoId).removeClass('clicked');
      const index = liId.indexOf(productoId);
      if (index > -1) {
        liId.splice(index, 1);
      }
    } else {
      // Si el botón no tiene la clase 'active_bonus', se agrega la clase y se agrega el elemento al array
      $(this).addClass('active_bonus');
      $('#Li' + productoId).addClass('clicked');
      liId.push(productoId);
    }
  });

  $(document).on('click', '.menos-item', function() {
    var productoId = $(this).data('producto-idrest');
    var exist = false
    for (let i = 0; i < venta.length; i++) {
      if (venta[i].code == productoId) {
        exist = true
        var ind = i
        break;
      }
    }
    if (exist) {
      venta[ind].quantity -=1
      if (venta[ind].quantity <=0) {
        removeItem(productoId, $(this));
      }else{
        venta[ind].full_value -= venta[ind].unit_price
        valor_final -= venta[ind].unit_price
        document.getElementById('cant'+venta[ind].code).innerHTML = 'Cantidad: ' + venta[ind].quantity;
        document.getElementById('value'+venta[ind].code).innerHTML = 'Valor: $' + venta[ind].full_value;
        $('#cart-total').html('<h3 id="valor_final">Total: $<strong>' + valor_final + '</strong>'+ 
        '<button type="button" class="btn btn-success float-end" data-bs-toggle="modal" id="Next" data-bs-target="#modalclient">Siguiente</button></h3>');
      }
    }
  });

  $(document).on('click', '.remove-item', function() {
    var productoId = $(this).data('producto-idremove');
    removeItem(productoId, $(this));
  });
});