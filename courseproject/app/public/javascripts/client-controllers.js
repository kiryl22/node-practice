var clientControllers = angular.module('clientControllers', []);

clientControllers.controller('DashboardCtrl', ['$scope', '$http',
    function ($scope, $http) {

        $scope.projectsList = [{ id:1, name: "Project1"},
                                { id:2, name: "Project2"},
                                { id:3, name: "Project3"}];
    }]);

clientControllers.controller('ProjectCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams) {
        $scope.projectId = $routeParams.projectId;
    }]);
