/**
 * @class KidStore.util.phonegap.iap.iOS
 */
Ext.define('KidStory.util.phonegap.iap.iOS', {
    statics: {
        initialize: function() {
            if (!KidStory.util.PhoneGap.is()) {
                return;
            }
            
            window.storekit.init({
                debug: true,

                purchase: this.onPurchase,
                restore: this.onRestore,
                restoreCompleted: this.onRestoreAll,
                restoreFailed: this.onRestoreFailure,
                error: this.onFailure,
                ready: this.onReady
            });
        },

        purchase: function(config) {
            window.storekit.purchase(config.productId, 1);
        },

        restore: function() {
        	window.storekit.restore();
        },

        // Actions
        
        onReady: function() {
        	var productIds = [
	            "com.nghidang.kidstory.book2", 
	            "com.nghidang.kidstory.book3"
	        ];

	        window.storekit.load(productIds, function(validProducts, invalidProductIds) {
	            $.each(validProducts, function (i, val) {
	                console.log("id: " + val.id + " title: " + val.title + " val: " + val.description + " price: " + val.price);
	            });

	            if(invalidProductIds.length) {
	                console.log("Invalid Product IDs: " + JSON.stringify(invalidProductIds));
	            }
	        });
        },

        onPurchase: function(transactionId, productId) {
        	console.log('purchased: ' + productId);
        },

        onRestore: function(transactionId, productId) {
            console.log('restored: ' + productId);
        },

        onRestoreAll: function() {
	       console.log('all restore complete');
	    },

	    onRestoreFailure: function(errCode) {
	        console.log('restore failed: ' + errCode);
	    },

	    onFailure: function(errno, errtext) {
	        console.log('Failed: ' + errtext);
	    }
    }
});