var fileBiggerThan = 0;

//-----------------------------------------------------------------------------

function searchInFolder(girder, parentFolder) {
    var folders = girder.listFolders({parentType: 'folder', parentId: parentFolder._id}).content,
        items = girder.listItems({folderId: parentFolder._id}).content;

    // List folders
    for(var i = 0; i < folders.length; ++i) {
        searchInFolder(girder, folders[i]);
    }

    // List items
    for(var i = 0; i < items.length; ++i) {
        searchInItem(girder, items[i])
    }
} 

//-----------------------------------------------------------------------------

function searchInItem(girder, item) {
    // List files
    var files = girder.listFiles(item._id).content, 
        count = files.length;

    while(count--) {
        if(files[count].size > fileBiggerThan) {
            console.log(" - File " + files[count].name + " with id " + files[count]._id + " inside item " + item._id + " has a size of " + files[count].size);
        }
    }
}

//-----------------------------------------------------------------------------

module.exports = function (girder, user, password, size) {
    if(!user || user === '--help') {
        console.log("Usage: girder-client [config] --script find-big-file.js userName userPassword fileSize");
        return;
    }

    console.log("Search for file bigger than " + size);
    fileBiggerThan = size;

    girder.login(user, password);
    var collections = girder.listCollections().content;

    for(var i = 0; i < collections.length; ++i) {
        var collection = collections[i],
            folders = girder.listFolders({parentType: 'collection', parentId: collection._id}).content;
        for(var j = 0; j < folders.length; ++j) {
            searchInFolder(girder, folders[j]);
        }
    }
};
