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
            }
        });
    }]);

angular.module('xeditable').directive('editableBstimePopupInternal', ['$compile', '$document', '$uibPosition', function($compile, $document, $position){
    function link($scope, $element, attr){
        $scope.isOpen = false;
        $scope.popupPosition = {};

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
            var timeMoment = moment(newValue);
            $scope.timeModel = timeMoment.isValid() ? timeMoment.format('HH:mm') : '';
        });

        function openTimepicker() {
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

            var popupEl = angular.element('<div bs-core-time-popup></div>');

            popupEl.attr({
                'popup-position': 'popupPosition',
                'is-open': 'isOpen',
                'time-model': 'timeModel',
                'on-change': 'openTimepicker()'
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
        "    <input type=\"text\" class=\"form-control\" disabled ng-model=\"timeModel\"/>\n" +
        "    <span class=\"input-group-btn\">\n" +
        "        <button type=\"button\" class=\"btn btn-default\" ng-click='openTimepicker()'><i class=\"glyphicon glyphicon-time\"></i></button>\n" +
        "    </span>\n" +
        "</div>\n" +
        "",
        link: link
    };
}]);

angular.module('xeditable').directive('bsCoreTimePopup', function(){
    return {
        restrict: 'A',
        template: "<div class=\"bs-core-timepicker-popup\" ng-show=\"isOpen\" ng-style=\"{top: popupPosition.top+'px', left: popupPosition.left+'px'}\">\n" +
        "    <uib-timepicker ng-model=\"$data\" hour-step=\"1\" minute-step=\"1\" show-meridian=\"false\" style=\"margin: 0 auto\"></uib-timepicker>\n" +
        "</div>\n" +
        "",
        replace: true,
        transclude: true
    };
});