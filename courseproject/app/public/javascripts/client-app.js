var app = angular.module('app', [
    'ngRoute',
    'projectService',
    'ticketService',
    'userService',
    'projectController',
    'projectBoardController',
    'ticketController',
    'dashboardController'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/templates/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    projectList: function (ProjectService) {
                        return ProjectService.getAll();
                    }
                }
            }).
            when('/about', {
                templateUrl: '/templates/about.html'
            }).
            when('/project/:projectId?', {
                templateUrl: '/templates/project.html',
                controller: 'ProjectCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        if($route.current.params.projectId)
                        return ProjectService.get($route.current.params.projectId);
                        return { statuses: [], priorities: []}
                    }
                }
            }).
            when('/project/:projectId/board', {
                templateUrl: '/templates/project-board.html',
                controller: 'ProjectBoardCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        return ProjectService.get($route.current.params.projectId);
                    }
                }
            }).
            when('/ticket/:projectId/:ticketId?', {
                templateUrl: 'templates/ticket.html',
                controller: 'TicketCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        return ProjectService.get($route.current.params.projectId);
                    },
                    ticket: function (TicketService, $route) {
                        if($route.current.params.ticketId)
                        return TicketService.get($route.current.params.ticketId);
                        return {};
                    },
                    users: function (UserService, $route) {
                        return UserService.get({});
                    }
                }
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.controller('NavbarController', function ($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
})

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

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});


