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

BlocJams.controller('Album.controller', [ '$scope', 'SongPlayer', '$timeout', function($scope, SongPlayer, $timeout) {
    $scope.album = albumPicasso;
//    $scope.$on('newVolume', function(event, data) {
//        SongPlayer.setVolume(data)
//    });
    $scope.updatePlayer = function() {
        $scope.isPlaying = SongPlayer.playing;
        $scope.index = SongPlayer.currentIndex;
        $scope.songName = SongPlayer.currentSong.name;
        $scope.artist = SongPlayer.currentAlbum.artist;
        $timeout(function() { $scope.setDuration(); }, 100);
        $scope.vol = SongPlayer.volume;
    };
    $scope.playSong = function(index) {
        if (($scope.currentTime > 0) && (index !== $scope.index)) {
            SongPlayer.setSong(albumPicasso, albumPicasso.songs[index]);
            SongPlayer.play();
            $scope.updatePlayer();
        } else if (($scope.currentTime > 0) && (index == $scope.index)) {
            SongPlayer.play();
            $scope.isPlaying = SongPlayer.playing;
            $scope.index = SongPlayer.currentIndex;
        } else {
            SongPlayer.setSong(albumPicasso, albumPicasso.song[index]);
            SongPlayer.play();
            $scope.updatePlayer();
        }
    };
    $scope.pauseSong = function() {
        SongPlayer.pause();
        $scope.isPlaying = SongPlayer.playing;
    };
    $scope.$on('seek', function(event, data) {
        SongPlayer.seek(data);
    });

    if (!$scope.isPlaying) {
        $scope.currentTime = '-:--';
        $scope.totalTime = '-:--';
    };
    $scope.next = function() {
        SongPlayer.next($scope.index);
        $scope.updatePlayer();
    };
    $scope.previous = function() {
        SongPlayer.previous($scope.index);
        $scope.updatePlayer();
    };
    var hovered = null;
    $scope.hover = function(index) {
        hovered = index;
    };
    $scope.offHover = function(index) {
        hovered = null;
    };
    $scope.songState = function(index) {
        if ((SongPlayer.currentIndex == index) && SongPlayer.playing) {
            return 'playing';
        } else if (index == hovered) {
            return 'hovered';
        }
        return 'default';
    };
}]);



//Services//

BlocJams.service('SongPlayer', function() {

    var currentSoundFile = null;
    var getIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    return {
        playing: false,
        currentAlbum: null,
        //song object
        currentSong: null,
        currentIndex: null,
        volume: 80,
        play: function() {
            this.playing = true;
            currentSoundFile.play();
            if (currentSoundFile) {
                currentSoundFile.bind('timeupdate', function(event) {
                    $rootScope.$broadcast('song:timeupdate', currentSoundFile.getTime());
                });
            }
            this.setVolume(this.volume);
        },
        pause: function() {
            this.playing = false;
            currentSoundFile.pause();
        },
        setVolume: function(value) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(value);
                this.volume = value;
            }
        },
        setSong: function(album, song) {
            if(currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;
            this.currentIndex = getIndex(this.currentAlbum, this.currentSong);
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
        },
        //go to previous song or go to end of album if on first song
        previous: function(index) {
            index--;
            if(index < 0) {
                index = this.currentAlbum.songs.length -1;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
            this.play();
        },
            //go to next song or go to start of album if on last song
        next: function(index) {
            index++;
            if(index >= this.currentAlbum.songs.length) {
                index = 0;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
            this.play();
        },
        seek: function(percent) {
            if (currentSoundFile) {
                var ratio = percent / 100;
                var newTime = currentSoundFile.getDuration() * ratio;
                currentSoundFile.setTime(newTime);
            }
        },
        duration: function() {
            if (currentSoundFile) {
                return currentSoundFile.getDuration();
            }
        }
    };
});
            
        




BlocJams.directive('slider', ['$document', function($document) {
    return {
        restrict: 'E',
        replace: true,
        scope: { 
            value:"=",
        },
        templateUrl: '/templates/player-bar.html',
        link: function(scope, element, attrs) {
            //initial slider value
            scope.value = 0; 
            
            //set new value for thumb
            scope.setThumb = function(value) {
                $(element).find('thumb').css({left: parseInt(value) + '%'});
            };
            scope.setFill = function(value) {
                $(element).find('fill').css({width: parseInt(value) + '%'});
            };
            
            //set new value
            scope.setValue = function(newVal) {
                scope.$apply(scope.value = parseInt(newVal));
                //send up new volume value
                if ($(element).hasClass('volume')) {
                    scope.$emit('newVolume', scope.value);
                }
                if ($(element).hasClass('seeker')) {
                    scope.$emit('seek', scope.value);
                }
            };
            //update seekbar to value between 1-100
            scope.setSeek = function($slider, ratio) {
                var offsetPercent = ratio * 100;
                offsetPercent = Math.max (0, offsetPercent);
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
                $(document).bind('mousemove.thumb', function(event) {
                    var offset = event.pageX - $(element).offset().left;
                    var barWidth = $(element).width();
                    var ratio = offset / barWidth;
                    scope.setSeek($(element), ratio);
                });
            }
        }
    }
}])

BlocJams.filter('filterTime', function() {
    return function(timeInSeconds) {
      var time = parseFloat(timeInSeconds);
      if (isNaN(time)) {
        return '0:00'
      }
      var wholeMinutes = Math.floor(time / 60);
      var wholeSeconds = Math.floor(time - wholeMinutes * 60);
      if (wholeSeconds >= 10) {
        var formatTime = wholeMinutes + ":" + wholeSeconds;
      }
      else{
        var formatTime = wholeMinutes + ":0" + wholeSeconds; 
      }
      return formatTime;
   };
});


















