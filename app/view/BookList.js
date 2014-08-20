/**
 * @class KidStory.view.BookList
 * 
 * The booklist view which displays all books
 */
Ext.define('KidStory.view.BookList', {
    extend: 'Ext.dataview.DataView',

    requires: [
        'KidStory.view.Book'
    ],

    config: {
        id: 'bookList',
        store: 'Books',
        itemTpl: '<span>{name}</span><div class="price">{formattedPrice}</div>',
        inline: {
            wrap: false
        },
        scrollable: {
            direction: 'horizontal',
            indicators: {
                x: {
                    autoHide: false
                }
            }
        }
    }
});