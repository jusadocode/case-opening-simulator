// Add functionality to send email from form with env variables

//// CAUTION RELATED TO CUSTOM VALIDATION 
// Mixing default html validation with custom provides difficult results
// disable default html validations if possible

const reportButton = document.querySelector('.report-button');
const reportDialog = document.querySelector('#report-dialog');

let nameInput = document.querySelector('#name');
let emailInput = document.querySelector('#e-mail');
let ideasInput = document.querySelector('#report');
let exitButton = document.querySelector('.exitButton');
let submitButton = document.querySelector('#submitButton');

reportButton.addEventListener('click', () => {
  // Show the dialog
  reportDialog.classList.add('animated');
  reportDialog.classList.add('fadeIn');
  reportDialog.showModal();
  initializeInputs();
  
});

exitButton.addEventListener('click', () => reportDialog.close());

submitButton.addEventListener('click', handleSubmit)

function initializeInputs() {
  nameInput.addEventListener('input', nameVerification);
  emailInput.addEventListener('input', emailVerification);
  ideasInput.addEventListener('input', ideasVerification);
}

function handleSubmit(event) {

  event.preventDefault();

  let isValid = true;

  if (!nameVerification()) isValid = false;
  if (!emailVerification()) isValid = false;
  if (!ideasVerification()) isValid = false;

  if(isValid) {
    // submit information
    // reset inputs
    resetInputs();
    reportDialog.close();
  }
    
}


function nameVerification() {
  if (nameInput.value.trim() === "") {
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
  if (emailInput.value.trim() === "") {
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
  if (ideasInput.value.trim() === "") {
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

}

function sendEmail(email, report) {
  // Use environment variables to get the email service configuration
  const serviceId = process.env.EMAIL_SERVICE_ID;
  const templateId = process.env.EMAIL_TEMPLATE_ID;
  const userId = process.env.EMAIL_USER_ID;
  
  // Use an email sending service like EmailJS
  emailjs.send(serviceId, templateId, {
    email: email,
    report: report
  }, userId)
  .then((response) => {
    console.log('Email sent successfully:', response.status, response.text);
  }, (error) => {
    console.error('Failed to send email:', error);
  });
}

export default reportButton;