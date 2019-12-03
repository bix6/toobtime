"use strict";

let spotsGlobal = null;
let tableListGlobal = [];
const MAX_COLS_GLOBAL = 6;

// Updates the color score
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

// Create a table string with the fetched surfline data
function createTableString(data, keyNameData) {
    if (keyNameData === "waveData") {
        let waveString = "<tr>";

        for (let i = 0; i < data.length; i++) {
            waveString += `<td class="score-${data[i].score}">${data[i].waveMin}-${data[i].waveMax}</td>`;
        }
    
        return waveString += "</tr>";
    }
}

// store the fetched surfline data
function storeData(index, data, keyNameData, keyNameString) {
    spotsGlobal[index][keyNameData] = data;
    spotsGlobal[index][keyNameString] = createTableString(data, keyNameData);
    updateScore(index, data);
    return true;
}

// get the pertinent wave data from the response payload
function getWaveData(responseJson, startIndex) {
    let waveData = [];

    for (let i = startIndex; i < startIndex + MAX_COLS_GLOBAL; i++) {
        let waveDataLocal = {
            score: responseJson.data.wave[i].surf.optimalScore,
            waveMin: Math.floor(responseJson.data.wave[i].surf.min),
            waveMax: Math.ceil(responseJson.data.wave[i].surf.max)
        }
    
        waveData.push(waveDataLocal);
    }

    return waveData;
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

// Fetch wave data from Surfline
function fetchSurflineData(startIndex) {
    const ENDPOINT_WAVE = "https://services.surfline.com/kbyg/spots/forecasts/wave";
    const ENDPOINT_WIND = "https://services.surfline.com/kbyg/spots/forecasts/wind";

    let params = {
        "spotId": null, // from surfline URL
        "days": 2, // max 6 w/o token, 17 w/ token
        "intervalHours": 1, // min 1
        "maxHeights": false, // true removes min & optimal values
        // "accesstoken": "string" // for premium data
    };

    // Loop through all spots. If checked, fetch wave and wind data.
    for (let i = 0; i < spotsGlobal.length; i++) {
        if (spotsGlobal[i].checked) {
            params.spotId = spotsGlobal[i].id;
            
            const PARAM_STRING = formatParams(params);
        
            const URL_WAVE = ENDPOINT_WAVE + "?" + PARAM_STRING;
            const URL_WIND = ENDPOINT_WIND + "?" + PARAM_STRING;

            fetch(URL_WAVE)
            .then(response => checkFetchResponse(response))
            .then(responseJson => getWaveData(responseJson, startIndex))
            .then(waveData => storeData(i, waveData, "waveData", "waveString"))
            .then(dataStored => console.log(spotsGlobal))
            .catch(error => alert(error.message)); // TODO error handling

            // fetch(URL_WIND)
        }
    }
}

// Create the time row for the table
function createTimeRow(startIndex) {
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

// Check which spots are checked and store information
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
}

// Ensure user selects at least one required checkbox
// Thank you: https://stackoverflow.com/questions/6218494/using-the-html5-required-attribute-for-a-group-of-checkboxes
function validateUserInput() {
    return ($(".required-cb :checkbox:checked").length > 0);
}

// Handle user form submission
function formSubmitted() {
    $(".user-input-form").on("submit", function(event) {
        event.preventDefault();

        if (validateUserInput()) {
            checkSpots();

            const startIndex = getStartIndex();
            createTimeRow(startIndex);

            fetchSurflineData(startIndex);
        }
        else {
            // TODO handle this without an alert?
            alert('Please select a valid surf spot.');
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
}

$(main);
