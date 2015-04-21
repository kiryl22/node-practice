var clientApp = angular.module('clientApp', [
    'ngRoute',
    'clientControllers'
]);

clientApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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

    $locationProvider.html5Mode(true);
    }]);
