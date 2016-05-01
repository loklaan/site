const PRIVATE_STORE_KEY = Symbol('PRIVATE_STORE_KEY');

class Store {
  constructor() {
    this.clear();
  }

  set(key, value) {
    this[PRIVATE_STORE_KEY][key] = value;
  }

  get(key) {
    return this[PRIVATE_STORE_KEY][key];
  }

  clear() {
    this[PRIVATE_STORE_KEY] = {};
  }
}

export default Store;
