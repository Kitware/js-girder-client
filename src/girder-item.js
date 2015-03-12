var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function downloadItem(itemId, callback) {
    _.GET('/item/' + itemId + '/download', callback);
}

// ----------------------------------------------------------------------------

function updateItemMetadata(itemId, metadata, callback) {
    // FIXME 
    // body: metadata
    // _.PUT('/item/' + itemId + '/metadata', callback);
    callback("Not implemented yet");
}

// ----------------------------------------------------------------------------

function listItems(query, callback) {
    var allowedQueryKeys = ['folderId', 'text', 'limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['query', 'callback'], arguments);

    _.GET('/item' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function createItem(folderId, name, description, callback) {
    var query = { folderId: folderId, name: name },
        args = _.args(['folderId', 'name', 'description', 'callback'], arguments);

    if(description) {
        query.description = args.description;
    }
    _.POST('/item' + _.extractQuery(query), args.callback);
}

// ----------------------------------------------------------------------------

function listFiles(itemId, options, callback) {
    var allowedQueryKeys = ['limit', 'offset', 'sort'],
        args = _.args(['itemId', 'options', 'callback'], arguments);

    _.GET('/item/' + itemId + '/files' + _.extractQuery(args.options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function getItemRootPath(itemId, callback) {
    _.GET('/item/' + itemId + '/rootpath', callback);
}

// ----------------------------------------------------------------------------

function getItem(itemId, callback) {
    _.GET('/item/' + itemId, callback);
}

// ----------------------------------------------------------------------------

function deleteItem(itemId, callback) {
    _.DELETE('/item/' + itemId, callback);
}

// ----------------------------------------------------------------------------

function editItem(itemId, options, callback) {
    var allowedQueryKeys = ['folderId', 'name', 'description'],
        args = _.args(['itemId', 'options', 'callback'], arguments);

    _.PUT('/item/' + itemId + _.extractQuery(args.options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function copyItem(itemId, options, callback) {
     var allowedQueryKeys = ['folderId', 'name', 'description'],
        args = _.args(['itemId', 'options', 'callback'], arguments);

    _.POST('/item/' + itemId + '/copy' + _.extractQuery(args.options, allowedQueryKeys), args.callback);
}

// --- Export functions for the module ---

module.exports = {
    downloadItem        : downloadItem,
    updateItemMetadata  : updateItemMetadata,
    listItems           : listItems,
    createItem          : createItem,
    listFiles           : listFiles,
    getItemRootPath     : getItemRootPath,
    getItem             : getItem,
    deleteItem          : deleteItem,
    editItem            : editItem,
    copyItem            : copyItem
};
