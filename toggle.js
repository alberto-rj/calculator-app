class Toggle {

  constructor (node, callback) {
    this.node = node;
    this.label = node.querySelector('.toggle__label');
    this.items = node.querySelectorAll('.toggle__items [class^="toggle__item-"]');
    this.slide = node.querySelector('.toggle__slide');
    this.callback = callback;
    Toggle.addEventHandler(this);
  }

  focus () {
    this.slide.focus();
  }

  setValue (newValue) {
    let oldValue = this.slide.dataset.value;
    let oldClassName = `toggle__slide--${oldValue}`;
    this.slide.classList.remove(oldClassName);

    let newClassName = `toggle__slide--${newValue}`;
    this.slide.dataset.value = newValue;
    this.slide.classList.add(newClassName);

    this.callback(this);
  }

  next () {
    let newValue = Number.parseInt(this.slide.dataset.value);
    if (newValue === this.items.length) {
      return;
    } else {
      newValue++;
    }
    this.setValue(newValue);
  }

  previous () {
    let newValue = Number.parseInt(this.slide.dataset.value);
    if (newValue === 1) {
      return;
    } else { 
      newValue--;
    }
    this.setValue(newValue);
  }

  keydownHandler (event) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.previous();
        break;
    }
  }

  itemHandler (event) {
    let newValue = event.target.dataset.value;
    this.setValue(newValue);
    this.focus();
  }

  getDelimiters () {
    let itemWidth = this.slide.clientWidth / this.items.length;
    let position = 0;
    let delimiters = [];

    this.items.forEach(item => {
        let newPosition = position + itemWidth;
        let delimiter = {start: position, end: newPosition, value: item.dataset.value};
        position = newPosition; 
        delimiters.push(delimiter);
      }
    );
    return delimiters;
  }

  slideHandler (event) {
    let offsetX = event.offsetX;
    let delimiters = this.getDelimiters();
    delimiters.forEach(delimiter => {
      if (offsetX >= delimiter.start && offsetX <= delimiter.end) {
        this.setValue(delimiter.value);
      }
    });
  }

  static addEventHandler (instance) {
    instance.items.forEach(item => item.addEventListener('click', event => instance.itemHandler(event)));
    instance.label.addEventListener('click', event => instance.focus(event));
    instance.slide.addEventListener('click', event => instance.slideHandler(event));
    instance.node.addEventListener('keydown', event => instance.keydownHandler(event));
  }
}