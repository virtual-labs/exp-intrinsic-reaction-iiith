"use strict";

import data, { instructions } from "./data.js";

let currentInstructionIndex = -1;
let sleepTime = 3500;

const setInstruction = (index) => {
  if (index < instructions.length && currentInstructionIndex < index) {
    currentInstructionIndex = index;
    document.getElementById("instructions").innerHTML =
      instructions[currentInstructionIndex].message;

    instructions[currentInstructionIndex].elementId.forEach((id, ind) => {
      if (ind === 0)
        document.getElementById(id).scrollIntoView({
          behavior: "smooth",
        });
      document.getElementById(id).classList.add("highlight");
    });
    sleep(sleepTime - 600).then(() =>
      instructions[currentInstructionIndex].elementId.forEach((id) =>
        document.getElementById(id).classList.remove("highlight")
      )
    );
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setMultipleInstructions = (indexes) =>
  indexes.forEach((val, ind) =>
    sleep(sleepTime * ind).then(() => setInstruction(val))
  );

document.querySelector("#left").addEventListener("click", () => {
  setInstruction(4);
  if (current > -5) {
    current--;
    triggerUpdate();
  }
});
document.querySelector("#right").addEventListener("click", () => {
  setMultipleInstructions([5, 6, 7]);

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

setMultipleInstructions([0, 1, 2, 3]);

