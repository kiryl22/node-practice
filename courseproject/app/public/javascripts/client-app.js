var app = angular.module('app', [
    'ngRoute',
    'clientControllers'
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

app.factory('ProjectService', function($http, $q) {
    var serviceUrl = "/api/projects";
    return {
        getAll: function() {
            return $http.get(serviceUrl + '/').then(function(result) {
                alertify.success("Project list loaded");
                return result.data;
            }, function(result) {
                alertify.error("Error has occurred while retrieving projects list");
                return result;
            });;
        },

        get: function(projectId) {
            return $http.get(serviceUrl +'/get', {
                params: {
                    projectId: projectId
                }
            }).then(function(result) {
                return result.data;
            }, function(result) {
                alertify.error("Error has occurred while retrieving project data");
                return result;
            });
        },

        save: function(project) {
            return $http.post(serviceUrl +'/save', project)
                .catch(function(err) {
                    console.log(err);
                    return $q.reject(err);
                });
        }
    }
});

app.factory('TicketService', function($http, $q) {
    var serviceUrl = "/api/tickets";
    return {
        get: function(ticketId) {
            return $http.get(serviceUrl + '/get', {
                params: {
                    ticketId: ticketId
                }
            }).then(function(result) {
                return result.data;
            }, function(err) {
                return $q.reject(err);
            });
        },

        getByProjId: function(projectId) {
            return $http.get(serviceUrl + '/', {
                params: {
                    projectId: projectId
                }
            }).then(function(result) {
                return result.data;
            }, function(err) {
                return $q.reject(err);
            });
        },

        save: function(ticket) {
            return $http.post(serviceUrl + '/save', ticket)
                .catch(function(err) {
                    console.log(err);
                    return $q.reject(err);
                });
        }
    }
});

app.factory('UserService', function($http, $q) {
    var serviceUrl = "/api/users";
    return {
        get: function(conf) {
            return $http.post(serviceUrl + '/', conf)
                .then(function(result) {
                    return result.data;
                }, function(err) {
                    return $q.reject(err);
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

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});


