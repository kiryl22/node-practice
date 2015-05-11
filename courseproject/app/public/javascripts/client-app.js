var app = angular.module('app', [
    'ngRoute',
    'clientControllers'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/templates/dashboard.html',
                controller: 'DashboardCtrl'
            }).
            when('/project/:projectId?', {
                templateUrl: '/templates/project.html',
                controller: 'ProjectCtrl'
            }).
            when('/project/:id/board', {
                templateUrl: '/templates/project-board.html',
                controller: 'ProjectBoardCtrl'
            }).
            when('/ticket/:projectId/:ticketId?', {
                templateUrl: 'templates/ticket',
                controller: 'TicketCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

    /*$locationProvider.html5Mode(true);*/
    }]);


app.factory('ProjectService', function($http) {
    return {
        getProjectsList: function(successCb, errorCb) {
            return $http.get('/ProjectsList')
                .then(function(result) {
                    return successCb(result.data);
                }, function(result) {
                    return errorCb(result)
                });
        },

        getProjectById: function(projectId, successCb, errorCb) {
            return $http.get('/GetProject', {
                    params: {
                        projectId: projectId
                    }
                }).then(function(result) {
                    return successCb(result.data);
                }, function(result) {
                    return errorCb(result)
                });
        },

        saveProject: function(project, successCb, errorCb) {
            return $http.post('/SaveProject', project)
                .then(function(result) {
                    return successCb(result.data);
                }, function(result) {
                    return errorCb(result)
                });
        }

    }
});

app.directive('editableRow', function($timeout) {
    return {
        restrict: 'EA',
        scope: {
            collection: '=',
            index: '='
        },
        templateUrl: '/templates/editableRow.html',
        replace: false,
        link: function($scope, elem, attr, ctrl) {
            $scope.tempVar = $scope.collection[$scope.index];
            $scope.isEdit = false;

            $scope.save = function() {
                $scope.isEdit = false;
                $scope.collection[$scope.index] = $scope.tempVar;
            }

            $scope.edit = function() {
                $scope.isEdit = true;
                $timeout(function() {
                    elem.find('input')[0].focus();
                });
            }

            $scope.delete = function() {
                $scope.collection.splice($scope.index, 1);
            }
        }
    };
});
