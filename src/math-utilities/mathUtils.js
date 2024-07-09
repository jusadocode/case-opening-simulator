function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(4);
}

function randomGenItem(array, distribution) {
  const index = randomIndex(distribution);
  return array[index];
}
  
function createDistribution(items, size, selectedCase) {
  const distribution = [];
  const weights = calculateItemWeights(items, selectedCase);
  
  const sum = weights.reduce((accum, currVal) => accum + currVal);
  const quant = size / sum;
  for (let i = 0; i < weights.length; ++i) {
    const limit = quant * weights[i];
    for (let j = 0; j < limit; ++j) {
      distribution.push(i);
    }
  }
  return distribution;
}

function calculateItemWeights(items, selectedCase) {
  const weights = items.map(
    item => (item.odds / (selectedCase.caseRarityCounts[item.rarity] || 1) / 100)
  );
  return weights;
}
  
function randomIndex(distribution) {
  const index = Math.floor(distribution.length * Math.random()); // random index
  return distribution[index];
}


export {getRandomInt, getRandomFloat, randomGenItem, createDistribution, randomIndex};
  