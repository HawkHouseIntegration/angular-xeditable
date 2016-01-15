app.controller('BsdatetimeCtrl', function($scope) {
    $scope.user = {
        datetime: new Date(1984, 4, 15, 10, 0, 0)
    };

    $scope.opened = {};

    $scope.open = function($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened[elementOpened] = !$scope.opened[elementOpened];
    };
});