(function () {

  function main(x, y, w, h, column, blocksta){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.parent = column;
    this.blocksta = blocksta;

    this.objectKey = this.blocksta.guid();

    this.blocksta.blocks[this.objectKey] = this;

    this.parent.children.push(this);

    this.generateElement();
  }

  function draw() {
    var self = this;

    self.css({
      width: (self.blocksta.baseBlockWidth * self.width) + 'px',
      height: self.blocksta.baseBlockHeight + 'px',
      left: (self.x * self.blocksta.baseBlockWidth) + 'px',
      top : (self.y * self.blocksta.baseBlockHeight) + 'px',
      padding: '5px'
    });


    self.blocksta.drawCallback(self);
  }

  function generateElement() {
    var self = this;

    self.element = document.createElement('div');
    self.parent.element.appendChild(self.element);

    self.css({
      width: (self.blocksta.baseBlockWidth * self.width) + 'px',
      height: self.blocksta.baseBlockHeight + 'px',
      left: (self.x * self.blocksta.baseBlockWidth) + 'px',
      top : (self.y * self.blocksta.baseBlockHeight) + 'px',
      padding: '5px'
    });

    self.element.setAttribute('draggable', 'true');

    self.addClass('block');

    self.element.addEventListener('dragstart', onDragStart.bind(self));
  }

  function css(styleArray) {
    for(var k in styleArray){
      this.element.style[k] = styleArray[k];
    }
  }

  function addClass(className) {
    this.element.className += ' ' + className;
  }

  function drop(x , y, maxCol) {
    this.x = x;
    this.y = y;

    var matrix = this.blocksta.children;

    for(var i = 0; i < matrix.length; i++){
      if(matrix[i] != this){
        if(this.checkCollision(matrix[i])){
          maxCol = maxCol ? maxCol : this.getAffectedColMax(ref);

          var targetY = matrix[i].y + matrix[i].height + 1  <= ref.rows ?  this.y + this.height : 0;
          var targetX = matrix[i].y + matrix[i].height + 1  <= ref.rows ? matrix[i].x : this.x + this.width;

          matrix[i].drop(ref, targetX, targetY, maxCol);
        }
      }
    }

    ref.draw();
  }

  function getAffectedColMax() {
    var self = this;

    var result = 0;
    var children = self.parent.children;

    for(var i = 0; i < self.blocksta.rows; i++){

      for(var t = 0; t < children[i].length; t++){
        if(self.checkCollision(children[i])){
          result = children[i].y + children[i].width > result ? children[i].y + children[i].width : result;
        }
      }
    }
  }

  function checkCollision(target) {
    var result = false;

    var thisPoints = [];
    var targetPoints = [];

    for(var i = 0; i < this.width;i++){
      thisPoints.push([this.y, this.x + i])
    }

    for(var i = 0; i < this.height;i++){
      thisPoints.push([this.y + i, this.x])
    }

    for(var i = 0; i < target.width;i++){
      targetPoints.push([target.y, target.x + i])
    }

    for(var i = 0; i < this.height;i++){
      targetPoints.push([target.y + i, target.x])
    }

    for(var i = 0; i < thisPoints.length;i++){
      for(var t = 0; t < targetPoints.length;t++){
        if(thisPoints[i][0] == targetPoints[t][0] &&
          thisPoints[i][1] == targetPoints[t][1]){
          result = true;
        }
      }
    }
    return result;
  }

  /**
   * Events
   * */

  function onDragStart (e) {
    this.blocksta.draggedBlock = {
      block: this,
      mousePosition: {
        x: e.layerX,
        y: e.layerY
      }
    };
  }


  main.prototype.draw = draw;

  main.prototype.generateElement = generateElement;

  main.prototype.css = css;

  main.prototype.addClass = addClass;

  main.prototype.drop = drop;

  main.prototype.getAffectedColMax = getAffectedColMax;

  main.prototype.checkCollision = checkCollision;

  this.Blocksta = this.Blocksta ? this.Blocksta : {};

  this.Blocksta.Block = main;

})();