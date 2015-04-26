(function (blocksta) {

  function main(blocksta){
    this.blocksta = blocksta;
    this.children = [];

    this.generateElement();
  }

  function generateElement(){
    var context = this;

    context.element = document.createElement('div');
    context.element.className = 'column';
    context.blocksta.container.appendChild(context.element);



    //context.element.setAttribute('ondragover', 'return false');

    context.element.addEventListener('dragover', function (e) {
      e.preventDefault();

      var block = context.blocksta.draggedBlock.block;
      var mp = context.blocksta.draggedBlock.mousePosition;

      var targetX = 0;
      var targetY = 0;

      var x = e.clientX - mp.x;
      var y = e.clientY - mp.y;

      for(var i = 0; i < context.getBoundX(); i++){

        var boundMin = i * context.blocksta.baseBlockWidth;
        var boundMax = boundMin + context.blocksta.baseBlockWidth;

        if(x >= boundMin && x < boundMax){
          targetX = i;
          break;
        }
      }

      for(var i = 0; i < context.blocksta.rows; i++){

        boundMin = i * context.blocksta.baseBlockHeight;
        boundMax = boundMin + context.blocksta.baseBlockHeight;

        if(y > boundMin && y < boundMax){
          targetY = i;
          break;
        }
      }

      if(block.x != targetX || block.y != targetY){
        context.drop(block, targetX, targetY);
        context.drawSelf();
      }



      //debugger;
    });

    context.element.addEventListener('drop', function (e) {
      var droppedBlock = context.blocksta.blocks[e.dataTransfer.getData('objectKey')];


      //get block init drop
    });
  }

  function draw(){
    var context = this;

    var blocks = this.children;

    for(var i = 0, block; block = blocks[i++];){
      block.draw();
    }

    context.element.style.width = context.calculateWidth() + 'px';
  }

  function drawSelf(){
    this.element.style.width = this.calculateWidth() + 'px';
  }

  function calculateWidth(){
    var maxX = 0;

    for(var i = 0, block; block = this.children[i++];){
      if(block.x + block.width > maxX){
        maxX = block.x + block.width;
      }
    }
    return this.blocksta.baseBlockWidth * maxX;

  }

  function getBoundX(){
    var self = this;

    var result = 0;

    for(var i = 0, block; block = self.children[i++];){
      if(block.x + block.width > result)
        result = block.x + block.width;
    }

    return result;
  }

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

  function sortByDistance(arr, target){
    var self = this;

    return arr.sort(function (a, b) {
      return self.getDistance(a, target) > self.getDistance(b, target) ? 1 : -1;
    });
  }

  function getDistance(point1, point2){
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  }

  function drop(block, x, y, maxCol){
    var self = this;

    block.x = x;
    block.y = y;

    block.draw();

    var blocks = self.children;

    for(var i = 0; i < blocks.length; i++){
      if(blocks[i] != block && block.checkCollision(blocks[i])){
        var emptySpaces = self.sortByDistance(self.getEmptySpaces(), blocks[i]);

        for(var z = 0, es; es = emptySpaces[z++];){

        }


        //maxCol = maxCol ? maxCol : this.getAffectedColMax(ref);

        //var targetY = blocks[i].y + blocks[i].height + 1  <= self.blocksta.rows ? block.y + block.height : 0;
        //var targetX = blocks[i].y + blocks[i].height + 1  <= self.blocksta.rows ? blocks[i].x : block.x + block.width;

        var targetY = emptySpaces[0].y;
        var targetX = emptySpaces[0].x;

        self.drop(blocks[i], targetX, targetY);

      }
    }
  }

  var Column = main;

  Column.prototype.draw = draw;
  Column.prototype.generateElement = generateElement;
  Column.prototype.calculateWidth = calculateWidth;
  Column.prototype.getBoundX = getBoundX;
  Column.prototype.drop = drop;
  Column.prototype.drawSelf = drawSelf;
  Column.prototype.getEmptySpaces = getEmptySpaces;
  Column.prototype.checkCollision = checkCollision;
  Column.prototype.sortByDistance = sortByDistance;
  Column.prototype.getDistance = getDistance;

  if(typeof window._blocksta == 'object'){
    window._blocksta.Column = Column;
  } else {
    window._blocksta = {
      Column: Column
    };
  }


})(window._blocksta);