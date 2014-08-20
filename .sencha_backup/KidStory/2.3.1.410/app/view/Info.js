/**
 * @class KidStory.view.Info
 * 
 * The information view shown when a user wants to view book information
 */
Ext.define('KidStory.view.Info', {
    extend: 'Ext.Panel',

    config: {
        modal: true,
        centered: true,
        width: 400,
        height: 300,
        hideOnMaskTap: true,
        items: [{
            docked: 'top',
            items: [{
                xtype: 'button',
                ui: 'none',
                cls: 'close',
                itemId: 'closeButton'
            }]
        }]
    },

    initialize: function() {
        this.callParent(arguments);

        this.down('#closeButton').on('tap', this.hide, this);
    }
});