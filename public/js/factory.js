graphite.factory('data', ['$http', function($http) {
    return function() {
        var self = {};
        self.get_server_data = function() {
            var promise = $http({ method: 'GET', url: '/graphite/listner' });
            return promise;
        }
        return self;
    }
}])
