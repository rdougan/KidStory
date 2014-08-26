/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'KidStory',

    // booksBaseURL: 'http://localhost/odesk/02-08-2014/books/',
    booksBaseURL: 'http://vm-rms.s3-eu-west-1.amazonaws.com/books/',

    requires: [
        'KidStory.util.Config',
        'KidStory.util.PhoneGap',
        'KidStory.util.Zip',
        'Ext.MessageBox'
    ],

    controllers: [
        'Books'
    ],

    views: [
        'BookList'
    ],

    stores: [
        'Books'
    ],

    models: [
        'Book'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        this.watchViewport();

        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('KidStory.view.BookList'));

        setTimeout(function() {
            KidStory.util.phonegap.IAP.initialize();
        }, 5000);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    watchViewport: function() {
        var viewport = Ext.Viewport;
        viewport.on('resize', function() {
            var width = window.innerWidth,
                height = window.innerHeight,
                aspect = .75;

            if (height / width > aspect) {
                viewport.innerElement.setSize({
                    width: width,
                    height: width * aspect
                });

                viewport.innerElement.setLeft(0);
                viewport.innerElement.setTop((height - width * aspect) / 2);
            }
            else {
                aspect = 1.33;

                viewport.innerElement.setSize({
                    width: height * aspect,
                    height: height
                });

                viewport.innerElement.setLeft((width - height * aspect) / 2);
                viewport.innerElement.setTop(0);

                width = height * aspect;
            }

            if (width < 1001) {
                viewport.removeCls('tablet');
                viewport.addCls('phone');
            }
            else {
                viewport.removeCls('phone');
                viewport.addCls('tablet');
            }
        }, this);
    }
});
