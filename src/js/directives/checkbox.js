//checkbox
angular.module('xeditable').directive('editableCheckbox', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'editableCheckbox',
      inputTpl: '<input type="checkbox">',
      render: function() {
        this.parent.render.call(this);
        if(this.attrs.eTitle) {
          this.inputEl.wrap('<label></label>');
          this.inputEl.parent().append(this.attrs.eTitle);
        }
      },
      autosubmit: function() {
        var self = this;
        self.inputEl.bind('change', function() {
          setTimeout(function() {
            self.scope.$apply(function() {
              self.scope.$form.$submit();
            });
          }, 500);
        });
      }
    });
}]);

angular.module('xeditable').directive('editableCheckboxCustom', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'editableCheckboxCustom',
      inputTpl: '<div class="checkbox"><label><input type="checkbox" ng-model="$data"><span ng-bind="$data"></span></label></div>',
      render: function() {
        this.parent.render.call(this);
      },
      autosubmit: function() {
        var self = this;
        self.inputEl.bind('change', function() {
          setTimeout(function() {
            self.scope.$apply(function() {
              self.scope.$form.$submit();
            });
          }, 500);
        });
      }
    });
  }]);
