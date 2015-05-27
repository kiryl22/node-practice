var projectBoardController = angular.module('projectBoardController', []);

projectBoardController.controller('ProjectBoardCtrl', ['$scope','$routeParams', 'TicketService', 'project',
    function ($scope, $routeParams, TicketService, project) {

        $scope.project = project;
        $scope.statusTicketColl = [];
        $scope.maxTicketCount = 0;

        $scope.init = function(){
            TicketService.getByProjId($scope.project._id).then(
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
