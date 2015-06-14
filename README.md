##Blocksta

Hello All,

This is a library of grid/widget system which supports drop and drag by HTML5 drag drop feature. Blocksta is still in design status and the implementation is not final. Also there are still features to implement which are listed below.

##ToDo

  Grunt concat/minify tasks

  Arrangeable columns

##How To

```html
  <script type="text/javascript" src="block.js"></script>
  <script type="text/javascript" src="column.js"></script>
  <script type="text/javascript" src="blocksta.js"></script>

  <script>
    (function (Blocksta) {
      var data = [
        [
          {
            x:0,
            y:0,
            width:2,
            height:1
          }, {
            x:0,
            y:1,
            width:1,
            height:1
          }, {
            x:1,
            y:1,
            width:1,
            height:1
          }, {
            x:0,
            y:2,
            width:2,
            height:1
          }
        ]
      ];

      var options = {
        data: data,
        rows:3,
        baseBlockWidth: 100,
        draw: draw
      };

      Blocksta('#myContainer', options);

    })(window.Blocksta);
  </script>
```