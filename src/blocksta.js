Blocksta = (function () {

  var Column = this.Blocksta.Column;
  var Block = this.Blocksta.Block;

  function main(selector, element, options) {
    var self = this;

    self.selector = selector;

    self.columns = [];

    self.wrapper = element;
    self.container = document.createElement('div');

    self.wrapper.appendChild(self.container);

    self.wrapper.className = 'blocksta';

    self.wrapper.addEventListener('drop', onDrop.bind(self));
    self.wrapper.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    self.containerWidth = self.container.offsetWidth;
    self.containerHeight = self.container.offsetHeight;

    self.rows = options.rows;
    self.baseBlockWidth = options.baseBlockWidth;
    self.baseBlockHeight = self.containerHeight / self.rows;

    self.drawCallback = options.draw;
    self.blocks = {};

    var columns = self.columns;

    for(var i = 0, col; col = options.data[i++];){
      self.setColumnChildren(col);
    }

    self.draw();
  }

  function setColumnChildren(col) {
    var self = this;

    var column = new Column(self);

    self.columns.push(column);

    for(var k = 0, data; data = col[k++];){
      new Block(
        data.x,
        data.y,
        data.width,
        data.height,
        column,
        self
      );
    }
  }

  function draw(){
    var self = this;
    var columns = self.columns;

    for(var i in columns){
      columns[i].draw();
    }
  }

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function removeColumn(target){
    var index = this.columns.indexOf(target);

    if(index > -1){
      this.columns.splice(index, 1);
    }
  }

  /**
   * Events
   * */

  function onDrop(e){
    //e.preventDefault();

    var column = new Column(this);
    var block = this.draggedBlock.block;

    this.columns.push(column);

    column.addBlock(block);
  }

  main.prototype.setColumnChildren = setColumnChildren;
  main.prototype.draw = draw;
  main.prototype.guid = guid;
  main.prototype.removeColumn = removeColumn;

  return function (selector, options) {

    var elements = document.querySelectorAll(selector);

    for(var i = 0, el; el = elements[i++];){
      new main(selector, el, options);
    }
  }

})();