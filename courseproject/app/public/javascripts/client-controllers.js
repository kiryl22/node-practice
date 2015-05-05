var clientControllers = angular.module('clientControllers', []);

clientControllers.controller('DashboardCtrl', ['$scope', '$http',
    function ($scope, $http) {

        $scope.projectsList = [];

        $scope.init = function (){
            $http.get('/ProjectsList').
                success(function(data, status, headers, config) {
                    $scope.projectsList = data;
                }).
                error(function(data, status, headers, config) {
                    //ToDo
                });
        }
    }]);

clientControllers.controller('ProjectCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {
        $scope.projectId = $routeParams.projectId;

        $scope.newProject= { name: "NewProject"}

        $scope.create = function(){
            $http.post('/CreateProject', $scope.newProject).
                success(function(data, status, headers, config) {
                    //ToDo
                }).
                error(function(data, status, headers, config) {
                    //ToDo
                });
        }

    }]);
