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

        $scope.project= {}

        $scope.save = function(){
            $http.post('/CreateProject', $scope.project).
                success(function(data, status, headers, config) {
                    //ToDo
                }).
                error(function(data, status, headers, config) {
                    //ToDo
                });
        }

        $scope.init = function(projectId){
            $http.get('/GetProject',{
                params: {
                    projectId: projectId
                }
            }).
                success(function(data, status, headers, config) {
                    if(data) {
                        $scope.project = data;
                    }
                }).
                error(function(data, status, headers, config) {
                    //ToDo
                });
        }

        $scope.init($routeParams.projectId);

    }]);
