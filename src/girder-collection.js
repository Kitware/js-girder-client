var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function listCollections(query, callback) {
    var allowedQueryKeys = ['text', 'limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['query', 'callback'], arguments);

    _.GET('/collection' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function createCollection(name, options, callback) {
    var allowedQueryKeys = ['name', 'description', 'public'],
        args = _.args(['name', 'options', 'callback'], arguments),
        query = args.options || {};

    query.name = name;
    _.POST('/collection' + _.extractQuery(query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function deleteCollection(collectionId, callback) {
    _.DELETE('/collection/' + collectionId, callback);
}

// ----------------------------------------------------------------------------

function getCollection(collectionId, callback) {
    _.GET('/collection/' + collectionId, callback);
}

// ----------------------------------------------------------------------------

function editCollection(id, name, description, callback) {
    var query = {},
        args = _.args(['resourceList', 'withMetadata', 'callback'], arguments);

    if(args.name) {
        query.name = args.name;
    }
    if(args.description) {
        query.description = args.description;
    }
    _.PUT('/collection/' + id + _.extractQuery(query), args.callback);
}
// ----------------------------------------------------------------------------

function getCollectionAccess(collectionId, callback) {
    _.GET('/collection/$/access'.replace(/$/g, collectionId), callback);
}

// ----------------------------------------------------------------------------

function editCollectionAccess(collectionId, access, publicFlag, callback) {
    var args = _.args(['resourceList', 'withMetadata', 'callback'], arguments),
        query = { access : access.toString() };

    if(args.publicFlag !== undefined) {
        query.public = args.publicFlag;
    }

    _.PUT('/collection/$/access'.replace(/$/g, collectionId) + _.extractQuery(query), args.callback);
}

// --- Export functions for the module ---

module.exports = {
    listCollections     : listCollections,
    createCollection    : createCollection,
    deleteCollection    : deleteCollection,
    getCollection       : getCollection,
    editCollection      : editCollection,
    getCollectionAccess : getCollectionAccess,
    editCollectionAccess: editCollectionAccess
};
