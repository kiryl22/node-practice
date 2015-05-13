var clientControllers = angular.module('clientControllers', []);

clientControllers.controller('DashboardCtrl', ['$scope', 'projectList',
    function ($scope, projectList) {
        $scope.projectsList = projectList;
    }]);

clientControllers.controller('ProjectCtrl', ['$scope', '$routeParams', 'ProjectService', 'project',
    function($scope, $routeParams, ProjectService, project) {

        $scope.project= project;

        $scope.statusToAdd = "";
        $scope.priorityToAdd = "";

        $scope.save = function(){
            ProjectService.saveProject($scope.project).then(function(res){
                alertify.success("Project was saved");
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
    }]);

clientControllers.controller('ProjectBoardCtrl', ['$scope','$routeParams', 'ProjectService', 'project',
    function ($scope, $routeParams, ProjectService, project) {

        $scope.project = project;
        $scope.statusTicketColl = [];

        $scope.init = function(){
            ProjectService.getTicketsByProjId($scope.project._id).then(
                function(data) {
                    if(data) {
                        sortTicketsByStatus(data, $scope.project.statuses);
                    }
                },
                function() {
                    alertify.error("Error has occurred while retrieving tickets");
                });
        }

        var sortTicketsByStatus = function (tickets, statuses) {
            var otherStat =  "other";
            $scope.statusTicketColl[otherStat] = [];

            statuses.forEach(function(status, i, arr) {
                if(status) $scope.statusTicketColl[status] = [];
            });

            tickets.forEach(function(ticket, i, arr) {
                if(!ticket) return;
                if(!$scope.statusTicketColl[ticket.status] || !ticket.status) {
                    $scope.statusTicketColl[otherStat].push(ticket)
                    return;
                }
                $scope.statusTicketColl[ticket.status].push(ticket)
            });
        }

        $scope.init();
    }]);

clientControllers.controller('TicketCtrl', ['$scope', 'ProjectService', 'project', 'ticket',
    function ($scope, ProjectService, project, ticket ) {

        $scope.ticket = ticket ? ticket : {};
        $scope.project = project;

        $scope.save = function(){
            ProjectService.saveTicket($scope.ticket)
                .then( function(res){
                        alertify.success("Ticket was saved");
                },
                function(err){
                    alertify.error("Ticket saving error");
                })
        }

        $scope.init = function (){
            if(!$scope.ticket._id){
                $scope.ticket.projectId = $scope.project._id;
            }
        }()
    }]);
