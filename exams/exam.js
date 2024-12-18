document.addEventListener("DOMContentLoaded", function () {
    const prof = document.getElementById('profile');
    const openprofile = document.getElementById('open');
    const closeprof = document.querySelector('.close');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const nameInput = document.getElementById('nameInput');
    const passwordInput = document.getElementById('passwordInput');
    const roleInput = document.getElementById('roleInput');
    const mailInput = document.getElementById('mailInput');
    const profilePhoto = document.getElementById('profilePhoto');
    const photoUpload = document.getElementById('photoUpload');
    const firebaseURL = "https://loginandregister-9116b-default-rtdb.firebaseio.com/users.json";

    async function fetchUserData() {
        try {
            const response = await fetch(firebaseURL);
            if (!response.ok) throw new Error("Error fetching user data!");

            const userData = await response.json();

            // Assuming you're fetching the first user's data for simplicity
            const userKeys = Object.keys(userData);
            const user = userData[userKeys[0]];

            // Populate the profile fields
            nameInput.value = user.username || "Unknown";
            passwordInput.value = user.password || "";
            roleInput.value = user.role || "Not defined";
            mailInput.value = user.email || "";

            console.log("User Data Loaded:", user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to fetch user data.");
        }
    }

    function validateInput(input, regex) {
        if (!regex.test(input.value)) {
            input.style.border = "2px solid red";
            return false;
        } else {
            input.style.border = "2px solid green";
            return true;
        }
    }

    function checkFormValidity() {
        const RGXname = /^[a-zA-Z\s]{3,30}$/;
        const RGXpass = /^(?=.*[A-Z][0-9]{4,8}).+$/;

        const isNameValid = validateInput(nameInput, RGXname);
        const isPasswordValid = validateInput(passwordInput, RGXpass);
        saveButton.disabled = !(isNameValid && isPasswordValid);
    }

    // Show Profile Modal
    openprofile.onclick = function () {
        prof.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    function logout() {
        sessionStorage.clear();
        localStorage.clear();
    
        window.location.replace(`../dashboards/pages/Home.html`,"_self");
    }

    closeprof.onclick = function () {
        // window.open(`../dashboards/pages/Home.html`,"_self");
                document.body.style.overflow = 'auto';
                logout();


               
    };

    cancelButton.onclick = function () {
        prof.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = function (event) {
        if (event.target === prof) {
            prof.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Photo Upload Handler
    photoUpload.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // Save Button Logic (Updated to Firebase functionality)
    saveButton.onclick = async function () {
        const role = roleInput.value;
        const name = nameInput.value;
        const mail = mailInput.value;

        // Create updated user object
        const updatedUserData = {
            username: name,
            password: passwordInput.value,
            role: role,
            email: mail,
            profileImage: profilePhoto.src // Add profile image URL (if needed for Firebase)
        };

        console.log("Saved Data:", updatedUserData);

        // Fetch existing data, get user key and update the user
        try {
            const response = await fetch(firebaseURL);
            if (!response.ok) throw new Error("Error fetching user data!");

            const userData = await response.json();
            const userKeys = Object.keys(userData);
            const userKey = userKeys[0]; // Assuming you're updating the first user

            // Send updated user data to Firebase using PUT method
            const updateResponse = await fetch(
                `https://loginandregister-9116b-default-rtdb.firebaseio.com/users/${userKey}.json`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedUserData),
                }
            );

            if (!updateResponse.ok) throw new Error("Error updating user data!");

            // Show success message and close modal
            prof.style.display = 'none';
            openprofile.src = profilePhoto.src;
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error("Error updating user data:", error);
            alert("Failed to update profile.");
        }
    };

    // Fetch user data on page load
    fetchUserData();

    // Disable save button initially
    saveButton.disabled = true;

    nameInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);
});








var response;
async function loadExam(searchName) {
    response = await fetch('https://examination-website-default-rtdb.firebaseio.com/Exam.json');
    const examData = await response.json(); // Parse JSON file
    renderExam(examData, searchName);
}

var examData;
function renderExam(_examData, searchName) {
    var found = false;
    var examContainer;
    for (let examId in _examData) {
        if (_examData.hasOwnProperty(examId)) {
            examData = _examData[examId]; // Access each exam by its unique ID
            if (examData.ExamName.toLowerCase() === searchName.toLowerCase()) {
                found = true;
                break;
            }
        }
    }

    if (!found) {
        // console.log("No exam found with that name")
        document.querySelector('.exam-title').textContent = "No exam found with that name"
    }
    else {
        const dateTimeString = `${examData.ExamDate}T${examData.ExamTime}:00`; // Adding seconds to the time
        const examDateObj = new Date(dateTimeString);
        const currentDateObj = new Date();

        if (examDateObj > currentDateObj) {
            // console.log("The exam is in the future.");

            // adding exam to the page 
            document.querySelector('.exam-title').textContent = examData.ExamName;
            document.querySelector('.exam-date').textContent = `Date: ${examData.ExamDate}`;

            examContainer = document.querySelector('.exam');

            examData.questions.forEach((question) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                questionDiv.style.backgroundColor = "#fefcf6"
                questionDiv.style.borderRadius = "20px"
                questionDiv.style.padding = "20px"

                const questionText = document.createElement('div');
                questionText.classList.add('question-text');
                questionText.textContent = `${question.QuestionID}. ${question.QuestionContent}`;
                questionDiv.appendChild(questionText);

                const optionsList = document.createElement('ol');
                optionsList.type = 'A';


                question.choices.forEach((option) => {
                    const choiceContent = option.content;
                    const isCorrect = option.isCorrect ? "Correct" : "Incorrect";
                    const optionItem = document.createElement('li');
                    const radioButton = document.createElement('input');
                    radioButton.type = 'radio';
                    radioButton.name = `q${question.QuestionID}`;

                    radioButton.value = choiceContent;
                    optionItem.appendChild(radioButton);
                    optionItem.append(` ${choiceContent}`);
                    optionsList.appendChild(optionItem);
                });
                questionDiv.appendChild(optionsList);

                examContainer.appendChild(questionDiv);
            });
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.addEventListener('click', evaluateAnswers);
            examContainer.appendChild(submitButton);


            submitButton.addEventListener('click', function () {
                var scorevalue = {
                    score: score,
                    title: examData.ExamName,
                    total: examData.questions.length
                }
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://examination-25129-default-rtdb.firebaseio.com/users.json", true); // Firebase URL
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(scorevalue,)); // Convert JavaScript object to JSON string

                // Handle the response from Firebase
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        alert("User examed successfully!");
                        console.log(xhr.responseText)
                    } else if (xhr.readyState == 4) {
                        alert("Error: " + xhr.responseText);
                    }
                };
            })

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'cancel';
            cancelButton.addEventListener('click', cancel);
            examContainer.appendChild(cancelButton);
            cancelButton.style.backgroundColor = "#fefcf6"
            cancelButton.style.color = "#162a2c"

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = "#162a2c"
                cancelButton.style.color = "#fefcf6"
            });

            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = "#fefcf6"
                cancelButton.style.color = "#162a2c"
            });

        } else if (examDateObj < currentDateObj) {
            // console.log("The exam is in the past.");
            document.querySelector('.exam-title').textContent = "The exam is closed"
        }
    }
}
let score = 0;

function evaluateAnswers() {
    if (!examData) return;




    examData.questions.forEach((question) => {
        let userAnswer;

        const selectedOption = document.querySelector(`input[name="q${question.QuestionID}"]:checked`);
        if (selectedOption) {
            userAnswer = selectedOption.value;
        }

        if (Array.isArray(question.choices) && question.choices.length > 0) {
            const correctChoice = question.choices.find(choice => choice.isCorrect);

            if (correctChoice && userAnswer === correctChoice.content) {
                score++;
            }
        }
    });

    OpenPopup(score, examData.questions.length)
}






function cancel() {
    window.open("ht.html")

}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    let exName = params.get('message');
    loadExam(exName);
});



function OpenPopup(score, totalQuestions) {
    popup.style.display = 'block';
    popup.style.visibility = 'visible';
    popupOverlay.style.display = 'block';
    const scoreMessage = document.getElementById('scoreMessage');
    scoreMessage.textContent = `Your score is: ${score} out of ${totalQuestions}`;

    document.body.classList.add('no-scroll');
}

function ClosePopup() {

    // Hide the popup and overlay
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';

    document.body.classList.remove('no-scroll');
    window.open(`../dashboards/pages/dashboard.html`);
}