/*
    Logic for multi-page form
    
    Adapted from: https://www.w3schools.com/howto/howto_js_form_steps.asp
*/

var currentPage = 0; // Current page is first page
showPage(currentPage); // Display the crurrent page
var timeStarted = 0; // When the user startd the form


// when the "next" button is clicked, go to the next page
$('#nextBtn').click(function() {
    console.log("currentPage: " + currentPage);
    // if the user hasn't validated email yet
    
    if (currentPage == 0) {
        // show progress bar
        $('.progress').css('opacity', '1');

        var helperText = $('#page1').find('.helper-text');

        // display 'validating email' text
        console.log("validating email...");
        helperText.text('Validating email...');

        // validate email
        $.post("/validateEmail", { email: $('#email').val() }, function(data, status){
            console.log("Email is valid: " + data);

            // email is invalid
            if (data != "true") {
                $('#email').addClass("invalid");
                helperText.text('Please enter a valid SMU email.');
                helperText.css('opacity', '1');
            }

            // hide progress bar
            $('.progress').css('opacity', '0');
            nextPrev(1)
        });
    }
    else {
        formIsValid = true;

        // calculate form based off page
        curForm = "#page" + (currentPage+1) + " div.input-field";
        console.log(curForm);

        // check each dropdown for valid... values
        $(curForm).each(function() {
            // the value selected in the dropdown
            dropDown = $(this).find('.select-dropdown')
            selectValue = dropDown.val();

            // a value hasn't been selected
            if (selectValue == "Select one" || 
                selectValue == "Select all that apply") {

                formIsValid = false;
                console.log("invalid");

                // show warning text
                dropDown.addClass('invalid');
                $(this).find('.helper-text').css({'opacity' : '1'});
            }
        });

        // form is valid, go to the next page
        if (formIsValid) {
            nextPrev(1);    
        }

        window.scrollTo(0,0);
    }
});

// check validity of dropdown when its value changes
$('select').change(function() {
    // if a value has been selected, remove the invalid class
    if ($(this).val() != "") {
        $(this).siblings('input.select-dropdown').removeClass("invalid");
        $(this).parent().siblings('.helper-text').css('opacity', '0');
    }
});


function showPage(n) {
    // This function will display the specified page of the form...
    var x = document.getElementsByClassName("page");
    x[n].style.display = "block";

    //... and fix the Previous/Next buttons:
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }

}

function nextPrev(n) {
    // the user has started the form
    if (currentPage == 0) {
        timeStarted = Date.now();
    }

    // This function will figure out which page to display
    var x = document.getElementsByClassName("page");

    var inputsInvalid = false;

    $(x[n - 1]).find("input").each(function() {
        // the input is invalid or it's empty
        if ($(this).hasClass("invalid") || $(this)[0].value == "") {
            $(this).addClass("invalid")
            inputsInvalid = true;
        }
    });


    if (inputsInvalid) return false;

    // Exit the function if any field in the current page is invalid:
    if (n == 1 && $(x[n]).hasClass("invalid")) return false;
    
    // Hide the current page:
    x[currentPage].style.display = "none";
    
    // Increase or decrease the current page by 1:
    currentPage = currentPage + n;

    // if you have reached the end of the form...
    if (currentPage >= x.length) {
        // note when the time it took to complete the form
        timeElapsed = (Date.now() - timeStarted) / 1000;

        // change the hidden form element value
        $('#timeToComplete').val(timeElapsed);

        // ... the form gets submitted:
        document.getElementById("mainForm").submit();
        return false;
    }
    // Otherwise, display the correct page:
    showPage(currentPage);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("page");
    y = x[currentPage].getElementsByTagName("input");
    // A loop that checks every input field in the current page:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }

    return valid; // return the valid status
}