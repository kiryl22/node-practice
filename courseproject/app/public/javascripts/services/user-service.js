var userService = angular.module('userService', []);

userService.factory('UserService', function($http, $q) {
    var serviceUrl = "/api/users";
    return {
        get: function(conf) {
            return $http.post(serviceUrl + '/', conf)
                .then(function(result) {
                    return result.data;
                }, function(err) {
                    return $q.reject(err);
                });
        }
    }
});
