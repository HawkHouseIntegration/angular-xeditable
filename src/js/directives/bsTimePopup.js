/*
 Angular-ui bootstrap editable timepicker
 http://angular-ui.github.io/bootstrap/#/timepicker
 */
angular.module('xeditable').directive('editableBstimePopup', ['editableDirectiveFactory',
    function(editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableBstimePopup',
            inputTpl: '<editable-bstime-popup-internal></editable-bstime-popup-internal>',
            render: function() {
                this.parent.render.call(this);

                this.inputEl.attr('e-show-meridian', this.attrs.eShowMeridian);
                this.inputEl.attr('e-datetime-format', this.attrs.eDatetimeFormat);
            }
        });
    }]);

angular.module('xeditable').directive('editableBstimePopupInternal', ['$compile', '$document', '$uibPosition', function($compile, $document, $position){
    function link($scope, $element, attr){
        $scope.isOpen = false;
        $scope.popupPosition = {};
        $scope.valid = true;


        $scope.showMeridian = attr.eShowMeridian && attr.eShowMeridian.toLowerCase() === 'true';
        var format = attr.timeFormat || 'HH:mm';

        $scope.openTimepicker = openTimepicker;

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
            $scope.timeModel = $filter('date')(newValue, format) || '';
            $scope.valid = true;
        });

        function onChange(){
            if($scope.timeModel === ''){
                $scope.$data = null;
                $scope.valid = true;
            } else {
                var newDate = uibDateParser.parse($scope.timeModel, format);
                var currentDate = Object.prototype.toString.call($scope.$data) === "[object Date]" ? $scope.$data : new Date($scope.$data);

                if(newDate && newDate.getTime() !== currentDate.getTime()){
                    $scope.$data = newDate;
                }
                $scope.valid = newDate && newDate.getTime() ? true : false;
            }
        }

        function openTimepicker() {
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

            var popupEl = angular.element('<div bs-core-time-popup></div>');

            popupEl.attr({
                'popup-position': 'popupPosition',
                'is-open': 'isOpen',
                'time-model': '$data',
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
        "    <input type=\"text\" class=\"form-control\" ng-model=\"timeModel\" ng-change=\"\"/>\n" +
        "    <span class=\"input-group-btn\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\" ng-click='openTimepicker()'><i class=\"glyphicon glyphicon-time\"></i></button>\n" +
        "    </span>\n" +
        "</div>",
        link: link
    };
}]);

angular.module('xeditable').directive('bsCoreTimePopup', function(){
    return {
        restrict: 'A',
        template: "<div class=\"bs-core-datetimepicker-popup\" ng-show=\"isOpen\" ng-style=\"{top: popupPosition.top+'px', left: popupPosition.left+'px'}\">\n" +
        "    <div uib-timepicker ng-model=\"timeModel\" hour-step=\"1\" minute-step=\"1\" show-meridian=\"showMeridian\" style=\"margin: 0 auto\"></div>\n" +
        "</div>",
        scope: {
            'isOpen': '=',
            'popupPosition': '=',
            'timeModel': '=',
            'showMeridian': '='
        }
    };
});