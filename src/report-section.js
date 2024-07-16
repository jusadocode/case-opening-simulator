// Add functionality to send email from form with env variables


//// CAUTION RELATED TO CUSTOM VALIDATION 
// Mixing default html validation with custom provides difficult results
// disable default html validations if possible

const reportButton = document.querySelector('.report-button');
const reportDialog = document.querySelector('#report-dialog');
const submitloadingIndicator = document.querySelector('#submitLoadingIndicator');

let nameInput = document.querySelector('#name');
let emailInput = document.querySelector('#e-mail');
let ideasInput = document.querySelector('#report');
let exitButton = document.querySelector('.exitButton');
let submitButton = document.querySelector('#submitButton');
let statusLabel = document.querySelector('#statusLabel');

reportButton.addEventListener('click', () => {
  // Show the dialog
  reportDialog.classList.add('animated');
  reportDialog.classList.add('fadeInReport');
  reportDialog.showModal();
  initializeInputs();
  
});

exitButton.addEventListener('click', () => reportDialog.close());

submitButton.addEventListener('click', handleSubmit);

function initializeInputs() {
  nameInput.addEventListener('input', nameVerification);
  emailInput.addEventListener('input', emailVerification);
  ideasInput.addEventListener('input', ideasVerification);
}

async function handleSubmit(event) {

  statusLabel.textContent = '';
  event.preventDefault();

  let isValid = true;

  if (!nameVerification()) isValid = false;
  if (!emailVerification()) isValid = false;
  if (!ideasVerification()) isValid = false;

  if (isValid) {
    
    const reportObj = {
      name: nameInput.value,
      email: emailInput.value,
      text: ideasInput.value
    };

    let baseUrl = '';
  
    if(process.env.NODE_ENV === 'production') {
      
      //baseUrl = 'http:localhost:5500'; Local prod test
      baseUrl = window.location.href;
      baseUrl = baseUrl.slice(0, -1);
    }
    try {

      enableIndicator();
      disableButton();
      
      const response = await fetch(`${baseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportObj)
        
      });

      if (response.ok) {
        statusLabel.textContent = 'Thank you for your feedback!';
      } else {
        statusLabel.textContent = 'Failed to send feedback';
        enableButton();
        return;
      }
    } catch (error) {
      statusLabel.textContent = `Error: ${error.message}`;
      enableButton();
      return;
    }
    finally {
      disableIndicator();
    }


    setTimeout(()=>{
      resetInputs();
      reportDialog.close();
    }, 1000);
    
  }
}


function nameVerification() {
  if (nameInput.value.trim() === '') {
    nameInput.setCustomValidity('Write your name');
    nameInput.reportValidity();
    return false;
  }

  nameInput.setCustomValidity('');
  nameInput.reportValidity();

  return true;
}

function emailVerification() {

  // If chosen to write email - write it properly
  if (emailInput.value.trim() === '') {
    //emailInput.setCustomValidity('Email cannot be empty');
    return true;
  }
  else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Make sure to provide proper email');
    emailInput.reportValidity();
    return false;
  } else {
    emailInput.setCustomValidity('');
  }

  emailInput.reportValidity();
  return true;
}

function ideasVerification() {
  if (ideasInput.value.trim() === '') {
    ideasInput.setCustomValidity('Say something, your feedback is important :)');
    ideasInput.reportValidity();
    return false;
  }

  else if (ideasInput.value.length < 15) {
    ideasInput.setCustomValidity('Try to be as insightful as you can!');
    ideasInput.reportValidity();
    return false;
  }
  else {
    ideasInput.setCustomValidity('');
  }

  ideasInput.reportValidity();
  return true;
}

function resetInputs() {
  nameInput.value = '';
  emailInput.value = '';
  ideasInput.value = '';
  statusLabel.textContent = '';
  enableButton();
}

function enableIndicator() {
  submitloadingIndicator.style.display = 'block';
}
function disableIndicator() {
  submitloadingIndicator.style.display = 'none';
}

function disableButton() {
  submitButton.disabled = true;
  submitButton.style.display = 'none';
}
function enableButton() {
  submitButton.disabled = false;
  submitButton.style.display = 'block';
}


export default reportButton;