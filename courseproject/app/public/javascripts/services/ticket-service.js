var ticketService = angular.module('ticketService', []);

ticketService.factory('TicketService', function($http, $q) {
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


