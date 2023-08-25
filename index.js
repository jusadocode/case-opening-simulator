
const button = document.querySelector('.open-button');

let itemHolder = document.querySelector('.item-holder');

const caseOpenWindow = document.querySelector('.case-open-window-holder');

const caseItemsList = ['ak', 'm4', 'pistol', 'knife'];

const rollItemCount = 200;


console.log(itemHolder);

for (let i = 0; i < rollItemCount; i++) {
    // randomization will be hugely reworked
    let randomItem = caseItemsList[getRandomInt(0, caseItemsList.length - 1)];

    let newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.textContent = randomItem;
    console.log(newItem.textContent);
    itemHolder.appendChild(newItem);

}


const items = document.querySelectorAll('.item');


button.addEventListener('click', (e) => {
    openCase();
    button.classList.add('animated');
    button.classList.add('bounceOut');
    button.disabled = true;
})




function openCase() {
    items.forEach(item => {
        item.classList.add('animatedItem');
        item.classList.add('moveLeft');
    });

    caseOpenWindow.classList.add('animated');
    caseOpenWindow.classList.add('flipInX');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}