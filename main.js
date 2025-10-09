// Initialize variables
let grades = 0;
let unit = 0;
let cOvers = 0;
let cgpa;
let totalCgpa;

// Load courses from localStorage or initialize empty array
let addToList = JSON.parse(localStorage.getItem('addToList')) || [];

// DOM Elements
const firstForm = document.querySelector('.js-first-form');
const secondForm = document.querySelector('.js-second-form');
const thirdForm = document.querySelector('.js-third-form');
const finalCgpa = document.querySelector('.cgpa');
const carryOvers = document.querySelector('.carryovers');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const errorMessage2 = document.querySelector('.message1');
const successMessage2 = document.querySelector('.message2');

// Initialize the course list display
modifyTodo();

// Event Listeners
document.querySelector('.next').addEventListener('click', (e) => {
  e.preventDefault();
  addTodo();
});

document.querySelector('.calculate').addEventListener('click', (e) => {
  e.preventDefault();
  calculateCGPA();
});

document.querySelector('.clear').addEventListener('click', (e) => {
  e.preventDefault();
  
  document.querySelector('.submit-field').style.display = 'none';
  resetPage();
});

// Functions
function showMessage(element, message) {
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 3000);
}

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

function addTodo() {
  if (!validateCourseInputs()) return;
  
  const courseCode = document.querySelector('#code').value.trim();
  const courseGrade = document.querySelector('#grades').value.trim().toUpperCase();
  const courseUnit = document.querySelector('#unit').value.trim();
  
  // Add to list
  addToList.push({
    courseCode: courseCode,
    courseGrade: courseGrade,
    courseUnit: courseUnit
  });
  
  // Clear inputs
  document.querySelector('#code').value = '';
  document.querySelector('#grades').value = '';
  document.querySelector('#unit').value = '';
  
  // Update display and storage
  modifyTodo();
  saveToStorage();
  
  showMessage(successMessage, 'Course added successfully');
}

function modifyTodo() {
  let addToListHtml = '';
  
  if (addToList.length === 0) {
    document.querySelector('.course-list').classList.add('add-style')
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
        <div class="table">${index+1}</div>
        <div class="table">${course}</div>
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
      modifyTodo();
      saveToStorage();
    });
  });
}

function saveToStorage() {
  localStorage.setItem('addToList', JSON.stringify(addToList));
}

function calculateGrades() {
  // Reset values
  grades = 0;
  unit = 0;
  cOvers = 0;
  
  // Calculate from all courses
  addToList.forEach(course => {
    const gradeInput = course.courseGrade.toUpperCase();
    const units = parseInt(course.courseUnit);
    
    let gradeValue;
    switch(gradeInput) {
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
      cgpa = (grades/unit).toFixed(2);
      showResults(cgpa);
    } else {
      // Show previous CGPA input for higher levels
      secondForm.style.display = 'none';
      thirdForm.style.display = 'flex';
      
      if (gradeValue > 0 && gradeValue <= 5.00) {
        // Calculate for higher levels
        cgpa = (grades/unit).toFixed(2);
        totalCgpa = ((Number(cgpa) + gradeValue) / 2).toFixed(2);
        showResults(totalCgpa);
      }
    }
  }
}

function showResults(resultCgpa) {
  const load = document.querySelector('.spinner');
  const submit = document.querySelector('.text');
  
  load.style.display = 'block';
  submit.innerHTML = 'calculating';
  
  setTimeout(() => {
    load.style.display = 'none';
    submit.innerHTML = 'Submit';
    finalCgpa.innerHTML = resultCgpa;
    localStorage.setItem('finalCgpa', resultCgpa); // Save CGPA
    localStorage.setItem('carryOvers', cOvers);    // Save carry overs
    
    // Reset forms
    firstForm.style.display = 'flex';
    secondForm.style.display = 'none';
    thirdForm.style.display = 'none';
    
    document.querySelector('.js-input-level').value = '';
    document.querySelector('.js-input-grade').value = '';
    
    showMessage(successMessage2, `CGPA calculated: ${resultCgpa}`);
  }, 2000);
}

function resetPage() {
  // Reset variables
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

// On page load, restore CGPA and carry overs if present
if (localStorage.getItem('finalCgpa')) {
  finalCgpa.innerHTML = localStorage.getItem('finalCgpa');
}
if (localStorage.getItem('carryOvers')) {
  carryOvers.innerHTML = localStorage.getItem('carryOvers');
}