/**
 * @class KidStory.view.Book
 * 
 * The main book view which contains all the pages for a book. Also has all buttons related to the book
 * such as: pause, play, menu, bookshelf, etc.
 */
Ext.define('KidStory.view.Book', {
    extend: 'Ext.carousel.Carousel',

    requires: [
        'KidStory.view.page.Cover',
        'KidStory.view.page.Page',
        'KidStory.view.page.End'
    ],

    id: 'bookView',

    config: {
        book: null,
        playAudio: true,
        sample: false,

        indicator: false,

        items: [{
            top: 0,
            left: 0,
            right: 0,
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                ui: 'none'
            },
            items: [{
                cls: 'pause',
                itemId: 'pauseButton',
                hidden: true
            }, {
                cls: 'resume',
                itemId: 'resumeButton',
                hidden: true
            }, {
                xtype: 'spacer'
            }, {
                cls: 'info_menu',
                itemId: 'infoMenuButton'
            }, {
                cls: 'close',
                itemId: 'closeButton',
                hidden: true
            }, {
                cls: 'home',
                itemId: 'homeButton',
                hidden: true
            }, {
                cls: 'info',
                itemId: 'infoButton',
                hidden: true
            }, {
                cls: 'bookshelf',
                itemId: 'bookshelfButton',
                hidden: true
            }]
        }, {
            bottom: 0,
            left: 0,
            right: 0,
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                ui: 'none'
            },
            items: [{
                cls: 'previous',
                itemId: 'previousButton'
            }, {
                xtype: 'spacer'
            }, {
                cls: 'next',
                itemId: 'nextButton'
            }]
        }]
    },

    initialize: function() {
        this.callParent();

        this.down('#pauseButton').on('tap', this.onPagePause, this);
        this.down('#resumeButton').on('tap', this.onPageResume, this);
    },

    /**
     * This method is called everytime the book configfuration (defined above) is updated
     * using the `setBook` method.
     *
     * Here we will cleanup the view and add pages for this book
     */
    updateBook: function(newBook) {
        if (!newBook) {
            this.setItems(null);
            return;
        }

        var items = [],
            pages = newBook.get('pages'),
            sample = newBook.isPurchasable(),
            length = sample ? newBook.get('samplePageCount') : pages.length;

        // Play audio when it is a sample
        if (sample) {
            this.setPlayAudio(true);
        }

        // Add the cover item
        if (!sample) {
            items.push({
                xclass: 'KidStory.view.page.Cover',
                book: newBook,
                listeners: {
                    scope: this,

                    activate: 'onPageActivate',
                    deactivate: 'onPageDeactivate',

                    readtome: 'onPageReadToMe',
                    readmyself: 'onPageReadMyself'
                }
            });
        }

        // Add each of the page items
        for (var i = 0; i < length; i++) {
            items.push({
                xclass: 'KidStory.view.page.Page',
                book: newBook,
                pageIndex: i,
                listeners: {
                    scope: this,

                    activate: 'onPageActivate',
                    deactivate: 'onPageDeactivate'
                }
            });
        }

        // Add the end page item
        if (!sample) {
            items.push({
                xclass: 'KidStory.view.page.End',
                book: newBook,
                listeners: {
                    scope: this,

                    activate: 'onPageActivate',
                    deactivate: 'onPageDeactivate'
                }
            });
        }

        this.setItems(items);

        this.setActiveItem(0);
    },

    // Page actions

    /**
     * Called when a page is activated.
     *
     * Here we start the audio.
     */
    onPageActivate: function(page) {
        var me = this;

        me.playPageAudio(page);

        if (page.isCover) {
            me.down('#nextButton').hide();
            me.down('#previousButton').hide();

            me.down('#pauseButton').hide();
            me.down('#resumeButton').hide();
        }

        if (page.isPage) {
            page.setStarted(true);
            page.setHighlight(me.getPlayAudio());
            page.currentPosition = -1;
            page.scrollToPosition(0);

            me.down('#nextButton').show();
            me.down('#previousButton').show();

            if (me.readToMe) {
                me.down('#pauseButton').show();
                me.down('#resumeButton').hide();
            } else {
                me.down('#pauseButton').hide();
                me.down('#resumeButton').hide();
            }
        }

        if (page.isEnd) {
            me.down('#nextButton').hide();
            me.down('#previousButton').show();

            me.down('#pauseButton').hide();
            me.down('#resumeButton').hide();
        }
    },

    /**
     * Called when a page is deactivated.
     */
    onPageDeactivate: function(page) {
        if (page.isPage) {
            page.setStarted(false);
        }
    },

    /**
     * Called when a page read to me button is pressed.
     */
    onPageReadToMe: function() {
        this.readToMe = true;
        this.setPlayAudio(true);
        this.next();
    },

    /**
     * Called when a page read myself button is pressed.
     */
    onPageReadMyself: function() {
        this.readToMe = false;
        this.setPlayAudio(false);
        this.next();
    },

    /**
     * Called when a pause button is pressed on a page
     */
    onPagePause: function() {
        var me = this,
            page = me.getActiveItem();

        if (page.isPage) {
            page.setStarted(false);
        }

        me.down('#pauseButton').hide();
        me.down('#resumeButton').show();

        KidStory.app.getController('Books').pauseAudio();
    },

    /**
     * Called when a resume button is pressed on a page
     */
    onPageResume: function(page) {
        var me = this,
            page = me.getActiveItem();

        if (page.isPage) {
            page.setStarted(true);
        }

        me.down('#pauseButton').show();
        me.down('#resumeButton').hide();

        KidStory.app.getController('Books').resumeAudio();
    },

    /**
     * Plays a specific pages audio, if audio playing is enabled.
     */
    playPageAudio: function(page) {
        var me = this;

        if (page.isPage && !me.getPlayAudio()) {
            KidStory.app.getController('Books').stopAudio();
            return;
        }

        var pageData = page.pageData ? page.pageData() : null,
            pageIndex = page.getPageIndex ? page.getPageIndex() : null,
            book = me.getBook(),
            baseAudioUrl = 'resources/books/' + book.get('path') + '/',
            repeat = false,
            audioFileUrl;

        // Create the audio file URL based on the page type (cover, end) or the page number
        if (page.isCover) {
            repeat = true;
            audioFileUrl = 'Music-Cover-Page.' + book.get('coverMusicExtension');
        } else if (page.isEnd) {
            audioFileUrl = 'Music-Cover-Page.' + book.get('endMusicExtension');
        } else {
            audioFileUrl = 'Page-' + (pageIndex + 1) + '.' + pageData['musicExtension'];
        }

        // Start playing the audio
        KidStory.app.getController('Books').playAudio(baseAudioUrl + audioFileUrl, repeat, me.audioEnded, function(position) {
            me.audioChange(position, page);
        }, me);
    },
    
    audioChange: function(currentTime, page) {
        if (page.handleAudioChange) {
            page.handleAudioChange(currentTime);
        }
    },

    audioEnded: function() {
        var me = this,
            page = me.getActiveItem();

        if (page.isPage) {
            page.setStarted(false);
            page.currentPosition = -1;
            page.scrollToPosition(0);
        }

        me.down('#pauseButton').hide();
        me.down('#resumeButton').show();

        // If it is the last page and this is a sample, we need to fire an event so the controller can
        // show the purchase modal again
        if (me.canSampleEnd()) {
            me.fireEvent('sampleend', me);
        }
    },

    canSampleEnd: function() {
        var me = this,
            page = me.getActiveItem();

        return me.getBook().isPurchasable() && me.getItems().indexOf(page) == (me.getItems().getCount() - 1)
    }
});