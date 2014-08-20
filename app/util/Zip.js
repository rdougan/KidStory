zip.workerScriptsPath = 'lib/zip/';

/**
 * @class KidStore.util.Zip
 */
Ext.define('KidStory.util.Zip', {
    statics: {
        memory: {},

        unzip: function(config) {
            var self = KidStory.util.Zip;

            zip.createReader(new zip.HttpReader(config.url), function(zipReader) {
                zipReader.getEntries(function(entries) {
                    var directory = null,
                        i = 0;


                    var unpackEntry = function(i) {
                        var entry = entries[i];

                        // Ignore __MACOSX + DS_Store files
                        if (entry.filename.match('__MACOSX|DS_Store|doc|docx')) {
                            next();
                            return;
                        }

                        if (entry.directory) {
                            directory = entry;

                            // Create the folder in memory
                            self.memory[entry.filename] = {};

                            next();
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

                                next();
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
