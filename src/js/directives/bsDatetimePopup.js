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

                var _this = this;

                _this.inputEl.attr('e-mode', _this.attrs.eMode);
                _this.inputEl.attr('e-datetime-format', _this.attrs.eDatetimeFormat);
                _this.inputEl.attr('e-starting-day', _this.attrs.eStartingDay);
                _this.inputEl.attr('e-show-meridian', _this.attrs.eShowMeridian);

                _this.attrs.$observe('eLang', function(newValue){
                    _this.inputEl.attr('e-mode', _this.attrs.eMode);
                    _this.inputEl.attr('e-datetime-format', _this.attrs.eDatetimeFormat);
                    _this.inputEl.attr('e-starting-day', _this.attrs.eStartingDay);
                    _this.inputEl.attr('e-show-meridian', _this.attrs.eShowMeridian);
                    _this.inputEl.attr('e-lang', _this.attrs.eLang);
                });
            }
        });
    }]);

angular.module('xeditable').directive('editableBsdatetimePopupInternal', ['$compile', '$document', '$uibPosition', '$filter', 'uibDateParser', function($compile, $document, $position, $filter, uibDateParser){
    function link($scope, $element, attrs){
        $scope.isOpen = false;
        $scope.popupPosition = {};
        $scope.valid = true;

        $scope.mode = attrs.eMode;
        $scope.format = attrs.eDatetimeFormat;

        $scope.dateOptions = {
            startingDay: parseStartingDay(attrs.eStartingDay)
        };

        $scope.showMeridian = attrs.eShowMeridian && attrs.eShowMeridian.toLowerCase() === 'true';

        $scope.openPicker = openPicker;
        $scope.onChange = onChange;

        if(!$scope.$popup) {
            $scope.$popup = createPopup();
        }

        $scope.$watch(function(){
            return attrs.$$element[0].getAttribute('e-lang');
        }, function (newValue) {
            var elem = attrs.$$element[0];

            var startingDay = elem.getAttribute('e-starting-day');
            var showMeridian = elem.getAttribute('e-show-meridian');
            var dateTimeFormat = elem.getAttribute('e-datetime-format');

            $scope.dateOptions.startingDay = parseStartingDay(startingDay);
            $scope.showMeridian = showMeridian && showMeridian.toLowerCase() === 'true';
            $scope.format = dateTimeFormat;
            initDateTimeModel($scope.$data);

            if($scope.$popup){
                $scope.$popup.remove();
                $scope.$popup = createPopup();
            }
        });

        $scope.$on('$destroy', function () {
            $document.off('mousedown', outClickHandler);

            if ($scope.$popup) {
                $scope.$popup.remove();
            }
        });

        $scope.$watch('$data', initDateTimeModel);

        function initDateTimeModel(newValue){
            if (!newValue || Object.prototype.toString.call(newValue) === "[object Date]" && isNaN( newValue.getTime() ) ) {
                $scope.dateTimeModel = '';
            } else {
                var newDateTimeModel = $filter('date')(newValue, $scope.format);
                if(newDateTimeModel !== $scope.dateTimeModel){
                    $scope.dateTimeModel = newDateTimeModel;
                }
            }
            $scope.valid = true;
        }

        function onChange(){
            if($scope.dateTimeModel === ''){
                $scope.$data = null;
                $scope.valid = true;
            } else {
                var newDate = uibDateParser.parse($scope.dateTimeModel, $scope.format);
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

        function parseStartingDay(startingDay) {
            if(!startingDay) {
                return 1;
            }

            var res = parseInt(startingDay, 10);
            return isNaN(res) ? 1 : res;
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