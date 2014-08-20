# KidStory App

This app is built using the [Sencha Touch](http://www.sencha.com/products/) framework (version 2.3.1)

## Application Structure

Sencha Touch is a rich javascript application framework, which means it mainly uses JavaScript to create views and components. All apps follow the MVC pattern, including this KidStory app.

The basic folder structure is as follows:

- **/app**
	- **/controllers** - contains app controllers
		- **Books.js** - controls all views related to books including opening and reading them
	- **/models** - contains data models
	- **/views** - contains views
		- **BookList.js** - the view for showing the main book list
		- **Purchase.js** - the view shown when a user attempts to buy a book
		- **Book.js** - the main container view for showing a book. Contains all pause/play/info/next/prev/back buttons
		- **Info.js** - the info view shown when use asks for book information
		
		- **/page**
			- **Cover.js** - the view for cover pages
			- **Page.js** - the view for regular pages
			- **End.js** - the view for end pages
	- **/util**
		- **PhoneGap.js** - a utility class to allow itneraction with PhoneGap
- **/resources**
	- **/css** - compiled css
	- **/sass** - sass files
	- **/images** - app images
- **/touch** - contains the Sencha Touch SDK
- **app.js** - main app file which loads the app and related files
- **app.json** - has app information for building for web and phonegap
- **build.xml** - contains information for PhoneGap about the apps to create
- **phonegap.local.properties** - information about the PhoneGap build

Each file has documentation related to what it is doing.

## Usage

Before modifying the code, you need to install [Sencha Cmd 5](http://www.sencha.com/products/sencha-cmd/download). This will allow you to run the app locally and to build the app for PhoneGap. This is available for both OSX and Windows.

### Running the app locally

You can start a web server using Sencha Cmd that allows you to view the app locally. To do that, navigate to the folder where this app source is located, and run the following command in the Terminal:

    sencha web start
    
This will start the server and give you a URL to view in your browser to show the app.


### Building the app for web distribution

You must build the app to distribute it on a web server (via FTP for example). To do this, run the following command in the Terminal:

	sencha app build package
	
This will compress all the application files and put them into the `/build/package/KidStory` folder. The contents of this folder should then but moved to the web server.

### Building the app for PhoneGap

There are two ways of building the app for PhoneGap:

1. **Locally** - this requires you to install the Xcode SDK (so you must be on OSX) and also the Android SDK
2. **Adobe Build** - this is a service that builds your app for you. You can signup here: [build.phonegap.com](http://build.phonegap.com)

Unless you are a developer and are experience with the Apple and Android SDKs, the first option is painful.

To use Adobe Build, you must signup and then specify your username and password in the `phonegap.local.properties` file. Once done, you can build the apps using the following command:

	sencha app build native

## Adding Books

Adding books requires you to modify the `books.json` file and create a seperate `book.json` file.

### books.json

This file is located in the `/resources` folder. The format is as follows:

    {
        "books": [
            {
                "name": "The Book Name",
                "path": "path_to_book",
                "price": 3.99, // optional
                "identifier": "com.book.book3", // optional
                "samplePageCount": 2 // optional
            },
            ..
        ]
    }
    
The `books` array contains an object for each book you have inside your app. This information is always loaded on app launch, and includes the basic book information, and if it is an IAP or not.

- **name** - the name of the book
- **path** - the folder name of the book resources, located inside `/resources/books`. This should not contain any spaces or special characters
- **price** - the price of the book, if this is purchasable
- **identifier** - the IAP identifier for this book
- **samplePageCount** - the number of pages so show when viewing the sample

### Book resources

Each book has a unique folder for its resources. This folder should be placed inside the `/resources/books` folder. The **name** of this folder should match the **path** property defined for the book inside `books.json`.

This folder should include all page images, page sounds and a `book.json` file which contains information about the book.

#### Book resources folder structure

    /resources
    	books.json   
    	 	
    	/books
    		/book_1
    			book.json
    			Cover-Page.jpg
    			Music-Cover-Page.mp3
    			End-Page.gif
    			Music-End-Page.mp3
    			Image-1.gif
    			Image-2.gif
    			Page-1.mp3
    			Page-2.mp3
    			
    		/book_2
    			book.json
    			...

Now lets go over each of the files for each book.

#### book.json

This file is used to define all information about the book and its pages. Here is an example:

    {
        "coverImageExtension": "jpg",
        "coverMusicExtension": "mp3",
        "endImageExtension": "gif",
        "endMusicExtension": "mp3",
        "pages": [
            {
                "imageExtension": "gif",
                "musicExtension": "wav",
                "position": "top",
                "texts": {
                    "0": "First page text", // 0 is where the sound starts for this text
                    "6": "Second page text", // 6s for this..
                    "13": "Third page text" // 13s for this..
                }
            },
            ...
        ]
    }
    
Lets go over each of the fields:

- **coverImageExtension** - this is the file extension used for the cover page image file. The cover page image should *always* be named `Cover-Page.extension` - where `extension` is the `coverImageExtension`
- **coverMusicExtension** - this is the file extension used for the cover page music file. The cover page music should *always* be named `Music-Cover-Page.extension` - where `extension` is the `coverMusicExtension`
- **endImageExtension** - this is the file extension used for the end page image file. The end page image should *always* be named `End-Page.extension` - where `extension` is the `endImageExtension`
- **endMusicExtension** - this is the file extension used for the end page music file. The end page music should *always* be named `Music-End-Page.extension` - where `extension` is the `endMusicExtension`
- **pages** - this is an array of pages this book contains. Each page has a few properties:
	- **imageExtension** - this is the file extension used for the page image file. The page image should *always* be named `Image-1.extension` - where `1` is the page number and `extension` is the `coverImageExtension`
	- **musicExtension** - this is the file extension used for the page music file. The page music should *always* be named `Page-1.extension` - where `1` is the page number and `extension` is the `endMusicExtension`
	- **position** - this is the position of the text box which will show the page text. Available values are: `top`, `bottom`, `left` and `right`
	- **texts** - this texts which are shown on this page. We need to define the position of the narration for each piece of text so we can sync the sound with the text highlighting. 


