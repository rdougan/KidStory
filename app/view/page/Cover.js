/**
 * @class KidStory.view.page.Cover
 * 
 * The cover page view
 */
Ext.define('KidStory.view.page.Cover', {
    extend: 'Ext.Component',

    isCover: true,

    config: {
        book: null,
        readToMe: true,

        baseCls: 'k-page'
    },

    template: [{
        reference: 'buttonsContainer',
        cls: 'buttons',
        children: [{
            reference: 'playButton',
            cls: 'play'
        }, {
            tag: 'br'
        }, {
            reference: 'readToMeButton',
            cls: 'readToMe selected'
        }, {
            reference: 'readMyselfButton',
            cls: 'readMyself'
        }]
    }],

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

        // Add events onto the buttons
        me.on([{
            event: 'tap',
            element: 'element',
            delegate: '.play',
            fn: 'onPlay'
        }, {
            event: 'tap',
            element: 'element',
            delegate: '.readToMe',
            fn: 'onReadToMe'
        }, {
            event: 'tap',
            element: 'element',
            delegate: '.readMyself',
            fn: 'onReadMyself'
        }]);
    },

    /**
     * When the page element is painted (displays) we should updated the background to show
     * the correct image.
     */
    onPainted: function() {
        this.updateBackground();
    },

    // Actions

    /**
     * This is called when the play button is pressed.
     *
     * When this happens, we fire off a new custom event so the main book view knows
     * how to handle it.
     */
    onPlay: function() {
        var me = this;

        if (me.getReadToMe()) {
            me.fireEvent('readtome', me);
        } else {
            me.fireEvent('readmyself', me);
        }
    },

    /**
     * This is called when the read to me button is pressed.
     */
    onReadToMe: function() {
        this.setReadToMe(true);
        this.updateButtonStates();
    },

    /**
     * This is called when the read myself button is pressed.
     */
    onReadMyself: function() {
        this.setReadToMe(false);
        this.updateButtonStates();
    },

    /**
     * Updates the selected state of the buttons depending on if readToMe is enabled or not
     */
    updateButtonStates: function() {
        var me = this,
            selectedCls = 'selected';

        if (me.getReadToMe()) {
            me.readToMeButton.addCls(selectedCls);
            me.readMyselfButton.removeCls(selectedCls);
        } else {
            me.readToMeButton.removeCls(selectedCls);
            me.readMyselfButton.addCls(selectedCls);
        }
    },


    /**
     * Updates the background of this page.
     */
    updateBackground: function() {
        var me = this,
            el = me.element,
            book = me.getBook(),
            base = KidStory.util.Config.booksBaseURL + me.getBook().get('path') + '/',
            image;

        image = book.urlForFile('Cover-Page.' + book.get('coverImageExtension'));

        el.setStyle('background-image', 'url(' + image + ')');
    }
});