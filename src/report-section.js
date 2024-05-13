// Add functionality to send email from form with env variables

const reportButton = document.querySelector('.report-button');
const reportDialog = document.querySelector('#report-dialog');

let emailInput = document.querySelector('#e-mail');
let ideasInput = document.querySelector('#report');
let exitButton = document.querySelector('.exitButton');

reportButton.addEventListener('click', () => {
  // Show the dialog
  reportDialog.showModal();
  initializeInputs();
  // Handle form submission
  const form = document.querySelector('#reportForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    
    if (emailInput.checkValidity() && ideasInput.checkValidity()) {
      // If all fields are valid, submit the form
      form.submit();
      reportDialog.close();
    }
    // Close the dialog
    
  });
});

exitButton.addEventListener('click', (event) => {
  reportDialog.close();
});

function initializeInputs() {
  emailInput.addEventListener('input', emailVerification);

}

function emailVerification() {
  if (emailInput.value.trim() === '') {
    emailInput.setCustomValidity('Email cannot be empty');
  }
  else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('I am expecting an email address!');
  } else {
    emailInput.setCustomValidity('');
  }

  emailInput.reportValidity();
}

function ideasVerification() {
  if (ideasInput.value.trim() === '') {
    ideasInput.setCustomValidity('Say something, dont be shy :)');
  }
  else {
    ideasInput.setCustomValidity('');
  }

  ideasInput.reportValidity();
}

export default reportButton;