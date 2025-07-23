const planetsAPI = "https://ﬁndfalcone.geektrust.com/planets";
const vehiclesAPI = "https://ﬁndfalcone.geektrust.com/vehicles";

const selectedPlanets = [null, null, null, null];
const selectedVehicles = [null, null, null, null];

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

function showVehicles(inputData) {
  vehiclesList.style.display = "flex";
  vehiclesList.innerHTML = "";

  inputData?.map((ele) => {
    vehiclesList.innerHTML += `<div class="single-vehicle-container">
            <input type="radio" id="${ele.name}" name="vehicles"/>
                 <label for="${ele?.name}">${ele?.name}</label>
        </div>`;
  });
}

function renderDropDowns(inputPlanetsData, inputVehiclesData) {
  const dropdownContainer = document.querySelector(".destination-container");
  dropdownContainer.innerHTML = "";

  const usedPlanets = selectedPlanets.filter((p) => p);

  //creating 4 dropdowns since there are 4 destinations
  for (let i = 0; i < 4; i++) {
    const planetDiv = document.createElement("div");
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
        inputVehiclesData
      );
      planetDiv.appendChild(vehicleUI);
    }

    dropdownContainer.appendChild(planetDiv);
  }
}

function renderVehicles(i, selectedVehicleName, inputVehiclesData) {
  const vehicleGroup = document.createElement("div");
  vehicleGroup.innerHTML = `<strong>Select Vehicle:</strong><br>`;

  inputVehiclesData?.forEach((vehicle) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `vehicle-${i}`;
    radio.value = vehicle.name;

    if (selectedVehicleName === vehicle.name) {
      radio.checked = true;
    }

    radio.onchange = () => {
      selectedVehicles[i] = vehicle.name;
      // renderDropDowns(planetData,vehicleData);
    };

    const label = document.createElement("label");
    label.style.display = "block";
    label.appendChild(radio);
    label.appendChild(
      document.createTextNode(`${vehicle.name}-${vehicle.total_no} available`)
    );
    vehicleGroup.appendChild(label);
  });

  return vehicleGroup;
}

Promise.all([fetchAllPlanets(), fetchAllVehicles()]).then(
  ([planetData, vehicleData]) => {
    console.log(vehicleData, "vehicle data");
    renderDropDowns(planetData, vehicleData);
  }
);
