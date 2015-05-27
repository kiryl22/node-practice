var dashboardController = angular.module('dashboardController', []);

dashboardController.controller('DashboardCtrl', ['$scope', 'projectList',
    function ($scope, projectList) {
        $scope.projectsList = projectList;
    }
]);
