(function ($) {
    var _width = 0;
    var _height = 0;
    var _aspectRatio = 0;
    var _wUnit = 0;
    var _hUnit = 0;
    var _blockList = [];
    var _self = null;
    var _settings = null;

    $.fn.blocksta = function (options) {
        _self = $(this);

        _settings = $.extend({
            cols: 6,
            rows: 4
        }, options);

        _width = _self.width();
        _height = _self.height();
        _aspectRatio = _width / _height;
        _wUnit = _width / _settings.cols;
        _hUnit = _height / _settings.rows;
        _blockList = _self.find('.block');

        $(_blockList).each(function (i, e) {
            var elemnentWidth = parseInt($(e).attr('data-width')) * _wUnit;
            var elemnentHeight = parseInt($(e).attr('data-height')) * _hUnit;
            var elementLeft = parseInt($(e).attr('data-x')) * _wUnit;
            var elementTop = parseInt($(e).attr('data-y')) * _hUnit;
            $(e).css({
                'width': elemnentWidth + 'px',
                'height': elemnentHeight + 'px',
                'left': elementLeft + 'px',
                'top': elementTop + 'px'
            });
        });
    };

    $(window).resize(function () {
        _width = _self.width();
        _height = _width / _aspectRatio;
        _wUnit = _width / _settings.cols;
        _hUnit = _height / _settings.rows;
        _self.css({
            'height': _height + 'px'
        });
        $(_blockList).each(function (i, e) {
            var elemnentWidth = parseInt($(e).attr('data-width')) * _wUnit;
            var elemnentHeight = parseInt($(e).attr('data-height')) * _hUnit;
            var elementLeft = parseInt($(e).attr('data-x')) * _wUnit;
            var elementTop = parseInt($(e).attr('data-y')) * _hUnit;
            $(e).css({
                'width': elemnentWidth + 'px',
                'height': elemnentHeight + 'px',
                'left': elementLeft + 'px',
                'top': elementTop + 'px'
            });
            if (_settings.resizeCallback){
                _settings.resizeCallback($(e).children());
            }
        });
    });

})(jQuery);