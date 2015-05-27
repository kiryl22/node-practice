var projectService = angular.module('projectService', []);

projectService.factory('ProjectService', function($http, $q) {
    var serviceUrl = "/api/projects";
    return {
        getAll: function() {
            return $http.get(serviceUrl + '/').then(function(result) {
                alertify.success("Project list loaded");
                return result.data;
            }, function(result) {
                alertify.error("Error has occurred while retrieving projects list");
                return result;
            });;
        },

        get: function(projectId) {
            return $http.get(serviceUrl +'/get', {
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

        save: function(project) {
            return $http.post(serviceUrl +'/save', project)
                .catch(function(err) {
                    console.log(err);
                    return $q.reject(err);
                });
        }
    }
});


