const planetsAPI = "https://ﬁndfalcone.geektrust.com/planets"; //GET
const vehiclesAPI = "https://ﬁndfalcone.geektrust.com/vehicles"; //GET
const tokenAPI = "https://ﬁndfalcone.geektrust.com/token"; //POST
const findAPI = "https://findfalcone.geektrust.com/find"; //POST

let selectedPlanets = [null, null, null, null];
let selectedVehicles = [null, null, null, null];

let cachedPlanetData = [];
let cachedVehicleData = [];

const resetContainer = document.querySelector(".reset-home-container");

async function fetchAllPlanets() {
  let response = await fetch(planetsAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  return data;
}

async function fetchAllVehicles() {
  let response = await fetch(vehiclesAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();

  return data;
}

function renderDropDowns(inputPlanetsData) {
  const dropdownContainer = document.querySelector(".destination-container");
  dropdownContainer.innerHTML = "";

  const usedPlanets = selectedPlanets.filter((p) => p);

  //creating 4 dropdowns since there are 4 destinations
  for (let i = 0; i < 4; i++) {
    const planetDiv = document.createElement("div");
    planetDiv.classList.add("destination-dropdown");
    const dropdown = document.createElement("select");
    const label = document.createElement("label");
    label.textContent = `Destination ${i + 1}`;
    const optionPlaceholder = document.createElement("option"); //default placeholder
    optionPlaceholder.textContent = "---select planet----";
    optionPlaceholder.value = "";
    dropdown.appendChild(optionPlaceholder);

    inputPlanetsData.forEach((planet) => {
      //check if planet is already selected in previous dropdowns
      if (
        !usedPlanets.includes(planet.name) ||
        selectedPlanets[i] === planet.name
      ) {
        const option = document.createElement("option");
        option.value = planet.name;
        option.textContent = planet.name;
        if (selectedPlanets[i] === planet.name) option.selected = true;
        dropdown.appendChild(option);
      }
    });

    //after selecting/deselecting a planet
    dropdown.onchange = () => {
      //push the selected planet to array
      selectedPlanets[i] = dropdown.value || null;
      selectedVehicles[i] = null; //reset vehicle selection with planet change
      renderDropDowns(inputPlanetsData);
    };

    planetDiv.appendChild(label);
    planetDiv.appendChild(dropdown);

    if (selectedPlanets[i]) {
      const vehicleUI = renderVehicles(
        i,
        selectedVehicles[i],
        cachedVehicleData,
        cachedPlanetData
      );
      planetDiv.appendChild(vehicleUI);
    }

    dropdownContainer.appendChild(planetDiv);
  }
}

function renderVehicles(
  i,
  selectedVehicleName,
  inputVehiclesData,
  inputPlanetsData
) {
  const planetName = selectedPlanets[i];
  const planetObj = cachedPlanetData.find((p) => p.name === planetName);

  const vehicleGroup = document.createElement("div");
  vehicleGroup.innerHTML = `<strong>Select Vehicle:</strong><br>`;

  inputVehiclesData?.forEach((vehicle) => {
    const usedCount = selectedVehicles.filter((v) => v === vehicle.name).length;
    const remaining = vehicle.total_no - usedCount;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `vehicle-${i}`;
    radio.value = vehicle.name;

    if (selectedVehicleName === vehicle.name) {
      radio.checked = true;
    }

    if (
      (planetObj && planetObj.distance > vehicle.max_distance) ||
      remaining <= 0
    ) {
      radio.disabled = true;
    }

    radio.onchange = () => {
      selectedVehicles[i] = vehicle.name;
      renderDropDowns(cachedPlanetData, cachedVehicleData);
      updateSummary();
    };

    const label = document.createElement("label");
    label.style.display = "block";
    label.appendChild(radio);
    label.appendChild(
      document.createTextNode(
        `${vehicle.name}-${remaining} available` +
          (planetObj.distance > vehicle.max_distance ? "[out of range]" : "") +
          (remaining <= 0 ? "[No Units Left]" : "")
      )
    );
    vehicleGroup.appendChild(label);
  });

  return vehicleGroup;
}

function updateSummary() {
  let totalTime = 0;
  let selections = [];
  for (let i = 0; i < 4; i++) {
    const planetName = selectedPlanets[i];
    const vehicleName = selectedVehicles[i];

    if (planetName && vehicleName) {
      const planet = cachedPlanetData.find((p) => p.name === planetName);
      const vehicle = cachedVehicleData.find((v) => v.name === vehicleName);

      if (planet && vehicle) {
        const time = planet.distance / vehicle.speed;
        totalTime += time;
        selections.push(
          `Destination ${
            i + 1
          }: Reached ${planetName} via ${vehicleName} in ${time}`
        );
      }
    }
  }

  document.getElementById("total-time-taken").innerHTML = totalTime;
  document.querySelector(".selection-summary").innerHTML = selections?.length
    ? selections.map((s) => `<li>${s}</li>`).join("")
    : "";

  const findButton = document.getElementById("find-button");
  selections.length > 3
    ? (findButton.disabled = false)
    : (findButton.disabled = true);
}

function findFalcone() {
  const headerBody = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  let tokenReceived = null;
  const requestBody = {};

  fetch(tokenAPI, headerBody)
    .then((res) => res.json())
    .then((data) => {
      tokenReceived = data?.token;
      requestBody["token"] = tokenReceived;
      requestBody["planet_names"] = selectedPlanets;
      requestBody["vehicle_names"] = selectedVehicles;

      fetch(findAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("API Error:", res.status, text);
            throw new Error("Non-200 response from /find");
          }
          return res.json();
        })
        .then((data) => {
          window.resultData = data;
          navigateTo("/result");
        })
        .catch((err) => alert(err));
    });
}

function renderHomePage() {
  const main = document.getElementById("main");
  main.innerHTML = `<h1>Welcome to Find Falcone Game!</h1>
                    <img src="./assets/falcon.jpg" alt="falcon-image"></img>
                    <button id="start-game-btn">Start Game</button>`;

  document
    .getElementById("start-game-btn")
    .addEventListener("click", function () {
      navigateTo("/game");
    });
}

function renderGamePage() {
  const main = document.getElementById("main");
  main.innerHTML = ` <h2>Select Planets you want to search in:</h2>
        <section class="destination-container">

        </section>
        <section class="result-container">
            <div>
                <h2>Total Time Taken:<span id="total-time-taken"></span></h2>
            </div>
            <div>
                <ul class="selection-summary">

                </ul>
            </div>
            <button id="find-button" disabled onclick="findFalcone()">Find Falcone</button>
        </section>`;

  Promise.all([fetchAllPlanets(), fetchAllVehicles()]).then(
    ([planetData, vehicleData]) => {
      cachedPlanetData = planetData;
      cachedVehicleData = vehicleData;
      renderDropDowns(cachedPlanetData, cachedVehicleData);
    }
  );
}

function renderResultPage() {
  const main = document.getElementById("main");
  const result = window.resultData || null;

  if (result && result.status === "success") {
    html = `<h2>Success! Congratulations on finding falcone.King Shan is mighty pleased!</h2>
            <h3>Found in Planet ${result.planet_name}</h3>
            <button id="try-again-btn">Play again</button>
    `;
  } else {
    html = `<h2>Falcone not Found</h2>
          <h3>Please try again!</h3>
          <button id="try-again-btn">Play again</button>
    `;
  }

  main.innerHTML = html;
  if (document.getElementById("try-again-btn")) {
    document
      .getElementById("try-again-btn")
      .addEventListener("click", function () {
        playAgain();
        navigateTo("/");
      });
  }
}
function resetGame() {
  selectedPlanets.fill(null);
  selectedVehicles.fill(null);

  window.resultData = null;

  const summaryEl = document.querySelector(".selection-summary");
  if (summaryEl) summaryEl.innerHTML = "";

  const totalTimeEl = document.getElementById("total-time-taken");
  if (totalTimeEl) totalTimeEl.innerText = "0";

  renderDropDowns(cachedPlanetData, cachedVehicleData);
}

function playAgain() {
  selectedPlanets.fill(null);
  selectedVehicles.fill(null);
  window.resultData = null;
}

function router() {
  const path = window.location.pathname;
  if (path === "/" || path === "") {
    resetContainer.classList.remove("show");

    renderHomePage();
  } else if (path === "/game") {
    resetContainer.classList.add("show");
    renderGamePage();
  } else if (path === "/result") {
    resetContainer.classList.remove("show");
    renderResultPage();
  } else {
    renderHomePage();
  }
}

function navigateTo(path) {
  history.pushState(null, "", path);
  router();
}

window.onpopstate = router;
window.onload = () => router();
