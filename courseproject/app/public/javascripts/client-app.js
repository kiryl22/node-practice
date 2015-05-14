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
                        return ProjectService.getProjectsList();
                    }
                }
            }).
            when('/project/:projectId?', {
                templateUrl: '/templates/project.html',
                controller: 'ProjectCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        if($route.current.params.projectId)
                        return ProjectService.getProject($route.current.params.projectId);
                        return { statuses: [], priorities: []}
                    }
                }
            }).
            when('/project/:projectId/board', {
                templateUrl: '/templates/project-board.html',
                controller: 'ProjectBoardCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        return ProjectService.getProject($route.current.params.projectId);
                    }
                }
            }).
            when('/ticket/:projectId/:ticketId?', {
                templateUrl: 'templates/ticket.html',
                controller: 'TicketCtrl',
                resolve: {
                    project: function (ProjectService, $route) {
                        return ProjectService.getProject($route.current.params.projectId);
                    },
                    ticket: function (ProjectService, $route) {
                        if($route.current.params.ticketId)
                        return ProjectService.getTicket($route.current.params.ticketId);
                        return {};
                    }
                }
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


app.factory('ProjectService', function($http, $q) {
    return {

        getProjectsList: function() {
            return $http.get('/ProjectsList').then(function(result) {
                alertify.success("Project list loaded");
                return result.data;
            }, function(result) {
                alertify.error("Error has occurred while retrieving projects list");
                return result;
            });;
        },

        getProject: function(projectId) {
            return $http.get('/GetProject', {
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

        saveProject: function(project) {
            return $http.post('/SaveProject', project)
                .catch(function(err) {
                    console.log(err);
                    return $q.reject(err);
                });
        },

        getTicket: function(ticketId) {
            return $http.get('/GetTicket', {
                params: {
                    ticketId: ticketId
                }
            }).then(function(result) {
                return result.data;
            }, function(err) {
                return $q.reject(err);
            });
        },

        getTicketsByProjId: function(projectId) {
            return $http.get('/GetTickets', {
                params: {
                    projectId: projectId
                }
            }).then(function(result) {
                return result.data;
            }, function(err) {
                return $q.reject(err);
            });
        },

        saveTicket: function(ticket) {
            return $http.post('/SaveTicket', ticket)
                .catch(function(err) {
                    console.log(err);
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


