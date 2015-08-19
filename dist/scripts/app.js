var BlocJams = angular.module('blocJams', ['ui.router']);

BlocJams.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requreBase: false
    });
    
    $stateProvider.state('album', {
        url: '/album',
        controller: 'Album.controller',
        templateUrl: '/templates/album.html'
    });
    
    $stateProvider.state('collection', {
        url: '/collection',
        controller: 'Collection.controller',
        templateUrl: '/templates/collection.html'
    });
    
    $stateProvider.state('landing', {
        url: '/landing',
        controller: 'Landing.controller',
        templateUrl: '/templates/landing.html'
    });
                        
});