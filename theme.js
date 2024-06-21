const root = document.querySelector(':root');
const labels = document.querySelectorAll('span[data-mode]');
const toggleSlide = document.querySelector('.toggle__slide');
const toggleNode = document.querySelector('.toggle');
let toggle;

const setTheme = (mode) => {
  root.className = `theme-${mode}`;
  saveTheme(mode);
};

const saveTheme = (mode) => {
  localStorage.setItem('theme', mode);
};

const restoreTheme = () => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    toggle.setValue(theme);
  }
};

const labelHandler = event => {
  let value = event.target.dataset.value;
  setTheme(value);
};

const toggleSlideHandler = () => {
  let value = toggleSlide.dataset.value;
  setTheme(value);
};

toggle = new Toggle(toggleNode, toggleSlideHandler);
toggleSlide.addEventListener('change', toggleSlideHandler);

restoreTheme();