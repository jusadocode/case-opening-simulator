/////////////////////////////////
// Dont use the word case in the code
/////////////////////////////////

import { getRandomInt, getRandomFloat, randomGenItem, createDistribution } from './utilities/mathUtils';
import { getRarityOdds, getRarityColor, getRandomWear } from './utilities/crateUtils';
import reportButton from './report-section'; // need to load report section, otherwise add in webpack entries
import './index.css';
import './loadingIndicator.css';
import { fetchCaseData, callApi } from './services/services';
import { getBorderRadius } from './utilities/styleUtils';

let statusText = document.querySelector('#status');
let moneyStatus = 4.35;
const keyPrice = 2.34;

let itemHolder = document.querySelector('.item-holder');
const caseOpenWindowHolder = document.querySelector('.case-open-window-holder');
let caseImageSection = document.querySelector('.case-image-section');

const caseLoadingIndicator = document.querySelector('#caseLoadingIndicator');
const interactionContainer = document.querySelector('.interaction-container');

let containerSelect = document.querySelector('#case');

const containerTypeSelect = document.querySelector('#container-type');

const button = document.querySelector('.open-button');
let reopenButton;
let backButton;

let containers = [];
let selectedCase = {};
let fixedItemCount = 18;

const rollItemCount = 150;
let rolledItems = [];
let distribution = [];

const itemRarityCounts = {
  'Consumer Grade': 0,
  'Industrial Grade': 0,
  'Mil-Spec Grade': 0,
  Restricted: 0,
  Classified: 0,
  Covert: 0,
  Contraband: 0,
  'High Grade': 0,
  Remarkable: 0,
  Exotic: 0,
  Extraordinary: 0
};


initializeContainerLoad();

async function initializeContainerLoad(containerType = 'cases') {
  try {
    
    switch(containerType) {
      case 'cases':
        containers = await callApi('data/cases');
        break;
      case 'capsules':
        containers = await callApi('data/capsules');
        break;
      case 'souvenirs':
        containers = await callApi('data/souvenirs');
        break;
      case 'autograph_capsules':
        containers = await callApi('data/autograph_capsules');
        break;
      case 'graffitis':
        containers = await callApi('data/graffitis');
        break;
      case 'pins':
        containers = await callApi('data/pins');
        break;
      default:
        containers = [];
        break;
    }

    containerSelect.innerHTML = '';

    containers.map((container, index) => {
      let option = document.createElement('option');
      option.value = index;
      option.textContent = container.price ? `${container.name} (${container.price}$)` : container.name;
      containerSelect.appendChild(option);
    });

    setSelectedContainer(containers[containerSelect.value]);
    caseOpenWindowHolder.disabled = true;

    displayInitialItems();
    initializeEventListeners();
  } catch (error) {
    console.error('Error loading containers:', error);
    interactionContainer.innerHTML = 'There was a problem loading containers, refresh the page or try again later.';
  } finally {
    caseLoadingIndicator.style.display = 'none';
    interactionContainer.style.display = 'flex';
  }
}

function handleOpenButtonClick() {
  openCase();
  instantiateMoneyAmount('red');
}

function handleBackButtonClick() {
  const lastChild = caseOpenWindowHolder.lastChild;
  if (lastChild && lastChild.classList.contains('obtainedItem')) {
    caseOpenWindowHolder.removeChild(lastChild);
  }
}

function initializeEventListeners() {
  button.addEventListener('click', handleOpenButtonClick);

  reopenButton = button.cloneNode(true);

  reopenButton.textContent = `Open another (-${keyPrice}$)`;
  reopenButton.style.color = 'white';

  reopenButton.addEventListener('click', handleOpenButtonClick);

  backButton = button.cloneNode(true);

  backButton.textContent = 'Back';
  backButton.style.color = 'white';

  backButton.addEventListener('click', handleBackButtonClick);

  containerSelect.addEventListener('change', () => setSelectedContainer(containers[containerSelect.value]));

  containerTypeSelect.addEventListener('change', () => {
    const selectedType = containerTypeSelect.value;
    initializeContainerLoad(selectedType); // Load containers based on selected type
  });

}



function displayInitialItems() {

  const caseItemsList = [...selectedCase.contains];

  for (let i = 0; i < 10; i++) {
    let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

    let newItem = createItemElement(randomItem);
    
    itemHolder.appendChild(newItem);

  }

}

function createItemElement(item) {
  const newItem = document.createElement('div');
  newItem.classList.add('item');

  const img = document.createElement('img');
  if (item.image) {
    if(item.category) {
      if (item.category.name === 'Knives' || item.category.name === 'Gloves')
        img.classList.add('exceedinglyRare');
        // webpack fix
    }

    img.src = item.image;
  }
  else
    img.src = './assets/images/xray.png';

  img.classList.add('image');

  const rarityColor = getRarityColor(item);

  newItem.style.backgroundImage = `linear-gradient(white 40%, ${rarityColor})`;

  const rarityBox = document.createElement('div');
  rarityBox.classList.add('item-rarity-box');
  rarityBox.style.backgroundColor = rarityColor;

  newItem.appendChild(img);
  newItem.appendChild(rarityBox);

  return newItem;
}

function initiateRollingProcess() {
  return new Promise((resolve) => {
    let translateX = getRandomInt(-5000, -6000);
    caseOpenWindowHolder.style.setProperty('--random-translateXb', `${translateX}px`);
    translateX -= caseOpenWindowHolder.offsetWidth / 2; // position of marker
    const itemNumber = Math.floor((translateX / 150) * -1);

    button.classList.add('animated', 'bounceOut');
    button.disabled = true;

    caseOpenWindowHolder.classList.add('animated', 'flipInX');

    setTimeout(() => {
      button.disabled = false;
      button.classList.remove('animated', 'bounceOut');
      caseOpenWindowHolder.classList.remove('animated', 'flipInX');
      resolve(itemNumber);
    }, 6000);
  });
  
}

async function determineItemWon(items) {
  for (let i = 0; i < rollItemCount; i++) {
    const randomItem = randomGenItem(items, distribution);
    rolledItems.push(randomItem);
    const newItem = createItemElement(randomItem);
    newItem.classList.add('animatedItem', 'moveLeft');
    itemHolder.appendChild(newItem);
  }

  const itemNumber = await initiateRollingProcess();

  return rolledItems[itemNumber];
}

async function getItemInfo(itemWon, itemWear) {
  let price;
  try {
    const category = itemWon.category ? itemWon.category.name : '';
    const data = await callApi(`data/price?&caseType=${selectedCase.type}&item=${itemWon.name}&&wear=${itemWear || ''}&itemID=${itemWon.id}&category=${category}`);
    price = data.lowest_price;
    const worth = parseFloat(price.slice(1));
    moneyStatus += worth;
    instantiateMoneyAmount('green');
    updateMoneyStatus();
  } catch (error) {
    console.error('Error fetching item price:', error);
    price = 'Market price not available';
  }
  let itemInfo = { name: itemWon.name, wear: itemWear, rarity: itemWon.rarity.name, price};

  const minFloat = itemWon.min_float; 
  const maxFloat = itemWon.max_float; 
  
  const float = (minFloat !== undefined && maxFloat !== undefined) 
      ? getRandomFloat(minFloat, maxFloat) 
      : undefined; 

  itemRarityCounts[itemWon.rarity]++;

  if (float)
    itemInfo.float = float;
  

  return itemInfo;
}


async function displayWonItem(itemWon) {
  const obtainedItem = document.createElement('div');
  obtainedItem.classList.add('obtainedItem');

  const img = document.createElement('img');
  img.src = itemWon.image || './assets/images/xray.png';
  img.classList.add('obtained-image');
  obtainedItem.appendChild(img);

  const rarityColor = getRarityColor(itemWon);
  const rarityBox = document.createElement('div');
  rarityBox.classList.add('obtained-item-rarity-box');
  rarityBox.style.backgroundColor = rarityColor;

  obtainedItem.classList.add('animated', 'fadeIn');

  const itemWear = getRandomWear(itemWon);
  const itemInfo = await getItemInfo(itemWon, itemWear);

  const obtainedText = document.createElement('div');
  obtainedText.classList.add('obtainedItemInfo');
  for (const [key, value] of Object.entries(itemInfo)) {
    const par = document.createElement('p');
    par.textContent = `${key.toUpperCase()}: ${value}`;
    if (key === 'rarity') par.style.textShadow = `4px 2px 4px ${rarityColor}`;
    obtainedText.appendChild(par);
  }

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('bottomSection');
  bottomSection.appendChild(obtainedText);

  const buttonSection = document.createElement('div');
  buttonSection.classList.add('buttonSection');
  buttonSection.appendChild(reopenButton);
  buttonSection.appendChild(backButton);

  bottomSection.appendChild(buttonSection);
  obtainedItem.appendChild(bottomSection);
  caseOpenWindowHolder.appendChild(obtainedItem);

  setTimeout(() => {
    obtainedItem.style.borderRadius = getBorderRadius();
    obtainedItem.style.borderColor = rarityColor;
  }, 500);
}

async function openCase() {
  try {
    clearUpWindow();

    let casePrice = 0;
    if(selectedCase.price) {
      casePrice = parseFloat(selectedCase.price);
    }
    
    moneyStatus -= keyPrice + casePrice;
    updateMoneyStatus();

    const caseItemList = [...selectedCase.contains];
    if(selectedCase.contains_rare.length > 0) {
      const knives = [...selectedCase.contains_rare];
      let randomKnife = {...knives[getRandomInt(0, 8)], odds: 0.26};
  
      if (caseItemList.length < fixedItemCount) 
        caseItemList.push(randomKnife);
    }
    

    distribution = createDistribution(caseItemList, 100, selectedCase);

    const itemWon = await determineItemWon(caseItemList);
    await displayWonItem(itemWon);
  } catch (error) {
    console.error('Error opening case:', error);
  }
}

function updateMoneyStatus() {
  statusText.textContent = 'State: ' + moneyStatus.toFixed(2) + '$';
}


function clearUpWindow() {
  itemHolder.innerHTML = '';
  const obtainedItem = document.querySelector('.obtainedItem');
  if (obtainedItem && obtainedItem.classList.contains('obtainedItem')) {
    caseOpenWindowHolder.removeChild(obtainedItem);
  }
  rolledItems = [];
}


function instantiateMoneyAmount(color) {

  statusText.style.color = color;
  statusText.classList.add('highlight-amount');
  setTimeout(() => {
    statusText.style.color = 'black';
    statusText.classList.remove('highlight-amount');
  }, 1000);
}


function setSelectedContainer(container) {
  selectedCase = {...container};
  fixedItemCount = container.contains.length + 1;
  if (!selectedCase.caseRarityCounts) {
    selectedCase.caseRarityCounts = getRarityOdds(selectedCase);
  }

  let caseImage = document.createElement('img');
  const caseImageSource = selectedCase.image;
  caseImage.src = caseImageSource;

  caseImageSection.innerHTML = '';
  caseImageSection.appendChild(caseImage);
}





