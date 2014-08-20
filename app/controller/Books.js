/**
 * @class KidStory.controller.Books
 * 
 * Controls all the functionality related to viewing and purchasing books, showing 
 */
Ext.define('KidStory.controller.Books', {
    extend: 'Ext.app.Controller',

    // Require the related views that we use in this controller
    requires: [
        'KidStory.view.Purchase',
        'KidStory.view.Info'
    ],

    config: {
        // References of views so we can access them later in code
        refs: {
            bookList: '#bookList',

            infoMenuButton: '#bookView #infoMenuButton',
            closeButton: '#bookView #closeButton',
            homeButton: '#bookView #homeButton',
            infoButton: '#bookView #infoButton',
            bookshelfButton: '#bookView #bookshelfButton'
        },

        // Control allows us to hook into view events so we can respond to them when necessary
        control: {
            'bookList': {
                itemtap: 'selectBook'
            },

            '#bookView #infoMenuButton': {
                tap: 'onInfoMenuTap'
            },
            '#bookView #closeButton': {
                tap: 'onCloseTap'
            },
            '#bookView #homeButton': {
                tap: 'onHomeTap'
            },
            '#bookView #infoButton': {
                tap: 'onInfoTap'
            },
            '#bookView #bookshelfButton': {
                tap: 'onBookshelfTap'
            },

            '#bookView #nextButton': {
                tap: 'onNext'
            },

            '#bookView #previousButton': {
                tap: 'onPrevious'
            }
        }
    },

    audioPlayer: null,

    /**
     * This is called when a book is selected in the main book list.
     */
    selectBook: function(dataView, index, target, book, e) {
        var me = this;

        if (book.get('price')) {
            me.showPurchaseBook(book);
        } else {
            me.openBook(book);
        }
    },

    /**
     * Called when a user wants to purchase a book. Simply shows the purchase book view.
     */
    showPurchaseBook: function(book) {
        if (this.purchaseView) {
            this.purchaseView.setBook(book);
            this.purchaseView.show();
        } else {
            this.purchaseView = Ext.create('KidStory.view.Purchase', {
                book: book,
                listeners: {
                    scope: this,
                    samplepages: 'onSamplePages',
                    close: function() {
                        this.purchaseView.hide();
                    }
                }
            });

            Ext.Viewport.add(this.purchaseView);
        }
    },

    /**
     * This loads the book data and then shows that specific book in the main view.
     */
    openBook: function(book) {
        var me = this;

        // Create a new bookView if one has not already been created.
        if (!me.bookView) {
            me.bookView = Ext.create('KidStory.view.Book', {
                listeners: {
                    scope: this,

                    sampleend: 'onSampleEnd'
                }
            });
        } else {
            me.bookView.setBook(null);
        }

        // Show a loading mask while the book is loaded
        Ext.Viewport.setMasked({
            xtype: 'loadmask'
        });

        me.loadBook({
            book: book,
            success: function(book) {
                // Remove the loading mask
                Ext.Viewport.setMasked(false);

                // Update the book property of the bookView
                me.bookView.setBook(book);

                // Display the book view
                Ext.Viewport.setActiveItem(me.bookView);
            },
            failure: function() {
                // Remove the loading mask
                Ext.Viewport.setMasked(false);

                Ext.Viewport.setActiveItem(0);

                Ext.Msg.alert('Problem', 'Sorry, there was a problem loading this book. Please try again.');
            }
        });
    },

    /**
     * Load specific book data for a specified book.
     */
    loadBook: function(config) {
        if (!config.book) {
            config.failure();
            return;
        }

        // If we have already loaded the book data, there is no need to do it again
        if (config.book.get('loadedData') === true) {
            config.success(config.book);
            return;
        }

        config.book.download({
            success: function() {
                config.success(config.book);
            },
            failure: function() {
                config.failure();
            }
        });
    },

    /**
     * Called when a person wants to view the sample pages of a book.
     * The book view handles only showing the required number of pages for that sample.
     */
    onSamplePages: function(view, book) {
        view.hide();
        this.openBook(book);
    },

    /**
     * Called when a sample is over.
     */
    onSampleEnd: function() {
        Ext.Viewport.setActiveItem(0);

        this.stopAudio();

        this.purchaseView.show();
    },

    /**
     * Gets the PhoneGap util class and plays audio
     */
    playAudio: function(url, repeat, callback, changeCallback, scope) {
        KidStory.util.phonegap.Audio.playAudio(url, repeat, callback, changeCallback, scope);
    },

    /**
     * Gets the PhoneGap util class and stop any currently playing audio
     */
    stopAudio: function() {
        KidStory.util.phonegap.Audio.stopAudio();
    },

    /**
     * Gets the PhoneGap util class and pauses audio
     */
    pauseAudio: function() {
        KidStory.util.phonegap.Audio.pauseAudio();
    },

    /**
     * Gets the PhoneGap util class and resumes audio
     */
    resumeAudio: function() {
        KidStory.util.phonegap.Audio.resumeAudio();
    },

    // Menu actions

    /**
     * Called when the user wants to show the menu
     */
    onInfoMenuTap: function() {
        var me = this;

        me.getInfoMenuButton().hide();

        // If you are viewing the cover, do not show the home button
        if (!me.bookView.getActiveItem().isCover) {
            me.getHomeButton().show();
        }

        me.getCloseButton().show();
        me.getInfoButton().show();
        me.getBookshelfButton().show();
    },

    /**
     * Called when the close button is closed
     */
    onCloseTap: function() {
        var me = this;

        me.getInfoMenuButton().show();

        me.getCloseButton().hide();
        me.getHomeButton().hide();
        me.getInfoButton().hide();
        me.getBookshelfButton().hide();
    },

    /**
     * Called when the home button is called
     */
    onHomeTap: function() {
        this.bookView.setActiveItem(0);

        this.onCloseTap();
    },

    /**
     * Called when the info button is called
     */
    onInfoTap: function() {
        var me = this;

        me.onCloseTap();

        if (me.infoView) {
            me.infoView.show();
            return;
        }

        me.infoView = Ext.create('KidStory.view.Info');

        Ext.Viewport.add(me.infoView);
    },

    /**
     * Called when the bookshelf button has been pressed
     */
    onBookshelfTap: function() {
        this.onCloseTap();

        this.stopAudio();

        Ext.Viewport.setActiveItem(0);
    },

    /**
     * Called when the next button is pressed
     */
    onNext: function() {
        if (this.bookView.canSampleEnd()) {
            this.onSampleEnd();
            return;
        }

        this.bookView.next();
    },

    /**
     * Called when the prev button is pressed
     */
    onPrevious: function() {
        this.bookView.previous();
    }
});