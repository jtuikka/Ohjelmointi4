document.addEventListener('DOMContentLoaded', () => {
  // päivittää yhteenvetoon kuun kokonais tilannetta
    function updateSummary() {
      const balanceEl = document.getElementById('balance');
      const bal = totalTulo - totalMeno;
      balanceEl.innerHTML = `Kuun tilanne: <strong>${bal >= 0 ? '+' : ''}${bal}€</strong>`;
      // Väri vihreä jos >=0 ja punainen jos <0
      balanceEl.querySelector('strong').style.color = bal >= 0 ? 'green' : 'red';
    }
  
  // tulo muuttujat
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('modal');
  const tuloForm = document.getElementById('tuloForm');
  const tuloLista = document.getElementById('tuloLista');
  const tuloTotal = document.getElementById('tuloTotal');
  
  let totalTulo = 0; //kokonaisTulo asetetaan nollaan
  
  
  // "Lisää tulo" painike aukaisee popupin
  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });
  
  // sulkee popupin
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    tuloForm.reset();
  });
  
  // ok painike
  tuloForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // hakee syötetyt tiedot
    const maara = parseFloat(document.getElementById('tuloMaara').value);
    const kategoria = document.getElementById('tuloKategoria').value;
  
    // summa on enemmän kuin 0 ja kategoria valittu
    if (maara > 0 && kategoria) {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
    
      const span = document.createElement('span');
      span.textContent = `${maara}€ ${kategoria}`;
    
      // poistonappi
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.className = 'remove-btn';
      // yhteenvetoa päivitetään, kun poistetaan tuloja
      removeBtn.addEventListener('click', () => {
        tuloLista.removeChild(li);
        totalTulo -= maara;
        tuloTotal.textContent = `Tulot: ${totalTulo}€`;
        updateSummary();
      });
    
      li.appendChild(span);
      li.appendChild(removeBtn);
      tuloLista.appendChild(li);
    
      // yhteenvetoa päivittää, kun lisätään tuloja
      totalTulo += maara;
      tuloTotal.textContent = `Tulot: ${totalTulo}€`;
      updateSummary();
    }
  
    // sulkee popupin
    tuloForm.reset();
    modal.classList.remove('open');
  });
  
  //meno
  const avaaMenoModal = document.getElementById('avaaMenoModal');
  const suljeMenoModal = document.getElementById('suljeMenoModal');
  const menoModal = document.getElementById('menoModal');
  const menoForm = document.getElementById('menoForm');
  const menoLista = document.getElementById('menoLista');
  const expenseTotal = document.getElementById('expenseTotal');
  
    let totalMeno = 0;
    // Lisaa meno painike popup
    avaaMenoModal.addEventListener('click', () => {
      menoModal.classList.add('open');
    });
    // sulkee popupin
    suljeMenoModal.addEventListener('click', () => {
      menoModal.classList.remove('open');
      menoForm.reset();
    });
  
    menoForm.addEventListener('submit', e => {
      e.preventDefault();
  
      const maara = parseFloat(document.getElementById('menoMaara').value);
      const kategoria = document.getElementById('menoKategoria').value;
      
      // summa > 0 ja kategoria valittu
      if (maara > 0 && kategoria) {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
  
      const span = document.createElement('span');
      span.textContent = `${maara}€ ${kategoria}`;
      
      // poistonappi
      const rem = document.createElement('button');
      rem.textContent = '✖';
      rem.className = 'remove-btn';
      rem.addEventListener('click', () => {
        menoLista.removeChild(li);
        totalMeno -= maara;
        expenseTotal.textContent = `Menot: ${totalMeno}€`;
        menoSumma[kategoria] -= maara;
        updateExpenseChart(); 
        updateSummary();
      });
  
      li.append(span, rem);
      menoLista.appendChild(li);
      
      menoSumma[kategoria] += maara;
      updateExpenseChart();  
      totalMeno += maara;
      expenseTotal.textContent = `Menot: ${totalMeno}€`;
      updateSummary();
    }
      // Automaattinen sulku ja reset
      menoForm.reset();
      menoModal.classList.remove('open');
    });
  
  
  // piechart kaavio
  const menoSumma = {
    'Sahkolasku': 0,
    'Vesilasku': 0,
    'Vuokra': 0,
    'Harrastus': 0,
    'Ruoka': 0,
    'Muu': 0
  };
  
  const ctx1 = document.getElementById('pieChart');
  const pieChart = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: Object.keys(menoSumma),
      datasets: [{
        data: Object.values(menoSumma),
        backgroundColor: ['#00c0ef', '#f39c12', '#00a65a', '#f56954', '#605ca8', '#8f7ace']
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  });
  
  // päivittää menojen kaavioon
  function updateExpenseChart() {
    pieChart.data.datasets[0].data = Object.values(menoSumma);
    pieChart.update();
  }
  
      // barchart kaavio
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
  
  