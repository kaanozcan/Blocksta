(function (blocksta) {

  var Block = function (x, y, w, h, column, blocksta){
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
  };

  Block.prototype.draw = function () {
    var self = this;

      self.css({
        width: (self.blocksta.baseBlockWidth * self.width) + 'px',
        height: self.blocksta.baseBlockHeight + 'px',
        left: (self.x * self.blocksta.baseBlockWidth) + 'px',
        top : (self.y * self.blocksta.baseBlockHeight) + 'px',
        padding: '5px'
      });


    self.blocksta.drawCallback(self);
  };

  Block.prototype.generateElement = function () {
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

    self.element.addEventListener('dragstart', function (e) {
      //e.setDragImage(null, self.blocksta.baseBlockWidth, self.blocksta.baseBlockWidth);
      self.blocksta.draggedBlock = {
        block: self,
        mousePosition: {
          x: e.layerX,
          y: e.layerY
        }
      };
      /*
      self.blocksta.draggedBlock = {
        block: self,
        mousePosition: {
          x: (parseInt(style.getPropertyValue("left"),10) - event.clientX),
          y: (parseInt(style.getPropertyValue("top"),10) - event.clientX)
        }
      };
      */
    });
  };

  Block.prototype.css = function (styleArray) {
    for(var k in styleArray){
      this.element.style[k] = styleArray[k];
    }
  };

  Block.prototype.addClass = function (className) {
    this.element.className += ' ' + className;
  };

  Block.prototype.drop = function (x , y, maxCol) {
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
  };

  Block.prototype.getAffectedColMax = function (ref) {
    var result = 0;
    var matrix = ref.matrix;

    for(var i = 0; i < ref.rows; i++){
      var clone = new Block(this.x, this.y + i, this.width, this.height);

      for(var t = 0; t < matrix[i].length; t++){
        if(clone.checkCollision(matrix[i])){
          result = matrix[i].y + matrix[i].width > result ? matrix[i].y + matrix[i].width : result;
        }
      }
    }
  };

  Block.prototype.checkCollision = function (target) {
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
  };


  if(typeof window._blocksta == 'object'){
    window._blocksta.Block = Block;
  } else {
    window._blocksta = {
      Block: Block
    };
  }

})(window._blocksta);