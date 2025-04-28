document.addEventListener('DOMContentLoaded', () => {
    const ctx1 = document.getElementById('pieChart');
    new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: ['Vuokra', 'Ruoka', 'Laskut', 'Auto', 'Muu'],
        datasets: [{
          data: [630, 220, 200, 300, 250],
          backgroundColor: ['#00c0ef', '#f39c12', '#00a65a', '#f56954', '#605ca8']
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom' 
          }
        },
        responsive: true
      }
    });
    const ctx2 = document.getElementById('barChart');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Syyskuu 2024', 'Lokakuu 2024', 'Marraskuu 2024', 'Joulukuu 2024', 'Tammikuu 2025'],
            datasets: [{
                label: 'Kuukausittainen tilanne',
                data: [1100, 900, 600, -200, 920],
                backgroundColor: '#3c8dbc'
            }]
        },
        options: {
            plugins: {
              legend: {
                position: 'bottom' 
              }
            },
            responsive: true
          }
    });
});

