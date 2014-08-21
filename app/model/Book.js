/**
 * @class KidStory.model.Book
 *
 * A model class which handles all the fields for each book.
 */
Ext.define('KidStory.model.Book', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            // fields from books.json
            'name',
            'path',
            'price',
            'samplePageCount',

            {
                name: 'price',
                convert: function(value, record) {
                    if (!value) {
                        record.set('formattedPrice', 'Free');
                        return value;
                    }

                    record.set('formattedPrice', '$' + value);

                    return value;
                }
            },

            // fields from individual book.json files
            {
                name: 'loadedData',
                type: 'boolean'
            },
            'pages'
        ]
    },

    isLocal: function() {
        return Boolean(KidStory.util.Zip.memory[this.get('path') + '/']);
    },
    
    isPurchased: function() {
        return false;
    },

    isPurchasable: function() {
        return this.get('price') && !this.isPurchased();
    },

    download: function(config) {
        if (this.isLocal()) {
            config.success.call(config.scope);

            return;
        }

        KidStory.util.Zip.unzip({
            filename: this.get('path') + '.zip',
            url: KidStory.app.booksBaseURL + this.get('path') + '.zip',
            scope: this,
            success: function(data) {
                this.unpackJson({
                    success: function() {
                        config.success.call(config.scope);
                    },
                    failure: function() {
                        config.failure.call(config.scope);
                    }
                });
            },
            failure: function(message) {
                config.failure.call(config.scope, message);
            },
            progressCallback: function(progress) {
                if (config.progressCallback) {
                    config.progressCallback.call(config.scope, progress);
                }
            }
        });
    },

    urlForFile: function(file) {
        if (!this.isLocal()) {
            return false;
        }

        if (KidStory.util.PhoneGap.is()) {
            return cordova.file.dataDirectory + this.get('path') + '/' + file;
        }

        return URL.createObjectURL(KidStory.util.Zip.memory[this.get('path') + '/'][file].blob);
    },

    dataForFile: function(config) {
        if (!this.isLocal()) {
            return false;
        }

        if (KidStory.util.PhoneGap.is()) {
            Ext.Ajax.request({
                url: this.urlForFile(config.file),
                scope: this,
                success: function(response) {
                    config.success.call(config.scope, response.responseText);
                },
                failure: function() {
                    config.failure.call(config.scope);
                }
            });
        }
        else {
            var blob = KidStory.util.Zip.memory[this.get('path') + '/'][config.file].blob,
                reader = new FileReader();

            if (reader._realReader) {
                reader = reader._realReader;
            }

            reader.addEventListener('loadend', function() {
                config.success.call(config.scope, reader.result);
            });

            reader.readAsText(blob);
        }
    },

    // @private
    
    unpackJson: function(config) {
        var me = this;

        this.dataForFile({
            file: 'book.json',
            success: function(data) {
                // Read the JSON file and decode it
                var json = Ext.decode(data);

                // Set the loadedData field to true so we know in the future that it is loaded
                json['loadedData'] = true;

                // Updated the record and let the callback know
                me.set(json);
                config.success.call(config.scope);
            }
        });
    }
});