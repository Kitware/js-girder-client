function listFolderChildren(girder, parentFolder, indentation) {
    console.log(indentation + '- ' + parentFolder.name + ': ' + parentFolder._id);

    var folders = girder.listFolders({parentType: 'folder', parentId: parentFolder._id}).content,
        items = girder.listItems({folderId: parentFolder._id}).content;

    // List folders
    for(var i = 0; i < folders.length; ++i) {
        listFolderChildren(girder, folders[i], indentation + '  ');
    }

    // List items
    for(var i = 0; i < items.length; ++i) {
        listItemChildren(girder, items[i], indentation)
    }
} 

//-----------------------------------------------------------------------------

function listItemChildren(girder, item, indentation) {
    console.log(indentation + '- ' + item.name + ': ' + item._id);

    // List files
    var files = girder.listFiles(item._id).content, 
        count = files.length;

    while(count--) {
        console.log(indentation + '  - ' + files[count].name + ': ' + files[count]._id + ' : ' + files[count].size);
    }
}

//-----------------------------------------------------------------------------

module.exports = function (girder, user, password) {
    if(!user || user === '--help') {
        console.log("Usage: girder-client [config] --script list-tree.js userName userPassword");
        return;
    }

    girder.login(user, password);
    var collections = girder.listCollections().content;

    for(var i = 0; i < collections.length; ++i) {
        var collection = collections[i],
            folders = girder.listFolders({parentType: 'collection', parentId: collection._id}).content;
        console.log("=> " + collection.name);
        for(var j = 0; j < folders.length; ++j) {
            listFolderChildren(girder, folders[j], "  ");
        }
    }
};
