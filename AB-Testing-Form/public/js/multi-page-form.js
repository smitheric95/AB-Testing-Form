/*
    Logic for multi-page form
    
    Adapted from: https://www.w3schools.com/howto/howto_js_form_steps.asp
*/

var currentPage = 0; // Current page is first page
showPage(currentPage); // Display the crurrent page
var timeStarted = 0; // When the user startd the form
var formIsComplete = false;
// prevent recaptcha from messing up
alert = function() {};

// when the "next" button is clicked, go to the next page
$('#nextBtn').click(function(e) {
    e.preventDefault();
    console.log("currentPage: " + currentPage);

    // if the user hasn't validated email yet
    if (currentPage == 0) {
        var helperText = $('#page1').find('.helper-text');

        captcha = grecaptcha.getResponse();

        if (captcha.length > 0 && $('#email').val().length > 0) {
            // display 'validating email' text
            // console.log("validating email...");
            // helperText.text('Validating email...');
            // helperText.css('opacity', '1');

            // show loading animation
            $('.loading-wrapper').fadeIn();

            // validate email
            $.post("/validateEmail", { 
                email: $('#email').val(),
                recaptcha: captcha
            }, function(data, status){
                console.log("Email is valid: " + data);

                // email is invalid
                if (data != "true") {
                    $('#email').addClass("invalid");
                    helperText.text("This email has already been used or is not a valid SMU email. Note: If using a VPN, you'll need to disable it.");
                    helperText.css('opacity', '1');


                }
                else {
                    // remove recaptcha
                    $('#captcha-button').remove();
                    $('#nextBtn').removeClass('g-recaptcha');
                    $('body > div:nth-child(4)').remove();
                    $('body > div:nth-child(4)').remove();

                    // grecaptcha.reset();

                    // email or user are valid!
                    nextPrev(1);
                }

                $('.loading-wrapper').fadeOut();
            });    
        }
    }
    else {
        formIsValid = true;

        // calculate form based off page
        curForm = "#page" + (currentPage+1) + " div.input-field";
        console.log(curForm);

        // check each dropdown for valid... values
        $(curForm).each(function() {
            // the value selected in the dropdown
            dropDown = $(this).find('.select-dropdown');
            selectValue = dropDown.val();

            // a value hasn't been selected
            if (selectValue == "Select one" || 
                selectValue == "Select all that apply") {

                formIsValid = false;

                // show warning text
                dropDown.addClass('invalid');
                $(this).find('.helper-text').css({'opacity' : '1'});
            }
        });

        // form is valid, go to the next page
        if (formIsValid) {
            nextPrev(1);    

            // remove recaptcha
            $('#captcha-button').remove();
            $('#nextBtn').removeClass('g-recaptcha');
            $('body > div:nth-child(4)').remove();
            $('body > div:nth-child(4)').remove();

            // grecaptcha.reset();
        }
        else {
            // show warning text
            $('#errorMessage' + (currentPage+1)).css('display', 'block');
        }
    }

    // scroll to the top 
    window.scrollTo(0,0);
});

// post form before the user goes away
$(window).on("beforeunload", function() { 
    if (currentPage > 0 && $('#email').val().length > 0 && !formIsComplete) {
        $.post("/postForm", { 
            email: $('#email').val(),
            dropout: true,
            currentPage: currentPage,
            themeChosen: $('#themeChosen').val()
        }); 
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
            $(this).addClass("invalid");
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
        formIsComplete = true;

        // note when the time it took to complete the form
        timeElapsed = (Date.now() - timeStarted) / 1000;

        // change the hidden form element value
        $('#timeToComplete').val(timeElapsed);

        $('.loading-wrapper').fadeIn();

        // ... the form gets submitted:
        document.getElementById("mainForm").submit();
        return false;
    }
    // Otherwise, display the correct page:
    showPage(currentPage) ;
}