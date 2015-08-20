var BlocJams = angular.module('blocJams', ['ui.router']);

BlocJams.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requreBase: false
    });
    
    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        }) 
    
        .state('collection', {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })
    
        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
    });               
});
           
//Controllers//

BlocJams.controller('Landing.controller', ['$scope', function($scope) {
    $scope.tagline = 'Turn the music up!';
}]);

BlocJams.controller('Collection.controller', ['$scope', function ($scope) {
    $scope.albums = [];
    for (var x=0; x < 12; x++) {
        $scope.albums.push(albumPicasso);
    };
}]);

BlocJams.controller('Album.controller', ['$scope', function() {
    
}]);

         