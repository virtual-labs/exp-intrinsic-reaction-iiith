"use strict";

import data from "./data.js";

document.querySelector("#left").addEventListener("click", () => {
  if (current > -5) {
    current--;
    triggerUpdate();
  }
});
document.querySelector("#right").addEventListener("click", () => {
  if (current < 11) {
    current++;
    triggerUpdate();
  }
});

let myChart = null;
let current = 0;

const initChart = () => {
  const xyValues = Object.keys(data)
    .map((key) => ({
      x: parseInt(key),
      y: data[key]["energy"],
    }))
    .sort((a, b) => a["x"] - b["x"]);

  if (myChart) myChart.destroy();
  myChart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xyValues.map((e) => e.x),
      datasets: [
        {
          data: xyValues.map((e) => e.y),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "rgb(0,0,255)",
          pointBorderColor: "rgb(133, 193, 233)",
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "States",
            },
            offset: true,
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Energy (Ha)",
            },
            offset: true,
          },
        ],
      },
    },
  });
};

const highlightChart = () => {
  if (myChart) {
    myChart.data.datasets[0].pointBackgroundColor = [];
    myChart.data.datasets[0].pointRadius = [];
    for (let i = 0; i < myChart.data.datasets[0].data.length; i++) {
      if (myChart.data.datasets[0].data[i] === data[current]["energy"]) {
        myChart.data.datasets[0].pointRadius[i] = 5;
        myChart.data.datasets[0].pointBackgroundColor[i] = "red";
      } else {
        myChart.data.datasets[0].pointBackgroundColor[i] = "rgb(75, 192, 192)";
      }
    }
    myChart.update();
  }
};

let width = 600,
  height = 400;
if (window.innerWidth < 900) {
  width = window.innerWidth;
  height = 300;
}
const movie = new ChemDoodle.MovieCanvas3D("element", width, height);

const setMolecule = () => {
  movie.clear();
  movie.frames = [];
  if (data !== null) {
    movie.addFrame([ChemDoodle.readXYZ(data[current]["geometry"])], []);
    movie.styles.set3DRepresentation("Ball and Stick");
    movie.styles.atoms_displayLabels_3D = true;
    movie.styles.backgroundColor = "transparent";
    movie.loadMolecule(movie.frames[0].mols[0]);
  }
  return movie;
};

const triggerUpdate = () => {
  highlightChart();
  setMolecule();
};

initChart();
triggerUpdate();
