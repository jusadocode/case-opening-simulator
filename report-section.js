// Add functionality to send email from form with env variables

const reportButton = document.querySelector('.report-button');
const reportDialog = document.querySelector('#report-dialog');

reportButton.addEventListener('click', () => {
  // Show the dialog
  reportDialog.showModal();

  // Handle form submission
  const form = document.querySelector('#reportForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(form);
    const name = formData.get('name');
    const report = formData.get('report');
    
    // Do something with the form data (e.g., send it to a server)
    console.log('Name:', name);
    console.log('Report:', report);

    // Close the dialog
    reportDialog.close();
  });
});

reportDialog.addEventListener('click', (event) => {
  if (event.target === reportDialog) {
    reportDialog.close();
  }
});

export default reportButton;