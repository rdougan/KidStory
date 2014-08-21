/**
 * @class KidStore.util.PhoneGap
 *
 * Handles integration with PhoneGap native functionality
 */
Ext.define('KidStory.util.PhoneGap', {
    requires: [
        'KidStory.util.phonegap.Audio',
        'KidStory.util.phonegap.IAP'
    ],
    
    statics: {
        /**
         * Returns true if the app is running inside PhoneGap
         */
        is: function() {
            if (typeof cordova != "undefined" || Ext.browser.is.PhoneGap) {
                return true;
            }

            return false;
        }
    }
});
