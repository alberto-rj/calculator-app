class Toast {
  constructor (node) {
    this.node = node;
    this.closeBtn = this.node.querySelector('.toast__close');
    this.content = this.node.querySelector('.toast__content');
    Toast.addHandler(this);
  }

  open (msg) {
    this.content.textContent = msg;
    this.node.classList.remove('close');
    this.node.classList.add('active');
    this.node.classList.add('open');
    this.node.focus();
  }

  close () {
    this.node.classList.remove('open');
    this.node.classList.add('close');
  }

  animationHandler () {
    if (this.node.classList.contains('close')) {
      this.node.classList.remove('active');
      this.node.classList.remove('close');
      this.content.textContent = '';
    }
  }

  keydownHandler (event) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  closeHandler (event) {
    this.close();
  }

  static addHandler(toast) {
    toast.node.addEventListener('animationend', () => toast.animationHandler());
    toast.node.addEventListener('keydown', (event) => toast.keydownHandler(event));
    toast.closeBtn.addEventListener('click', () => toast.closeHandler());
  }
}