var venta = [];
var nombres_productos = [];
var liId = [];
let valor_final = 0;
var spent = {};
var spent_empty = [];

function limpiarLocalStorage() {
  return new Promise((resolve) => {
    localStorage.removeItem('carrito');
    localStorage.removeItem('nombres_productos');
    localStorage.removeItem('liId');
    localStorage.removeItem('spent');
    localStorage.removeItem('spent_empty');
    resolve();
  });
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(venta));
  localStorage.setItem('nombres_productos', JSON.stringify(nombres_productos));
  localStorage.setItem('liId', JSON.stringify(liId));
  localStorage.setItem('spent', JSON.stringify(spent));
  localStorage.setItem('spent_empty', JSON.stringify(spent_empty));
}

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

      spent[item.code] -= cantidadItem;
      let cantidad_dispo = spent[item.code]

      if(cantidad_dispo < 0){
        if (!(item.code in spent_empty)) {
          spent_empty.push(item.code);
          spent_empty = spent_empty.map(code => parseInt(code));
        }
        var alert_spent_element = document.getElementById('alert_spent' + venta[i].code);
        alert_spent_element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-diamond-fill alert_true_spent" viewBox="0 0 16 16">' +
        '<path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>';
      }
      else{
        if (item.code in spent_empty) {
          var index = spent.indexOf(parseInt(item.code));
          if (index !== -1) {
            spent_empty.splice(index, 1);
            var alert_spent_element = document.getElementById('alert_spent' + venta[i].code);
            alert_spent_element.innerHTML = '';
          }
        }
      }

      for (var key in spent) {
        if (spent.hasOwnProperty(key)) {
            console.log("Clave: " + key + ", Valor: " + spent[key]);
        }
      }
    }
  }

  if (!result) { // El producto no existe en la venta, agrega uno nuevo
    
    spent[item.code] = parseInt(item.amount);

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

    spent[item.code]-=cantidadItem;

    let cantidad_dispo = spent[item.code]
    if(cantidad_dispo < 0){
      spent_empty.push(item.code);
      spent_empty = spent_empty.map(code => parseInt(code));
    }

    // Actualiza elementos HTML para reflejar los cambios
    $('#cart-items').html('');
    for (let i = 0; i < venta.length; i++) {
      const productoId = parseInt(venta[i].code);
      const validation_bonus = liId.includes(productoId);
      const validation_spent = spent_empty.includes(venta[i].code);
      // Construye elementos HTML para cada producto en el carrito
      itemHtml = '<li class="list-group-item d-flex justify-content-between lh-sm' + (validation_bonus ? ' clicked' : '')+'" id="Li' + productoId + '" style="margin-left: 15px; margin-bottom: 5px; display: flex; align-items: center;">' + 
      '<div style="flex: 35%;">' + 
        '<h6 class="my-0">' + nombres_productos[i].nombre + '</h6>' + 
      '</div>' + 
      '<div class="text-group" style="flex: 25%;">' + 
        '<small class="text-muted" id="cant' + venta[i].code + '"> Cantidad: ' + venta[i].quantity + '</small>' + 
        '<small class="text-muted">Precio unitario: $' + venta[i].unit_price + '</small>' + 
      '</div>' + 
      '<div id="alert_spent' + venta[i].code + '" class="icon-container container_spent" style="flex: 20%;">' +
      (validation_spent ?
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-diamond-fill alert_true_spent" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Este producto no tiene existencias en el inventario">' +
        '<path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>' +
        '</svg>'    
          : '') +
      '</div>' + 
      '<span class="text-success full-value" id="value' + venta[i].code + '" style="flex: 15%;">Valor: $' + venta[i].full_value + '</span>' + 
      '<div class="icon-container" id=' + 'icon-container' + productoId + ' style="flex: 5%;">' + 
        '<i class="bi bi-patch-check icon_sale bonus-item' + (validation_bonus ? ' active_bonus' : '') + '" data-producto-idbonus=' + venta[i].code + '></i>' + 
        '<i class="bi bi-dash-circle icon_sale menos-item" data-producto-idrest=' + venta[i].code + '></i>' + 
        '<i class="bi bi-trash icon_sale remove-item" data-producto-idremove=' + venta[i].code + '></i>' + 
      '</div>' + 
    '</li>';
      $('#cart-items').prepend(itemHtml);
    }
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
  guardarCarritoEnLocalStorage();
}

function removeItem(productoId, element) {
  for (let i = 0; i < venta.length; i++) {
    if (venta[i].code == productoId) {
        var productoEliminado = venta[i];  // Almacena el producto antes de eliminarlo
        valor_final -= productoEliminado.full_value;
        nombres_productos.splice(i, 1);
        venta.splice(i, 1);
        delete spent[productoId]; // Elimina la entrada correspondiente en spent
        var indexx = spent_empty.indexOf(parseInt(productoId));
        if (indexx !== -1) {
            spent_empty.splice(indexx, 1); // Elimina el producto del spent_empty
        }
        if (venta.length <= 0) {
            limpiarLocalStorage();
            document.getElementById('valor_final').innerHTML = 'Total: $<strong>' + valor_final + '</strong>'+
                '<button type="button" class="btn btn-outline-success float-end" disabled>Siguiente</button>';
        } else {
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
  guardarCarritoEnLocalStorage();
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
        ;
        $.ajax({
          url: '/api/v1/sales/',
          method : 'GET',
          data : {search : response.factura},
          success: function(data){
              var productos = data.productos;
              var info_venta = data.info_venta

              var diccionario = {
                  productos: productos, // Asigna la variable 'productos' al diccionario
                  info_venta: info_venta // Asigna la variable 'info_venta' al diccionario
              };
              
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
                                      '<p class="invoice-total">Total: $'+info_venta.valor_final+'</</p>'+
                                      '<p class="invoice-total">Pago con: $'+info_venta.pay+'</</p>'+
                                      '<p class="invoice-total">Cambio: $'+info_venta.change+'</</p>'+
                                  '</div>'+
                              '</div>'+
                              '<div class="invoice-details-botons">'+
                                  '<button class="btn btn-success mx-3" id="btn-imprimir">Imprimir</button>'+
                              '</div>';
              setTimeout(function() {
                  call_modal(modalHtml)
                  document.getElementById('btn-imprimir').addEventListener('click', function() {
                    imprimirFactura(diccionario);
                  });
              }, 300);
          }
        });
      },
      error: function (error) {
        document.getElementById('mensaje_error').innerHTML = 'Ha ocurrido un error al intentar registrar la venta, puede tratars de que aún no existe una caja abierta';
        $('#errorModal').modal('show');
        $('#client').val('');
        $('#pay').val('');
        console.log(error)
      }
  });
  limpiarLocalStorage()
}

function imprimirFactura(diccionario) {
    
  $.ajax({
      url: '/factura/sale/', // URL del endpoint que devuelve el HTML de la factura
      method: 'GET',
      data: { factura_sale: JSON.stringify(diccionario) }, // Serializa el diccionario como una cadena JSON
      success: function(data) {
          // Crea un iframe invisible
          var iframe = document.createElement('iframe');
          iframe.style.position = 'absolute';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = 'none';

          // Agrega el iframe al documento
          document.body.appendChild(iframe);

          // Obtén el documento dentro del iframe
          var doc = iframe.contentWindow.document;
          doc.open();
          doc.write(data); // Escribe directamente el HTML de la factura recibido
          doc.close();

          // Espera a que el contenido esté completamente cargado y listo para imprimir
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          // Elimina el iframe después de la impresión
          document.body.removeChild(iframe);
      },
      error: function(error) {
          console.error("Error al obtener la factura:", error);
      }
  });
}

$('.inputproducts').keypress(function(event) {
  if (event.which === 13) {
    $('#sendproduct').click();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  
  function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      alert('Hay una venta en curso')
      venta = JSON.parse(carritoGuardado);
      nombres_productos = JSON.parse(localStorage.getItem('nombres_productos')) || [];
      liId = JSON.parse(localStorage.getItem('liId')) || [];
      spent = JSON.parse(localStorage.getItem('spent')) || [];
      spent_empty = JSON.parse(localStorage.getItem('spent_empty')) || [];

    }
  };

  function actualizarInterfaz() {
    if (venta.length > 0) {
      // Recorre cada elemento en la lista de venta y construye el HTML correspondiente
      for (let i = 0; i < venta.length; i++) {
        const productoId = parseInt(venta[i].code);
        const validation_bonus = liId.includes(productoId);
        const validation_spent = spent_empty.includes(venta[i].code);
        // Construye elementos HTML para cada producto en el carrito
        itemHtml = '<li class="list-group-item d-flex justify-content-between lh-sm' + (validation_bonus ? ' clicked' : '')+'" id="Li' + productoId + '" style="margin-left: 15px; margin-bottom: 5px; display: flex; align-items: center;">' + 
          '<div style="flex: 35%;">' + 
            '<h6 class="my-0">' + nombres_productos[i].nombre + '</h6>' + 
          '</div>' + 
          '<div class="text-group" style="flex: 25%;">' + 
            '<small class="text-muted" id="cant' + venta[i].code + '"> Cantidad: ' + venta[i].quantity + '</small>' + 
            '<small class="text-muted">Precio unitario: $' + venta[i].unit_price + '</small>' + 
          '</div>' + 
          '<div id="alert_spent' + venta[i].code + '" class="icon-container container_spent" style="flex: 20%;">' +
          (validation_spent ?
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-diamond-fill alert_true_spent" viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Este producto no tiene existencias en el inventario">' +
          '<path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>' +
            '</svg>'
            : '') +
          '</div>' + 
          '<span class="text-success full-value" id="value' + venta[i].code + '" style="flex: 15%;">Valor: $' + venta[i].full_value + '</span>' + 
          '<div class="icon-container" id=' + 'icon-container' + productoId + ' style="flex: 5%;">' + 
            '<i class="bi bi-patch-check icon_sale bonus-item' + (validation_bonus ? ' active_bonus' : '') + '" data-producto-idbonus=' + venta[i].code + '></i>' + 
            '<i class="bi bi-dash-circle icon_sale menos-item" data-producto-idrest=' + venta[i].code + '></i>' + 
            '<i class="bi bi-trash icon_sale remove-item" data-producto-idremove=' + venta[i].code + '></i>' + 
          '</div>' + 
        '</li>';
        $('#cart-items').prepend(itemHtml);
      }
      
      // Calcula el precio total y lo muestra
      valor_final = venta.reduce((total, producto) => total + parseFloat(producto.full_value), 0);
  
      // Actualiza el contador del carrito
      const count = $('#cart-items li').length;
      $('.badge').text(count);
  
      // Actualiza el total y aplica un estilo si es necesario
      $('#cart-total').html('<h3 id="valor_final">Total: $<strong class="' + (valor_final <= 0 ? 'producto-agotado' : '') + '">' + valor_final + '</strong>' +
        '<button type="button" class="btn btn-success float-end" data-bs-toggle="modal" id="Next" data-bs-target="#modalclient">Siguiente</button></h3>');
    } else {
      // Si no hay productos en la venta, muestra el total como cero y deshabilita el botón de siguiente
      $('.badge').text('0');
      $('#cart-total').html('<h3 id="valor_final">Total: $<strong>0</strong>' +
        '<button type="button" class="btn btn-outline-success float-end" data-bs-toggle="modal" id="Next" disabled>Siguiente</button></h3>');
    }
  };

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
          $('.inputproducts').val(''); // vaciar el campo de búsqueda
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
    }else{
      alert('el campo no puede estar vacio')
    }
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

  $(document).on('click', '.menos-item', async function() {
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
        spent[venta[ind].code]+=1;
        let cantidad_dispo = spent[venta[ind].code]
        if(cantidad_dispo < 0){
          if (!spent_empty.includes(venta[ind])) {
            spent_empty.push(venta[ind]);
            spent_empty = spent_empty.map(code => parseInt(code));
          }       
          var alert_spent_element = document.getElementById('alert_spent' + venta[ind].code);
           alert_spent_element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-diamond-fill alert_true_spent" viewBox="0 0 16 16">' +
          '<path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>';
        }
        else {
          var index = spent_empty.indexOf(venta[ind].code); // Encuentra el índice del elemento en spent_empty
          if (index !== -1) {
              spent_empty.splice(index, 1); // Elimina el elemento del array
          }
          var alert_spent_element = document.getElementById('alert_spent' + venta[ind].code);
          alert_spent_element.innerHTML = '';
          
        }      
      }
    }
    guardarCarritoEnLocalStorage();
  });

  $(document).on('click', '.remove-item', function() {
    var productoId = $(this).data('producto-idremove');
    removeItem(productoId, $(this));
  });

  $(document).on('click','.delete_car', async function(){
    emptyHtml = ''
    $('#client').val(emptyHtml);
    $('#pay').val(emptyHtml);
    $('#cart-items').html(emptyHtml);
    $('.badge').text('0');
    $('#cart-total').html('<h3 id="valor_final">Total: $<strong>0</strong>'+ 
    '<button type="button" class="btn btn-outline-success float-end" data-bs-toggle="modal" id="Next" disabled>Siguiente</button></h3>');
    venta = [];
    nombres_productos = [];
    liId = [];
    valor_final = 0;
    spent = [];
    spent_empty = [];
    

    // Limpiar el localStorage y restablecer las variables
    localStorage.removeItem('carrito');
    localStorage.removeItem('nombres_productos');
    localStorage.removeItem('liId');
    localStorage.removeItem('spent');
    emptyHtml = '';
    $('#client').val(emptyHtml);
    $('#pay').val(emptyHtml);
    $('#cart-items').html(emptyHtml);
    $('.badge').text('0');
    $('#cart-total').html('<h3 id="valor_final">Total: $<strong>0</strong>'+ 
    '<button type="button" class="btn btn-outline-success float-end" data-bs-toggle="modal" id="Next" disabled>Siguiente</button></h3>');
    venta = [];
    nombres_productos = [];
    liId = [];
    valor_final = 0;
    spent = [];
  });
cargarCarritoDesdeLocalStorage();
actualizarInterfaz();
});
