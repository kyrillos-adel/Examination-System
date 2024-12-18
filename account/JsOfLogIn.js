// URL to access Firebase Realtime Database data
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://loginandregister-9116b-default-rtdb.firebaseio.com/users.json", true);
xhr.setRequestHeader("Content-Type", "application/json");

var data;


xhr.onload = function () {
    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        console.log("Fetched Data:", data);
    } else {
        console.error("Error fetching data:", xhr.status);
    }
};


xhr.onerror = function () {
    console.error("Network Error");
};

xhr.send();

// Add the event listener for login after data is fetched
var login = document.getElementById("login");
var err = document.getElementById("wrong");

login.addEventListener('click', function (e) {
    e.preventDefault();

    if (!data) {
        alert("Data is still loading. Please wait.");
        return;
    }

    var email = document.getElementById("form2").value;
    var password = document.getElementById("form3").value;

    let userFound = false;

    for (let userId in data) {
        let user = data[userId];
        if (user.email === email && user.password === password) {
            userFound = true;
            // /To be added
            localStorage.setItem('userEmail', email);
            // console.log(user.role)
            if(user.role === "student")
            {
                window.open('../dashboards/pages/dashboard.html','_self')
            }
            else if(user.role === "teather"){
                window.open('../dashboards/pages/teacherDashboard.html','_self')
            }

            // window.location.href = "sign in teste.html";
            break;
        }
    }


    if (!userFound) {
        err.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Wrong password or email <br>';
    }
});





