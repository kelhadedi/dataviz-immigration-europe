let chart3Instance = null;
let selectedYear = document.getElementById("yearSlider").value;
let selectedCountries = []; // Pays sélectionnés
let perceptionRealityData = {}; // Données perception/réalité

let immigrationData = {}; // Données d'immigration

// Charger les données d'immigration
fetch('/data/immigrationData.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    immigrationData = data;
    console.log("Données d'immigration chargées :", immigrationData);

    // Initialiser un graphique avec les données
    initializeImmigrationChart();
  })
  .catch(error => {
    console.error("Erreur lors du chargement des données d'immigration :", error);
  });

// Initialiser un graphique
function initializeImmigrationChart() {
  const countryKey = "BEL"; // Exemple : Belgique
  const countryData = immigrationData[countryKey];

  if (!countryData) {
    console.error(`Aucune donnée trouvée pour le pays : ${countryKey}`);
    return;
  }

  // Créer un graphique avec les données
  const ctx = document.getElementById('immigrationChart').getContext('2d');
  const chartConfig = {
    type: 'line',
    data: {
      labels: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      datasets: [{
        label: countryData.label,
        data: countryData.migrationTrend,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: `Flux migratoire - ${countryData.label}` }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Nombre de migrants' }
        },
        x: {
          title: { display: true, text: 'Année' }
        }
      }
    }
  };

  new Chart(ctx, chartConfig);
}

function updateInfoBox(countryKey) {
  const countryData = immigrationData[countryKey];

  if (!countryData) {
    console.error(`Aucune donnée trouvée pour le pays : ${countryKey}`);
    return;
  }

  // Mettre à jour les informations du pays sélectionné
  window.selectedCountryKey = countryKey;

  // Mettre à jour les éléments de l'info box
  document.querySelector('.info-box h3').textContent = countryData.label;
  document.querySelector('.info-box p:nth-of-type(1)').textContent = `Fluctuations de l'immigration :`;
  document.querySelector('.info-box p:nth-of-type(2)').textContent = `Nombre de migrants : ${countryData.migrantCount}`;
  document.querySelector('.info-box p:nth-of-type(3)').textContent = `Emplois dus à l'immigration : ${countryData.employmentRate}%`;
  document.querySelector('.info-box p:nth-of-type(4)').textContent = `Comparaison avec les natifs : ${countryData.comparisonData.join('% vs ')}%`;

  // Créer ou mettre à jour le graphique dans l'info box
  const ctx = document.getElementById('infoChart').getContext('2d');
  if (window.infoChartInstance) {
    window.infoChartInstance.destroy(); // Supprimer l'ancien graphique
  }
  window.infoChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      datasets: [{
        label: `Fluctuations - ${countryData.label}`,
        data: countryData.migrationTrend.slice(0, selectedYear - 2012 + 1), // Filtrer les données par année
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: `Flux migratoire - ${countryData.label}` }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Nombre de migrants' }
        },
        x: {
          title: { display: true, text: 'Année' }
        }
      }
    }
  });
}

// Charger les données de perception
fetch('/data/perceptionData.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    perceptionRealityData = data;
    console.log("Données de perception chargées :", perceptionRealityData);
  })
  .catch(error => {
    console.error("Erreur lors du chargement des données de perception :", error);
  });

// Mettre à jour ou créer un graphique en barres
function updateBarChart(countryKey) {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Vérifier si le pays est déjà sélectionné
  if (selectedCountries.includes(countryKey)) {
    return;
  }

  // Ajouter le pays à la liste des pays sélectionnés
  selectedCountries.push(countryKey);

  // Créer un nouveau dataset pour le pays sélectionné
  const countryData = perceptionRealityData[countryKey];
  const newDataset = {
    label: countryData.label,
    data: countryData.data,
    backgroundColor: countryData.backgroundColor,
    borderWidth: 1
  };

  if (!chart3Instance) {
    // Créer un nouveau graphique si aucun n'existe
    barConfig.data.datasets = [newDataset];
    chart3Instance = new Chart(ctx, barConfig);
  } else {
    // Ajouter le nouveau dataset au graphique existant
    chart3Instance.data.datasets.push(newDataset);
    chart3Instance.update();
  }

  // Afficher le graphique et le titre
  document.getElementById('chartTitle').style.display = 'block';
  document.getElementById('myChart').style.display = 'block';
}

// Configuration du graphique en barres
const barConfig = {
  type: 'bar',
  data: {
    labels: ['Statistique (%)', 'Estimation ESS (%)'],
    datasets: []
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      },
      title: {
        display: true,
        text: 'Pourcentage de personnes nées à l\'étranger (2014)',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 40, // Ajuster selon les données
        title: {
          display: true,
          text: 'Pourcentage (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Type de donnée'
        }
      }
    }
  }
};

const colorScale = d3.scaleQuantize()
  .domain([0, 100000]) // Ajuster les valeurs min et max
  .range(["#f7fbff", "#d0e2f0", "#7fbfff", "#2c7bbf", "#08306b"]); // Couleurs de la légende

function updateDataForYear(year) {
  selectedYear = year;

  // Mettre à jour l'affichage de l'année
  document.getElementById("yearDisplay").textContent = selectedYear;

  // Mettre à jour la carte
  updateMap();

  // Mettre à jour l'info box si un pays est sélectionné
  if (window.selectedCountryKey) {
    updateInfoBox(window.selectedCountryKey);
  }
}

// Fonction pour réinitialiser le graphique
function resetChart() {
  if (chart3Instance) {
    chart3Instance.destroy();
    chart3Instance = null;
  }
  selectedCountries = [];
  document.getElementById('chartTitle').style.display = 'none';
  document.getElementById('myChart').style.display = 'none';
}

// Configuration de la carte D3
d3.json("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson").then((europe) => {
  const svg = d3.select("#map").append("svg")
    .attr("width", 800)
    .attr("height", 600);

  const countries = topojson.feature(europe, europe.objects.europe);
  const projection = d3.geoMercator().fitSize([800, 600], countries);
  const path = d3.geoPath().projection(projection);

  svg.selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#ccc")
    .attr("stroke", "#333")
    .on("click", (event, d) => {
      const countryName = d.properties.NAME; // Nom du pays
      const countryKey = getCountryKey(countryName); // Convertir le nom en clé (ex. "Belgium" -> "BEL")
      updateInfoBox(countryKey); // Mettre à jour l'info box
      updatePreviewBox(countryKey); // Mettre à jour les sliders
    });
});

// Fonction pour mapper les noms de pays aux clés
function getCountryKey(countryName) {
  const countryMapping = {
    "Belgium": "BEL",
    "France": "FRA",
    "United Kingdom": "GBR",
    "Ireland": "IRL",
    "Czech Republic": "CZE",
    "Austria": "AUT",
    "Switzerland": "CHE",
    "Germany": "DEU",
    "Denmark": "DNK",
    "Spain": "ESP",
    "Estonia": "EST",
    "Finland": "FIN",
    "Hungary": "HUN",
    "Lithuania": "LTU",
    "Netherlands": "NLD",
    "Poland": "POL",
    "Portugal": "PRT",
    "Slovenia": "SVN",
    "Sweden": "SWE",
    "Norway": "NOR"
  };

  return countryMapping[countryName] || null;
}

document.getElementById("yearSlider").addEventListener("input", function () {
  selectedYear = parseInt(this.value, 10); // Convertir la valeur en entier
  document.getElementById("yearDisplay").textContent = selectedYear; // Afficher l'année sélectionnée
  updateMap(); // Mettre à jour la carte
  if (window.selectedCountryKey) {
    updateInfoBox(window.selectedCountryKey); // Mettre à jour l'info box si un pays est sélectionné
  }
});

// Flag click handlers
document.addEventListener('DOMContentLoaded', () => {
  const flags = document.querySelectorAll('.flag');
  const chartTitle = document.getElementById('chartTitle');
  const canvas = document.getElementById('myChart');

  // Hide chart and title by default
  chartTitle.style.display = 'none';
  canvas.style.display = 'none';

  flags.forEach(flag => {
    flag.addEventListener('click', () => {
      const country = flag.alt.trim();
      updateBarChart(country); // Update chart on flag click
    });
  });
});

// Placeholder function for map color scaling (replace with actual data)
function getFluxForYearAndCountry(year, country) {
  // Replace with actual data logic
  return Math.random() * 100000; // Example placeholder
}

function updateMap() {
  d3.select("svg").selectAll("path")
    .transition().duration(200)
    .attr("fill", d => {
      const countryKey = getCountryKey(d.properties.NAME);
      const countryData = immigrationData[countryKey];

      if (!countryData || !countryData.migrationTrend) {
        return "#ccc"; // Couleur grise pour les pays sans données
      }

      const val = getFluxForYearAndCountry(selectedYear, d.properties.NAME); // Récupérer la valeur pour l'année sélectionnée
      return colorScale(val); // Appliquer la couleur en fonction de l'échelle
    });
}

function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  const mapLegend = document.getElementById('map-legend'); // Sélectionnez la légende

  if (popup) {
    popup.style.display = 'block'; // Affiche le pop-up
    mapLegend.classList.add('hidden'); // Masque la légende
  } else {
    console.error(`L'élément avec l'ID ${popupId} n'existe pas.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeButton = document.querySelector('#about-data .close');
  const mapLegend = document.getElementById('map-legend'); // Sélectionnez la légende

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      document.getElementById('about-data').style.display = 'none';
      mapLegend.classList.remove('hidden'); // Réaffiche la légende
    });
  }
});