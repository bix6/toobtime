"use strict";

// Ensure user selects at least one required checkbox
function validateUserInput() {
    // TODO delete console log
    console.log($(".required-cb :checkbox:checked").length);

    return ($(".required-cb :checkbox:checked").length > 0);
}

function formSubmitted() {
    $(".user-input-form").on("submit", function(event) {
        event.preventDefault();

        const validInput = validateUserInput();

        if (validInput) {
            console.log('Good Input');
        }
        else {
            console.log('Bad Input');
        }
    })
}
$(formSubmitted);