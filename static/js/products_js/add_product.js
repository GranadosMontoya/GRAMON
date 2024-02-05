$('.modal_create_product').click(function () {
  $.ajax({
    url: '/add/product/',
    success: function (data) {
      call_modal(data)
      add_delete_img()
      $(document).ready(function() {
        $("#mi_formulario").submit(function(event) {
          $('.addproduct_boton').prop('disabled', true);
          $('.addproduct_boton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
          event.preventDefault();
          var formData = new FormData();
          formData.append('name', $("#name").val());
          formData.append('code', $("#code").val());
          formData.append('amount', $("#amount").val());
          formData.append('entry_price', $("#entry_price").val());
          formData.append('exit_price', $("#exit_price").val());
          var imageInput = $('#input_image_product')[0];
          
          if (imageInput.files.length > 0) {
            formData.append('image', imageInput.files[0]);
          }
          var exit = $("#exit_price").val();
          var entry = $("#entry_price").val()
          if(parseInt(exit) < parseInt(entry)){
              alert('el precio de salida debe ser mayor al precio de entrada')
            $("#entry_price").val('');
            $("#exit_price").val('');
            $('.addproduct_boton').prop('disabled', false);
            $('.addproduct_boton').html('Crear Producto');
          }else{
            setTimeout(function(){
              $.ajax({
                url: '/api/products/',
                method: 'POST',
                headers: {
                  'X-CSRFToken': csrfToken
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                  $('.toast-body').html('Producto '+response.name+' creado correctamente');
                  const tostada = document.getElementById('tostada')
                  const toast = new bootstrap.Toast(tostada)
                  toast.show()
                  close_modal()
                  $('#botom_search_producto').click();
                  $('.addproduct_boton').prop('disabled', false);
                },
                error: function(error) {
                  if (error.responseJSON) {
                    var fieldsWithErrors = Object.keys(error.responseJSON);
                    if (fieldsWithErrors.includes("code")) {
                      alert("Error en el campo 'codigo' probablemente el código ya este en uso o el tipo de dato no es valido");
                      $("#code").val('')
                      $('.addproduct_boton').prop('disabled', false);
                      $('.addproduct_boton').html('Crear Producto');
                    } else {
                      alert("Ha ocurrido un error en algunos campos")
                      console.error("Error en los siguientes campos:", fieldsWithErrors);
                      $('.addproduct_boton').prop('disabled', false);
                      $('.addproduct_boton').html('Crear Producto');
                    }
                  } else {
                    console.error("Error al crear el producto:", error);
                  }
                }            
              });
            }, 1000)
          }
        });
      });
    },
    error: function (error) {
      alert('Algo salió mal');
    }
  });
});