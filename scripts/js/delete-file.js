function findFolder(girder, parentType, parentId, folderPath) {
    var folders = girder.listFolders({parentType: parentType, parentId: parentId}).content,
        folderName = folderPath.shift();

    // List folders
    for(var i = 0; i < folders.length; ++i) {
        if(folders[i].name === folderName) {
            if(folderPath.length === 0) {
                return folders[i]._id;
            } else {
                return findFolder(girder, 'folder', folders[i]._id, folderPath);
            }            
        }
    }

    // Nothing found
    console.log("No folder with " + folderName + " name was found.");
    return null;
}

//-----------------------------------------------------------------------------

module.exports = function (girder, user, password, filePathToDelete) {
    if(!user || user === '--help') {
        console.log("Usage: girder-client [config] --script upload-file.js userName userPassword filePathToDelete");
        return;
    }

    girder.login(user, password);

    // Find item id to upload to
    var girderPath = filePathToDelete.split('/'),
        collectionName = girderPath.shift(),
        folderNames = [].concat(girderPath),
        fileName = folderNames.pop(),
        itemName = folderNames.pop();

    // console.log(collectionName + ' | ' + folderNames.join(', ') + ' | ' + itemName + ' | ' + fileName);

    var collections = girder.listCollections({ text: collectionName }).content;

    // Make sure we have only one collection
    if(collections.length !== 1) {
        console.log(collections.length + ' collection(s) with name ' + collectionName + ' were found');
        return;
    }

    var itemParent = findFolder(girder, 'collection', collections[0]._id, folderNames);

    if(itemParent) {
        var items = girder.listItems({ folderId: itemParent }).content,
            count = items.length;

        while(count--) {
            if(items[count].name === itemName) {
                var files = girder.listFiles(items[count]._id).content,
                    fCount = files.length;

                while(fCount--) {
                    if(files[fCount].name === fileName) {
                        // Found file to delete
                        console.log("Delete fileId: " + files[fCount]._id);
                        girder.deleteFile(files[fCount]._id);
                        return;
                    }
                }
                console.log("No file to delete");
            }
        }        
    }
};
