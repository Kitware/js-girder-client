// Get reference to the internal HTTP request abstraction
var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function listFolders(query, callback) {
    var allowedQueryKeys = ['parentType', 'parentId', 'text', 'limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['query', 'callback'], arguments);
    _.GET('/folder' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function createFolder(parentType, parentId, name, options, callback) {
    var allowedQueryKeys = ['parentType', 'parentId', 'name', 'description', 'public'],
        args = _.args(['query', 'callback'], arguments);

    options = options || {};
    options.parentType = args.parentType;
    options.parentId   = args.parentId;
    options.name       = args.name;

    _.POST('/folder' + _.extractQuery(args.options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function editFolderMetaData(folderId, metadata, callback) {
    // FIXME provide body as JSON for metadata
    // _.PUT('/folder/' + folderId + '/metadata', callback);
    callback("Not implemented yet");
}

// ----------------------------------------------------------------------------

function deleteFolder(folderId, callback) {
    _.DELETE('/folder/' + folderId, callback);
}

// ----------------------------------------------------------------------------

function getFolder(folderId, callback) {
    _.GET('/folder/' + folderId, callback);
}

// ----------------------------------------------------------------------------

function editFolder(folderId, options, callback) {
    var allowedQueryKeys = ['parentType', 'parentId', 'name', 'description'],
        args = _.args(['query', 'callback'], arguments);
    _.PUT('/folder/' + args.folderId + _.extractQuery(args.options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function downloadFolder(folderId, callback) {
    _.PUT('/folder/' + folderId + '/download', callback);
}

// ----------------------------------------------------------------------------

function getFolderAccess(folderId, callback) {
    _.GET('/folder/' + folderId + '/access', callback);
}
// ----------------------------------------------------------------------------

function editFolderAccess(folderId, access, publicFlag, callback) {
    var args = _.args(['query', 'callback'], arguments),
        query = {
            access : access
        };

    if(args.publicFlag !== undefined) {
        query.public = publicFlag;
    }
    _.PUT('/folder/' + folderId + '/access' + _.extractQuery(query), args.callback);
}

// --- Export functions for the module ---

module.exports = {
    listFolders         : listFolders,
    createFolder        : createFolder,
    editFolderMetaData  : editFolderMetaData,
    deleteFolder        : deleteFolder,
    getFolder           : getFolder,
    editFolder          : editFolder,
    downloadFolder      : downloadFolder,
    getFolderAccess     : getFolderAccess,
    editFolderAccess    : editFolderAccess
};
