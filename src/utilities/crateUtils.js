import { getRandomInt } from './mathUtils';

function getRarityOdds(crate) {
  const rarityCounts = {
    Consumer: 0,
    Industrial: 0,
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

  crate.contains.forEach((item) => {
    const rarityName = item.rarity.name;

    if (rarityCounts.hasOwnProperty(rarityName)) {
      rarityCounts[rarityName]++;
    } else {
      console.warn(`Unknown rarity: ${rarityName}`);
    }
  });

  const filteredRarityCounts = Object.fromEntries(
    Object.entries(rarityCounts).filter(([rarity, count]) => count > 0)
  );

  return filteredRarityCounts;
}

function getRarityColor(item) {

  if(item.category) {
    if (item.category.name === 'Knives' || item.category.name === 'Gloves')
      return '#ffcc00'; 
  }
  
  switch (item.rarity.name) {
    case 'Consumer Grade':
      return '#afafaf';
    case 'Industrial Grade':
      return '#6496e1'; 
    case 'Mil-Spec Grade':
      return '#4b69cd'; 
    case 'Restricted':
      return '#8847ff'; 
    case 'Classified':
      return '#d32ce6'; 
    case 'Covert':
      return '#eb4b4b'; 
    case 'Contraband':
      return '#886a08'; 
    
    case 'High Grade':
      return '#4b69cd'; 
    case 'Remarkable':
      return '#8847ff'; 
    case 'Exotic':
      return '#d32ce6'; 
    case 'Extraordinary':
      return '#eb4b4b'; 

    default:
      return ''; 
  }
}



function getRandomWear(item) {
  if(item.wears) {
    return item.wears[getRandomInt(0, item.wears.length-1)].name;
  }
  return '';
}

export {getRarityColor, getRarityOdds, getRandomWear};
  