"use strict";

let dataGlobal = null;

// Check which spots are checked and store information
function checkSpots() {
    dataGlobal = [
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
