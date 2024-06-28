/////////////////////////////////
// Dont use the word case in the code
/////////////////////////////////

// Divide the code into functions

// Working emails
// Add more info about obtained skin
// Loading indicators


import { getRandomInt, getRandomFloat, randomGenItem, createDistribution } from "./math-utilities/mathUtils";
import { getRarityOdds, getRarityColor } from "./crate-info-utilities/crateUtils";
import reportButton from "./report-section";
// Change this for production build (it wont be using localhost)

const button = document.querySelector('.open-button');

let newButton;

let statusText = document.querySelector('#status');

let moneyStatus = 4.35;
const keyPrice = 2.34;

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

let caseImageSection = document.querySelector('.case-image-section');

let caseSelect = document.querySelector('select');

const itemMarker = document.querySelector('.case-open-marker');



/////////////////////////////////
// Case variables
/////////////////////////////////
let cases = [];
const rollItemCount = 150;
let rolledItems = [];
let distribution = [];

let selectedCase = {};
let fixedItemCount = 18;

let itemRarityCounts = {
  Consumer: 0,
  Industrial: 0,
  'Mil-Spec Grade': 0,
  Restricted: 0,
  Classified: 0,
  Covert: 0,
  Contraband: 0
}; // could be used to track what color items user obtained


initializeCaseLoad(); // catch of an error might be good

async function initializeCaseLoad() {

  await fetchCaseData(); // add indicators while getting data

  cases.map(async (crate, index) => {
    let option = document.createElement('option');
    option.value = index;
    option.textContent = crate.name;

    caseSelect.appendChild(option);
  });

  setSelectedCase(cases[caseSelect.value]);

  caseOpenWindow.disabled = true;


  const caseItemsList = selectedCase.contains;



  // console.log(caseItemsList);


  for (let i = 0; i < 10; i++) {
    let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

    let newItem = document.createElement('div');
    newItem.classList.add('item');

    let img = document.createElement('img');

    img.src = randomItem.image;


    img.classList.add('image');
    // newItem.textContent = randomItem.name;

    const rarityColor = getRarityColor(randomItem);

    newItem.style.backgroundImage = 'linear-gradient(white 40%, '
            + rarityColor + ')';
    let rarityBox = document.createElement('div');
    rarityBox.classList.add('item-rarity-box');
    rarityBox.style.backgroundColor = rarityColor;
    newItem.appendChild(img);
    newItem.appendChild(rarityBox);
    itemHolder.appendChild(newItem);

    itemHolder.appendChild(newItem);

  }


  button.addEventListener('click', () => openCase());
  button.addEventListener('click', () => instantiateMoneyAmount('red'));

  newButton = button.cloneNode(true);

  newButton.style.width = '50%';
  newButton.textContent = `Open another (-${keyPrice}€)`;
  newButton.style.width = '50%';
  newButton.style.borderRadius = '10px';


  newButton.addEventListener('click', () => openCase());
  newButton.addEventListener('click', () => instantiateMoneyAmount('red'));


  caseSelect.addEventListener('change', () => setSelectedCase(cases[caseSelect.value]));

}


async function openCase() {

  clearUpWindow();

  moneyStatus -= keyPrice;
  updateMoneyStatus();
  //clearUpWindow();
  console.log(cases[caseSelect.value]);
  let caseItemList = selectedCase.contains;
  let knives = selectedCase.contains_rare;

  // Adding a random knife from the case to the table

  let randomKnife = knives[getRandomInt(0, 8)];

  randomKnife.odds = 0.26;

  if (caseItemList.length < fixedItemCount)
    caseItemList.push(randomKnife);

  console.log(caseItemList);

  distribution = createDistribution(caseItemList, 100, selectedCase);

  let translateX = getRandomInt(-5000, -6000);

  caseOpenWindow.style.setProperty('--random-translateXb', `${translateX}px`);
  translateX -= 352; // roller is positioned 352px from the start
  const itemNumber = Math.floor((translateX / 152) * (-1));
  // console.log(itemNumber);
  button.classList.add('animated');
  button.classList.add('bounceOut');
  button.disabled = true;

  itemHolder.innerHTML = '';
  caseOpenWindow.classList.add('animated');
  caseOpenWindow.classList.add('flipInX');


  setTimeout(async () => {

    button.disabled = false;
    button.classList.remove('animated');
    button.classList.remove('bounceOut');

    caseOpenWindow.classList.remove('animated');
    caseOpenWindow.classList.remove('flipInX');

    let itemWon = rolledItems[itemNumber];

    let obtainedItem = document.createElement('div');
    obtainedItem.classList.add('obtainedItem');
    let img = document.createElement('img');

    if (itemWon.image)
      img.src = itemWon.image;
    else
      img.src = '../data/images/xray.png';

    img.classList.add('obtained-image');

    obtainedItem.appendChild(img);

    const rarityColor = getRarityColor(itemWon);

    let rarityBox = document.createElement('div');
    rarityBox.classList.add('obtained-item-rarity-box');
    rarityBox.style.backgroundColor = rarityColor;


    obtainedItem.classList.add('animated');
    obtainedItem.classList.add('fadeIn');

    let info = [];

    const textParts = itemWon.name.split(' ');
    // console.log(textParts);

    let price = '';
    let stattrack = '';

    // Call to backend
    await callApi(`data/price?&weapon=${itemWon.weapon}&skin=${itemWon.pattern}&wear=${itemWon.wears[0]}&itemID=${itemWon.id}`)
      .then((data) => {
          let skinPriceText = data.lowest_price;
          price = 'Market price: ' + skinPriceText;
          skinPriceText = skinPriceText.replace(',', '.');
          const worth = skinPriceText.slice(0, -1);
          console.log(moneyStatus);
          moneyStatus += parseFloat(worth);
          console.log(moneyStatus);

          instantiateMoneyAmount('green');
      })
      .catch((error) => {
        console.log(error);
        price = 'Market price not available';
      });


    let float = 'Float: ' + getRandomFloat(itemWon.min_float, itemWon.max_float);


    itemRarityCounts[itemWon.rarity]++;

    console.log(itemRarityCounts);

    info.push(price);
    info.push(float);

    let obtainedText = document.createElement('div');
    obtainedText.style.margin = '1rem';

    info.forEach((element) => {
      let par = document.createElement('p');
      par.textContent = element;
      par.style.color = 'white';
      obtainedText.appendChild(par);
    });

    //itemWon.style.setProperty('border', '3px solid yellow');
    obtainedItem.appendChild(obtainedText);

    obtainedItem.appendChild(newButton);

    caseOpenWindow.appendChild(obtainedItem);

    setTimeout(() => {obtainedItem.style.borderRadius = getBorderRadius()}, 500)
    

    updateMoneyStatus();

  }, 6000);



  for (let i = 0; i < rollItemCount; i++) {

    let randomItem = randomGenItem(caseItemList, distribution);
    rolledItems.push(randomItem);
    let newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.classList.add('animatedItem');
    newItem.classList.add('moveLeft');
    let img = document.createElement('img');

    if (randomItem.image) {
      // exceedingly_rare_item.png
      if (randomItem.category === 'Knives' || randomItem.category === 'Gloves')
        img.src = '../data/images/exceedingly_rare_item.png';
      else
        img.src = randomItem.image;
    }
    else
      img.src = '../data/images/xray.png';

    img.classList.add('image');
    // newItem.textContent = randomItem.name;

    const rarityColor = getRarityColor(randomItem);

    newItem.style.backgroundImage = 'linear-gradient(white 40%, '
            + rarityColor + ')';
    let rarityBox = document.createElement('div');
    rarityBox.classList.add('item-rarity-box');
    rarityBox.style.backgroundColor = rarityColor;

    newItem.appendChild(img);
    newItem.appendChild(rarityBox);
    itemHolder.appendChild(newItem);

  }

}

function updateMoneyStatus() {
  statusText.textContent = 'State: ' + moneyStatus.toFixed(2) + '€';
}


function clearUpWindow() {
  caseOpenWindow.lastChild.remove();
  rolledItems = [];
}




/////////////////////////////////
// function for updating the money text with any color
/////////////////////////////////

function instantiateMoneyAmount(color) {

  statusText.style.color = color;
  statusText.classList.add('highlight-amount');
  setTimeout(() => {
    statusText.style.color = 'black';
    statusText.classList.remove('highlight-amount');
  }, 1000);
}



function setSelectedCase(crate) {
  selectedCase = crate;
  fixedItemCount = crate.contains.length + 1;
  console.log('Items: ' + selectedCase.contains.length);
  if (!selectedCase.caseRarityCounts) {
    selectedCase.caseRarityCounts = getRarityOdds(selectedCase);
  }

  let caseImage = document.createElement('img');

  caseImage.src = selectedCase.image;
  if (caseImageSection.hasChildNodes()) {
    caseImageSection.removeChild(caseImageSection.lastChild);
    caseImageSection.appendChild(caseImage);
  }

}

/////////////////////////////////
// Functions for fetching data from server
/////////////////////////////////

async function callApi(urlPostfix) {

  let baseUrl = 'http:localhost:8080';

// if(process.env.NODE_ENV === 'production') {
//     baseUrl = window.location.href;
//     baseUrl = baseUrl.slice(0, -1);
// }

  let url = baseUrl + '/' + urlPostfix;

  console.log(url);
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
      // Return an error value or handle the error as needed
      return null; // You can choose an appropriate error value here
    });
}

async function fetchCaseData() {
  await callApi('data/cases')
    .then((data) => {
      cases = data;
      console.log(cases);
    })
    .catch((error) => {
      console.log(error);
    });
}


//////////////////
// Styling functions
//////////////////

function getBorderRadius() {
  
  const borderRadiusInstructions = [
    '10px 20px 30px 40px',
    '25% 10%',
    '10% 30% 50% 70%',
    '10% / 50%',
    '10px 100px / 120px',
    '50% 20% / 10% 40%'
  ]

  return borderRadiusInstructions[getRandomInt(0, borderRadiusInstructions.length-1)];

}


