class Expression  {
  // type
  static TYPE_OPERATOR = 'operator';
  static TYPE_NUMBER = 'number';
  
  // operator
  static OPERATOR_PLUS = '+';
  static OPERATOR_MINUS = '-';
  static OPERATOR_TIMES = '*';
  static OPERATOR_DIVIDE = '/';

  constructor () {
    this.map = new Map();
    this.index = -1;
    this.impossible = false;
  }
  
  static isOperator (value) {
    let regex = /^[\+\-\*\/]$/;
    return regex.test(value);
  };

  static isDot (value) {
    return value === '.';
  }

  static isDigit (value) {
    let regex = /^\d$/;
    return regex.test(value);
  }

  static isNumber (value) {
    let regex = /^[\+\-]*\d+(\.\d+)?$/;
    return regex.test(value);
  }

  static isValid (value) {
    let patterns = [
      /^[\+\-]?\d+(\.\d+)?[\+\-\*\/]\d+(\.\d+)?([\+\-\*\/]\d+(\.\d+)?)*$/
    ];
    return patterns.some(pattern => pattern.test(value));
  }

  static formatNumber(value) {
    let regex = /\.$/;
    let number;
    if (regex.test(value)) {
      value = value.substring(0, value.length - 1);
      number = new Number(value);
      return number.toLocaleString('en-US') + '.';
    }
    number = new Number(value);
    return number.toLocaleString('en-US');
  }
  
  isEmpty ()  {
    return this.map.size === 0;
  }

  reset () {
    this.map.clear();
    this.index = -1;
  }

  remove () {
    let last = this.map.get(this.index);
    if (!last) return;

    let length = last.value.length;
    if (last.type === Expression.TYPE_OPERATOR) {
      this.removeType();
    }else if (last.type === Expression.TYPE_NUMBER && length === 1) {
      this.removeType();
    } else {
      let newValue = last.value.substring(0, length - 1);
      last.value = newValue;
    }
  }
  
  add (value) {
    let last = this.map.get(this.index);
    if (!last) {
      if (Expression.isDigit(value)) {
        this.addNewType(Expression.TYPE_NUMBER, value);
      } else if (Expression.isDot(value)) { 
        this.addNewType(Expression.TYPE_NUMBER, '0.');
      }
    } else if (Expression.isOperator(value) && last.type === Expression.TYPE_OPERATOR) {
      last.value = value;
    } else if (Expression.isOperator(value)) {
      this.addNewType(Expression.TYPE_OPERATOR, value);
    } else if (Expression.isDigit(value) && last.type === Expression.TYPE_OPERATOR) {
      this.addNewType(Expression.TYPE_NUMBER, value);
    } else if (Expression.isDigit(value) || Expression.isDot(value)){
      last.value += value;
    }
  }

  addNewType (type, value) {
    let data = {type: type, value: value};
    this.index++;
    this.map.set(this.index, data);
  }

  removeType () {
    this.map.delete(this.index);
    this.index--;
    if (this.isEmpty()) {
      this.index = -1;
    }
  }

  format () {
    let values = Array.from(this.map.values());
    return values.map(data => {
      let value = data.value;
      if (value === '*') {
        return '&times;';
      } else if (value === '/') {
        return '&divide;';
      } else if (value === '+') {
        return '&plus;';
      } else if (value === '-') {
        return '&minus;';
      } else if (data.type === Expression.TYPE_NUMBER) {
        return Expression.formatNumber(value);
      } else {
        return value;
      }
    }).join('');
  }
  
  clone () {
    let newInstance = new Expression();
    newInstance.index = this.index;

    let values = this.map.values();
    values.forEach((data, i) => {
      newInstance.map.set(i, data);
    });

    return newInstance;
  }

  copy (other) {
    
    if (!other) {
      this.reset();
      return;
    }

    let newMap = new Map();
    let values = other.map.valueOf();
    values.forEach((value, i) => {
      newMap.set(i, value);
    });
    this.reset();
    
    this.map = newMap;
    this.index = newMap.size - 1;
  }

  prioritize () {
    // 5.2 * 3 - 8 / 2.21 + 1.5 * 4
    let size = this.map.size;
    let firstKey = 0;
    while (firstKey < size - 2) {
      
      let first = this.map.get(firstKey);

      let secondKey = firstKey + 1;
      let second = this.map.get(secondKey);
      
      let thirdKey = firstKey + 2;
      let third = this.map.get(thirdKey);

      if (
        first.type === Expression.TYPE_NUMBER && 
        second.value === Expression.OPERATOR_TIMES  &&
        third.type === Expression.TYPE_NUMBER
      ) {
        let a = new Number(first.value).valueOf();
        let b = new Number(third.value).valueOf();
        let c = a * b;
        third.value = c.toString();
        this.map.delete(firstKey);
        this.map.delete(secondKey);
        firstKey = thirdKey;
      } else if (
        first.type === Expression.TYPE_NUMBER &&
        second.value === Expression.OPERATOR_DIVIDE &&
        third.type === Expression.TYPE_NUMBER
      ) {
        let a = new Number(first.value).valueOf();
        let b = new Number(third.value).valueOf();
        this.impossible = b == 0;
        if (this.impossible) {
          return;
        }
        let c = a / b;
        third.value = c.toString();
        this.map.delete(firstKey);
        this.map.delete(secondKey);
        firstKey = thirdKey;
      } else {
        firstKey++;
      }
    }
  }
  
  sum () {
    let size = this.map.size;
    let firstKey = 0;
    while (firstKey < size - 2) {
      
      let first = this.map.get(firstKey);

      let secondKey = firstKey + 1;
      let second = this.map.get(secondKey);

      let thirdKey = firstKey + 2;
      let third = this.map.get(thirdKey);

      let a, b, c;

      if (
        first.type === Expression.TYPE_NUMBER &&
        second.value === Expression.OPERATOR_PLUS && 
        third.type === Expression.TYPE_NUMBER
      ) {
        a = new Number(first.value).valueOf();
        b = new Number(third.value).valueOf();
        c = a + b;
        third.value = c.toString();

        this.map.delete(firstKey);
        this.map.delete(secondKey);

        firstKey = thirdKey;
      } else if (
        first.type === Expression.TYPE_NUMBER && 
        second.value === Expression.OPERATOR_MINUS &&
        third.type === Expression.TYPE_NUMBER
      ) {
        a = new Number(first.value).valueOf();
        b = new Number(third.value).valueOf();
        c = a - b;
        third.value = c.toString();

        this.map.delete(firstKey);
        this.map.delete(secondKey);

        firstKey = thirdKey;
      } else {
        firstKey++;
      }
    }
  }

  toString() {
    let values = Array.from(this.map.values());
    return values.map((data) => {
      return data.value;
    }).join('');
  }
}