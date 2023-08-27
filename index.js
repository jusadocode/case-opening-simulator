
const button = document.querySelector('.open-button');

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

const caseItemsList = [
    { name: 'ak', color: 'lightblue', odds: 0.07375 },
    { name: 'm4', color: 'darkblue', odds: 0.075 },
    { name: 'pistol', color: 'green', odds: 0.35 },
    { name: 'knife', color: 'yellow', odds: 0.00125 },
    { name: 'ak2', color: 'lightblue', odds: 0.07375 },
    { name: 'm42', color: 'darkblue', odds: 0.075 },
    { name: 'pistol2', color: 'green', odds: 0.35 },]

const rollItemCount = 360;

const distribution = createDistribution(caseItemsList, 100);

// console.log(itemHolder);

for (let i = 0; i < 10; i++) {
    // randomization will be hugely reworked
    let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

    let newItem = document.createElement('div');
    newItem.classList.add('item');

    newItem.textContent = randomItem.name;

    itemHolder.appendChild(newItem);

}


const items = document.querySelectorAll('.item');


button.addEventListener('click', () => openCase());



function openCase() {

    caseOpenWindow.style.setProperty('--random-translateX', `${getRandomInt(-5000, -6000)}px`);

    button.classList.add('animated');
    button.classList.add('bounceOut');
    button.disabled = true;

    itemHolder.innerHTML = '';
    caseOpenWindow.classList.add('animated');
    caseOpenWindow.classList.add('flipInX');




    setTimeout(() => {
        button.disabled = false;
        button.classList.remove('animated');
        button.classList.remove('bounceOut');

        caseOpenWindow.classList.remove('animated');
        caseOpenWindow.classList.remove('flipInX');
    }, 6000);



    for (let i = 0; i < rollItemCount; i++) {

        let randomItem = randomGenItem(caseItemsList, distribution);
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.classList.add('animatedItem');
        newItem.classList.add('moveLeft');
        newItem.textContent = randomItem.name;
        newItem.style.backgroundImage = 'linear-gradient(white 40%, '
            + randomItem.color + ')';
        let rarityBox = document.createElement('div');
        rarityBox.classList.add('item-rarity-box');
        rarityBox.style.backgroundColor = randomItem.color;
        newItem.appendChild(rarityBox);
        itemHolder.appendChild(newItem);

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
    const weights = items.map(item => item.odds);
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

