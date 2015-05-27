var projectController = angular.module('projectController', []);

projectController.controller('ProjectCtrl', ['$scope', '$routeParams', 'ProjectService', 'project',
    function($scope, $routeParams, ProjectService, project) {

        $scope.project= project;

        if(!$scope.project._id){
            $scope.project.priorities = ["Low", "Regular", "High"];
            $scope.project.statuses = ["ToDo", "In Progress", "Done"];
        }

        $scope.statusToAdd = "";
        $scope.priorityToAdd = "";

        $scope.save = function(){
            ProjectService.save($scope.project).then(function(res){
                if(res.data && res.data._id){
                    $scope.project = res.data;
                    alertify.success("Project was saved");
                }
                else {
                    if(res.data && res.data.error) {
                        if(res.data.message){
                            alertify.error(res.data.message);
                        }
                        else {
                            alertify.error("Project saving error");
                        }
                    }
                }
            }, function(res){
                alertify.error("Project saving error");
            })
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
    }
]);