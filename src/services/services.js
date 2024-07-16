async function callApi(urlPostfix) {

  // Change this for production build (it wont be using localhost)
  let baseUrl = '';
  
  if(process.env.NODE_ENV === 'production') {
    
    //baseUrl = 'http:localhost:5500'; Local prod test
    baseUrl = window.location.href;
    baseUrl = baseUrl.slice(0, -1);
  }
  
  let url = `${baseUrl}/${urlPostfix}`;
  
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      return null; 
    });
}
  
async function fetchCaseData() {
  try {
    const data = await callApi('data/cases');
    return data;
  } catch (error) {
    console.error('Error fetching case data:', error);
    throw error;
  }
}

export {callApi, fetchCaseData};