/**
 * @class KidStore.util.phonegap.iap.iOS
 */
Ext.define('KidStory.util.phonegap.iap.iOS', {
    statics: {
        validProducts: [],

        initialize: function() {
            var self = KidStory.util.phonegap.iap.iOS;

            if (!KidStory.util.PhoneGap.is()) {
                return;
            }
            
            window.storekit.init({
                debug: true,

                purchase: self.onPurchase,
                restore: self.onRestore,
                restoreCompleted: self.onRestoreAll,
                restoreFailed: self.onRestoreFailure,
                error: self.onFailure,
                ready: self.onReady
            });
        },

        purchase: function(config) {
            var self = KidStory.util.phonegap.iap.iOS;

            if (self.validProducts.indexOf(config.identifier) == -1) {
                config.failure('did not find valid identifier: ' + config.identifier);

                return;
            }

            self._purchaseSuccess = config.success;
            self._purchaseFailure = config.failure;

            window.storekit.purchase(config.identifier, 1);
        },

        restore: function() {
        	window.storekit.restore();
        },

        // Actions
        
        onReady: function() {
            var self = KidStory.util.phonegap.iap.iOS;

        	var productIds = [];

            Ext.getStore('Books').each(function(record) {
                if (record.isPurchasable()) {
                    console.log(record);
                    productIds.push(record.get('identifier'));
                }
            });

	        window.storekit.load(productIds, function(validProducts, invalidProductIds) {
                self.validProducts = [];

	            for (var i = 0; i < validProducts.length; i++) {
                    val = validProducts[i];
	                console.log("id: " + val.id + " title: " + val.title + " val: " + val.description + " price: " + val.price);

                    self.validProducts.push(val.id);
                }

	            if (invalidProductIds.length) {
	                console.log("Invalid Product IDs: " + JSON.stringify(invalidProductIds));
	            }
	        });
        },

        onPurchase: function(transactionId, productId) {
            var self = KidStory.util.phonegap.iap.iOS;

        	console.log('purchased: ' + productId);

            self._purchaseSuccess();
        },

        onRestore: function(transactionId, productId) {
            var self = KidStory.util.phonegap.iap.iOS;

            console.log('restored: ' + productId);
        },

        onRestoreAll: function() {
            var self = KidStory.util.phonegap.iap.iOS;

	       console.log('all restore complete');
	    },

	    onRestoreFailure: function(errCode) {
            var self = KidStory.util.phonegap.iap.iOS;

	        console.log('restore failed: ' + errCode);
	    },

	    onFailure: function(errno, errtext) {
            var self = KidStory.util.phonegap.iap.iOS;

            self._purchaseFailure(errtext);
	    }
    }
});