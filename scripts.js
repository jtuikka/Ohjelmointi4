document.addEventListener('DOMContentLoaded', () => {
  // päivittää yhteenvetoon kuun kokonais tilannetta
    function updateSummary() {
      const balanceEl = document.getElementById('saldo');
      const sal = totalTulo - totalMeno; // tulojen ja menojen erotus
      balanceEl.innerHTML = `Kuun tilanne: <strong>${sal >= 0 ? '+' : ''}${sal}€</strong>`;
      // Väri vihreä jos >=0 ja punainen jos <0
      balanceEl.querySelector('strong').style.color = sal >= 0 ? 'green' : 'red';
    }
  
  // tulo muuttujat
  const openBtn = document.getElementById('openModal'); // lisää tulo nappi
  const closeBtn = document.getElementById('closeModal'); // peruuta nappi
  const modal = document.getElementById('modal'); // popup ikkuna
  const tuloForm = document.getElementById('tuloForm'); // tulojen lomake
  const tuloLista = document.getElementById('tuloLista'); // tulojen lista
  const tuloTotal = document.getElementById('tuloTotal'); // kokonais tulo
  const tuloData = {}; // tallentaa kategorian summat
  
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
  
    if (!(maara > 0 && kategoria)) return;

    // jos kategoria löytyy listasta -> päivittää summan
    if (tuloData[kategoria]) {
      tuloData[kategoria].maara += maara;
      tuloData[kategoria].el.textContent = `${tuloData[kategoria].maara}€ ${kategoria}`;
    } else {
      // muodostaa uuden listan
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      const span = document.createElement('span');
      span.textContent = `${maara}€ ${kategoria}`;
      li.appendChild(span);

      // poistonappi
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => {
        tuloLista.removeChild(li);
        totalTulo -= tuloData[kategoria].maara;
        delete tuloData[kategoria];
        tuloTotal.textContent = `Tulot: ${totalTulo}€`;
        updateSummary();
      });
      li.appendChild(removeBtn);

    tuloLista.appendChild(li);

    // tallentaa datan
    tuloData[kategoria] = { maara: maara, el: span };
    }

     // päivittää kokonaissumman ja yhteenveedon
    totalTulo += maara;
    tuloTotal.textContent = `Tulot: ${totalTulo}€`;
    updateSummary();

    tuloForm.reset();
    modal.classList.remove('open');
});
  
  //meno muuttujat
  const avaaMenoModal = document.getElementById('avaaMenoModal');
  const suljeMenoModal = document.getElementById('suljeMenoModal');
  const menoModal = document.getElementById('menoModal');
  const menoForm = document.getElementById('menoForm');
  const menoLista = document.getElementById('menoLista');
  const expenseTotal = document.getElementById('expenseTotal');
  const menoData = {};
  
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
    // oik painike
    menoForm.addEventListener('submit', e => {
      e.preventDefault();
      const maara    = parseFloat(document.getElementById('menoMaara').value);
      const kategoria = document.getElementById('menoKategoria').value;
      if (!(maara > 0 && kategoria)) return;
    
      if (menoData[kategoria]) {
        menoData[kategoria].maara += maara;
        menoData[kategoria].el.textContent =
          `${menoData[kategoria].maara}€ ${kategoria}`;
      } else {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
    
        const span = document.createElement('span');
        span.textContent = `${maara}€ ${kategoria}`;
        li.appendChild(span);
    
        const rem = document.createElement('button');
        rem.textContent = '✖';
        rem.className = 'remove-btn';
        rem.addEventListener('click', () => {
          menoLista.removeChild(li);
          totalMeno -= menoData[kategoria].maara;
          delete menoData[kategoria];
          expenseTotal.textContent = `Menot: ${totalMeno}€`;
          updateExpenseChart();
          updateSummary();
        });
        li.appendChild(rem);
    
        menoLista.appendChild(li);
    
        menoData[kategoria] = { maara: maara, el: span };
      }
    
      totalMeno += maara;
      expenseTotal.textContent = `Menot: ${totalMeno}€`;
      updateExpenseChart();
      updateSummary();
      
      menoForm.reset();
      menoModal.classList.remove('open');
    });
    
  
  
  // piechart kaavio
  const kaikkiKategoriat = ['Sahkolasku','Vesilasku','Vuokra','Harrastus','Ruoka','Muu'];
  const ctx1 = document.getElementById('pieChart');
  const pieChart = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: kaikkiKategoriat,
      datasets: [{
        data: kaikkiKategoriat.map(() => 0),
        backgroundColor: ['#00c0ef','#f39c12','#00a65a','#f56954','#605ca8','#8f7ace']
      }]
    },
    options: { plugins:{ legend:{ position:'bottom' } }, responsive:true }
  });
  
  function updateExpenseChart() {
    pieChart.data.datasets[0].data = kaikkiKategoriat.map(k =>
      menoData[k] ? menoData[k].maara : 0
    );
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
  
//Menun avaaminen ja sulkeminen
function toggleMenu() {
  const menu = document.getElementById('profile-content');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
  
// Lisää säästö painike popup
avaaSaastoModal.addEventListener('click', () => {
  saastoModal.classList.add('open');
});

// sulkee popupin
suljeSaastoModal.addEventListener('click', () => {
  saastoModal.classList.remove('open');
  saastoForm.reset();
});