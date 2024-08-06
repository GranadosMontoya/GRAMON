$(document).ready(function() {

    const ctx = document.getElementById('myChart')

    $.ajax({
        url: '/api/home/',
        method: 'GET',
        dataType: 'json',
        success: function (resultado){
            
            let sumaTotal = resultado.reduce((acumulador, objeto) => {
                return acumulador + parseFloat(objeto.valor_final);
            }, 0);

            let countsale = resultado.length;
            
            document.getElementById('daily_sale').textContent = '$'+sumaTotal
            document.getElementById('count_sale').textContent = countsale

            // Procesar los datos
            const labels = resultado.map(item => 'Factura N°'+item.id); // Extraer solo la fecha
            const valores = resultado.map(item => parseFloat(item.valor_final));

            // Crear el gráfico
            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, {
                type: 'line', // Tipo de gráfico: 'line' para línea
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas del dia',
                        data: valores,
                        fill: false, // No rellenar el área bajo la línea
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1 // Suavizar la línea
                    }]
                },
                options: {
                    scales: {
                        x: {
                            display: false // Ocultar el eje X
                        },
                        y: {
                            beginAtZero: true,
                            display: true, // Asegurar que el eje Y se muestre
                            grid: {
                                display: false // Ocultar las líneas de cuadrícula en el eje Y
                            },
                            border: {
                                display: false // Ocultar la línea del borde del eje Y
                            }
                        }
                    },
                },
            });
        }
    });
}); 