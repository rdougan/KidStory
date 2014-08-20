/**
 * @class KidStory.view.page.End
 * 
 * The end page view
 */
Ext.define('KidStory.view.page.End', {
    extend: 'Ext.Container',

    isEnd: true,

    config: {
        book: null,

        baseCls: 'k-page'
    },

    /**
     * When this view is initialized, we need to add a listener for the painted event, so
     * we know to display the proper background image.
     *
     * We also add listeners for when this view is activated and deactivated, so we can
     * start and stop any functionality related to this page (like sound)
     */
    initialize: function() {
        var me = this;

        me.callParent();

        me.on({
            scope: me,
            painted: 'onPainted'
        });
    },

    // Configs

    /**
     * When the page element is painted (displays) we should updated the background to show
     * the correct image.
     */
    onPainted: function() {
        this.updateBackground();
    },

    /**
     * Updates the background of this page.
     */
    updateBackground: function() {
        var me = this,
            el = me.element,
            book = me.getBook(),
            base = 'resources/books/' + me.getBook().get('path') + '/',
            image;

        image = base + 'End-Page.' + book.get('endImageExtension');

        el.setStyle('background-image', 'url(' + image + ')');
    }
});