


graphite.controller('homeController', ['$scope', '$routeParams', '$route', 'data', '$interval', function($scope, $routeParams, $route, data, $interval) {

    $scope.serverData;
    var factory = new data();

    $interval(getData, 10000);


    function getData() {
        factory.get_server_data()
            .then(function(result) {
                $scope.serverData = result.data
            })
            .catch(function(err) {})
    }

}]);
