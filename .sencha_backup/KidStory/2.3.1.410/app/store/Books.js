/**
 * @class KidStory.store.Books
 *
 * A store class which loads and contains all book data
 */
Ext.define('KidStory.store.Books', {
    extend: 'Ext.data.Store',

    config: {
        autoLoad: true,
        model: 'KidStory.model.Book',

        proxy: {
            type: "ajax",
            url: 'resources/books.json',
            reader: {
                type: "json",
                rootProperty: "books"
            }
        }
    }
});