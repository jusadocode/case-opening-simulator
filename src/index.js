/////////////////////////////////
// Dont use the word case in the code
/////////////////////////////////

import { getRandomInt, getRandomFloat, randomGenItem, createDistribution } from './math-utilities/mathUtils';
import { getRarityOdds, getRarityColor, getRandomWear } from './crate-info-utilities/crateUtils';
import reportButton from './report-section'; // need to load report section, otherwise add in webpack entries
import { fetchCaseData, callApi } from './service-utilities/serviceUtils';
import { getBorderRadius } from './style-utilities/styleUtils';

let statusText = document.querySelector('#status');
let moneyStatus = 4.35;
const keyPrice = 2.34;

let itemHolder = document.querySelector('.item-holder');
const caseOpenWindowHolder = document.querySelector('.case-open-window-holder');
let caseImageSection = document.querySelector('.case-image-section');

const caseLoadingIndicator = document.querySelector('#caseLoadingIndicator');
const interactionContainer = document.querySelector('.interaction-container');

let caseSelect = document.querySelector('select');


const button = document.querySelector('.open-button');
let reopenButton;
let backButton;


let cases = [];
let selectedCase = {};
let fixedItemCount = 18;

const rollItemCount = 150;
let rolledItems = [];
let distribution = [];

let itemRarityCounts = {
  Consumer: 0,
  Industrial: 0,
  'Mil-Spec Grade': 0,
  Restricted: 0,
  Classified: 0,
  Covert: 0,
  Contraband: 0
}; 


initializeCaseLoad();

async function initializeCaseLoad() {
  try {
    cases = await fetchCaseData();

    cases.map(async (crate, index) => {
      let option = document.createElement('option');
      option.value = index;
      option.textContent = crate.price ? `${crate.name} (${crate.price}€)` : crate.name;
      caseSelect.appendChild(option);
    });

    setSelectedCase(cases[caseSelect.value]);

    caseOpenWindowHolder.disabled = true;

    
    displayInitialItems();
    initializeEventListeners();
  }
  catch {
    console.log('Error loading cases');
    interactionContainer.innerHTML = 'There was a problem getting cases, refresh the page or try again at a later time';
  }
  finally {
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
  console.log(lastChild);
  if (lastChild && lastChild.classList.contains('obtainedItem')) {
    caseOpenWindowHolder.removeChild(lastChild);
  }
}

function initializeEventListeners() {
  button.addEventListener('click', handleOpenButtonClick);

  reopenButton = button.cloneNode(true);

  reopenButton.textContent = `Open another (-${keyPrice}€)`;
  reopenButton.style.color = 'white';

  reopenButton.addEventListener('click', handleOpenButtonClick);

  backButton = button.cloneNode(true);

  backButton.textContent = 'Back';
  backButton.style.color = 'white';

  backButton.addEventListener('click', handleBackButtonClick);

  caseSelect.addEventListener('change', () => setSelectedCase(cases[caseSelect.value]));
}

function displayInitialItems() {

  const caseItemsList = [...selectedCase.contains];

  for (let i = 0; i < 10; i++) {
    let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

    let newItem = createItemElement(randomItem);
    
    itemHolder.appendChild(newItem);

  }

  console.log(itemHolder.childElementCount);
}

function createItemElement(item) {
  const newItem = document.createElement('div');
  newItem.classList.add('item');

  const img = document.createElement('img');
  if (item.image) {
    if (item.category === 'Knives' || item.category === 'Gloves')
      img.src = '../data/images/exceedingly_rare_item.png';
    else
      img.src = item.image;
  }
  else
    img.src = '../data/images/xray.png';

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
    console.log(caseOpenWindowHolder.offsetWidth);
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
  console.log(itemHolder.childElementCount);

  const itemNumber = await initiateRollingProcess();

  return rolledItems[itemNumber];
}

async function getItemInfo(itemWon, itemWear) {
  let price;
  try {
    const data = await callApi(`data/price?&weapon=${itemWon.weapon}&skin=${itemWon.pattern}&wear=${itemWear}&itemID=${itemWon.id}&category=${itemWon.category}`);
    price = data.lowest_price;
    const worth = parseFloat(price.replace(',', '.').slice(0, -1));
    moneyStatus += worth;
    instantiateMoneyAmount('green');
    updateMoneyStatus();
  } catch (error) {
    console.error('Error fetching item price:', error);
    price = 'Market price not available';
  }

  const float = getRandomFloat(itemWon.min_float, itemWon.max_float);
  itemRarityCounts[itemWon.rarity]++;
  return { name: itemWon.name, wear: itemWear, rarity: itemWon.rarity, price, float };
}


async function displayWonItem(itemWon) {
  const obtainedItem = document.createElement('div');
  obtainedItem.classList.add('obtainedItem');

  const img = document.createElement('img');
  img.src = itemWon.image || '../data/images/xray.png';
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
    const knives = [...selectedCase.contains_rare];
    const randomKnife = knives[getRandomInt(0, 8)];
    randomKnife.odds = 0.26;

    if (caseItemList.length < fixedItemCount) 
      caseItemList.push(randomKnife);

    distribution = createDistribution(caseItemList, 100, selectedCase);
    console.log(distribution.length);

    const itemWon = await determineItemWon(caseItemList);
    await displayWonItem(itemWon);
  } catch (error) {
    console.error('Error opening case:', error);
  }
}

function updateMoneyStatus() {
  statusText.textContent = 'State: ' + moneyStatus.toFixed(2) + '€';
}


function clearUpWindow() {
  itemHolder.innerHTML = '';
  const obtainedItem = document.querySelector('.obtainedItem');
  console.log(obtainedItem);
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


function setSelectedCase(crate) {
  selectedCase = crate;
  fixedItemCount = crate.contains.length + 1;
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





