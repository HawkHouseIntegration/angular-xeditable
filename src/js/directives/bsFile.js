/*angular.module('xeditable').directive('editableBsfile', ['editableDirectiveFactory',
    function(editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableBsfile',
            inputTpl: '<editable-bsfile-internal></editable-bsfile-internal>'
        });
    }]);

angular.module('xeditable').directive('editableBsfileInternal', function(){
    function link($scope, $element, attr){
        $scope.uploadFiles = function(file, invalidFiles){
            $scope.f = file;
            $scope.errFile = invalidFiles && invalidFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
                });
            }
        };

        $scope.$watch('data', function(newVal, oldVal){
            var x = 1;
        });
    }
    return {
        restrict: 'E',
        template: "<div>\n" +
            "<input type=\"file\" class=\"btn btn-default btn-sm\" file-model=\"data\"><i class=\"glyphicon glyphicon-file\"></i></input>\n" +
            "<span ng-bind=\"f.name\"></span>\n" +
        "</div>",
        link: link
    };
});

angular.module('xeditable').directive('fileModel', ['$parse', function($parse){
    return {
        restrict: 'A',
        link: function(scope, elem, attr){
            var model = $parse(attr.fileModel);

            elem.on('change', function(){
                scope.$apply(function(){
                    model.assign(scope, elem[0].files);
                });
            });

            scope.$on('$destroy', function(){
                elem.off('change');
            });
        }
    };
}]);*/