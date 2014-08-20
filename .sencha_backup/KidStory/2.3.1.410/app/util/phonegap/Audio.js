/**
 * @class KidStore.util.phonegap.Audio
 *
 * Handles integration with PhoneGap native functionality
 */
Ext.define('KidStory.util.phonegap.Audio', {
    statics: {
        /**
         * Plays audio
         */
        playAudio: function(url, repeat, callback, changeCallback, scope) {
            var singleton = KidStory.util.phonegap.Audio;

            if (KidStory.util.PhoneGap.is()) {

                if (singleton.audioPlayer) {
                    // Check if we are already playing the same url
                    if (singleton.audioPlayer.src.match(url)) {
                        return;
                    }

                    singleton.stopAudio();
                }

                // If android, we need to change the url
                if (Ext.os.is.Android && !url.match('android_asset/www')) {
                    url = '/android_asset/www/' + url;
                }

                singleton.audioPlayer = new Media(url, null, function() {

                }, function(status) {
                    if (status == Media.MEDIA_STOPPED) {
                        if (repeat && !singleton.forceStop) {
                            singleton.audioPlayer = null;
                            singleton.playAudio(url, repeat, callback, scope);
                            return;
                        }

                        if (!singleton.forceStop && callback) {
                            callback.call(scope);
                        }

                        singleton.forceStop = false;
                    }
                });

                singleton.audioPlayer.play();
            } else {
                if (singleton.audioPlayer) {
                    // Check if we are already playing the same url
                    if (singleton.audioPlayer.src.match(url)) {
                        return;
                    }

                    singleton.stopAudio();
                }

                singleton.audioPlayer = new Audio(url);
                singleton.audioPlayer.play();

                if (changeCallback) {
                    singleton.audioPlayer.addEventListener('timeupdate', function() {
                        if (singleton.audioPlayer) {
                            changeCallback.call(scope, singleton.audioPlayer.currentTime);
                        }
                    });
                }

                singleton.audioPlayer.addEventListener('ended', function() {
                    if (repeat) {
                        singleton.currentTime = 0;
                        singleton.play();
                        return;
                    }

                    if (callback) {
                        callback.call(scope);
                    }
                }, false);
            }
        },

        /**
         * Stops any playing audio
         */
        stopAudio: function() {
            var singleton = KidStory.util.phonegap.Audio;

            if (!singleton.audioPlayer) {
                return;
            }

            if (KidStory.util.PhoneGap.is()) {
                singleton.forceStop = true;
                singleton.audioPlayer.stop();
            } else {
                singleton.audioPlayer.pause();
            }

            singleton.audioPlayer = null;
        },

        /**
         * Pauses any playing audio
         */
        pauseAudio: function() {
            var singleton = KidStory.util.phonegap.Audio;

            if (!singleton.audioPlayer) {
                return;
            }

            if (KidStory.util.PhoneGap.is()) {
                singleton.audioPlayer.pause();
            } else {
                singleton.audioPlayer.pause();
            }
        },

        /**
         * Resumes any paused audio
         */
        resumeAudio: function() {
            var singleton = KidStory.util.phonegap.Audio;

            if (!singleton.audioPlayer) {
                return;
            }

            if (KidStory.util.PhoneGap.is()) {
                singleton.audioPlayer.play();
            } else {
                singleton.audioPlayer.play();
            }
        }
    }
});