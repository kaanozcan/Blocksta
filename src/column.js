(function () {

  /**
   * Constructor
   * */
  function main(blocksta){
    this.blocksta = blocksta;
    this.children = [];

    this.generateElement();
  }

  /**
   * Crates a container element for column
   * */
  function generateElement(){
    var context = this;

    context.element = document.createElement('div');
    context.element.className = 'column';
    context.blocksta.container.appendChild(context.element);

    context.element.addEventListener('dragover', onDragOver.bind(context));

    context.element.addEventListener('drop', onDrop.bind(context));
  }

  /**
   * Draws columns children and itself
   * */
  function draw(){
    var context = this;

    var blocks = this.children;

    for(var i = 0, block; block = blocks[i++];){
      block.draw();
    }

    context.element.style.width = context.calculateWidth() + 'px';
  }

  /**
   * Sets column container to width of their total children
   * */
  function drawSelf(){
    this.element.style.width = this.calculateWidth() + 'px';
  }

  /**
   * Calculates width of column in pixel.
   * */
  function calculateWidth(){
    var maxX = 0;

    for(var i = 0, block; block = this.children[i++];){
      if(block.x + block.width > maxX){
        maxX = block.x + block.width;
      }
    }
    return this.blocksta.baseBlockWidth * maxX;

  }

  /**
   * Calculates width of column
   * */
  function getBoundX(){
    var self = this;

    var result = 0;

    for(var i = 0, block; block = self.children[i++];){
      if(block.x + block.width > result)
        result = block.x + block.width;
    }

    return result;
  }

  /**
   * Returns empty positions
   * */
  function getEmptySpaces(){
    var self = this;

    var result = [];

    for(var x = 0; x < self.getBoundX(); x++){
      for(var y = 0; y < self.blocksta.rows; y++){
        if(!self.checkCollision(x, y)){
          result.push({x:x,y:y});
        }
      }
    }

    return result;
  }

  /**
   * Checks for collision
   * */
  function checkCollision(x, y){
    var self = this;
    var result = false;


    for(var i = 0, block; block = self.children[i++];){
      if( x >= block.x &&
        x <= block.x + block.width - 1 &&
        y >= block.y &&
        y <= block.y + block.height - 1){
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Sorts an array of positions depending on their distance to a target position
   * */
  function sortByDistance(arr, target){
    var self = this;

    return arr.sort(function (a, b) {
      return self.getDistance(a, target) > self.getDistance(b, target) ? 1 : -1;
    });
  }

  /**
   * Gets the distance between two points
   * */
  function getDistance(point1, point2){
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  }

  /**
   * Drops the block on target position. Handles collisions.
   * */
  function drop(block, x, y){
    var self = this;

    block.x = x;
    block.y = y;

    block.draw();
    self.drawSelf();

    var blocks = self.children;

    for(var i = 0; i < blocks.length; i++){
      if(blocks[i] != block && block.checkCollision(blocks[i])){
        var emptySpaces = self.sortByDistance(self.getEmptySpaces(), blocks[i]);

        var targetY, targetX;

        if(emptySpaces[0]){
          targetY = emptySpaces[0].y;
          targetX = emptySpaces[0].x;
        } else {
          targetY = blocks[i].y + blocks[i].height + 1  <= self.blocksta.rows ? block.y + block.height : 0;
          targetX = blocks[i].y + blocks[i].height + 1  <= self.blocksta.rows ? blocks[i].x : block.x + block.width;
        }



        self.drop(blocks[i], targetX, targetY);

      }
    }
  }

  /**
   * Removes block from self.children
   * */
  function removeChild(block){
    var self = this;

    var index = self.children.indexOf(block);

    self.children.splice(index, 1);
  }

  /**
   * Removes block from one column adds to this.
   * */
  function addBlock(block){
    var self = this;
    var column = block.parent;
    column.removeChild(block);

    if(!block.parent.children.length){
      column.element.className += ' killed';

      setTimeout(function () {
        column.destroySelf();
      }, 300);
    }

    block.parent = self;
    self.children.push(block);
    self.element.appendChild(block.element);

    self.drop(block,0,0);
  }

  /**
   * Removes column
   * */
  function destroySelf(){
    this.element.remove();
    this.blocksta.removeColumn(this);
  }

  /**
   * Events
   * */
  function onDragOver(e) {
    e.preventDefault();

    var self = this;

    var block = self.blocksta.draggedBlock.block;

    if(block.parent == self){
      var offset = self.element.getBoundingClientRect();

      var mp = self.blocksta.draggedBlock.mousePosition;

      var targetX = 0;
      var targetY = 0;

      var x = e.clientX - offset.left - mp.x + self.blocksta.baseBlockWidth / 2;
      var y = e.clientY - offset.top - mp.y + self.blocksta.baseBlockHeight / 2;


      for(var i = 0; i < self.getBoundX(); i++){

        var boundMin = i * self.blocksta.baseBlockWidth;
        var boundMax = boundMin + self.blocksta.baseBlockWidth;

        if(x >= boundMin && x < boundMax){
          targetX = i;
          break;
        }
      }

      for(var i = 0; i < self.blocksta.rows; i++){

        boundMin = i * self.blocksta.baseBlockHeight;
        boundMax = boundMin + self.blocksta.baseBlockHeight;

        if(y > boundMin && y < boundMax){
          targetY = i;
          break;
        }
      }

      if( (block.x != targetX || block.y != targetY) && !isOutofBounds(block, targetX)){
        self.drop(block, targetX, targetY);
        self.drawSelf();
      }
    }

    function isOutofBounds(block, targetX){
      var result = false;

      var bound = self.getBoundX();

      if(block.width > 1 && targetX >= bound - 1){
        result = true;
      }

      return result;
    }
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    var self = this;

    var block = self.blocksta.draggedBlock.block;

    if(block.parent != self){
      self.addBlock(block);
    }

    return false;
  }

  main.prototype.draw = draw;
  main.prototype.generateElement = generateElement;
  main.prototype.calculateWidth = calculateWidth;
  main.prototype.getBoundX = getBoundX;
  main.prototype.drop = drop;
  main.prototype.drawSelf = drawSelf;
  main.prototype.getEmptySpaces = getEmptySpaces;
  main.prototype.checkCollision = checkCollision;
  main.prototype.sortByDistance = sortByDistance;
  main.prototype.getDistance = getDistance;
  main.prototype.removeChild = removeChild;
  main.prototype.addBlock = addBlock;
  main.prototype.destroySelf = destroySelf;

  this.Blocksta = this.Blocksta ? this.Blocksta : {};

  this.Blocksta.Column = main;
})();