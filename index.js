"use strict";

// Ensure user selects at least one required checkbox
// Thank you: https://stackoverflow.com/questions/6218494/using-the-html5-required-attribute-for-a-group-of-checkboxes
function validateUserInput() {
    return ($(".required-cb :checkbox:checked").length > 0);
}

// Handle User Form Submission
function formSubmitted() {
    $(".user-input-form").on("submit", function(event) {
        event.preventDefault();

        if (!validateUserInput()) {
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
