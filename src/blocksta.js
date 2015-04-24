(function () {
  var Column = window._blocksta.Column;
  var Block = window._blocksta.Block;

  var blocksta = function (selector, options){
    return new main(selector, options);
  }

  /*
  * main
  * */

  var main = function (selector, options) {
    var self = this;

    self.selector = selector;

    self.columns = [];

    self.wrapper = document.getElementById(selector);
    self.container = document.createElement('div');

    self.wrapper.appendChild(self.container);

    self.wrapper.className = 'blocksta';

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
  };

  main.prototype.setColumnChildren = function (col) {
    var context = this;

    var column = new Column(context);

    context.columns.push(column);

    for(var k = 0, data; data = col[k++];){
        new Block(
          data.x,
          data.y,
          data.width,
          data.height,
          column,
          context
        );
    }
  };

  main.prototype.draw = function(){
    var self = this;
    var columns = self.columns;

    for(var i in columns){
      columns[i].draw();
    }
  };

  main.prototype.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  window.blocksta = blocksta;


  /*
  * Block
  * */


//aeryzus
  /*
  if(typeof window.blocksta == 'object'){

  } else {
    window.blocksta = blocksta;
  }
  */

})();