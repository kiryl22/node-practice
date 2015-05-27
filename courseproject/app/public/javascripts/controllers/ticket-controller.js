var ticketController = angular.module('ticketController', []);

ticketController.controller('TicketCtrl', ['$scope', 'TicketService', 'project', 'ticket', 'users',
    function ($scope, TicketService, project, ticket, users) {

        $scope.project = project;
        $scope.users = users;

        $scope.ticket = (ticket && ticket._id) ? ticket : {
            status: (project.statuses && project.statuses[0]) ? project.statuses[0] : "",
            priority: (project.priorities && project.priorities[0]) ? project.priorities[0] : "",
            assignee: (users && users[0]) ? users[0] : {}
        };

        $scope.save = function(){
            TicketService.save($scope.ticket)
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
    }
]);
