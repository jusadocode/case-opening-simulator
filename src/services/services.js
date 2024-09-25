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
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching case data:', error);
    throw error;
  }
}

async function fetchCapsuleData() {
  try {
    const data = await callApi('data/capsules');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching capsule data:', error);
    throw error;
  }
}

async function fetchSouvenirData() {
  try {
    const data = await callApi('data/souvenirs');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching souvenir data:', error);
    throw error;
  }
}

async function fetchAutographCapsuleData() {
  try {
    const data = await callApi('data/autograph_capsules');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching autograph capsule data:', error);
    throw error;
  }
}

async function fetchGraffitiData() {
  try {
    const data = await callApi('data/graffitis');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching graffiti data:', error);
    throw error;
  }
}

async function fetchPinData() {
  try {
    const data = await callApi('data/pins');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching pin data:', error);
    throw error;
  }
}

export { 
  callApi, 
  fetchCaseData, 
  fetchCapsuleData, 
  fetchSouvenirData, 
  fetchAutographCapsuleData, 
  fetchGraffitiData, 
  fetchPinData 
};