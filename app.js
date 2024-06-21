const primaryKeyId = 'key-equal';

const deleteKeyId = 'key-delete';
const resetKeyId = 'key-reset';

const timesKeyId = 'key-times';
const plusKeyId = 'key-plus';
const minusKeyId = 'key-minus';
const divideKeyId = 'key-divide';
const dotKeyId = 'key-dot';

const allKeys = Array.from(document.querySelectorAll('.key'));
const screenContent = document.querySelector('.screen__content');

const toastNode =  document.querySelector('.toast');
const toast = new Toast(toastNode);

const expression = new Expression();


const defaultKeyHandler = (value) => {
  toast.close();
  expression.add(value);
  let format = expression.format();
  screenContent.innerHTML = format;
};

const deleteHandler = () => {
  toast.close();
  expression.remove();
  screenContent.innerHTML = expression.format();
};

const resetHandler = () => {
  toast.close();
  expression.reset();
  screenContent.innerHTML = expression.format();
};

const primaryHandler = () => {
  if (expression.isEmpty() || Expression.isNumber(expression.toString())) {
    return;
  } else if (!Expression.isValid(expression.toString())) {
    toast.open('Valid expression is required.');
    return;
  }
  toast.close();

  let newExpression = expression.clone();
  newExpression.prioritize();

  if (newExpression.impossible) {
    toast.open('Impossible divide by zero.');
    return;
  }
  toast.close();

  newExpression.copy(newExpression.clone());
  newExpression.sum();
  
  expression.copy(newExpression.clone());
  
  screenContent.innerHTML = expression.toString();
  screenContent.classList.add('show');
};

const animationScreenHandler = (event) => {
  screenContent.classList.remove('show');
};

const zoomInKey  = (id) => {
  let key = allKeys.find(key => key.id === id);
  let className = 'zoom';

  if (!key) return;

  key.classList.remove(className);
  key.classList.add(className);
  setTimeout(() => zoomOutKey(key), 125);
};

const zoomOutKey = (key) => {
  key.classList.remove('zoom');
};

const transitionKeyHandler = (event) => {
  zoomOutKey(event.target);
};

const keyFocusHandler = (event) => {
  event.target.blur();
};

const keydownHandler = (event) => {
  let key = event.key;
  
  if (event.ctrlKey && key === 'Backspace') {
    event.preventDefault();
    resetHandler();
    zoomInKey(resetKeyId);
  } else if (
    (event.shiftKey && key === '=') ||
    (key === 'Enter')) {
    event.preventDefault();
    primaryHandler();
    zoomInKey(primaryKeyId);
  } else if (key === 'Backspace'){
    event.preventDefault();
    deleteHandler();
    zoomInKey(deleteKeyId);
  } else if (
    key === '0' || key === '1' || key === '2' ||
    key === '3' || key === '4' || key === '5' || 
    key === '6' || key === '7' || key === '8' ||
    key === '9' || key === '+' || key === '-' ||
    key === '*' || key === '/' || key === '.'
  ) { 
    event.preventDefault();
    defaultKeyHandler(key);
  } if (key === '+') {
    zoomInKey(plusKeyId);
  } else if (key === '-') {
    zoomInKey(minusKeyId);
  } else if (key === '*') {
    zoomInKey(timesKeyId);
  } else if (key === '/') {
    zoomInKey(divideKeyId);
  } else if (key === '.') {
    zoomInKey(dotKeyId);
  } else {
    zoomInKey(`key-${key}`);
  }
};

allKeys.forEach(key => {
  if (key.classList.contains('key--primary')) {
    key.addEventListener('click', primaryHandler);
  } else if (key.id === 'key-delete') { 
    key.addEventListener('click', deleteHandler);
  } else if (key.id === 'key-reset') {
    key.addEventListener('click', resetHandler);
  } else {
    key.addEventListener('click', () => defaultKeyHandler(key.value));
  }
  key.addEventListener('click', keyFocusHandler);
  key.addEventListener('transitionend', transitionKeyHandler);
});


screenContent.addEventListener('animationend', animationScreenHandler);
window.addEventListener('keydown', keydownHandler);