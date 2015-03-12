var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function updateAssetStore(assetStoreId, name, options, callback) {
    var allowedQueryKeys = ['name', 'root', 'db', 'current'],
        args = _.args(['resourceList', 'withMetadata', 'callback'], arguments);

    options = args.options || {};
    options.name = name;
    _.PUT('/assetstore/' + assetStoreId + _.extractQuery(options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function deleteAssetStore(assetStoreId, callback) {
    _.DELETE('/assetstore/' + assetStoreId, callback);
}

// ----------------------------------------------------------------------------

function listAssetStores(query, callback) {
    var allowedQueryKeys = ['limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['resourceList', 'withMetadata', 'callback'], arguments);
    _.GET('/assetstore/' + _.extractQuery(query, allowedQueryKeys), callback);
}

// ----------------------------------------------------------------------------

function createAssetStore(name, type, options, callback) {
    var allowedQueryKeys = ['name', 'type', 'root', 'db', 'bucket', 'prefix', 'accessKeyId', 'secretKey', 'service'],
        args = _.args(['resourceList', 'withMetadata', 'callback'], arguments);

    options = args.options || {};
    options.name = name;
    options.type = type;
    _.POST('/assetstore' + _.extractQuery(options), args.callback);
}

// --- Export functions for the module ---

module.exports = {
    updateAssetStore : updateAssetStore,
    deleteAssetStore : deleteAssetStore,
    listAssetStores  : listAssetStores,
    createAssetStore : createAssetStore
};
