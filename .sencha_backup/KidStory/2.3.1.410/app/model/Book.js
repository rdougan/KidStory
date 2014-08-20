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
    
    isPurchased: function() {
        return false;
    },

    isPurchasable: function() {
        return this.get('price') && !this.isPurchased();
    }
});