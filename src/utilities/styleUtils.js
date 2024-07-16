import { getRandomInt } from './mathUtils';

function createLoadingIndicator() {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'lds-ellipsis';
  loadingIndicator.innerHTML = '<div></div><div></div><div></div><div></div>';
  return loadingIndicator;
}
  
// Utility function to hide the loading indicator and show the original content
function showLoadingIndicatorInElement(element) {
  const loadingIndicator = createLoadingIndicator();
  loadingIndicator.id = 'loadingIndicator';
  element.innerHTML = '';
  element.appendChild(loadingIndicator);
}
  
// Utility function to hide the loading indicator
function hideLoadingIndicatorInElement(element, originalContent) {
  element.innerHTML = originalContent;
}

function getBorderRadius() {
  
  const borderRadiusInstructions = [
    '10px 20px 30px 40px',
    '25% 10%',
    '10% 20% 40% 20%;',
    '10% / 50%',
    '10px 100px / 120px',
    '50% 20% / 10% 40%'
  ];

  return borderRadiusInstructions[getRandomInt(0, borderRadiusInstructions.length-1)];

}

export {createLoadingIndicator, showLoadingIndicatorInElement, hideLoadingIndicatorInElement, getBorderRadius};