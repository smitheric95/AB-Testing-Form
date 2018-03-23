/*
    Logic for multi-page form
    https://www.w3schools.com/howto/howto_js_form_steps.asp
*/

var currentPage = 0; // Current page is first page
showPage(currentPage); // Display the crurrent page

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
  // This function will figure out which page to display
  var x = document.getElementsByClassName("page");

  var inputsInvalid = false;
  console.log($(x[n-1]).find("input"));
  $(x[n-1]).find("input").each(function() {
  	if ($(this).hasClass("invalid")){
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
