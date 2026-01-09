// ==============================
// Variable Initialization
// ==============================
let grades = 0;
let unit = 0;
let cOvers = 0;
let cgpa;
let totalCgpa;

// ==============================
// Load Data from Local Storage
// ==============================
let addToList = JSON.parse(localStorage.getItem('addToList')) || [];

// ==============================
// DOM Element References
// ==============================
const firstForm = document.querySelector('.js-first-form');
const secondForm = document.querySelector('.js-second-form');
const thirdForm = document.querySelector('.js-third-form');
const finalCgpa = document.querySelector('.cgpa');
const carryOvers = document.querySelector('.carryovers');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const errorMessage2 = document.querySelector('.message1');
const successMessage2 = document.querySelector('.message2');

// ==============================
// Initial UI Setup
// ==============================
modifyTodo();

// ==============================
// Event Listeners
// ==============================

// Add course to the list
document.querySelector('.next').addEventListener('click', (e) => {
  e.preventDefault();
  addTodo();
});

// Calculate CGPA
document.querySelector('.calculate').addEventListener('click', (e) => {
  e.preventDefault();
  calculateCGPA();
});

// Clear all data and reset UI
document.querySelector('.clear').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.submit-field').style.display = 'none';
  resetPage();
});

// ==============================
// Utility Functions
// ==============================

// Show temporary message to user
function showMessage(element, message) {
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 3000);
}

// Validate course input fields
function validateCourseInputs() {
  const courseCode = document.querySelector('#code').value.trim();
  const gradeInput = document.querySelector('#grades').value.trim().toUpperCase();
  const courseUnit = document.querySelector('#unit').value.trim();

  if (!courseCode || !gradeInput || !courseUnit) {
    showMessage(errorMessage, 'Please fill in all course fields');
    return false;
  }

  const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];
  if (!validGrades.includes(gradeInput)) {
    showMessage(errorMessage, 'Please enter a valid grade (A-F)');
    return false;
  }

  if (isNaN(courseUnit) || courseUnit <= 0) {
    showMessage(errorMessage, 'Please enter a valid course unit');
    return false;
  }

  return true;
}

// ==============================
// Course List Management
// ==============================

// Add a new course to the list
function addTodo() {
  if (!validateCourseInputs()) return;

  const courseCode = document.querySelector('#code').value.trim();
  const courseGrade = document.querySelector('#grades').value.trim().toUpperCase();
  const courseUnit = document.querySelector('#unit').value.trim();

  addToList.push({
    courseCode: courseCode,
    courseGrade: courseGrade,
    courseUnit: courseUnit
  });

  // Clear input fields
  document.querySelector('#code').value = '';
  document.querySelector('#grades').value = '';
  document.querySelector('#unit').value = '';

  // Update UI and storage
  modifyTodo();
  saveToStorage();

  showMessage(successMessage, 'Course added successfully');
}

// Render the course list and handle row coloring
function modifyTodo() {
  let addToListHtml = '';

  if (addToList.length === 0) {
    document.querySelector('.course-list').classList.add('add-style');
    addToListHtml = '<div class="empty-message">No courses added yet</div>';
    document.querySelector('.submit-field').style.display = 'none';
  } else {
    document.querySelector('.submit-field').style.display = 'flex';
    document.querySelector('.course-list').classList.remove('add-style');
    addToList.forEach((todoObject, index) => {
      const course = todoObject.courseCode;
      const courseGrade = todoObject.courseGrade;
      const courseUnit = todoObject.courseUnit;
      const html = `
        <div class="table">${index + 1}</div>
        <div class="table">${course.toUpperCase()}</div>
        <div class="table">${courseGrade}</div>
        <div class="table">${courseUnit}</div>
        <button class="delete_btn js_delete" data-index="${index}">
          Delete
        </button>
      `;
      addToListHtml += html;
    });
  }

  document.querySelector('.course-list').innerHTML = addToListHtml;

  // Add event listeners to delete buttons
  document.querySelectorAll('.js_delete').forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      addToList.splice(index, 1);

      // If this was the last course, reset all calculations and storage
      if (addToList.length === 0) {
        resetPage();
        return;
      }

      // Otherwise update UI and storage
      modifyTodo();
      saveToStorage();
      showMessage(successMessage, 'Course removed successfully');
    });
  });
}

// Save course list to localStorage
function saveToStorage() {
  localStorage.setItem('addToList', JSON.stringify(addToList));
}

// ==============================
// CGPA Calculation Logic
// ==============================

// Calculate total grades, units, and carry overs
function calculateGrades() {
  grades = 0;
  unit = 0;
  cOvers = 0;

  addToList.forEach(course => {
    const gradeInput = course.courseGrade.toUpperCase();
    const units = parseInt(course.courseUnit);

    let gradeValue;
    switch (gradeInput) {
      case 'A': gradeValue = 5; break;
      case 'B': gradeValue = 4; break;
      case 'C': gradeValue = 3; break;
      case 'D': gradeValue = 2; break;
      case 'E': gradeValue = 1; break;
      case 'F': gradeValue = 0; cOvers += 1; break;
      default: gradeValue = 0;
    }

    grades += gradeValue * units;
    unit += units;
  });

  // Update carryovers display
  carryOvers.innerHTML = cOvers;
}

// Validate level and previous CGPA input
function validateLevelAndGrade() {
  const inputLevel = document.querySelector('.js-input-level');
  const inputPrevGrade = document.querySelector('.js-input-grade');

  const levelValue = Number(inputLevel.value);
  const gradeValue = Number(inputPrevGrade.value);

  if (!levelValue || levelValue < 100 || levelValue > 600) {
    showMessage(errorMessage2, 'Please enter a valid level (100-600)');
    return false;
  }

  if (levelValue > 100 && (gradeValue < 0 || gradeValue > 5)) {
    showMessage(errorMessage2, 'Please enter a valid previous CGPA (0.00-5.00)');
    return false;
  }

  return true;
}

// Main CGPA calculation handler
function calculateCGPA() {
  if (addToList.length === 0) {
    showMessage(errorMessage, 'Please add at least one course');
    return;
  }

  calculateGrades();

  if (grades === 0 && unit === 0) {
    showMessage(errorMessage2, 'Cannot calculate CGPA with no valid courses');
    return;
  }

  const inputLevel = document.querySelector('.js-input-level');
  const inputPrevGrade = document.querySelector('.js-input-grade');

  const levelValue = Number(inputLevel.value);
  const gradeValue = Number(inputPrevGrade.value);

  // Show level input form for all students
  secondForm.style.display = 'flex';

  // If level is already provided, proceed to next step
  if (levelValue) {
    if (!validateLevelAndGrade()) return;

    if (levelValue === 100) {
      // Calculate for 100 level
      cgpa = (grades / unit).toFixed(2);
      showResults(cgpa);
    } else {
      // Show previous CGPA input for higher levels
      secondForm.style.display = 'none';
      thirdForm.style.display = 'flex';

      if (gradeValue > 0 && gradeValue <= 5.00) {
        // Calculate for higher levels
        cgpa = (grades / unit).toFixed(2);
        totalCgpa = ((Number(cgpa) + gradeValue) / 2).toFixed(2);
        showResults(totalCgpa);
      }
    }
  }
}

// Display CGPA result and reset forms
function showResults(resultCgpa) {
  const load = document.querySelector('.spinner');
  const submit = document.querySelector('.text');

  load.style.display = 'block';
  submit.innerHTML = 'calculating';

  setTimeout(() => {
    load.style.display = 'none';
    submit.innerHTML = 'Submit';
    finalCgpa.innerHTML = resultCgpa;
    localStorage.setItem('finalCgpa', resultCgpa);
    localStorage.setItem('carryOvers', cOvers);

    // 🔥 UPDATE PROGRESS BAR
    setCGPA(resultCgpa);

    // Reset forms
    firstForm.style.display = 'flex';
    secondForm.style.display = 'none';
    thirdForm.style.display = 'none';

    document.querySelector('.js-input-level').value = '';
    document.querySelector('.js-input-grade').value = '';

    showMessage(successMessage2, `CGPA calculated: ${resultCgpa}`);
  }, 2000);
}

// ==============================
// Reset & Restore Logic
// ==============================

// Reset all data and UI to initial state
function resetPage() {
  grades = 0;
  unit = 0;
  cOvers = 0;
  cgpa = 0;
  totalCgpa = 0;

  // Clear course list
  addToList = [];
  modifyTodo();
  saveToStorage();

  // Reset forms
  document.querySelector('#code').value = '';
  document.querySelector('#grades').value = '';
  document.querySelector('#unit').value = '';
  document.querySelector('.js-input-level').value = '';
  document.querySelector('.js-input-grade').value = '';

  // Reset displays
  finalCgpa.innerHTML = '0.00';
  setCGPA(0);
  carryOvers.innerHTML = '0';
  localStorage.setItem('finalCgpa', '0.00');     // Reset CGPA
  localStorage.setItem('carryOvers', '0');       // Reset carry overs

  // Show first form
  firstForm.style.display = 'flex';
  secondForm.style.display = 'none';
  thirdForm.style.display = 'none';

  // Show success message
  showMessage(successMessage, 'All data cleared successfully');

  // Update clear button text temporarily
  const clearButton = document.querySelector('.clear');
  clearButton.innerHTML = 'Cleared';
  setTimeout(() => {
    clearButton.innerHTML = 'Clear';
  }, 2000);
}

// Restore CGPA and carry overs from localStorage on page load
const storedCGPA = localStorage.getItem('finalCgpa') || 0;
finalCgpa.innerHTML = Number(storedCGPA).toFixed(2);
setCGPA(storedCGPA);

if (localStorage.getItem('carryOvers')) {
  carryOvers.innerHTML = localStorage.getItem('carryOvers');
}

function setCGPA(cgpa, maxCGPA = 5) {
  const value = Math.min(Math.max(Number(cgpa), 0), maxCGPA);
  const percentage = value / maxCGPA;

  const arcLength = 251; // must match CSS
  const offset = arcLength * (1 - percentage);

  const arc = document.getElementById("progressArc");
  const text = document.getElementById("cgpaValue");

  if (arc) arc.style.strokeDashoffset = offset;
  if (text) text.textContent = value.toFixed(2);
}