var clientControllers = angular.module('clientControllers', []);

clientControllers.controller('DashboardCtrl', ['$scope', 'ProjectService',
    function ($scope,ProjectService ) {

        $scope.projectsList = [];
        $scope.init = function (){
            ProjectService.getProjectsList(function(data) {
                $scope.projectsList = data;
            }, function() {
                alertify.error("Error has occurred while retrieving projects list");
            });
        }
    }]);

clientControllers.controller('ProjectCtrl', ['$scope', '$routeParams', 'ProjectService',
    function($scope, $routeParams, ProjectService) {

        $scope.project= {
            statuses : [],
            priorities: []
        }

        $scope.statusToAdd = "";
        $scope.priorityToAdd = "";

        $scope.save = function(){
            ProjectService.saveProject(
                $scope.project,
                function(data) {
                    alertify.success("Project was saved");
                },
                function() {
                    alertify.error("Project saving error");
                });
        }

        $scope.getProject = function(projectId){
            ProjectService.getProjectById(
                projectId,
                function(data) {
                    if(data) $scope.project = data;
                },
                function() {
                    alertify.error("Error has occurred while retrieving project");
                });
        }

        $scope.addPriority = function() {
            if($scope.priorityToAdd){
                $scope.project.priorities.push($scope.priorityToAdd);
                $scope.priorityToAdd = "";
            }
        }

        $scope.addStatus = function() {
            if($scope.statusToAdd){
                $scope.project.statuses.push($scope.statusToAdd);
                $scope.statusToAdd = "";
            }
        }

        $scope.deletePriority = function(index) {
                $scope.project.priorities.splice(index, 1);
        }

        $scope.deleteStatus = function(index) {
            $scope.project.statuses.splice(index, 1);
        }

        $scope.getProject($routeParams.projectId);

    }]);
