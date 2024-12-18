//////////////////valid name//////////////
// var RGXname = /^[a-zA-Z]{2,10}[0-9]{2,4}$/
var RGXname = /^[a-zA-Z\s]{3,30}$/;

var USERname = document.getElementById("form1")
USERname.addEventListener('keyup',function(){
    var useval=USERname.value
    USERname.style.border=""


    if(!RGXname.test(useval)){
        USERname.style.border="2px solid #FF2929"
    }
    else {
        USERname.style.border = "2px solid green"
    }
})
USERname.addEventListener('blur', function () {
    if (USERname.value === "") {
        USERname.style.border = "2px solid rgb(252, 250, 250)";
    }
});
//////////////////valid mail///////////////////////// 
var mail = document.getElementById("form2")
var RGXofmile = /^[a-zA-z]{3,7}[0-9]{0,4}@gmail\.com$/
mail.addEventListener('keyup', function () {

    mail.style.border = "1px solid #ccc";


    var val = mail.value;
    if (!RGXofmile.test(val)) {
        mail.style.border = "2px solid #FF2929"
    }
    else {
        mail.style.border = "2px solid green"
    }
});
mail.addEventListener('blur', function () {
    if (mail.value === "") {
        mail.style.border = "2px solid rgb(252, 250, 250)";
    }
});
////////////vaild password/////////
var password = document.getElementById("form3")
var RGXpass = /^(?=.*[A-Z][0-9]{4,8}).+$/;

password.addEventListener('keyup', function () {
    password.style.border = "1px solid #ccc";
    var val = password.value;
    if (!RGXpass.test(val)) {
        password.style.border = "2px solid #FF2929"
    }
    else {
        password.style.border = "2px solid green"
    }
});
password.addEventListener('blur', function () {
    if (password.value === "") {
        password.style.border = "2px solid rgb(252, 250, 250)";
    }
});
//////////////match pass///////////
var repass = document.getElementById("form4")

repass.addEventListener('keyup', function () {
    var repass2 = repass.value
    var val = password.value;
    if (val != repass2) {
        repass.style.border = "2px solid #FF2929"
    }
    else {
        repass.style.border = "2px solid green"
    }
})
repass.addEventListener('blur', function () {
    if (repass.value === "") {
        repass.style.border = "2px solid rgb(252, 250, 250)";
    }
});
///////////////error of supmit///////////////
var errmile = document.getElementById("err")
var errpass = document.getElementById("err2")
var errREpass = document.getElementById("err3")
var errrole = document.getElementById("err4")
var sup = document.getElementById("submit")
sup.addEventListener('click', function () {
    // Clear all error messages
    errmile.innerHTML = "";
    errpass.innerHTML = "";
    errREpass.innerHTML = "";

    // Check email validation
    if (!RGXofmile.test(mail.value)) {
        errmile.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Wrong email "ex: ea2@gmail.com" <br>';
   
    }
    // Check password validation
    if (!RGXpass.test(password.value)) {
        errpass.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Wrong password "ex: A1234" <br>';
    }
    // Check if passwords match
    if (password.value !== repass.value) {
        errREpass.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Passwords do not match <br>';
    }
});
/////////////////store data in firebase/////////////
document.getElementById("forms").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get values from the form
    var username = document.getElementById("form1").value;
    var email = document.getElementById("form2").value;
    var password = document.getElementById("form3").value;
    var repassword = document.getElementById("form4").value;
    var dob = document.getElementById("form5").value;
    var role = document.querySelector('input[name="role"]:checked').value;

    // Validation checks
    if (password !== repassword) {
        document.getElementById("err3").innerHTML = "Passwords do not match.";
        return;
    }
    
    // Prepare data object to send to Firebase
    var userData = {
        username: username,
        email: email,
        password: password,
        dob: dob,
        role: role
    };

    // Send data to Firebase Realtime Database using XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://loginandregister-9116b-default-rtdb.firebaseio.com/users.json", true); // Firebase URL
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(userData)); // Convert JavaScript object to JSON string

    // Handle the response from Firebase
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert("User registered successfully!");
            window.location.href = "log in teste.html"; // Redirect to login page after successful registration
            console.log(xhr.responseText)
        } else if (xhr.readyState == 4) {
            alert("Error: " + xhr.responseText);
        }
    };
});