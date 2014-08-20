/**
 * @class KidStore.util.phonegap.iap.Android
 */
Ext.define('KidStory.util.phonegap.iap.Android', {
    statics: {
        skus: 'product1',

        initialize: function() {
            inappbilling.init({
                options: {
                    showLog: true
                },

                success: this.onSuccess,
                error: this.onFailure,
                skus: this.skus
            });
        },

        purchase: function(config) {
            inappbilling.buy(function(item) {
                console.log('success:', item);

                config.success();
            }, function() {
                console.log('failure:', error);

                config.failure();
            }, config.productId);
        },

        restore: function() {

        },

        // Actions
        
        onSuccess: function(skus) {
            console.log('onSuccess', skus);
        },

        onFailure: function(error) {
            console.log('onFailure', error);
        }
    }
});