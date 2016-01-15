/*
 Angular-ui bootstrap editable datetimepicker
 http://angular-ui.github.io/bootstrap/#/timepicker
 http://angular-ui.github.io/bootstrap/#/datepicker
 */
angular.module('xeditable').directive('editableBsdatetimePopup', ['editableDirectiveFactory',
    function(editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableBsdatetimePopup',
            inputTpl: '<editable-bsdatetime-popup-internal></editable-bsdatetime-popup-internal>',
            render: function() {
                this.parent.render.call(this);

                this.inputEl.attr('e-mode', this.attrs.eMode);
                this.inputEl.attr('e-datetime-format', this.attrs.eDatetimeFormat);
            }
        });
    }]);

angular.module('xeditable').directive('editableBsdatetimePopupInternal', ['$compile', '$document', '$uibPosition', function($compile, $document, $position){
    function link($scope, $element, attr){
        $scope.isOpen = false;
        $scope.popupPosition = {};

        $scope.mode = attr.eMode;
        var format = attr.eDatetimeFormat;

        $scope.openPicker = openPicker;

        if(!$scope.$popup) {
            $scope.$popup = createPopup();
        }

        $scope.$on('$destroy', function () {
            $document.off('click', outClickHandler);

            if ($scope.$popup) {
                $scope.$popup.remove();
            }
        });

        $scope.$watch('$data', function(newValue){
            var datetimeMoment = moment(newValue);
            $scope.dateTimeModel = datetimeMoment.isValid() ? datetimeMoment.format(format) : '';
        });

        function openPicker() {
            $scope.isOpen = !$scope.isOpen;

            $document[$scope.isOpen ? 'on' : 'off']('click', outClickHandler);

            if($scope.isOpen) {
                var coord = $position.positionElements($element, $scope.$popup, 'bottom', true);

                $scope.popupPosition = $position.offset($element);

                var windowBottom = window.innerHeight + window.pageYOffset;
                var fieldOffset = angular.element($element[0].children[0]).prop('offsetHeight');
                var popupHeight = 345;

                if (windowBottom < $scope.popupPosition.top + fieldOffset + popupHeight) {
                    $scope.popupPosition.top = $scope.popupPosition.top - popupHeight;
                } else {
                    $scope.popupPosition.top = $scope.popupPosition.top + fieldOffset;
                }
            }
        }

        function outClickHandler(e) {
            if (!$scope.isOpen) {
                return;
            }

            if (!e || !e.target) {
                return;
            }

            var element;

            for (element = e.target; element; element = element.parentNode) {
                if (element == $element[0]) {
                    return;
                }
            }

            var popup = $scope.$popup[0];
            if (popup.contains !== undefined && popup.contains(e.target)) {
                return;
            }

            $scope.isOpen = false;
            $document.off('click', outClickHandler);
            return $scope.$digest();
        }

        function createPopup() {
            var $popup;

            var popupEl = angular.element('<div bs-core-datetime-popup></div>');

            popupEl.attr({
                'popup-position': 'popupPosition',
                'is-open': 'isOpen',
                'date-time-model': '$data',
                'on-change': 'openPicker()',
                'mode': 'mode'
            });
            $popup = $compile(popupEl)($scope);
            popupEl.remove();
            $document.find('body').append($popup);

            return $popup;
        }
    }
    return {
        restrict: 'E',
        template: "<div class=\"input-group\">\n" +
        "    <input type=\"text\" class=\"form-control\" disabled ng-model=\"dateTimeModel\"/>\n" +
        "    <span class=\"input-group-btn\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\" ng-click='openPicker()'><i class=\"glyphicon\" ng-class=\"{'glyphicon-time': mode === 'time', 'glyphicon-calendar': mode !== 'time'}\"></i></button>\n" +
        "    </span>\n" +
        "</div>\n" +
        "",
        link: link
    };
}]);

angular.module('xeditable').directive('bsCoreDatetimePopup', function(){
    return {
        restrict: 'A',
        template: "<div class=\"bs-core-datetimepicker-popup\" ng-show=\"isOpen\" ng-style=\"{top: popupPosition.top+'px', left: popupPosition.left+'px'}\">\n" +
        "    <div ng-if='mode !== date'>\n" +
        "        <uib-timepicker ng-model=\"$parent.dateTimeModel\" hour-step=\"1\" minute-step=\"1\" show-meridian=\"false\" style=\"margin: 0 auto\"></uib-timepicker>\n" +
        "    </div>\n" +
        "    <div ng-if='mode !== time'>\n" +
        "        <uib-datepicker ng-model=\"$parent.dateTimeModel\" style=\"margin: 0 auto\"></uib-datepicker>\n" +
        "    </div>\n" +
        "</div>\n" +
        "",
        scope: {
            'isOpen': '=',
            'popupPosition': '=',
            'dateTimeModel': '=',
            'onChange': '&',
            'mode': '@'
        },
        replace: true,
        transclude: true
    };
});