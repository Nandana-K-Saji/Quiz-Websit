let quizData;
let sectionHeader;
let mainContainer;
let loadingContainer;
let currentSection = 0;
let currentQuestion = 0;
let optionArea;
let totalTime;
let time = 60;
let submitExam;


async function getExamData() {
  let link = 'https://dreamthemonline.com/sample/getNewQuizData/600';
  fetch(link).then((value) => {
    return value.json();

  }).then((vale) => {
    quizData = vale;
    console.table(quizData);
    displayQuizArea();
    updateSectionHeader();
    updateQuestion();
    updateOption();
    displayPallete();
    timeFun();
    legendCount();
    questionTimer();
    submitExam = document.getElementById('submitExam');
    submitExam.addEventListener('click', () => {
      examFinished();
    })

  })

}
getExamData();
function examFinished() {
  loadingContainer.innerHTML = '';
  loadingContainer.innerHTML = '<div>Thank you for attending the exam. see you later</div>';
  loadingContainer.style.display = 'block';
  sectionHeader.style.display = 'none';
  mainContainer.style.display = 'none';

}


function displayQuizArea() {
  loadingContainer = document.getElementById('loading-container');
  loadingContainer.style.display = 'none';
  sectionHeader = document.getElementById('section-header');
  sectionHeader.style.display = 'block';
  mainContainer = document.getElementById('main-container');
  mainContainer.style.display = 'flex';

}

function updateSectionHeader() {

  sectionHeader.innerHTML = '';
  for (i = 0; i < quizData.sections.length; i++) {
    if (i == currentSection) {
      sectionHeader.innerHTML += `<button class="section-btn section-btn-active"onclick="sectionButtonClicked(${i})">${quizData.sections[i].title}</button>`;
    }
    else {
      sectionHeader.innerHTML += `<button class="section-btn"onclick="sectionButtonClicked(${i})">${quizData.sections[i].title}</button>`
    }

    console.log(quizData.sections[i].title);
  }
}
function sectionButtonClicked(pos) {
  console.log(pos);
  currentSection = pos;
  currentQuestion = 0;
  updateQuestion();
  updateOption();
  displayPallete();
  legendCount();
  updateSectionHeader();


}

function updateQuestion() {
  questions = document.getElementById('question');
  options = document.getElementById('options');
  questions.innerHTML = quizData.sections[currentSection].data[currentQuestion].question;
  questionCounter = document.getElementById('question-counter');
  questionCounter.innerHTML = `Question No ${currentQuestion + 1}`;
}

function updateOption() {
  optionArea = document.getElementById('options');
  optionArea.innerHTML = '';
  console.log(quizData.sections[currentSection].data[currentQuestion].userSelectedOptions);
  for (i = 0; i < quizData.sections[currentSection].data[currentQuestion].options.length; i++) {
    console.log(quizData.sections[currentSection].data[currentQuestion].options[i].option);
    if (quizData.sections[currentSection].data[currentQuestion].options[i].option == quizData.sections[currentSection].data[currentQuestion].userSelectedOptions[0]) {
      optionArea.innerHTML += `<li class="option selected" onclick="selectOption(${i})">${quizData.sections[currentSection].data[currentQuestion].options[i].value}</li>`
    } else {
      optionArea.innerHTML += `<li class="option" onclick="selectOption(${i})">${quizData.sections[currentSection].data[currentQuestion].options[i].value}</li>`
    }

  }

}
function selectOption(pos) {
  let optionn = document.querySelectorAll('.option');
  console.log(optionn);
  optionn.forEach((select) => {
    select.classList.remove('selected');

  })
  optionn[pos].classList.add('selected');

  quizData.sections[currentSection].data[currentQuestion].userSelectedOptions = [quizData.sections[currentSection].data[currentQuestion].options[pos].option];
  console.log(quizData.sections[currentSection].data[currentQuestion].userSelectedOptions);
}





function displayPallete() {
  palleteArea = document.getElementById('question-pallete-area');
  palleteArea.innerHTML = '';
  for (i = 0; i < quizData.sections[currentSection].data.length; i++) {
    if (quizData.sections[currentSection].data[i].userSelectedOptions.length > 0) {
      palleteArea.innerHTML += `<button class="pallete-btn pallete-btn-success" onclick="questionPalleteclicked(${i})">${i + 1}</button>`

    }
    else {
      palleteArea.innerHTML += `<button class="pallete-btn" onclick="questionPalleteclicked(${i})">${i + 1}</button>`

    }
    // console.log(quizData.sections[currentSection].data);

  }
}
function questionPalleteclicked(pos) {
  currentQuestion = pos;
  updateQuestion();
  updateOption();


}


function nextQuestion() {
  if (currentQuestion < quizData.sections[currentSection].data.length - 1) {
    currentQuestion++;
    updateQuestion();
    updateOption();
    displayPallete();
    legendCount();
    optionSaverApi();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    updateQuestion();
    updateOption();
    displayPallete();
    legendCount();
    optionSaverApi();
  }
}

async function optionSaverApi() {
  console.log('sent the data to server', quizData.sections[currentSection].data[currentQuestion].questionID, quizData.sections[currentSection].data[currentQuestion].userSelectedOptions, quizData.section[currentSection].data[currentQuestion].userSpentTime);
}

// function timeFun() {
//   let totalTime = document.getElementById('total-time');
//   totalTime.innerHTML = time;
//   setInterval(() => {
//     if (time >= 1) {
//       time--;
//       totalTime.innerHTML = time;
//       console.log(time);
//     }
//     else {
//       examFinished();
//     }
//   }, 60000);

// }

function timeFun() {
  let totalTime = document.getElementById('total-time');
  let time = 7200; 
  totalTime.innerHTML = formatTime(time);
  setInterval(() => {
    if (time >= 1) {
      time--;
      totalTime.innerHTML = formatTime(time);
      console.log(formatTime(time));
    } else {
      examFinished();
    }
  }, 1000); // 1000 milliseconds = 1 second

  function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${hours}Hrs:${minutes}Mins:${seconds}:sec`;
  }
}

function questionTimer() {
  setInterval(() => {
    quizData.sections[currentSection].data[currentQuestion].userSpentTime++;
    console.table(quizData.sections[currentSection].data);
  }, 1000);

}

function legendCount() {
  let attended = 0;
  let unAttended = 0;
  let unAnswerd = 0;
  attendedElement = document.querySelector('.attended');
  unAnswerdElement = document.querySelector('.unattended');
  for (i = 0; i < quizData.sections[currentSection].data.length; i++) {
    if (quizData.sections[currentSection].data[i].userSelectedOptions.length > 0) {
      attended++;
      console.log(attended);
    } else {
      unAnswerd++;
      console.log(unAnswerd);
    }
  }
  attendedElement.innerHTML = attended;
  unAnswerdElement.innerHTML = unAnswerd;
}




