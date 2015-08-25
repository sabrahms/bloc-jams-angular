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

BlocJams.controller('Album.controller', [ '$scope', function($scope) {
    
    $scope.album = albumPicasso;
}]);



//Services//

BlocJams.service('SongPlayer', function() {

    var currentSoundFile = null;
    return {
        playing: false,
        currentAlbum: null,
        //song object
        currentSong: null,
        //initial volume
        volume: 80,
        //start audio & let everything know its playing
        play: function() {
            currentSoundFile.play();
            this.playing = true;
        },
        //pause audio & let everything know its no longer playing
        pause: function() {
            currentSoundFile.pause();
            this.playing = false;
        },
        setVolume: function(value) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(value);
            }
        }
    };
});


BlocJams.directive('slider', ['$document', function($document) {
    return {
        restrict: 'E',

        replace: true,
        scope: { 

        },
        templateUrl: '/template/player-bar.html',
        link: function(scope, element, attrs) {
            //initial value of slider
            scope.value = 0; 
            //set new value for thumb
            $scope.setThumb = function(value) {
                $(element).find('thumb').css({left: parseInt(value) + '%'});




            };
            //set new value
            scope.setValue = function(newVal) {
            
            };
            //update seekbar to value between 1-100
            scope.setSeek = function($slider, ratio) {
                var offsetPercent = ratio * 100;
                offsetPercent = Math.max(0, offsetPercent);
                offsetPercent = Math.min (100, offsetPercent);
                scope.setThumb(offsetPercent);
                scope.setFill(offsetPercent);
                scope.setValue(offsetPercent);
            };
            
            //seek to clicked area
            $(element).on('click', function(event) {
                var offsetX = event.pageX - $(element).offset().left;
                var barWidth = $(element).width();
                var ratio = offset / barWidth;
                scope.setSeek($(element), ratio);
                
            });
            //drag thumb
            scope.seek = function(event) {
                $(document).bind('mousemove.thumb', function (event) {
                    var offset = event.pageX - $(element).offset().left;
                    var barWidth = $(element).width();
                    var ratio = offset / barWidth;
                    scope.setSeek($(element), ratio);
                });
                $(document).bind('mouseup.thumb', function() {
                    $(document).unbind('mousemove.thumb');
                    $(document).unbind('mouseup.thumb');
                });
            };
        }
    };
}]);


















