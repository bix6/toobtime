"use strict";

let spotsGlobal = null;
let tableListGlobal = [];
let buoyDataGlobal = {};
const MAX_COLS_GLOBAL = 6;

// Display the score
function displayScore () {
    $(".score-ol").empty();
    let spotsLocal = spotsGlobal.slice();

    // Sort in descending order
    spotsLocal.sort(function(a, b) {
        const aScore = a.score ? a.score : 0;
        const bScore = b.score ? b.score : 0;
        return bScore - aScore;
    });

    for (let i = 0; i < 3; i++) {
        if (spotsLocal[i].checked) {
            let scoreString = `<li>${spotsLocal[i].name} (${spotsLocal[i].score})</li>`;
            $(".score-ol").append(scoreString);
        }
    }
}

// Display the main table
function displayTable () {
    $(".display-table").empty();
    $(".display-table").html(tableListGlobal.join(""));
    $(".display-main").removeClass("hidden");
}

// Append the spot strings to the global table
function appendTableRows() {
    for (let i = 0; i < spotsGlobal.length; i++) {
        if (spotsGlobal[i].checked) {
            tableListGlobal.push(`<tr class="name-row"><th>${spotsGlobal[i].name}</th></tr>`);
            tableListGlobal.push(spotsGlobal[i].waveString);
            tableListGlobal.push(spotsGlobal[i].windString);
        }
    }
}

// Update the color score
function updateScore(index, data) {
    let score = 0;

    for (let i = 0; i < data.length; i++) {
            score += data[i].score;
    }

    if (spotsGlobal[index]["score"]) {
        spotsGlobal[index]["score"] += score;
    }
    else {
        spotsGlobal[index]["score"] = score;
    }
}

// Create a table string with the fetched data
function createTableString(data, keyNameData) {
    let tableString = "<tr>";

    for (let i = 0; i < data.length; i++) {
        if (keyNameData === "waveData") {
            if (i === 0) {
                tableString += "<th>Waves (ft)</th>";
            }
            tableString += `<td class="score-${data[i].score}">${data[i].waveMin}-${data[i].waveMax}</td>`;
        }
        else if (keyNameData === "windData") {
            if (i === 0) {
                tableString += "<th>Wind (kn)</th>";
            }
            tableString += `<td class="score-${data[i].score}">${data[i].windSpeed}-`+
                `${data[i].windGust} ${data[i].windDirection}&#176;</td>`;
        }
    }

    return tableString += "</tr>";
}

// Check the current fetch index
// Stop and display data if all spot's have been retrieved
// Othwerise, recursively fetch the next spot's data
function checkFetchIndex(startIndex, lastSpotIndex, curIndex) {
    if (curIndex === lastSpotIndex || curIndex === spotsGlobal.length) {
        console.log("final");
        appendTableRows();
        displayTable();
        displayScore();
    }
    else {
        console.log(curIndex);
        fetchSurfData(startIndex, lastSpotIndex, ++curIndex);
    }
}

// Store the fetched data
function storeData(index, data, keyNameData, keyNameString) {
    spotsGlobal[index][keyNameData] = data;
    spotsGlobal[index][keyNameString] = createTableString(data, keyNameData);
    updateScore(index, data);
}

// Extract the data from the response payload
function extractData(responseJson, startIndex, keyNameData) {
    let data = [];

    for (let i = startIndex; i < startIndex + MAX_COLS_GLOBAL; i++) {
        let dataLocal = {};

        if (keyNameData === "waveData") {
            dataLocal = {
                score: responseJson.data.wave[i].surf.optimalScore,
                waveMin: Math.floor(responseJson.data.wave[i].surf.min),
                waveMax: Math.ceil(responseJson.data.wave[i].surf.max)
            }
        }
        else if (keyNameData === "windData") {
            dataLocal = {
                windSpeed: Math.round(responseJson.data.wind[i].speed),
                windDirection: Math.round(responseJson.data.wind[i].direction),
                windGust: Math.round(responseJson.data.wind[i].gust),
                score: responseJson.data.wind[i].optimalScore
            }
        }

        data.push(dataLocal);
    }

    return data;
}

// Check the fetched response
function checkFetchResponse(response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.statusText);
}

// Format parameters for query string
function formatParams(params) {
    let paramList = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}` +
        `=${encodeURIComponent(params[key])}`);
    return paramList.join("&")
}

// Fetch surf data from Surfline
function fetchSurfData(startIndex, lastSpotIndex, curIndex) {
    const ENDPOINT_WAVE = "https://services.surfline.com/kbyg/spots/forecasts/wave";
    const ENDPOINT_WIND = "https://services.surfline.com/kbyg/spots/forecasts/wind";

    let params = {
        "spotId": null, // from surfline URL
        "days": 2, // max 6 w/o token, 17 w/ token
        "intervalHours": 1, // min 1
        "maxHeights": false, // true removes min & optimal values
        // "accesstoken": "string" // for premium data
    };

    // If spot checked, fetch wave and wind data.
    if (spotsGlobal[curIndex].checked) {
        params.spotId = spotsGlobal[curIndex].id;
        
        const PARAM_STRING = formatParams(params);
    
        const URL_WAVE = ENDPOINT_WAVE + "?" + PARAM_STRING;
        const URL_WIND = ENDPOINT_WIND + "?" + PARAM_STRING;

        fetch(URL_WAVE)
        .then(response => checkFetchResponse(response))
        .then(responseJson => extractData(responseJson, startIndex, "waveData"))
        .then(waveData => storeData(curIndex, waveData, "waveData", "waveString"))
        .then(function() { 
            fetch(URL_WIND)
            .then(response => checkFetchResponse(response))
            .then(responseJson => extractData(responseJson, startIndex, "windData"))
            .then(windData => storeData(curIndex, windData, "windData", "windString"))
            .then(function() {checkFetchIndex(startIndex, lastSpotIndex, curIndex)}) // recursively search until all data retrieved
            .catch(error => displayError(error.message));
        })
        .catch(error => displayError(error.message));
    }
}

// Create the time string and push it to the table
function createTimeString(startIndex) {
    let timeString = "<tr><th>Time</th>";
    let dateNow = new Date();

    for (let i = startIndex; i < startIndex + MAX_COLS_GLOBAL; i++) {
        dateNow.setHours(i);
        timeString += `<th data-order="-1">${dateNow.toLocaleString('default', {hour: "numeric"})}</th>`;
    }

    timeString += "</tr>";
    tableListGlobal.push(timeString);
}

// Get start index for data based on current time
function getStartIndex() {
    let dateNow = new Date(); 
    return dateNow.getHours() === 0 ? 0 : dateNow.getHours() - 1;
}

// Find the index of the last checked spot
function findLastChecked() {
    let index = 0;

    for (let i = 0; i < spotsGlobal.length; i++) {
        if (spotsGlobal[i].checked) {
            index = i;
        }
    }

    return index;
}

// Check which spots are checked and store information in spotsGlobal
function checkSpots() {
    spotsGlobal = [
        {
            name: "Ocean Beach",
            id: "5842041f4e65fad6a77087f8",
            checked: $("#ob-cb").is(":checked")
        },
        {
            name: "Rockaway",
            id: "5842041f4e65fad6a7708979",
            checked: $("#rockaway-cb").is(":checked")
        },
        {
            name: "Pacifica",
            id: "5cbf8d85e7b15800014909e8",
            checked: $("#pacifica-cb").is(":checked")
        },
        {
            name: "Montara",
            id: "5842041f4e65fad6a7708974",
            checked: $("#montara-cb").is(":checked")
        },
        {
            name: "Mavericks",
            id: "5842041f4e65fad6a7708801",
            checked: $("#mavericks-cb").is(":checked")
        },
        {
            name: "The Jetty",
            id: "5842041f4e65fad6a7708970",
            checked: $("#jetty-cb").is(":checked")
        },
        {
            name: "Half Moon Bay",
            id: "5842041f4e65fad6a770896f",
            checked: $("#hmb-cb").is(":checked")
        },
        {
            name: "Tunitas Creek",
            id: "5842041f4e65fad6a7708972",
            checked: $("#tunitas-cb").is(":checked")
        },
        {
            name: "Pescadero",
            id: "5842041f4e65fad6a770897d",
            checked: $("#pescadero-cb").is(":checked")
        },
        {
            name: "Pigeon Point",
            id: "5842041f4e65fad6a770897e",
            checked: $("#pigeon-cb").is(":checked")
        },
        {
            name: "Ano Nuevo",
            id: "5842041f4e65fad6a770897f",
            checked: $("#ano-cb").is(":checked")
        },
        {
            name: "Waddell Creek",
            id: "5842041f4e65fad6a7708980",
            checked: $("#waddell-cb").is(":checked")
        },
        {
            name: "Scott Creek",
            id: "5842041f4e65fad6a7708982",
            checked: $("#scott-cb").is(":checked")
        },
        {
            name: "Davenport",
            id: "5842041f4e65fad6a7708983",
            checked: $("#davenport-cb").is(":checked")
        },
        {
            name: "Four Mile",
            id: "5842041f4e65fad6a7708981",
            checked: $("#four-cb").is(":checked")
        },
        {
            name: "Natural Bridges",
            id: "5842041f4e65fad6a7708986",
            checked: $("#natural-cb").is(":checked")
        },
        {
            name: "Steamer Lane",
            id: "5842041f4e65fad6a7708805",
            checked: $("#steamer-cb").is(":checked")
        },
        {
            name: "Pleasure Point",
            id: "5842041f4e65fad6a7708807",
            checked: $("#pleasure-cb").is(":checked")
        },
        {
            name: "Jack's",
            id: "5842041f4e65fad6a770880b",
            checked: $("#jacks-cb").is(":checked")
        },
        {
            name: "The Hook",
            id: "584204204e65fad6a7709996",
            checked: $("#hook-cb").is(":checked")
        },
    ];

    return findLastChecked();
}

// Display the buoy data
function displayBuoyData() {
    $(".buoy-ul").empty();

    let buoyContent = `<li><span class="buoy-span">Water Level:</span> ${buoyDataGlobal.water_level} ft above MLLW</li>` +
        `<li><span class="buoy-span">Water Temp:</span> ${buoyDataGlobal.water_temperature} &#176;F</li>` +
        `<li><span class="buoy-span">Barometric Pressure:</span> ${buoyDataGlobal.air_pressure} mb</li>`;

    $(".buoy-ul").html(buoyContent);
}

// Store the fetched buoy data from NOAA
function storeBuoyData(responseJson, name) {
    buoyDataGlobal[name] = Math.round(responseJson.data[0].v * 10) / 10; // round to .1s
}

// Fetch buoy data from NOAA
function fetchBuoyData() {
    buoyDataGlobal = {}; // reset the buoy data

    const ENDPOINT_NOAA = "https://tidesandcurrents.noaa.gov/api/datagetter";

    let params = {
        station: 9415020, // Point Reyes: 9415020, Monterey: 9413450
        date: "latest",
        product: "water_level",
        datum: "MLLW",
        units: "english",
        time_zone: "lst",
        format: "json",
        application: "student",
    }

    const URL_WATER_LEVEL = ENDPOINT_NOAA + "?" + formatParams(params);
    params.product = "water_temperature";
    const URL_WATER_TEMPERATURE = ENDPOINT_NOAA + "?" + formatParams(params);
    params.product = "air_pressure";
    const URL_AIR_PRESSURE = ENDPOINT_NOAA + "?" + formatParams(params);

    fetch(URL_WATER_LEVEL)
    .then(response => checkFetchResponse(response))
    .then(responseJson => storeBuoyData(responseJson, "water_level"))
    .then(function() {
        fetch(URL_WATER_TEMPERATURE)
        .then(response => checkFetchResponse(response))
        .then(responseJson => storeBuoyData(responseJson, "water_temperature"))
        .then(function() {
            fetch(URL_AIR_PRESSURE)
            .then(response => checkFetchResponse(response))
            .then(responseJson => storeBuoyData(responseJson, "air_pressure"))
            .then(function() {displayBuoyData()})
            .catch(error => displayError(error.message));  
        })
        .catch(error => displayError(error.message)); 
    })
    .catch(error => displayError(error.message));
}

// Clear error message
function clearError() {
    $(".error-p").empty();
    $(".error-p").addClass("hidden");
}

// Display error message
function displayError(errorMessage) {
    $(".error-p").text(errorMessage);
    $(".error-p").removeClass("hidden");
}

// Ensure user selects at least one required checkbox
// Thank you: https://stackoverflow.com/questions/6218494/using-the-html5-required-attribute-for-a-group-of-checkboxes
function validateUserInput() {
    return ($(".required-cb :checkbox:checked").length > 0);
}

function newSearch() {
    $(".new-search-button").on("click", function(event) {
       $("main").addClass("hidden"); 
    })
}

// Handle user form submission
function formSubmitted() {
    $(".user-input-form").on("submit", function(event) {
        event.preventDefault();

        if (validateUserInput()) {
            clearError(); // clear error if it exists
            tableListGlobal = []; // reset the table list

            fetchBuoyData();

            const lastSpotindex = checkSpots(); 

            const startIndex = getStartIndex();
            createTimeString(startIndex);

            fetchSurfData(startIndex, lastSpotindex, 0); // curIndex = 0
        }
        else {
            displayError("Please select a valid spot.");
        }
    })
}

// Toggle nested checkboxes when parent is clicked
// Thank you: https://stackoverflow.com/questions/14853568/jquery-selecting-all-child-checkboxes
function toggleCheckbox() {
    $("input[type='checkbox']").change(function () {
        $(this).siblings('ul')
            .find("input[type='checkbox']")
            .prop('checked', this.checked);
    });
}

function main() {
    toggleCheckbox();
    formSubmitted();
    newSearch();
}

$(main);
