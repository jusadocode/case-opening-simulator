
const button = document.querySelector('.open-button');

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

const caseItemsList = [
    { name: 'ak', color: 'lightblue' },
    { name: 'm4', color: 'orange' },
    { name: 'pistol', color: 'brown' },
    { name: 'knife', color: 'yellow' }];

const rollItemCount = 360;


console.log(itemHolder);

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
        // randomization will be hugely reworked
        let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.classList.add('animatedItem');
        newItem.classList.add('moveLeft');
        newItem.textContent = randomItem.name;
        newItem.style.backgroundImage = 'linear-gradient(white, '
            + randomItem.color + ')';
        let rarityBox = document.createElement('div');
        rarityBox.classList.add('item-rarity-box');
        rarityBox.style.backgroundColor = randomItem.color;
        newItem.appendChild(rarityBox);
        console.log(newItem.textContent);
        itemHolder.appendChild(newItem);

    }


}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}