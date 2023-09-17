/////////////////////////////////
// Dont use the word case in code
/////////////////////////////////

const baseUrl = "http:localhost:8080";
const button = document.querySelector('.open-button');
let statusText = document.querySelector('#status');

let moneyStatus = 0.00;
const keyPrice = 2.34;

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

const caseSelect = document.querySelector('select');

const itemMarker = document.querySelector('.case-open-marker');

let cases = [];
const rollItemCount = 150;
let rolledItems = [];
let distribution = [];

initializeCaseLoad();


async function initializeCaseLoad() {

    await fetchCaseData();

    cases.map(async (crate, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = crate.name;

        caseSelect.appendChild(option);
    });

    caseOpenWindow.disabled = true;

    const caseItemsList = cases[0].contains;



    // console.log(caseItemsList);


    for (let i = 0; i < 10; i++) {
        // randomization will be hugely reworked
        let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

        let newItem = document.createElement('div');
        newItem.classList.add('item');

        let img = document.createElement('img');

        img.src = randomItem.image;


        img.classList.add('image');
        // newItem.textContent = randomItem.name;

        const rarityColor = getRarityColor(randomItem.rarity);

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

}


async function openCase() {

    clearUpWindow();

    moneyStatus -= keyPrice;
    updateMoneyStatus();
    //clearUpWindow();
    console.log(cases[caseSelect.value]);
    let caseItemList = [];
    caseItemList = cases[caseSelect.value].contains;
    let knives = cases[caseSelect.value].contains_rare;

    // Adding a random knife from the case to the table

    let randomKnife = knives[getRandomInt(0, 8)];

    if (caseItemList.length < 18)
        caseItemList.push(randomKnife);

    console.log(caseItemList);

    distribution = createDistribution(caseItemList, 100);

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

        var rect = itemMarker.getBoundingClientRect();

        let elements = document.elementsFromPoint(rect.x, rect.y);
        // elements.map(element => console.log(element, window.getComputedStyle(element).getPropertyValue('z-index')));
        let itemWon = rolledItems[itemNumber];


        let obtainedItem = document.createElement('div');
        obtainedItem.classList.add('obtainedItem');
        let img = document.createElement('img');

        if (itemWon.image)
            img.src = itemWon.image;
        else
            img.src = 'xray.png';

        img.classList.add('obtained-image');

        obtainedItem.appendChild(img);

        const rarityColor = getRarityColor(itemWon.rarity);

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
                if (data) {
                    skinPriceText = data.lowest_price;
                    price = 'Market price: ' + skinPriceText;
                    skinPriceText = skinPriceText.replace(',', '.');
                    const worth = skinPriceText.slice(0, -1);
                    console.log(moneyStatus);
                    moneyStatus += parseFloat(worth);
                    console.log(moneyStatus);
                } else {
                    price = 'Market price not available';
                }
            })
            .catch((error) => {
                console.log(error);
            })


        let float = 'Float: ' + itemWon.max_float;

        let par = document.createElement('p');
        par.textContent = name;
        obtainedItem.prepend(name);

        info.push(price);
        info.push(float);

        let obtainedText = document.createElement('div');



        info.forEach((element) => {
            let par = document.createElement('p');
            par.textContent = element;
            obtainedText.appendChild(par);
        })

        //itemWon.style.setProperty('border', '3px solid yellow');
        obtainedItem.appendChild(obtainedText);

        let newButton = button.cloneNode(true);

        newButton.style.border = 'none';
        newButton.style.width = '50%';
        newButton.textContent = `Open another (-${keyPrice}€)`
        newButton.style.width = '50%';
        newButton.style.borderRadius = '10px';

        newButton.addEventListener('click', () => openCase());
        obtainedItem.appendChild(newButton);

        caseOpenWindow.appendChild(obtainedItem);

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

        if (randomItem.image)
            img.src = randomItem.image;
        else
            img.src = 'xray.png';

        img.classList.add('image');
        // newItem.textContent = randomItem.name;

        const rarityColor = getRarityColor(randomItem.rarity);

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

function getRarityColor(rarity) {
    switch (rarity) {
        case ("Consumer"):
            return "#afafaf";
        case ("Industrial"):
            return "#6496e1";
        case ("Mil-Spec Grade"):
            return "#4b69cd";
        case ("Restricted"):
            return "#8847ff";
        case ("Classified"):
            return "#d32ce6";
        case ("Covert"):
            return "#eb4b4b";
        case ("Contraband"):
            return "#886a08";
        default:
            return ''
    }
}

function getRarityOdds(item) {
    switch (item.rarity) {
        case ("Consumer"):
            return 7;
        case ("Industrial"):
            return 7;
        case ("Mil-Spec Grade"):
            return 7;
        case ("Restricted"):
            return 5;
        case ("Classified"):
            return 3;
        case ("Covert"):
            return 2;
        case ("Contraband"):
            return 7;
        default:
            return 1;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGenItem(array, distribution) {
    const index = randomIndex(distribution);
    return array[index];
};

function createDistribution(items, size) {
    const distribution = [];
    const weights = items.map(item => (item.odds / getRarityOdds(item)) / 100);
    console.log(weights);

    const sum = weights.reduce((accum, currVal) => accum + currVal);
    console.log(sum);
    const quant = size / sum;
    for (let i = 0; i < weights.length; ++i) {
        const limit = quant * weights[i];
        for (let j = 0; j < limit; ++j) {
            distribution.push(i);
        }
    }
    return distribution;
};

function randomIndex(distribution) {
    const index = Math.floor(distribution.length * Math.random());  // random index
    return distribution[index];
};

async function callApi(urlPostfix) {
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
    await callApi(`data/cases`)
        .then((data) => {
            console.log(data);
            cases = data;
            console.log(cases);
        })
        .catch((error) => {
            console.log(error);
        })
}


