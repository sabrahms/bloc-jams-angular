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

BlocJams.controller('Album.controller', [ '$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.album = albumPicasso;
    $scope.play = function(song) {
        SongPlayer.setSong($scope.album, song);
    };
    $scope.pause = function() {
        SongPlayer.pause();
    };
}]);




//Services//

BlocJams.service('SongPlayer', function() {
    var getIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    var currentSoundFile = null;
    return {
        isPlaying: false,
        currentAlbum: null,
        currentSong: null,
        volume: 80,
        play: function() {
            currentSoundFile.play();
            this.isPlaying = true;
        },
        pause: function() {
            currentSoundFile.pause();
            this.isPlaying = false;
        },
        setVolume: function(value) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(value);
            }
        },
        setSong: function(album, song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            this.play();
            this.setVolume(this.volume);
        },
        previous: function() {
            var index = getIndex(this.currentAlbum, this.currentSong);
            index--;
            if (index < 0) {
                index = this.currentAlbum.songs.length - 1;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
        next: function() {
            var index = getIndex(this.currentAlbum, this.currentSong);
            index++;
            if (index >= this.currentAlbum.songs.length) {
                index = 0;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
        getTimePos: function() {
            if (currentSoundFile) {
                currentSoundFile.bind('timeupdate', function() {
                    return this.getTime() / this.getDuration();
                });
            }
        }
    };
});

