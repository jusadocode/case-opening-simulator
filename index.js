
const baseUrl = "http:localhost:8080";
const button = document.querySelector('.open-button');

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

const caseSelect = document.querySelector('select');

const itemMarker = document.querySelector('.case-open-marker');

// const caseItemsList = [
//     {
//         name: 'awp', color: 'purple', odds: 0.07375,
//         img: 'https:\/\/community.akamai.steamstatic.com\/economy\/image\/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9SupUijOjAotyg3w2x_0ZkZ2rzd4OXdgRoYQuE8gDtyL_mg5K4tJ7XiSw0WqKv8kM\/62fx62f\''
//     },
//     { name: 'm4', color: 'darkblue', odds: 0.075 },
//     {
//         name: 'pistol', color: 'lightblue', odds: 0.35,
//         img: "https:\/\/community.akamai.steamstatic.com\/economy\/image\/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9SupUijOjAotyg3w2x_0ZkZ2rzd4OXdgRoYQuE8gDtyL_mg5K4tJ7XiSw0WqKv8kM\/62fx62f\''"
//     },
//     { name: 'knife', color: 'yellow', odds: 0.00125 },
//     { name: 'ak2', color: 'darkblue', odds: 0.07375 },
//     { name: 'm42', color: 'purple', odds: 0.075 },
//     { name: 'pistol2', color: 'lightblue', odds: 0.35 },]



let cases = [];

fetchCaseData();

console.log(cases)



cases.sort((caseA, caseB) => (caseA.first_sale_date < caseB.first_sale_date ? 1 : -1));

cases.map((caseItem, index) => {
    let option = document.createElement('option');
    option.value = index;
    option.textContent = caseItem.name;

    caseSelect.appendChild(option);
});

caseOpenWindow.disabled = true;

const caseItemsList = cases[0].contains;

const rollItemCount = 100;

let rolledItems = [];

const distribution = createDistribution(caseItemsList, 100);

console.log(caseItemsList);


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


const items = document.querySelectorAll('.item');


button.addEventListener('click', () => openCase());


async function openCase() {

    //clearUpWindow();
    console.log(caseSelect.value);
    const caseItemsList = cases[caseSelect.value].contains;
    let translateX = getRandomInt(-5000, -6000);

    caseOpenWindow.style.setProperty('--random-translateXb', `${translateX}px`);
    translateX -= 352; // roller is positioned 352px from the start
    const itemNumber = Math.floor((translateX / 152) * (-1));
    console.log(itemNumber);
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

        img.src = itemWon.image;
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
        console.log(textParts);

        let price = '';
        let stattrack = '';

        // Call to backend
        await callApi(`data/price?weapon=${itemWon.weapon}&skin=${itemWon.pattern}&wear=${itemWon.wears[0]}`)
            .then((data) => {
                if (data) {
                    price = 'Market price: ' + data.lowest_price;
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
        caseOpenWindow.appendChild(obtainedItem);

    }, 1);



    for (let i = 0; i < rollItemCount; i++) {

        let randomItem = randomGenItem(caseItemsList, distribution);
        rolledItems.push(randomItem);
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.classList.add('animatedItem');
        newItem.classList.add('moveLeft');
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

    }

}

function clearUpWindow() {
    if (caseOpenWindow.lastChild.classList[0] === 'obtainedItem animated fadeIn')
        caseOpenWindow.removeChild[caseOpenWindow.childElementCount];
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGenItem(array, distribution) {
    const index = randomIndex(distribution);
    return array[index];
};

function createDistribution(items, size) {
    const distribution = [];
    const weights = items.map(item => item.odds / 100);
    const sum = weights.reduce((a, b) => a + b);
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
    try {
        const data = await callApi(`data/cases`);
        if (data) {
            cases = data;
        }
    } catch (error) {
        console.log(error);
    }
}


