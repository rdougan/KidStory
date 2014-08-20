/**
 * @class KidStore.util.phonegap.IAP
 *
 * Handles integration with PhoneGap native functionality
 */
Ext.define('KidStory.util.phonegap.IAP', {
    requires: [
        'KidStory.util.phonegap.iap.iOS',
        'KidStory.util.phonegap.iap.Android'
    ],

    statics: {
        singleton: function() {
            return KidStory.util.phonegap.iap.iOS;
        },

        initialize: function() {
            this.singleton().initialize();
        },

        restore: function() {
            this.singleton().restore();
        }
    }
});