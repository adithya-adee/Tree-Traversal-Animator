class Node {
  constructor(value, id, x = 0, y = 0) {
    this.value = value;
    this.id = id;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
    this.color = 'red';
    this.x = x;
    this.y = y;
  }
}

export default Node;
