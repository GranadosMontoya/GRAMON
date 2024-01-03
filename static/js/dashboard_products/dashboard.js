function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$(document).ready(function() {
  // Obtén el contexto del gráfico
  const ctx = document.getElementById('myChart')
  const ctx2 = document.getElementById('myChart2')
  // Realiza una solicitud AJAX para obtener los datos del gráfico desde Django
  $.ajax({
    url: '/get_chart_data/products/',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      const chartData = {
        labels: data.map(item => item.product_name_statistics),
        datasets: [{
          data: data.map(item => item.quantity_statistics),
          lineTension: 0,
          backgroundColor: 'green',
          borderColor: '#065F2A',
          borderWidth: 1,
          pointBackgroundColor: '#065F2A'
        }]
      };
    
      // Crea el gráfico con los datos mapeados
      const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              boxPadding: 3
            }
          }
        }
      });
    },
    error: function(error) {
      console.error('Error al obtener los datos del gráfico:', error);
    }
  });

  $.ajax({
    url: '/get_chart_data/products/revenue/',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      const randomColors = data.map(() => generateRandomColor());
      const chartData = {
        labels: data.map(item => item.product_name_statistics),
        datasets: [{
          data: data.map(item => item.revenue),
          lineTension: 0,
          backgroundColor: randomColors,
          borderColor: '#065F2A',
          borderWidth: 1,
          pointBackgroundColor: '#065F2A'
        }]
      };
    
      const myChart = new Chart(ctx2, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              boxPadding: 3
            }
          }
        }
      });
    },
    error: function(error) {
      console.error('Error al obtener los datos del gráfico 2:', error);
    }
  });
});