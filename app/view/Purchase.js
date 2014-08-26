/**
 * @class KidStory.view.Purchase
 * 
 * The purchase view shown when a user wants to purchase a book
 */
Ext.define('KidStory.view.Purchase', {
    extend: 'Ext.Panel',
    id: 'purchaseView',

    config: {
        book: null,

        width: 500,
        height: 400,
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        hideAnimation: {
            type: 'popOut',
            duration: 500,
            easing: 'ease-out'
        },
        showAnimation: {
            type: 'popIn',
            duration: 500,
            easing: 'ease-out'
        },

        items: [{
            docked: 'top',
            layout: {
                type: 'hbox'
            },
            items: [{
                cls: 'name',
                flex: 1,
                itemId: 'name'
            }, {
                xtype: 'button',
                ui: 'none',
                cls: 'close',
                itemId: 'closeButton'
            }]
        }, {
            docked: 'bottom',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                xtype: 'button',
                itemId: 'samplePages',
                text: 'Sample Pages'
            }, {
                xtype: 'button',
                itemId: 'purchase',
                text: 'Purchase'
            }]
        }]
    },

    initialize: function() {
        var me = this;

        me.callParent();

        me.down('#closeButton').on('tap', function() {
            me.fireEvent('close', me);
        }, me);

        me.down('#samplePages').on('tap', function() {
            me.fireEvent('samplepages', me, me.getBook());
        }, me);

        me.down('#purchase').on('tap', function() {
            me.fireEvent('purchase', me, me.getBook());
        }, me);
    },

    updateBook: function(newBook) {
        if (!newBook) {
            return;
        }

        this.down('#name').setHtml(newBook.get('name'));
    }
});