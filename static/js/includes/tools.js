function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrfToken = getCookie('csrftoken');


function call_modal(contenido){
    $('#myModal .modal-content').html(contenido);
    $('#myModal').modal('show');
}

function close_modal() {
  $('#myModal').modal('hide');
  $('#myModal').on('hidden.bs.modal', function () {
    $('#myModal .modal-content').html('');
  });
}

function add_delete_img(){
  const defaultFile = document.getElementById("image_product").getAttribute("data-default-file");
    const img = document.getElementById( "image_product" );
    const file = document.getElementById( "input_image_product" );
    const eliminar = document.getElementById('delete_image_product');

    file.addEventListener( "change", e => {
        if( e.target.files[0] ){
            const reader = new FileReader( );
            reader.onload = function( e ){
            img.src = e.target.result;
        }
        reader.readAsDataURL(e.target.files[0])
        }
    } );

    eliminar.addEventListener('click', function(){
        img.src = defaultFile
    });
}

document.addEventListener('DOMContentLoaded', function () {
  var tooltips = new bootstrap.Tooltip(document.body, {
      selector: '[data-bs-toggle="tooltip"]'
  });
});