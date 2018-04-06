angular.module('xeditable').directive('editableMoney', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'editableMoney',
      inputTpl: '' +
        '<div class="editable-money">'+
            '<input type="text" class="form-control editable-money__masked-field"' +
                '/>' +
        '</div>',
      render: function() {
        var self = this;
        this.parent.render.call(this);

        this.mask = new IMask(this.inputEl.querySelectorAll('.editable-money__masked-field')[0], {
            mask: Number,  // enable number mask

            // other options are optional with defaults below
            scale: 2,  // digits after point, 0 for integers
            signed: false,  // disallow negative
            thousandsSeparator: ' ',  // any single char
            padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
            normalizeZeros: true,  // appends or removes zeros at ends
            radix: ',',  // fractional delimiter
            mapToRadix: ['.'],  // symbols to process as radix
            // additional number interval options (e.g.),
            min: - (Math.pow(2, 53) - 1),
            max: Math.pow(2, 53) - 1
        });

        this.mask.unmaskedValue = this.scope.$data || '';
        this.scope.mask = this.mask;

        this.mask.on("accept", function() {
            self.scope.$data = self.mask.unmaskedValue;
        });

        this.onhide = function() {
            self.mask.destroy();
            self.mask = null;
        };
      }
    });
  }]);