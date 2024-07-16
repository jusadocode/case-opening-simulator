import { getRandomInt } from './mathUtils';

function getRarityOdds(crate) {
  const caseRarityCounts = {
    Consumer: 0,
    Industrial: 0,
    'Mil-Spec Grade': 0,
    Restricted: 0,
    Classified: 0,
    Covert: 0,
    Contraband: 0
  };
  
  // Count the rarities in the selected case
  crate.contains.forEach((item) => {
    caseRarityCounts[item.rarity]++;
  });
  
  // Return the count object
  return caseRarityCounts;
}

function getRarityColor(item) {

  if (item.category === 'Knives' || item.category === 'Gloves')
    return '#ffcc00';
  
  switch (item.rarity) {
  case ('Consumer'):
    return '#afafaf';
  case ('Industrial'):
    return '#6496e1';
  case ('Mil-Spec Grade'):
    return '#4b69cd';
  case ('Restricted'):
    return '#8847ff';
  case ('Classified'):
    return '#d32ce6';
  case ('Covert'):
    return '#eb4b4b';
  case ('Contraband'):
    return '#886a08';
  default:
    return '';
  }
}


function getRandomWear(item) {
  if(item.wears) {
    return item.wears[getRandomInt(0, item.wears.length-1)];
  }
  return '';
}

export {getRarityColor, getRarityOdds, getRandomWear};
  