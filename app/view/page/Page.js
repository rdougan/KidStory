/**
 * @class KidStory.view.page.Page
 * 
 * The main page view used to display a specific page
 */
Ext.define('KidStory.view.page.Page', {
    extend: 'Ext.Container',

    isPage: true,

    config: {
        book: null,
        pageIndex: null,
        started: false,
        position: null,
        highlight: false,

        baseCls: 'k-page',

        layout: 'card',

        items: [{
            cls: 'textArea',
            scrollable: {
                direction: 'vertical',
                directionLock: true,
                indicators: {
                    y: {
                        autoHide: false
                    }
                }
            }
        }]
    },

    currentPosition: -1,

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
            activate: 'onActivate',
            painted: 'onPainted'
        });
    },

    // Configs

    updatePosition: function(newPosition) {
        var textArea = this.down('container');
        textArea.setDocked(newPosition);

        if (newPosition == "left" || newPosition == "right") {
            textArea.setHeight('100%');
            textArea.setWidth('40%');
        } else {
            textArea.setWidth('100%');
            textArea.setHeight('40%');
        }
    },

    /**
     * This method is automatically called when the pageIndex config (defined above) is changed.
     *
     * When it changes, we need to check if this page is a cover. If it is, we show the buttons.
     * If it isn't we hide them.
     */
    updatePageIndex: function(newPageIndex) {
        // Get the element which holds the buttons
        var me = this,
            data = me.pageData(),
            textArea = me.down('container');

        me.updatePosition(data['position']);
        textArea.setHtml(me.textWithTexts(data['texts']));

        me.currentPosition = -1;
    },

    updateStarted: function(newStarted) {
        var textArea = this.down('container');

        if (newStarted) {
            textArea.show();
        } else {
            textArea.hide();
        }
    },

    textWithTexts: function(texts) {
        var result = "",
            first = this.getHighlight() ? true : false;

        for (var position in texts) {
            result += '<p class="text ' + (first ? 'highlight' : '') + '" data-position="' + position + '">' + texts[position] + '</p>';
            first = false;
        }

        return result;
    },

    scrollToPosition: function(position) {
        var me = this,
            textArea = me.down('container'),
            els = textArea.element.query('p.text'),
            el = textArea.element.down('p[data-position="' + position + '"]'),
            offset = position == 0 ? 0 : el.dom.offsetTop,
            scroller = textArea.getScrollable().getScroller();

        if (!me.getHighlight()) {
            scroller.scrollTo(0, 0, true);

            for (var i = 0; i < els.length; i++) {
                Ext.get(els[i]).removeCls('highlight');
            }

            return;
        }

        var size = scroller.getSize(),
            cntSize = scroller.getContainerSize(),
            maxOffset = size.y - cntSize.y;

        scroller.scrollTo(0, Math.min(offset, maxOffset), true);

        for (var i = 0; i < els.length; i++) {
            Ext.get(els[i]).removeCls('highlight');
        }

        Ext.get(el).addCls('highlight');
    },

    handleAudioChange: function(currentTime) {
        var me = this,
            data = me.pageData(),
            allPositions = Object.keys(data['texts']),
            positions = [];

        // remove current position and everything before it
        for (var i = 0; i < allPositions.length; i++) {
            if (parseInt(allPositions[i]) > parseInt(me.currentPosition)) {
                positions.push(allPositions[i]);
            }
        }

        var position = positions[0];
        if (currentTime > position) {
            me.currentPosition = position;

            me.scrollToPosition(position);
        }
    },

    /**
     * When the page element is painted (displays) we should updated the background to show
     * the correct image.
     */
    onPainted: function() {
        this.updateBackground();
    },

    /**
     * Called when the view is shown
     */
    onActivate: function() {
        this.currentPosition = -1;
        this.scrollToPosition(0);
    },

    /**
     * Returns the book page data for a specified page.
     */
    pageData: function() {
        var book = this.getBook();
        if (!book) {
            return;
        }

        return book.get('pages')[this.getPageIndex()];
    },

    /**
     * Updates the background of this page.
     */
    updateBackground: function() {
        var me = this,
            el = me.element,
            book = me.getBook(),
            pageIndex = me.getPageIndex(),
            pageData = me.pageData(),
            base = KidStory.app.booksBaseURL + me.getBook().get('path') + '/',
            image;

        image = base + 'Image-' + (pageIndex + 1) + '.' + pageData['imageExtension'];

        el.setStyle('background-image', 'url(' + image + ')');
    }
});