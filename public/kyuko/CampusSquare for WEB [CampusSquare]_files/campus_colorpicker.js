(function($) {
      var defColors = ['ffffff','333333','666666','999999','cccccc','ffffff'];

      var defaults = {
            color:         '',
            colors:        defColors,
            columns:       10,
            width:         16,
            height:        16,
            margin:        0,
            borderColor:   '#666',
            selcectBorder: '#f00',
            areaColor:     '#FFF',
            areaPadding:   '0px',
            areaMargin:    '0px',
            areaBorder:    'none'
      };

  var methods = {
    init : function( config ) {
      options = $.extend(defaults, config || {});

      options.totalWidth = options.columns * (options.width + (2 * options.margin) + 2) + 2;
      if (options.margin == 0){
        options.totalWidth -= (options.columns + 1);
      }
      if ($.browser.msie) {
        options.totalWidth += 2;
      }

      options.rows = Math.ceil(options.colors.length / options.columns);
      options.totalHeight = options.rows * (options.height + (2 * options.margin) + 2) + 2;
      if (options.margin == 0){
        options.totalHeight -= (options.rows + 1);
      }

      $.campusColorPickerOptions = options;

      this.each(createColorPicker);

      return this;

      function createColorPicker(index) {
        var options = $.campusColorPickerOptions;
        
        var area = $("<div class='campusColorPickerArea' />");
        area.css('clear',   'both');
        area.css('width',   options.totalWidth + 'px');
        area.css('height',  options.totalHeight + 'px');
        area.css('background-color', options.areaColor);
        area.css('padding',  options.areaPadding);
        area.css('margin',  options.areaMargin);
        area.css('border',  options.areaBorder);

        var selectColor = $(this).val();
        if (options.color != ''){
            selectColor = options.color;
        }
        if (selectColor.indexOf('#') == 0){
          selectColor = selectColor.substring(1);
        }
        
        for (var i = 0; i < options.colors.length; i++) {
          var picker = $("<div class='campusColorPicker' id='" + options.colors[i] + "' title='#" + options.colors[i] + "'/>");
          if (options.colors[i] == selectColor){
              picker.css('border', '1px ' + options.selcectBorder + ' solid');
          
          } else {
              picker.css('border', '1px ' + options.borderColor + ' solid');
          }
          picker.css('position',        'relative');  // to 'z-index'
          picker.css('width',           options.width + 'px');
          picker.css('height',          options.height + 'px');
          picker.css('margin',          options.margin + 'px');
          if (options.margin == 0){
            picker.css('margin-left',     '-1px');
            picker.css('margin-top',      '-1px');
          }
          picker.css('cursor',          'pointer');
          picker.css('float',           'left');
          picker.css('background-color', '#'+options.colors[i]);
          area.append(picker);

          picker.bind('click', {
            input: $(this)
          }, function(event) {
            event.data.input.val('#' + this.id);
            event.data.input.trigger("change");
            $(this).siblings().css('border', '1px ' + options.borderColor + ' solid').css('z-index', '');
            $(this).css('border', '1px ' + options.selcectBorder + ' solid').css('z-index', '1');
          });
        }
        $(this).after(area);
      }
    },
    update : function( config ) {
      options = $.extend(defaults, config || {});
      var selectColor = this.val();
      if (selectColor.indexOf('#') == 0){
        selectColor = selectColor.substring(1);
      }
      if (selectColor.length != ''){
        this.parent().find(".campusColorPicker").css('border', '1px ' + options.borderColor + ' solid').css('z-index', '');
        this.parent().find(".campusColorPickerArea").find("#" + selectColor).css('border', '1px ' + options.selcectBorder + ' solid').css('z-index', '1');
      }
      return this;
    }
  };

  $.fn.campusColorPicker = function(method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.' + 'campusColorPicker' );
    }
  };
})(jQuery);
