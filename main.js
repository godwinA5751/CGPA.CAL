document.querySelector('.next').addEventListener('click', () =>{
  gradesNext();
})
 
let grades = 0;
let unit = 0;
let cOvers = 0;

function gradesNext(){
  let grade = document.querySelector('#grades');
  let gradeInput = grade.value.toUpperCase();
  let courseUnit = document.querySelector('#unit');
  let units = parseInt(courseUnit.value);

  if(gradeInput === '' && (units < 0 || units === '')){
    return;
  }

  if(gradeInput === 'A'){
    gradeInput = 5;
  } else if(gradeInput === 'B'){
    gradeInput = 4;
  } else if(gradeInput === 'C'){
    gradeInput = 3;
  } else if(gradeInput === 'D'){
    gradeInput = 2;
  } else if(gradeInput === 'E'){
    gradeInput = 1;
  } else if(gradeInput === 'F'){
    gradeInput = 0;
    cOvers += 1;
  } else{
    return Error;
  }
  

  const finalCgpa = document.querySelector('.cgpa');
  const carryOvers = document.querySelector('.carryovers');
  finalCgpa.innerHTML = '0.00';
  carryOvers.innerHTML = '0';

  document.querySelector('#grades').value = '';
  document.querySelector('#unit').value = '';
  

  grades += gradeInput*units;
  unit += units;
  
  
}
document.querySelector('.calculate').addEventListener('click', () =>{
  
  gradesNext();
  if(grades === 0 && unit === 0){
    return;
  }
  const load = document.querySelector('.spinner');
  const submit = document.querySelector('.text');
  const firstForm = document.querySelector('.js-first-form');
  const secondForm = document.querySelector('.js-second-form');
  const thirdForm = document.querySelector('.js-third-form');
  const inputLevel = document.querySelector('.js-input-level');
  const inputPrevGrade = document.querySelector('.js-input-grade');

  const levelValue = Number(inputLevel.value);
  const gradeValue = Number(inputPrevGrade.value);

  const finalCgpa = document.querySelector('.cgpa');
  const carryOvers = document.querySelector('.carryovers');
  carryOvers.innerHTML = cOvers;


  firstForm.style.display = 'none';
  secondForm.style.display = 'flex';

  let cgpa = (grades/unit).toFixed(2);
  let totalCgpa = ((Number(cgpa) + gradeValue) / 2).toFixed(2);

  if(levelValue > 100){
    secondForm.style.display = 'none';
    thirdForm.style.display = 'flex';
    if(gradeValue > 0 && gradeValue <= 5.00){
      load.style.display = 'block';
      submit.innerHTML = 'calculating';
      setTimeout(() =>{
        load.style.display = 'none';
        submit.innerHTML = 'Submit';
        finalCgpa.innerHTML = totalCgpa;
        thirdForm.style.display = 'none';
        firstForm.style.display = 'flex';
        resetPage();
      }, 3000);
    } else{
      return;
    }
  } 
  if(levelValue === 100){
    load.style.display = 'block';
    submit.innerHTML = 'calculating';
    setTimeout(() =>{
      load.style.display = 'none';
      submit.innerHTML = 'Submit';
      finalCgpa.innerHTML = cgpa;
      secondForm.style.display = 'none';
      firstForm.style.display = 'flex';
      resetPage();
    }, 3000);
  }
  function resetPage(){
    cgpa = '';
    totalCgpa = 0;
    grades = 0;
    unit = 0;
    document.querySelector('.js-input-grade').value = '';
    document.querySelector('.js-input-level').value = '';
  }
});

