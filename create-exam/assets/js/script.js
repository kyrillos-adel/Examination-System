
    var examName,examDuration, examDate , examTime;
    /////////////////////////////////////////////
    var questionCreateContainer;
    var saveChoicebutton = document.getElementById("questionCreateContainer");
    var addAnotherQuestion = document.getElementById("addAnotherQuestion");
    var SaveExam = document.getElementById("SaveExam");
    var popup = document.getElementById('popup')
    var newForm = null;

    /////////////////////////////////////////////////
    //! Event for saving Exam details
    var saveQuestionDetails = document.getElementById('saveQuestionDetails')
    var validationMessage = document.getElementById('validationMessage');
    var durationValidationMessage = document.getElementById('durationValidationMessage');


    saveQuestionDetails.addEventListener('click',()=>{
        var inputs =  document.getElementById("examDetailsForm").querySelectorAll("input");
        var isValid = true;
        var isValidDuration = true;
        validationMessage.style.display = 'none';  // Hide the validation message initially
        durationValidationMessage.style.display = 'none';  // Hide the validation message initially

        for (const input of inputs) {
            if (input.value.trim() === '') {
                if(input.name=="examDuration"){
                    // Validate Exam Duration (must be a number greater than 1)
                    var examDuration = document.getElementById('examDuration').value.trim();
                    if (isNaN(examDuration) || Number(examDuration) <= 1) {
                        isValidDuration = false;
                        document.getElementById('examDuration').style.border = "1px solid red"; // Highlight the Exam Duration field
                        durationValidationMessage.style.display = 'block'; // Show error for Exam Duration
                    }
                }
                else{
                    isValid = false; // If any input is empty, set isValid to false
                    input.style.border = "1px solid red";  // Highlight empty fields
                }
            } else {
                input.style.border = "";  // Reset border style for non-empty fields
            }
        }

        

        // If any field is empty, prevent further actions and show a message
        if (!isValid) {
            validationMessage.style.display = 'block';  // Show validation message
            return; // Prevent the rest of the code from executing
        }

        if (!isValidDuration) {
            durationValidationMessage.style.display = 'block';  // Show validation message
            return; // Prevent the rest of the code from executing
        }

        if(saveQuestionDetails.innerText=="Edit"){
            for (const key in inputs) {
                inputs[key].disabled=false
            }
            saveQuestionDetails.innerText="Save"
        }
        else{
            for (const key in inputs) {
                inputs[key].disabled=true
            }
            saveQuestionDetails.innerText="Edit"
            saveQuestionDetails.id = "EditExamDetails"

            NodeCloning()
            addAnotherQuestion.insertAdjacentElement('beforebegin', newForm);

            addAnotherQuestion.style.visibility = 'visible'
            SaveExam.style.visibility = 'visible'

            questionCreateContainer = document.getElementById("questionCreateContainer");
            
            newForm = questionCreateContainer.cloneNode(true);

            newForm.style.visibility = "hidden";  // Initially hidden, will show when adding a new question

            // Add event listener for saving choices to the cloned form
            newForm.querySelector("#saveChoice").addEventListener("click", saveChoicee);

            
            // Reset the cloned form (e.g., clear the textarea and choices view)
            newForm.querySelector("#question").value = "";
            newForm.querySelector("#choicesView").innerHTML = "";
        } 
    })

    ///////////////////////////////////////
    //! Helper function to add the question create container
    function NodeCloning(){
        var questionCreateContainer2 = document.getElementById("questionCreateContainer")
        newForm = questionCreateContainer2.cloneNode(true);
        newForm.style.visibility='visible'
        newForm.style.display='block'
    }

    //! Event for adding another question card
    addAnotherQuestion.addEventListener('click' , ()=>{
        NodeCloning(); 
        // Insert the cloned form before the "Add another question" button
        addAnotherQuestion.insertAdjacentElement('beforebegin', newForm);
    })

    //////////////////////////////////////////////////
    //! Event to apply saving choice.
    var choicesCounter = 0;

    function saveChoicee(event) {
        // Ensure we target the correct form's choices view by finding the parent of the clicked button
        var currentForm = event.target.closest('form');
        var choiceContent = currentForm.querySelector('#choiceContent');  
        var choicesView = currentForm.querySelector('#choicesView');  

        if (choiceContent.value.trim() === "") return;  // Don't save if the choice is empty

        // Append the new choice to the specific question's choices view
        choicesView.innerHTML += `
            <div class="choices-View" >
                <input type="radio" id="choice${choicesCounter}" name="choices" value="${choicesCounter}" />
                <label for="choice${choicesCounter}">${choiceContent.value}</label>
                <input type="text" style="visibility: hidden; margin: 0; padding: 5px; display:none" id="inputToEdit">
                <button class="btn" onclick="EditChoice(event)"><i class="fa-solid fa-pen-to-square"></i> </button>
                <button class="btn" onclick="DeleteChoice(event)"><i  class="fa-solid fa-trash" ></i> </button> 
            </div>
        `;
        
        // Clear the input after saving
        choiceContent.value = "";
        choicesCounter++;
    }

    ///////////////////////////////////////////////////

    var questionCounter=1;
    var questionslist=[];

    function saveQuestionn(event){
        var currentForm = event.target.closest('form');
        var outerDiv = event.target.closest('div')

        var inputs =  currentForm.querySelectorAll("input");

        
        var questiontxtarea = currentForm.querySelector("#question")
        var icons = currentForm.querySelectorAll(".btn")

        if(event.target.innerText=="Edit"){ //edit question
            questiontxtarea.disabled = false;

            currentForm.querySelector(".choice-wrapper").style.display="flex"

            for (const icon of icons) {
                icon.style.display= "block";
            }
            for (const key of inputs) {
                key.disabled=false
            }
            
            event.target.innerText="Save question"
        }

        else{ // save question
            questiontxtarea.disabled = true;
            currentForm.querySelector(".choice-wrapper").style.display="none"

            for (const icon of icons) {
                icon.style.display= "none";
            }

            for (const key of inputs) {
                key.disabled=true;
            }
            console.log(event.target)
            event.target.innerText="Edit"


            var questionID = currentForm.querySelector('input[name="questionId"]')
            // console.log(currentForm)
            // outerDiv.querySelector("#questionCreateForm").style.visibility='hidden'
            // outerDiv.querySelector("#questionDetailsView").style.visibility='visible'
            
            // var questiontxt = currentForm.querySelector("#question").value
            // outerDiv.querySelector("#questionPlaceholder").innerText=`${questiontxt}`

            var choicesPlaceholder = outerDiv.querySelector("#choicesPlaceholder")    
            
            // select labels (actual answer text)
            var choiceslst = currentForm.querySelector("#choicesView").querySelectorAll("label")
            
            // select if checked
            var choicesinputlst = currentForm.querySelectorAll("[name='choices']")
            
            var questionitem = {
                QuestionID:-1,
                QuestionContent: currentForm.querySelector("#question").value,
                choices: [  ]
            };
            
            // choicesPlaceholder.innerHTML=""
            for (let i = 0; i < choiceslst.length; i++) {
                if(choicesinputlst[i].checked){
                    questionitem.choices.push({
                        content: choiceslst[i].innerHTML,
                        isCorrect: true
                    });
                }
                else{
                    questionitem.choices.push({
                        content: choiceslst[i].innerHTML,
                        isCorrect: false
                    });
                }
            }

        
            if(questionID.value==0){  // first save
                console.log("empty")
                questionID.value = questionCounter
                questionCounter++;      

                questionitem.QuestionID = questionID.value
                questionslist.push(questionitem)  
            }
            else{    // Edit existing question
                console.log("not-empty");

                var currentQuestionID = questionID.value;

                // Find the question in questionslist with the same QuestionID
                var currentQuestionIndex = questionslist.findIndex(question => question.QuestionID == currentQuestionID);

                if (currentQuestionIndex !== -1) {
                    // Update the question content and choices
                    questionslist[currentQuestionIndex].QuestionContent = questionitem.QuestionContent;
                    questionslist[currentQuestionIndex].choices = questionitem.choices;

                    console.log("Updated question:", questionslist[currentQuestionIndex]);
                } else {
                    console.log("Question not found in list.");
                }
            }
            
        }  
    }


    ///////////////////////////////////////

    //! event for editing question and answers

    // function EditQuestionn(event){
    //     var outerDiv = event.target.closest('div');
    //     var currentForm = outerDiv.previousElementSibling;   
    //     currentForm.style.visibility='visible'
    //     outerDiv.style.visibility='hidden'
    // }


    function EditChoice(event){
        event.preventDefault()
        var label = event.target.closest('div').querySelector('label')
        var editIcon = event.target.closest('div').querySelector('.fa-pen-to-square')
        var inputToEdit = event.target.closest('div').querySelector('#inputToEdit')
        if(editIcon==null){
            editIcon = event.target.closest('div').querySelector('.fa-check')
            label.style.display="flex"
            label.innerText = inputToEdit.value
            inputToEdit.style.visibility="hidden"
            inputToEdit.style.display="none"
            editIcon.classList.value = "fa-solid fa-pen-to-square";        
        }
        else{    
            label.style.display="none"
            inputToEdit.style.visibility="visible"
            inputToEdit.style.display="inline-block"
            inputToEdit.value = label.innerText
            inputToEdit.focus()
            editIcon.classList.value = "fa-solid fa-check";
        }
    }




    function DeleteChoice(event){
        event.preventDefault()
        var label = event.target.closest('div')
        // console.log(label)
        label.remove();
    }





    var examID=0;

    function saveExam() {
        
        examName = document.getElementById('examName').value
        examDate = document.getElementById('examDate').value
        examTime = document.getElementById('examTime').value
        examDuration = document.getElementById('examDuration').value

        
        var obj={
            ExamID:examID,
            ExamName:examName,
            ExamDate:examDate,
            ExamTime:examTime,
            ExamDuration:examDuration,
            questions: questionslist
        }

        console.log(obj)

        var xhr= new XMLHttpRequest()
        xhr.open("POST", "https://examination-website-default-rtdb.firebaseio.com/Exam.json")
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(obj))
        xhr.addEventListener("readystatechange",()=>{
            if(xhr.readyState==4 && xhr.status == 200){
                console.log(xhr.responseText)
            }
        })

        examID++;

        OpenPopup();
    }

    function OpenPopup(){

    // Show the popup and overlay
    popup.style.display = 'block';
    popup.style.visibility = 'visible';
    popupOverlay.style.display = 'block';
    
    // Make the page unscrollable
    document.body.classList.add('no-scroll');
    }

    function ClosePopup(){

    // Hide the popup and overlay
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';

    // Restore page scrollability
    document.body.classList.remove('no-scroll');
    window.open(`teacherDashboard.html`);
    }














    function closeCard(event) {
        var questionId =event.target.closest("#questionCreateContainer").querySelector('input[name="questionId"]').value
        
        // console.log(event.target.closest("#questionCreateContainer").querySelector('input[name="questionId"]'));
        // console.log(event.target.closest('form').querySelector('input[name="questionId"]'));

        if (questionId) {
            // If there's a question ID, remove the question from the questionslist
            var questionIndex = questionslist.findIndex(question => question.QuestionID == questionId);
            
            if (questionIndex !== -1) {
                // Remove the question from the list
                questionslist.splice(questionIndex, 1);
                console.log("Question deleted:", questionslist);
            }
        }

        // Hide the questionCreateContainer
        event.target.closest("#questionCreateContainer").style.display = "none";
        // console.log(event.target.closest('div'));
        console.log("Card closed and question deleted.");
        // document.getElementById("questionCreateContainer").style.visibility = "hidden";
    }

