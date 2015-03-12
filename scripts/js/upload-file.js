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

function uploadFile(girder, filePath, item) {
    var fs = require('fs'),
        path = require('path'),
        chunkSize = 1024 * 1024 * 10,
        offset = 0,
        fileBuffer = fs.readFileSync(filePath),
        uploadId = null;

    console.log("Upload " + filePath + " (" + fileBuffer.length + ") to item " + item._id);

    var uploadObj = girder.newFile('item', item._id, path.basename(filePath), {
        size: fileBuffer.length,
        mimeType: 'application/octet-stream'
    }).content;

    uploadId = uploadObj._id;

    if(uploadId) {
        while(offset < fileBuffer.length) {
            var chunk = fileBuffer.slice(offset, (offset+chunkSize < fileBuffer.length) ? (offset+chunkSize) : fileBuffer.length);
            
            // Get the chunk on the net
            console.log("Upload chunk " + Math.ceil(offset / chunkSize) + "/" + Math.ceil(fileBuffer.length / chunkSize));
            var resp = girder.uploadChunk(uploadId, offset, chunk);
            if(resp.status !== 200) {
                console.error(resp);
            }

            // Move to next chunk
            offset += chunkSize;
        }
        // console.log(girder.uploadComplete(uploadId));
        console.log("Upload done ");
    }   
}

//-----------------------------------------------------------------------------

module.exports = function (girder, user, password, filePath, destinationPath) {
    if(!user || user === '--help') {
        console.log("Usage: girder-client [config] --script upload-file.js userName userPassword filePath destinationPath");
        return;
    }

    girder.login(user, password);

    // Find item id to upload to
    var girderPath = destinationPath.split('/'),
        collectionName = girderPath.shift(),
        folderNames = [].concat(girderPath),
        itemName = folderNames.pop();

    // console.log(collectionName + ' | ' + folderNames.join(', ') + ' | ' + itemName);

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
                return uploadFile(girder, filePath, items[count]);
            }
        }

        console.log(items.length + ' item(s) with name ' + itemName + ' were found');
        
    }
};
