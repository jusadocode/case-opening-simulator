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

export {createLoadingIndicator, showLoadingIndicatorInElement, hideLoadingIndicatorInElement};