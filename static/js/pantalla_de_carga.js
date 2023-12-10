// Obtener referencia a los elementos
var div_load = document.getElementById('div_load');
var contentContainer = document.getElementById('contentContainer');

// Mostrar la imagen de carga
div_load.style.display = 'block';
contentContainer.style.display = 'none';


// Simular una demora de 5 segundos
setTimeout(function() {
    // Ocultar la imagen de carga y mostrar el contenido principal
    div_load.style.display = 'none';
    contentContainer.style.display = 'block';
}, 1000); // 5000 milisegundos = 5 segundos