// welcome.js

// Retrieve the student's name and exam details from localStorage
var studentName = localStorage.getItem('studentName');
var examName = localStorage.getItem('examName');
var examDate = localStorage.getItem('examDate');
var examTime = localStorage.getItem('examTime');
var examDuration = localStorage.getItem('examDuration');

// Fill in the student name and exam details if available
document.getElementById('studentName').innerText = studentName || "Student";
document.getElementById('examName').innerText = examName || "Sample Exam";
document.getElementById('examDate').innerText = examDate || "2024-12-20";
document.getElementById('examTime').innerText = examTime || "09:00 AM";
document.getElementById('examDuration').innerText = examDuration || "60 minutes";

// Handle the "Start Exam" button click
document.getElementById('startExamButton').addEventListener('click', function() {
  // Redirect to the exam page (this is just an example)
  window.location.href = "startExam.html"; // You can replace this with the actual exam page URL
});

// Handle the "View Exam Instructions" button click
document.getElementById('viewInstructionsButton').addEventListener('click', function() {
  // Redirect to the instructions page (this is just an example)
  window.location.href = "examInstructions.html"; // You can replace this with the actual instructions page URL
});
