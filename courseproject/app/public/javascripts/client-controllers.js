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
                if(res.data && res.data._id){
                    $scope.project = res.data;
                    alertify.success("Project was saved");
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
    }]);

clientControllers.controller('ProjectBoardCtrl', ['$scope','$routeParams', 'ProjectService', 'project',
    function ($scope, $routeParams, ProjectService, project) {

        $scope.project = project;
        $scope.statusTicketColl = [];
        $scope.maxTicketCount = 0;

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
                $scope.statusTicketColl[ticket.status].push(ticket);
                if($scope.statusTicketColl[ticket.status].length > $scope.maxTicketCount){
                    $scope.maxTicketCount = $scope.statusTicketColl[ticket.status].length;
                }
            });
        }

        $scope.init();
    }]);

clientControllers.controller('TicketCtrl', ['$scope', 'ProjectService', 'project', 'ticket', 'users',
    function ($scope, ProjectService, project, ticket, users) {

        $scope.project = project;
        $scope.users = users;

        $scope.ticket = (ticket && ticket._id) ? ticket : {
            status: (project.statuses && project.statuses[0]) ? project.statuses[0] : "",
            priority: (project.priorities && project.priorities[0]) ? project.priorities[0] : "",
            assignee: (users && users[0]) ? users[0] : {}
        };

        $scope.save = function(){
            ProjectService.saveTicket($scope.ticket)
                .then( function(res){
                    if(res.data && res.data._id){
                        $scope.ticket = res.data;
                        alertify.success("Ticket was saved");
                    }
                },
                function(err){
                    alertify.error("Ticket saving error");
                })
        }

        $scope.buildUserName = function (user){
            if(!user)
            return "Unknown";

            if(user.firstName || user.firstName)
            return user.firstName + " " + user.firstName + " (" + user.email +")"

            return user.email;
        }

        $scope.init = function (){
            if(!$scope.ticket._id){
                $scope.ticket.projectId = $scope.project._id;
            }
        }()
    }]);
