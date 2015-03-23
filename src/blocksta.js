(function () {
var glob = {};

  function blocksta(selector, options){
    glob = new main(selector, options);
  }

  function main(selector, options){
    var self = this;

    self.selector = selector;

    self.matrix = [];

    self.container = document.getElementById(selector);

    self.containerWidth = self.container.offsetWidth;
    self.containerHeight = self.container.offsetHeight;

    self.rows = options.rows;
    self.baseBlockWidth = options.baseBlockWidth;
    self.baseBlockHeight = self.containerHeight / self.rows;

    var matrix = self.matrix;

    for(var i = 0, item; item = options.data[i++];){
      matrix.push(new Block(item.x, item.y, item.width, item.height, item.draw));
    }

    self.draw();
  }

  main.prototype.draw = function(){
    var self = this;
    var matrix = self.matrix;

    for(var i = 0, item; item = matrix[i++];){
      if(!item.element){
        item.element = document.createElement('div');
        self.container.appendChild(item.element);

        item.element.style.width = (self.baseBlockWidth * item.width) + 'px';
        item.element.style.height = self.baseBlockHeight + 'px';
        item.element.style.position = 'absolute';
        item.element.style.left = (item.x * self.baseBlockWidth) + 'px';
        item.element.style.top = (item.y * self.baseBlockHeight) + 'px';
        item.element.style.padding = '5px';

        item.draw(item.element);

      }
    }
  }

  function Block(x, y, w, h, drawCallback){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.draw = drawCallback;
  }

  window.blocksta = blocksta;
})();