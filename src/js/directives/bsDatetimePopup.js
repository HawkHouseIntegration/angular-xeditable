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
                this.inputEl.attr('e-starting-day', this.attrs.eStartingDay);
                this.inputEl.attr('e-show-meridian', this.attrs.eShowMeridian);
            }
        });
    }]);

angular.module('xeditable').directive('editableBsdatetimePopupInternal', ['$compile', '$document', '$uibPosition', '$filter', 'uibDateParser', function($compile, $document, $position, $filter, uibDateParser){
    function link($scope, $element, attr){
        $scope.isOpen = false;
        $scope.popupPosition = {};
        $scope.valid = true;

        $scope.mode = attr.eMode;
        var format = attr.eDatetimeFormat;

        $scope.dateOptions = {
            startingDay: attr.eStartingDay && parseInt(attr.eStartingDay, 10) || 1
        };

        $scope.showMeridian = attr.eShowMeridian && attr.eShowMeridian.toLowerCase() === 'true';

        $scope.openPicker = openPicker;
        $scope.onChange = onChange;

        if(!$scope.$popup) {
            $scope.$popup = createPopup();
        }

        $scope.$on('$destroy', function () {
            $document.off('mousedown', outClickHandler);

            if ($scope.$popup) {
                $scope.$popup.remove();
            }
        });

        $scope.$watch('$data', function(newValue){
            if (!newValue || Object.prototype.toString.call(newValue) === "[object Date]" && isNaN( newValue.getTime() ) ) {
                $scope.dateTimeModel = '';
            } else {
                var newDateTimeModel = $filter('date')(newValue, format);
                if(newDateTimeModel !== $scope.dateTimeModel){
                    $scope.dateTimeModel = newDateTimeModel;
                }
            }
            $scope.valid = true;
        });

        function onChange(){
            if($scope.dateTimeModel === ''){
                $scope.$data = null;
                $scope.valid = true;
            } else {
                var newDate = uibDateParser.parse($scope.dateTimeModel, format);
                var currentDate = Object.prototype.toString.call($scope.$data) === "[object Date]" ? $scope.$data : new Date($scope.$data);

                if(newDate && newDate.getTime() !== currentDate.getTime()){
                    $scope.$data = newDate;
                }
                $scope.valid = newDate && newDate.getTime() ? true : false;
            }
        }

        function openPicker() {
            $scope.isOpen = !$scope.isOpen;

            $document[$scope.isOpen ? 'on' : 'off']('mousedown', outClickHandler);

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
            $document.off('mousedown', outClickHandler);
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
                'mode': 'mode',
                'date-options': 'dateOptions',
                'show-meridian': 'showMeridian'
            });
            $popup = $compile(popupEl)($scope);
            popupEl.remove();
            $document.find('body').append($popup);

            return $popup;
        }
    }
    return {
        restrict: 'E',
        template: "<div class=\"input-group\" ng-class=\"{'has-error': !valid}\">\n" +
        "    <input type=\"text\" class=\"form-control\" ng-model=\"dateTimeModel\" ng-change=\"onChange()\"/>\n" +
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
        "    <div ng-if=\"mode !== 'date'\">\n" +
        "        <div uib-timepicker ng-model=\"$parent.dateTimeModel\" hour-step=\"1\" minute-step=\"1\" show-meridian=\"$parent.showMeridian\"></div>\n" +
        "    </div>\n" +
        "    <div ng-if=\"mode !== 'time'\">\n" +
        "        <div uib-datepicker ng-model=\"$parent.dateTimeModel\" datepicker-options=\"$parent.dateOptions\" ng-change=\"onChange()\"></div>\n" +
        "    </div>\n" +
        "</div>",
        scope: {
            'isOpen': '=',
            'popupPosition': '=',
            'dateTimeModel': '=',
            'onChange': '&',
            'mode': '=',
            'dateOptions': '=',
            'showMeridian': '='
        }
    };
});