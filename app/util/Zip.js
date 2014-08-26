zip.workerScriptsPath = 'lib/zip/';

/**
 * @class KidStore.util.Zip
 */
Ext.define('KidStory.util.Zip', {
    statics: {
        memory: {},

        unzip: function(config) {
            var self = KidStory.util.Zip,
                isPhoneGap = KidStory.util.PhoneGap.is();

            zip.createReader(new zip.HttpReader(config.url), function(zipReader) {
                zipReader.getEntries(function(entries) {
                    var directory = null,
                        i = 0;

                    var unpackEntry = function(i) {
                        var entry = entries[i];

                        if (config.progressCallback) {
                            config.progressCallback.call(config.scope, (i / entries.length) * 100);
                        }

                        // Ignore __MACOSX + DS_Store files
                        if (entry.filename.match('__MACOSX|DS_Store|doc|docx')) {
                            next();
                            return;
                        }

                        if (entry.directory) {
                            directory = entry;

                            // Create the folder in memory
                            self.memory[entry.filename] = {};

                            if (isPhoneGap) {
                                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem) {
                                    // console.log('creating dir');

                                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                                        dirEntry.getDirectory(entry.filename.replace('/', ''), {
                                            create: true,
                                            exclusive: false
                                        }, function() {
                                            // console.log('created dir');
                                            next();
                                        }, function() {
                                            config.failure.call(config.scope, 'Error creating directory: ' + entry.filename);
                                        });
                                    }, function() {
                                        config.failure.call(config.scope, 'Error finding data directory');
                                    });
                                }, function() {
                                    config.failure.call(config.scope, 'Error requesting file access');
                                });
                            }
                            else {
                                next();
                            }

                            return;
                        }
                        else {
                            if (!directory) {
                                return;
                            }

                            entry.getData(new zip.BlobWriter(zip.getMimeType(entry.filename)), function(blob) {
                                self.memory[directory.filename][entry.filename.replace(directory.filename, '')] = {
                                    blob: blob
                                };

                                if (isPhoneGap) {
                                    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem) {
                                        // console.log('getting directory', directory.filename.replace('/', ''));

                                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                                            dirEntry.getDirectory(directory.filename.replace('/', ''), {
                                                create: true,
                                                exclusive: false
                                            }, function(dirEntry) {

                                                // console.log('# created directory', dirEntry.fullPath);

                                                var filename = entry.filename.replace(directory.filename, '');
                                                // console.log('creating file', filename);
                                                dirEntry.getFile(filename, {
                                                    create: true,
                                                    exclusive: false
                                                }, function(fileEntry) {
                                                    // console.log('# created file', fileEntry.fullPath);

                                                    fileEntry.createWriter(function(writer) {
                                                        // console.log('writing file');
                                                        writer.onwrite = function() {
                                                            // console.log('wrote to file', arguments);
                                                            next();
                                                        };

                                                        writer.onerror = function() {
                                                            // console.log('error writing to file', arguments);
                                                            config.failure.call(config.scope, 'Error saving file: ' + entry.filename);
                                                        };

                                                        writer.write(blob);
                                                    }, function() {
                                                        config.failure.call(config.scope, 'Error saving file: ' + entry.filename);
                                                    });
                                                }, function() {
                                                    config.failure.call(config.scope, 'Error creating file: ' + filename, arguments);
                                                });
                                            }, function() {
                                                config.failure.call(config.scope, 'Error finding directory');
                                            });
                                        }, function() {
                                            config.failure.call(config.scope, 'Error finding data directory');
                                        });
                                    }, function() {
                                        config.failure.call(config.scope, 'Error requesting file access');
                                    });
                                }
                                else {
                                    next();
                                }
                            }, function(current, total) {

                            });
                        }
                    };

                    var next = function() {
                        i++;

                        if (i < entries.length) {
                            unpackEntry(i);
                        }
                        else {
                            zipReader.close();
                            
                            config.progressCallback.call(config.scope, 100);
                            config.success.call(config.scope, self.memory[directory.filename]);
                        }
                    };

                    unpackEntry(0);
                });
            }, function() {
                config.failure.call(config.scope, 'Error unzipping file');
            });
        }
    }
});
