"use strict";

// Ensure user selects at least one required checkbox
// Thank you: https://stackoverflow.com/questions/6218494/using-the-html5-required-attribute-for-a-group-of-checkboxes
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
