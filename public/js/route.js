var graphite = angular.module('graphite', ['ngRoute']);

graphite.config(function($routeProvider) {
    $routeProvider
        .when('/', { //home page
            templateUrl: '/pages/home.html',
            controller: 'homeController'
        })
});
